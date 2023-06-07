// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {RegistrarStorage} from "./storage.sol";
import {Validator} from "./lib/validator.sol";
import {RegistrarMessages} from "./message.sol";
import {AngelCoreStruct} from "../struct.sol";
import {Array} from "../../lib/array.sol";
import {AddressArray} from "../../lib/address/array.sol";
import {StringArray} from "./../../lib/Strings/string.sol";
import "./storage.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {LocalRegistrar} from "./LocalRegistrar.sol";
import {LocalRegistrarLib} from "./lib/LocalRegistrarLib.sol";

/**
 * @title Registrar Contract
 * @dev Contract for Registrar
 */
contract Registrar is LocalRegistrar, Storage, ReentrancyGuard {
    event UpdateRegistrarConfig(RegistrarStorage.Config details);
    event PostNetworkConnection(
        uint256 chainId,
        AngelCoreStruct.NetworkInfo networkInfo
    );
    event DeleteNetworkConnection(uint256 chainId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor () {
        _disableInitializers();
    }

    /**
     * @notice intialize function for the contract
     * @dev initialize function for the contract only called once at the time of deployment
     * @param details details for the contract
     */
    function initialize(
        RegistrarMessages.InstantiateRequest memory details
    ) public initializer {
        __LocalRegistrar_init();
        state.config = RegistrarStorage.Config({
            applicationsReview: msg.sender,
            indexFundContract: address(0),
            accountsContract: address(0),
            treasury: details.treasury,
            subdaoGovContract: address(0), // Sub dao implementation
            subdaoTokenContract: address(0), // NewERC20 implementation
            subdaoBondingTokenContract: address(0), // Continous Token implementation
            subdaoCw900Contract: address(0),
            subdaoDistributorContract: address(0),
            subdaoEmitter: address(0),
            donationMatchContract: address(0),
            // rebalance: details.rebalance,
            splitToLiquid: details.splitToLiquid,
            haloToken: address(0),
            haloTokenLpContract: address(0),
            govContract: address(0),
            donationMatchCharitesContract: address(0),
            donationMatchEmitter: address(0),
            collectorShare: 50,
            charitySharesContract: address(0),
            // acceptedTokens: details.acceptedTokens,
            fundraisingContract: address(0),
            uniswapSwapRouter: address(0),
            multisigFactory: address(0),
            multisigEmitter: address(0),
            charityProposal: address(0),
            lockedWithdrawal: address(0),
            proxyAdmin: address(0),
            usdcAddress: address(0),
            wMaticAddress: address(0),
            cw900lvAddress: address(0)
        });
        emit UpdateRegistrarConfig(state.config);

        state.NETWORK_CONNECTIONS[block.chainid] = AngelCoreStruct.NetworkInfo({
            name: "Polygon",
            chainId: block.chainid,
            router: details.router,
            axelarGateway: details.axelarGateway,
            ibcChannel: "",
            transferChannel: "",
            gasReceiver: details.axelarGasRecv,
            gasLimit: 0
        });
        emit PostNetworkConnection(
            block.chainid,
            state.NETWORK_CONNECTIONS[block.chainid]
        );
    }

    // Executor functions for registrar

    /**
     * @notice update config function for the contract
     * @dev update config function for the contract
     * @param details details for the contract
     */
    function updateConfig(
        RegistrarMessages.UpdateConfigRequest memory details
    ) public onlyOwner nonReentrant {
        // Set applications review
        if (Validator.addressChecker(details.applicationsReview)) {
            state.config.applicationsReview = details.applicationsReview;
        }

        if (Validator.addressChecker(details.accountsContract)) {
            state.config.accountsContract = details.accountsContract;
        }

        if (Validator.addressChecker(details.uniswapSwapRouter)) {
            state.config.uniswapSwapRouter = details.uniswapSwapRouter;
        }

        if (Validator.addressChecker(details.charitySharesContract)) {
            state.config.charitySharesContract = details
                .charitySharesContract;
        }

        if (Validator.addressChecker(details.indexFundContract)) {
            state.config.indexFundContract = details.indexFundContract;
        }

        if (Validator.addressChecker(details.treasury)) {
            state.config.treasury = details.treasury;
        }

        // require(details.taxRate <= 100, "E06"); //Invalid tax rate input
        // // change taxRate from optional to required field because theres no way to map default value to tax rate
        // // since this is an update call, frontend will always send rebalance details
        // state.config.rebalance = details.rebalance;

        // check splits
        AngelCoreStruct.SplitDetails memory split_details = AngelCoreStruct
            .SplitDetails({
                max: details.splitMax,
                min: details.splitMin,
                defaultSplit: details.splitDefault
            });

        require(Validator.splitChecker(split_details), "Invalid Splits");
        state.config.splitToLiquid = split_details;

        if (
            Validator.addressChecker(details.donationMatchCharitesContract)
        ) {
            state.config.donationMatchCharitesContract = details
                .donationMatchCharitesContract;
        }
        if (Validator.addressChecker(details.donationMatchEmitter)) {
            state.config.donationMatchEmitter = details.donationMatchEmitter;
        }

        // state.config.acceptedTokens = details.acceptedTokens;

        if (Validator.addressChecker(details.fundraisingContract)) {
            state.config.fundraisingContract = details.fundraisingContract;
        }

        // TODO update decimal logic
        if (details.collectorShare != 0) {
            state.config.collectorShare = details.collectorShare;
        }

        if (Validator.addressChecker(details.govContract)) {
            state.config.govContract = details.govContract;
        }

        if (Validator.addressChecker(details.subdaoGovContract)) {
            state.config.subdaoGovContract = details.subdaoGovContract;
        }

        if (Validator.addressChecker(details.subdaoBondingTokenContract)) {
            state.config.subdaoBondingTokenContract = details
                .subdaoBondingTokenContract;
        }

        if (Validator.addressChecker(details.subdaoTokenContract)) {
            state.config.subdaoTokenContract = details.subdaoTokenContract;
        }

        if (Validator.addressChecker(details.subdaoCw900Contract)) {
            state.config.subdaoCw900Contract = details.subdaoCw900Contract;
        }

        if (Validator.addressChecker(details.subdaoDistributorContract)) {
            state.config.subdaoDistributorContract = details
                .subdaoDistributorContract;
        }
        if (Validator.addressChecker(details.subdaoEmitter)) {
            state.config.subdaoEmitter = details.subdaoEmitter;
        }

        if (Validator.addressChecker(details.donationMatchContract)) {
            state.config.donationMatchContract = details.donationMatchContract;
        }

        if (Validator.addressChecker(details.haloToken)) {
            state.config.haloToken = details.haloToken;
        }

        if (Validator.addressChecker(details.haloTokenLpContract)) {
            state.config.haloTokenLpContract = details.haloTokenLpContract;
        }

        if (Validator.addressChecker(details.multisigEmitter)) {
            state.config.multisigEmitter = details.multisigEmitter;
        }

        if (Validator.addressChecker(details.multisigFactory)) {
            state.config.multisigFactory = details.multisigFactory;
        }

        if (Validator.addressChecker(details.charityProposal)) {
            state.config.charityProposal = details.charityProposal;
        }

        if (Validator.addressChecker(details.lockedWithdrawal)) {
            state.config.lockedWithdrawal = details.lockedWithdrawal;
        }

        if (Validator.addressChecker(details.proxyAdmin)) {
            state.config.proxyAdmin = details.proxyAdmin;
        }

        if (Validator.addressChecker(details.usdcAddress)) {
            state.config.usdcAddress = details.usdcAddress;
        }

        if (Validator.addressChecker(details.wMaticAddress)) {
            state.config.wMaticAddress = details.wMaticAddress;
        }

        if (Validator.addressChecker(details.cw900lvAddress)) {
            state.config.cw900lvAddress = details.cw900lvAddress;
        }
        // state.config.acceptedTokens = AngelCoreStruct.AcceptedTokens({
        //     native: details.accepted_tokens_native,
        //     cw20: details.accepted_tokens_cw20
        // });
        emit UpdateRegistrarConfig(state.config);
    }

    /**
     * @dev This function updates a Registrar-Level Accepted Token's Price Feed contract address in storage.
     * @param token address
     * @param priceFeed address
     */
    function updateTokenPriceFeed(
        address token,
        address priceFeed
    ) public onlyOwner {
        state.PriceFeeds[token] = priceFeed;
    }
    
    /**
     * @dev update network connections in the registrar
     * @param networkInfo The network info to update
     * @param action The action to perform (post or delete)
     */
    function updateNetworkConnections(
        AngelCoreStruct.NetworkInfo memory networkInfo,
        string memory action
    ) public nonReentrant onlyOwner {
        if (Validator.compareStrings(action, "post")) {
            state.NETWORK_CONNECTIONS[networkInfo.chainId] = networkInfo;
            emit PostNetworkConnection(networkInfo.chainId, networkInfo);
        } else if (Validator.compareStrings(action, "delete")) {
            delete state.NETWORK_CONNECTIONS[networkInfo.chainId];
            emit DeleteNetworkConnection(networkInfo.chainId);
        } else {
            revert("Invalid inputs");
        }
    }
   
    /**
     * @dev Query the Price Feed contract set for an Accepted Token in the Registrar
     * @param token The address of token
     * @return address of Price Feed contract set (zero-address if not set)
     */
    function queryTokenPriceFeed(
        address token
    ) public view returns (address) {
        return state.PriceFeeds[token];
    } 
   
    /**
     * @dev Query the network connection in registrar
     * @param chainId The chain id of the network to query
     * @return response The network connection
     */
    function queryNetworkConnection(
        uint256 chainId
    ) public view returns (AngelCoreStruct.NetworkInfo memory response) {
        response = state.NETWORK_CONNECTIONS[chainId];
    }

    // Query functions for contract

    /**
     * @dev Query the registrar config
     * @return The registrar config
     */
    function queryConfig()
        public
        view
        returns (RegistrarStorage.Config memory)
    {
        return state.config;
    }

    // STRATEGY ARRAY HANDLING
    function queryAllStrategies() view external returns (bytes4[] memory allStrategies) {
        allStrategies = new bytes4[](state.STRATEGIES.length);
        for(uint256 i; i < allStrategies.length; i++) {
            allStrategies[i] = state.STRATEGIES[i];
        }
    }

    function setStrategyParams(
        bytes4 _strategyId,
        address _lockAddr,
        address _liqAddr,
        LocalRegistrarLib.StrategyApprovalState _approvalState
    ) public override onlyOwner {
        if (_approvalState == LocalRegistrarLib.StrategyApprovalState.DEPRECATED) {
            _removeStrategy(_strategyId);
        }
        else {
            _maybeAddStrategy(_strategyId);
        }
        super.setStrategyParams(_strategyId, _lockAddr, _liqAddr, _approvalState);
    }

    function setStrategyApprovalState(bytes4 _strategyId, LocalRegistrarLib.StrategyApprovalState _approvalState)
        public
        override
        onlyOwner
    {
        if (_approvalState == LocalRegistrarLib.StrategyApprovalState.DEPRECATED) {
            _removeStrategy(_strategyId);
        }
        super.setStrategyApprovalState(_strategyId, _approvalState);
    }

    function _maybeAddStrategy(bytes4 _strategyId) internal {
        bool inList;
        for (uint256 i = 0; i < state.STRATEGIES.length; i++) {
            if (state.STRATEGIES[i] == _strategyId) {
                inList = true;
            }
        }
        if (!inList) {
            state.STRATEGIES.push(_strategyId);
        }
    }

    function _removeStrategy(bytes4 _strategyId) internal {
        uint256 delIndex;
        bool indexFound;
        for (uint256 i = 0; i < state.STRATEGIES.length; i++) {
            if (state.STRATEGIES[i] == _strategyId) {
                delIndex = i;
                indexFound =true;
                break;
            }
        }
        if (indexFound) {
            state.STRATEGIES[delIndex] = state.STRATEGIES[state.STRATEGIES.length - 1];
            state.STRATEGIES.pop();
        }
    }


    // /**
    //  * @dev Add a new vault to the registrar
    //  * @param details The details of the vault to add
    //  */
    // function vaultAdd(
    //     RegistrarMessages.VaultAddRequest memory details
    // ) public nonReentrant onlyOwner {

    //     uint256 vaultNetwork;
    //     if (details.network == 0) {
    //         vaultNetwork = block.chainid;
    //     } else {
    //         vaultNetwork = details.network;
    //     }

    //     if (!(Validator.addressChecker(details.yieldToken))) {
    //         revert("Failed to validate yield token address");
    //     }

    //     state.VAULTS[details.stratagyName] = AngelCoreStruct.YieldVault({
    //         network: vaultNetwork,
    //         addr: details.stratagyName,
    //         inputDenom: details.inputDenom,
    //         yieldToken: details.yieldToken,
    //         approved: true,
    //         restrictedFrom: details.restrictedFrom,
    //         acctType: details.acctType,
    //         vaultType: details.vaultType
    //     });
    //     state.VAULT_POINTERS.push(details.stratagyName);
    //     emit AddVault(
    //         details.stratagyName,
    //         state.VAULTS[details.stratagyName]
    //     );
    // }

    // /**
    //  * @dev Remove a vault from the registrar
    //  * @param _stratagyName The name of the vault to remove
    //  */
    // function vaultRemove(string memory _stratagyName) public nonReentrant onlyOwner {

    //     delete state.VAULTS[_stratagyName];
    //     uint256 delIndex;
    //     bool indexFound;
    //     (delIndex, indexFound) = StringArray.stringIndexOf(
    //         state.VAULT_POINTERS,
    //         _stratagyName
    //     );

    //     if (indexFound) {
    //         state.VAULT_POINTERS = StringArray.stringRemove(
    //             state.VAULT_POINTERS,
    //             delIndex
    //         );
    //     }
    //     emit RemoveVault(_stratagyName);
    // }

    // /**
    //  * @dev Update a vault in the registrar
    //  * @param _stratagyName The name of the vault to update
    //  * @param approved Whether the vault is approved or not
    //  * @param restrictedfrom The list of endowments that are restricted from using this vault
    //  */
    // function vaultUpdate(
    //     string memory _stratagyName,
    //     bool approved,
    //     AngelCoreStruct.EndowmentType[] memory restrictedfrom
    // ) public nonReentrant onlyOwner {

    //     state.VAULTS[_stratagyName].approved = approved;
    //     state.VAULTS[_stratagyName].restrictedFrom = restrictedfrom;
    //     emit UpdateVault(_stratagyName, approved, restrictedfrom);
    // }

    // /**
    //  * @dev Query the vaults in the registrar
    //  * @param network The network to query
    //  * @param endowmentType The endowment type to query
    //  * @param accountType The account type to query
    //  * @param vaultType The vault type to query
    //  * @param approved Whether the vault is approved or not
    //  * @param startAfter The index to start the query from
    //  * @param limit The number of vaults to return
    //  * @return The list of vaults
    //  */
    // function queryVaultListDep(
    //     uint256 network,
    //     AngelCoreStruct.EndowmentType endowmentType,
    //     AngelCoreStruct.AccountType accountType,
    //     AngelCoreStruct.VaultType vaultType,
    //     AngelCoreStruct.BoolOptional approved,
    //     uint256 startAfter,
    //     uint256 limit
    // ) public view returns (AngelCoreStruct.YieldVault[] memory) {
    //     uint256 lengthResponse = 0;
    //     if (limit != 0) {
    //         lengthResponse = limit;
    //     } else {
    //         lengthResponse = state.VAULT_POINTERS.length;
    //     }
    //     AngelCoreStruct.YieldVault[]
    //         memory response = new AngelCoreStruct.YieldVault[](lengthResponse);

    //     if (startAfter >= state.VAULT_POINTERS.length) {
    //         revert("Invalid start value");
    //     }

    //     for (uint256 i = startAfter; i < state.VAULT_POINTERS.length; i++) {
    //         //check filters here
    //         if (
    //             RegistrarLib.filterVault(
    //                 state.VAULTS[state.VAULT_POINTERS[i]],
    //                 network,
    //                 endowmentType,
    //                 accountType,
    //                 vaultType,
    //                 approved
    //             )
    //         ) {
    //             response[i] = state.VAULTS[state.VAULT_POINTERS[i]];
    //         }

    //         if (limit != 0) {
    //             if (response.length == limit) {
    //                 break;
    //             }
    //         }
    //     }
    //     return response;
    // }

    // /**
    //  * @dev Query the vaults in the registrar
    //  * @param network The network to query
    //  * @param endowmentType The endowment type to query
    //  * @param accountType The account type to query
    //  * @param vaultType The vault type to query
    //  * @param approved Whether the vault is approved or not
    //  * @param startAfter The index to start the query from
    //  * @param limit The number of vaults to return
    //  * @return The list of vaults
    //  */
    // function queryVaultList(
    //     uint256 network,
    //     AngelCoreStruct.EndowmentType endowmentType,
    //     AngelCoreStruct.AccountType accountType,
    //     AngelCoreStruct.VaultType vaultType,
    //     AngelCoreStruct.BoolOptional approved,
    //     uint256 startAfter,
    //     uint256 limit
    // ) public view returns (AngelCoreStruct.YieldVault[] memory) {
    //     uint256 lengthResponse = 0;

    //     if (limit != 0) {
    //         lengthResponse = limit;
    //     } else {
    //         lengthResponse = state.VAULT_POINTERS.length;
    //     }

    //     AngelCoreStruct.YieldVault[]
    //         memory response = new AngelCoreStruct.YieldVault[](lengthResponse);

    //     if (startAfter >= state.VAULT_POINTERS.length) {
    //         revert("Invalid start value");
    //     }

    //     uint256 count = 0;
    //     string[] memory indexArr = new string[](state.VAULT_POINTERS.length);

    //     for (uint256 i = startAfter; i < state.VAULT_POINTERS.length; i++) {
    //         //check filters here
    //         if (
    //             RegistrarLib.filterVault(
    //                 state.VAULTS[state.VAULT_POINTERS[i]],
    //                 network,
    //                 endowmentType,
    //                 accountType,
    //                 vaultType,
    //                 approved
    //             )
    //         ) {
    //             response[i] = state.VAULTS[state.VAULT_POINTERS[i]];
    //             indexArr[count] = state.VAULT_POINTERS[i];
    //             count++;
    //         }
    //     }

    //     AngelCoreStruct.YieldVault[]
    //         memory responseFinal = new AngelCoreStruct.YieldVault[](count);

    //     for (uint256 i = 0; i < count; i++) {
    //         responseFinal[i] = state.VAULTS[indexArr[i]];
    //     }

    //     return responseFinal;
    // }

    // /**
    //  * @dev Query the vaults in the registrar
    //  * @param _stratagyName The name of the vault to query
    //  * @return response The vault
    //  */
    // function queryVaultDetails(
    //     string memory _stratagyName
    // ) public view returns (AngelCoreStruct.YieldVault memory response) {
    //     response = state.VAULTS[_stratagyName];
    // }

    // returns true if the vault satisfies the given conditions
}
