// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./message.sol";
import "./storage.sol";
import {IRegistrar} from "../../core/registrar/interface/IRegistrar.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {AngelCoreStruct} from "../../core/struct.sol";
import {IAccountsQuery} from "../../core/accounts/interface/IAccountsQuery.sol";
import {AccountStorage} from "../../core/accounts/storage.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {FundraisingLib} from "./FundraisingLib.sol";

/**
 * @title Fundraising
 * @dev Fundraising contract
 * 1) Through this contract, users can create and manage fundraising campaigns
 * 2) Users can contribute to the campaign
 * 3) Users can top up their contributions to the campaign
 * 4) Users can claim their rewards
 */
contract Fundraising is StorageFundraising {
    // flag for initialization
    bool initialized = false;

    /* Events */
    event FundraisingConfigUpdated(FundraisingStorage.Config config);
    event FundraisingCampaignCreated(uint256 campaignId, Campaign campaign);
    event FundraisingCampaignUpdated(uint256 campaignId, Campaign campaign);
    event FundraisingContributorUpdated(
        uint256 campaignId,
        address sender,
        FundraisingStorage.ContributorInfo contributorInfo
    );
    event FundraisingContributionRefunded(
        uint256 campaignId,
        address sender,
        AngelCoreStruct.GenericBalance balance
    );
    event FundraisingRewardsClaimed(
        uint256 campaignId,
        address sender,
        AngelCoreStruct.GenericBalance balance
    );

    /**
     * @dev Initialize the contract
     * @param curDetails FundraisingMessage.InstantiateMsg used to initialize the contract
     */
    function initFundraising(
        FundraisingMessage.InstantiateMsg memory curDetails
    ) public {
        if (initialized) revert("Already initialized");
        initialized = true;
        state.config.registrarContract = curDetails.registrarContract;
        state.config.nextId = curDetails.nextId;
        state.config.campaignPeriodSeconds = curDetails.campaignPeriodSeconds;
        state.config.taxRate = curDetails.taxRate;
        state.config.acceptedTokens = curDetails.acceptedTokens;
        emit FundraisingConfigUpdated(state.config);
    }

    /**
     * @dev Get the config of the fundraising contract
     * @return FundraisingStorage.Config
     */
    function getRegistrarConfig()
        public
        view
        returns (RegistrarStorage.Config memory)
    {
        address registrarContract = state.config.registrarContract;
        return IRegistrar(registrarContract).queryConfig();
    }

    /**
     * @dev update the config of the fundraising contract
     * @param campaignPeriodSeconds uint256
     * @param taxRate uint256
     * @param acceptedTokens AngelCoreStruct.GenericBalance
     */
    function executeUpdateConfig(
        uint256 campaignPeriodSeconds,
        uint256 taxRate,
        AngelCoreStruct.GenericBalance memory acceptedTokens
    ) public {
        address registrarContract = state.config.registrarContract;
        require(msg.sender == IRegistrar(registrarContract).owner(), "Unauthorized");
        state.config.campaignPeriodSeconds = campaignPeriodSeconds;
        state.config.taxRate = taxRate;
        state.config.acceptedTokens = acceptedTokens;

        emit FundraisingConfigUpdated(state.config);
    }

    /**
     * @dev Create a fundraising campaign
     * @param endowmentId uint256
     * @param message FundraisingMessage.CreateMsg
     * @param balance Balance
     */
    function executeCreate(
        uint256 endowmentId,
        FundraisingMessage.CreateMsg memory message,
        Balance memory balance,
        address sender // TODO: remove this param as sender will always be accountsContract
    ) public payable {
        if (balance.coinNativeAmount == 0 && balance.cw20Addr == address(0))
            revert("Invalid inputs");
        // receive tokens
        bool success = IERC20(balance.cw20Addr).transferFrom(
            msg.sender,
            address(this),
            balance.cw20Amount
        );
        require(success, "Transfer failed");

        FundraisingStorage.Config storage config = state.config;
        address accountsContract = sender;
        RegistrarStorage.Config memory registrarConfig = getRegistrarConfig();

        if (registrarConfig.accountsContract == address(0))
            revert("accountsContract does not exist");
        if (registrarConfig.accountsContract != accountsContract)
            revert("Unauthorized");

        AccountStorage.Endowment memory endowment_details = IAccountsQuery(
            accountsContract
        ).queryEndowmentDetails(endowmentId);

        // assert that the campaign has started already
        if (
            message.endTimeEpoch - config.campaignPeriodSeconds <=
            block.timestamp
        ) {
            revert("Invalid inputs");
        }
        uint256[] memory cw20Amount = new uint256[](1);
        cw20Amount[0] = balance.cw20Amount;
        address[] memory cw20Addr = new address[](1);
        cw20Addr[0] = balance.cw20Addr;

        require(
            balance.coinNativeAmount == msg.value,
            "Native coin amount mismatch"
        );

        AngelCoreStruct.GenericBalance memory lockedBalance = AngelCoreStruct
            .GenericBalance({
                coinNativeAmount: balance.coinNativeAmount,
                Cw20CoinVerified_amount: cw20Amount,
                Cw20CoinVerified_addr: cw20Addr
            });
        AngelCoreStruct.GenericBalance memory fundingThreshold;
        AngelCoreStruct.GenericBalance memory contributedBalance;

        // check we have a single token to use as the desired contribution token for the campaign
        if (
            message.fundingGoal.coinNativeAmount > 0 &&
            message.fundingGoal.Cw20CoinVerified_amount.length == 0
        ) {
            fundingThreshold.coinNativeAmount =
                (message.fundingGoal.coinNativeAmount *
                    message.rewardThreshold) /
                100;
            contributedBalance.coinNativeAmount = 0;
        } else if (
            message.fundingGoal.Cw20CoinVerified_addr.length == 1 &&
            message.fundingGoal.coinNativeAmount == 0
        ) {
            int256 pos = -1;
            for (
                uint256 i = 0;
                i < config.acceptedTokens.Cw20CoinVerified_addr.length;
                i++
            ) {
                if (
                    config.acceptedTokens.Cw20CoinVerified_addr[i] ==
                    message.fundingGoal.Cw20CoinVerified_addr[0]
                ) {
                    pos = int256(i);
                    break;
                }
            }
            if (pos < 0) revert("Token not in allowlist");
            fundingThreshold.Cw20CoinVerified_amount = new uint256[](1);
            fundingThreshold.Cw20CoinVerified_addr = new address[](1);
            fundingThreshold.Cw20CoinVerified_amount[0] =
                (message.fundingGoal.Cw20CoinVerified_amount[0] *
                    message.rewardThreshold) /
                100;
            fundingThreshold.Cw20CoinVerified_addr[0] = message
                .fundingGoal
                .Cw20CoinVerified_addr[0];
            contributedBalance.Cw20CoinVerified_amount = new uint256[](1);
            contributedBalance.Cw20CoinVerified_addr = new address[](1);
            contributedBalance.Cw20CoinVerified_amount[0] = 0;
            contributedBalance.Cw20CoinVerified_addr[0] = message
                .fundingGoal
                .Cw20CoinVerified_addr[0];
        } else {
            revert(
                "Contract only accepts a single CW20 or Native Token at a time for funding goal"
            );
        }
        Campaign memory campaign = Campaign({
            open: true,
            success: false,
            creator: msg.sender,
            title: message.title,
            description: message.description,
            imageUrl: message.imageUrl,
            endTimeEpoch: message.endTimeEpoch,
            fundingGoal: message.fundingGoal,
            fundingThreshold: fundingThreshold,
            lockedBalance: lockedBalance,
            contributedBalance: contributedBalance,
            contributors: new address[](0)
        });
        if (state.CAMPAIGNS[config.nextId].creator == address(0)) {
            state.CAMPAIGNS[config.nextId] = campaign;
            emit FundraisingCampaignCreated(config.nextId, campaign);
        } else {
            revert("Campaign already exists");
        }
        config.nextId += 1;
        emit FundraisingConfigUpdated(config);
    }

    /**
     * @notice Close a campaign
     * @param id uint256
     */
    function executeCloseCampaign(uint256 id) public {
        // check if campaign exists
        if (state.CAMPAIGNS[id].creator == address(0))
            revert("Campaign does not exist");

        if (!FundraisingLib.isExpired(state.CAMPAIGNS[id]))
            revert("Not expired");
        RegistrarStorage.Config memory registrarConfig = getRegistrarConfig();

        Campaign storage campaign = state.CAMPAIGNS[id];

        if (
            FundraisingLib.thresholdMet(
                campaign.contributedBalance,
                campaign.fundingGoal
            )
        ) {
            campaign.success = true;
            (
                AngelCoreStruct.GenericBalance memory balance_less_tax,
                AngelCoreStruct.GenericBalance memory withholding_balance
            ) = FundraisingLib.calculateWitholding(
                    state.config.taxRate,
                    campaign.contributedBalance
                );
            sendTokens(campaign.creator, balance_less_tax);
            sendTokens(registrarConfig.treasury, withholding_balance);
        } else {
            sendTokens(campaign.creator, campaign.lockedBalance);
        }
        campaign.open = false;
        emit FundraisingCampaignUpdated(id, campaign);
    }

    /**
     * @notice Top up a campaign
     * @param id uint256
     * @param balance Balance
     */
    function executeTopUp(uint256 id, Balance memory balance) public payable {
        if (balance.coinNativeAmount == 0 && balance.cw20Addr == address(0))
            revert("Invalid inputs");
        // receive tokens
        bool success = IERC20(balance.cw20Addr).transferFrom(
            msg.sender,
            address(this),
            balance.cw20Amount
        );
        require(success, "Transfer failed");
        Campaign storage campaign = state.CAMPAIGNS[id];
        // check if state.CAMPAIGNS[id] exists
        if (campaign.creator == address(0)) revert("Campaign does not exist");

        if (!campaign.open || FundraisingLib.isExpired(campaign))
            revert("Campaign is expired");
        if (msg.sender != campaign.creator) revert("Unauthorized");

        // ensure the token is on the allowlist
        bool found = false;
        for (
            uint256 i = 0;
            i < campaign.fundingGoal.Cw20CoinVerified_addr.length;
            i++
        ) {
            if (
                campaign.fundingGoal.Cw20CoinVerified_addr[i] ==
                balance.cw20Addr
            ) {
                found = true;
                break;
            }
        }
        if (!found) revert("Token not in allowed list");
        require(
            balance.coinNativeAmount == msg.value,
            "Native coin amount does not match value received"
        );
        campaign.lockedBalance.coinNativeAmount += balance.coinNativeAmount;
        AngelCoreStruct.addToken(
            campaign.lockedBalance,
            balance.cw20Addr,
            balance.cw20Amount
        );
        emit FundraisingCampaignUpdated(id, campaign);
    }

    /**
     * @notice Contribute to a campaign
     * @param id uint256
     * @param balance Balance
     */
    function executeContribute(
        uint256 id,
        Balance memory balance
    ) public payable {
        if (balance.coinNativeAmount == 0 && balance.cw20Addr == address(0))
            revert("Invalid inputs");
        // receive tokens
        bool success = IERC20(balance.cw20Addr).transferFrom(
            msg.sender,
            address(this),
            balance.cw20Amount
        );
        require(success, "Transfer failed");

        Campaign storage campaign = state.CAMPAIGNS[id];
        // check if state.CAMPAIGNS[id] exists
        if (campaign.creator == address(0)) revert("Campaign does not exist");

        if (!campaign.open || FundraisingLib.isExpired(campaign)) revert();

        // ensure the token is on the allowlist
        bool found = false;
        for (
            uint256 i = 0;
            i < campaign.fundingGoal.Cw20CoinVerified_addr.length;
            i++
        ) {
            if (
                campaign.fundingGoal.Cw20CoinVerified_addr[i] ==
                balance.cw20Addr
            ) {
                found = true;
                break;
            }
        }
        if (!found) revert("Token not in allowlist");
        require(
            balance.coinNativeAmount == msg.value,
            "Native coin amount does not match value received"
        );

        // get the contributor's balance for the given campaign and credit them
        mapping(uint256 => FundraisingStorage.ContributorInfo)
            storage contributor = state.CONTRIBUTORS[msg.sender];
        if (state.CONTRIBUTOR_CAMPAIGNS[msg.sender].length != 0) {
            if (contributor[id].exists) {
                contributor[id].balance.coinNativeAmount += balance
                    .coinNativeAmount;
                AngelCoreStruct.addToken(
                    contributor[id].balance,
                    balance.cw20Addr,
                    balance.cw20Amount
                );
            } else {
                AngelCoreStruct.GenericBalance memory default_bal;
                default_bal.coinNativeAmount += balance.coinNativeAmount;
                default_bal = AngelCoreStruct.addTokenMem(
                    default_bal,
                    balance.cw20Addr,
                    balance.cw20Amount
                );
                contributor[id] = FundraisingStorage.ContributorInfo({
                    campaign: id,
                    balance: default_bal,
                    rewardsClaimed: false,
                    contributionRefunded: false,
                    exists: true
                });
                state.CONTRIBUTOR_CAMPAIGNS[msg.sender].push(id);
            }
        } else {
            AngelCoreStruct.GenericBalance memory default_bal;
            default_bal.coinNativeAmount += balance.coinNativeAmount;
            default_bal = AngelCoreStruct.addTokenMem(
                default_bal,
                balance.cw20Addr,
                balance.cw20Amount
            );

            contributor[id] = FundraisingStorage.ContributorInfo({
                campaign: id,
                balance: default_bal,
                rewardsClaimed: false,
                contributionRefunded: false,
                exists: true
            });
            state.CONTRIBUTOR_CAMPAIGNS[msg.sender].push(id);
        }

        campaign.contributedBalance.coinNativeAmount += balance
            .coinNativeAmount;
        AngelCoreStruct.addToken(
            campaign.contributedBalance,
            balance.cw20Addr,
            balance.cw20Amount
        );

        found = false;
        for (uint256 i = 0; i < campaign.contributors.length; i++) {
            if (campaign.contributors[i] == msg.sender) {
                found = true;
                break;
            }
        }
        if (!found) campaign.contributors.push(msg.sender);

        emit FundraisingCampaignUpdated(id, campaign);
        emit FundraisingContributorUpdated(id, msg.sender, contributor[id]);
    }

    /**
     * @notice Refund a contributor's contribution
     * @param id uint256
     */
    function executeRefundContributions(uint256 id) public {
        Campaign storage campaign = state.CAMPAIGNS[id];
        // check if campaign exists
        if (campaign.creator == address(0)) revert("Campaign does not exist");

        if (campaign.open) revert("Campaign is open");

        if (!state.CONTRIBUTORS[msg.sender][id].exists) revert("Invalid input");
        if (state.CONTRIBUTORS[msg.sender][id].contributionRefunded)
            revert("Already refunded");
        state.CONTRIBUTORS[msg.sender][id].contributionRefunded = true;
        sendTokens(msg.sender, state.CONTRIBUTORS[msg.sender][id].balance);
        emit FundraisingContributorUpdated(
            id,
            msg.sender,
            state.CONTRIBUTORS[msg.sender][id]
        );
        emit FundraisingContributionRefunded(
            id,
            msg.sender,
            state.CONTRIBUTORS[msg.sender][id].balance
        );
    }

    /**
     * @notice Claim rewards for a contributor
     * @param id uint256
     */
    function executeClaimRewards(uint256 id) public {
        Campaign storage campaign = state.CAMPAIGNS[id];
        // check if campaign exists
        if (campaign.creator == address(0)) revert("Campaign does not exist");

        if (campaign.open) revert("Campaign is open");
        mapping(uint256 => FundraisingStorage.ContributorInfo)
            storage contributor = state.CONTRIBUTORS[msg.sender];

        if (!contributor[id].exists) revert("Invalid input");

        // FundraisingStorage.ContributorInfo storage camp_contrib = contributor[uint256(pos)];
        if (contributor[id].rewardsClaimed) revert("Already claimed");

        uint256 allCoins = campaign
            .contributedBalance
            .Cw20CoinVerified_addr
            .length;
        AngelCoreStruct.GenericBalance memory rewards = AngelCoreStruct
            .GenericBalance(
                0,
                new uint256[](allCoins),
                new address[](allCoins)
            );

        if (campaign.contributedBalance.coinNativeAmount == 0)
            rewards.coinNativeAmount = 0;
        else {
            rewards.coinNativeAmount =
                (contributor[id].balance.coinNativeAmount *
                    campaign.lockedBalance.coinNativeAmount) /
                campaign.contributedBalance.coinNativeAmount;
        }
        rewards.Cw20CoinVerified_addr = campaign
            .contributedBalance
            .Cw20CoinVerified_addr;

        for (uint256 i = 0; i < allCoins; i++) {
            uint256 lockedBalanceAmt = 0;
            for (
                uint256 j = 0;
                j < campaign.lockedBalance.Cw20CoinVerified_addr.length;
                j++
            ) {
                if (
                    campaign.lockedBalance.Cw20CoinVerified_addr[j] ==
                    rewards.Cw20CoinVerified_addr[i]
                ) {
                    lockedBalanceAmt = campaign
                        .lockedBalance
                        .Cw20CoinVerified_amount[j];
                    break;
                }
            }
            uint256 contributorAmt = 0;
            for (
                uint256 j = 0;
                j < contributor[id].balance.Cw20CoinVerified_addr.length;
                j++
            ) {
                if (
                    contributor[id].balance.Cw20CoinVerified_addr[j] ==
                    rewards.Cw20CoinVerified_addr[i]
                ) {
                    contributorAmt = contributor[id]
                        .balance
                        .Cw20CoinVerified_amount[j];
                    break;
                }
            }
            rewards.Cw20CoinVerified_amount[i] =
                (contributorAmt * lockedBalanceAmt) /
                campaign.contributedBalance.Cw20CoinVerified_amount[i];
            rewards.Cw20CoinVerified_addr[i] = campaign
                .contributedBalance
                .Cw20CoinVerified_addr[i];
        }
        sendTokens(msg.sender, rewards);
        contributor[id].rewardsClaimed = true;
        emit FundraisingContributorUpdated(id, msg.sender, contributor[id]);
        emit FundraisingRewardsClaimed(id, msg.sender, rewards);
    }

    /**
     * @notice Internal function used to send tokens to a balance
     * @param to address
     * @param balance AngelCoreStruct.GenericBalance
     */
    function sendTokens(
        address to,
        AngelCoreStruct.GenericBalance memory balance
    ) internal {
        if (balance.coinNativeAmount > 0) {
            (bool sent, ) = to.call{value: balance.coinNativeAmount}("");
            require(sent, "Failed to send Native Coin");
        }
        for (uint256 i = 0; i < balance.Cw20CoinVerified_amount.length; i++) {
            require(
                IERC20(balance.Cw20CoinVerified_addr[i]).transfer(
                    to,
                    balance.Cw20CoinVerified_amount[i]
                ),
                "Transfer failed"
            );
        }
    }

    // function thresholdMet(AngelCoreStruct.GenericBalance memory contributed, AngelCoreStruct.GenericBalance memory threshold) internal pure returns(bool){
    //     // TODO: verify this
    //     bool result = false;
    //     if(contributed.coinNativeAmount >= threshold.coinNativeAmount && contributed.coinNativeAmount > 0) result = true;
    //     int index = -1;
    //     for(uint256 i = 0; i < threshold.Cw20CoinVerified_addr.length; i++){
    //         for(uint256 j = 0; j < contributed.Cw20CoinVerified_addr.length; j++){
    //             if(contributed.Cw20CoinVerified_addr[j] == threshold.Cw20CoinVerified_addr[i]){
    //                 index = int(j);
    //                 break;
    //             }
    //         }
    //         if(index > -1) result = contributed.Cw20CoinVerified_amount[uint256(index)] >= threshold.Cw20CoinVerified_amount[i];
    //     }
    //     return result;
    // }
    // function calculateWitholding(uint256 taxRate, AngelCoreStruct.GenericBalance storage balance) internal returns(AngelCoreStruct.GenericBalance memory, AngelCoreStruct.GenericBalance memory){
    //     AngelCoreStruct.GenericBalance storage contributed_less_tax = balance;
    //     AngelCoreStruct.GenericBalance memory withholding_balance; // initialized to default
    //     // AngelCoreStruct.GenericBalance memory

    //     withholding_balance.coinNativeAmount += (balance.coinNativeAmount * taxRate)/100;
    //     contributed_less_tax.coinNativeAmount -= (balance.coinNativeAmount * taxRate)/100;

    //     for(uint256 i = 0; i < balance.Cw20CoinVerified_addr.length; i++){
    //         withholding_balance = AngelCoreStruct.addTokenMem(
    //             withholding_balance,
    //             balance.Cw20CoinVerified_addr[i],
    //             (balance.Cw20CoinVerified_amount[i] * taxRate)/100
    //         );
    //         AngelCoreStruct.subToken(
    //             contributed_less_tax,
    //             balance.Cw20CoinVerified_addr[i],
    //             (balance.Cw20CoinVerified_amount[i] * taxRate)/100
    //         );
    //     }
    //     return (contributed_less_tax, withholding_balance);
    // }

    /**
     * @notice query details of a campaign
     * @param id the id of the campaign
     */
    function queryDetails(
        uint256 id
    ) public view returns (FundraisingMessage.DetailsResponse memory) {
        FundraisingMessage.DetailsResponse memory details = FundraisingMessage
            .DetailsResponse({
                id: id,
                creator: state.CAMPAIGNS[id].creator,
                title: state.CAMPAIGNS[id].title,
                description: state.CAMPAIGNS[id].description,
                imageUrl: state.CAMPAIGNS[id].imageUrl,
                endTimeEpoch: state.CAMPAIGNS[id].endTimeEpoch,
                fundingGoal: state.CAMPAIGNS[id].fundingGoal,
                fundingThreshold: state.CAMPAIGNS[id].fundingThreshold,
                lockedBalance: state.CAMPAIGNS[id].lockedBalance,
                contributorCount: state.CAMPAIGNS[id].contributors.length,
                contributedBalance: state.CAMPAIGNS[id].contributedBalance,
                success: state.CAMPAIGNS[id].success,
                open: state.CAMPAIGNS[id].open
            });
        return details;
    }

    function queryConfig()
        public
        view
        returns (FundraisingStorage.Config memory)
    {
        return state.config;
    }
    // function queryList(address creator, bool open, bool success) public view returns(FundraisingMessage.ListResponse memory){
    //     uint256 count = 0;
    //     for(uint256 i = 0; i < state.CAMPAIGN_IDS.length; i++){
    //         if(state.CAMPAIGNS[state.CAMPAIGN_IDS[i]].creator == creator && state.CAMPAIGNS[state.CAMPAIGN_IDS[i]].open == open && state.CAMPAIGNS[state.CAMPAIGN_IDS[i]].success == success){
    //             count++;
    //         }
    //     }
    //     Campaign[] memory campaigns = new Campaign[](count);
    //     uint256 pos = 0;
    //     for(uint256 i = 0; i < state.CAMPAIGN_IDS.length; i++){
    //         if(state.CAMPAIGNS[state.CAMPAIGN_IDS[i]].creator == creator && state.CAMPAIGNS[state.CAMPAIGN_IDS[i]].open == open && state.CAMPAIGNS[state.CAMPAIGN_IDS[i]].success == success){
    //             campaigns[pos] = state.CAMPAIGNS[i];
    //             pos++;
    //         }
    //     }
    //     FundraisingMessage.ListResponse memory list = FundraisingMessage.ListResponse({
    //         campaigns: campaigns
    //     });
    //     return list;
    // }
}
