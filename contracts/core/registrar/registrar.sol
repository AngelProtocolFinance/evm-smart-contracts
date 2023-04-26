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

/**
 * @title Registrar Library
 * @dev Library for Registrar for size fixes
 */
library RegistrarLib {
    /*
     * TODO: add doc string @badrik
     */
    function filterVault(
        AngelCoreStruct.YieldVault memory data,
        uint256 network,
        AngelCoreStruct.EndowmentType endowmentType,
        AngelCoreStruct.AccountType accountType,
        AngelCoreStruct.VaultType vaultType,
        AngelCoreStruct.BoolOptional approved
    ) public pure returns (bool) {
        // check all conditions based on default null param if anyone of them is false return false

        if (approved != AngelCoreStruct.BoolOptional.None) {
            if (approved == AngelCoreStruct.BoolOptional.True) {
                if (data.approved != true) {
                    return false;
                }
            }
            if (approved == AngelCoreStruct.BoolOptional.False) {
                if (data.approved != false) {
                    return false;
                }
            }
        }

        if (endowmentType != AngelCoreStruct.EndowmentType.None) {
            // check if given endowment type is not in restricted from. if it is return false
            bool found = false;
            for (uint256 i = 0; i < data.restrictedFrom.length; i++) {
                if (data.restrictedFrom[i] == endowmentType) {
                    found = true;
                }
            }
            if (found) {
                return false;
            }
        }

        if (accountType != AngelCoreStruct.AccountType.None) {
            if (data.acctType != accountType) {
                return false;
            }
        }

        if (vaultType != AngelCoreStruct.VaultType.None) {
            if (data.vaultType != vaultType) {
                return false;
            }
        }

        if (network != 0) {
            if (data.network != network) {
                return false;
            }
        }

        return true;
    }
}

/**
 * @title Registrar Contract
 * @dev Contract for Registrar
 */
contract Registrar is Storage, ReentrancyGuard {
    event UpdateRegistrarConfig(RegistrarStorage.Config details);
    event UpdateRegistrarOwner(address newOwner);
    event UpdateRegistrarFees(RegistrarMessages.UpdateFeeRequest details);
    event AddVault(string strategyName, AngelCoreStruct.YieldVault vault);
    event RemoveVault(string strategyName);
    event UpdateVault(
        string strategyName,
        bool approved,
        AngelCoreStruct.EndowmentType[] endowmentTypes
    );
    event PostNetworkConnection(
        uint256 chainId,
        AngelCoreStruct.NetworkInfo networkInfo
    );
    event DeleteNetworkConnection(uint256 chainId);

    /**
     * @notice intialize function for the contract
     * @dev initialize function for the contract only called once at the time of deployment
     * @param curDetails details for the contract
     */
    function initialize(
        RegistrarMessages.InstantiateRequest memory curDetails
    ) public {
        require(!initilized, "E01"); //Already Initilized
        require(curDetails.taxRate <= 100, "E02"); //Invalid tax rate input
        // TODO check split details
        // split check will be coming default from frontend
        if (!Validator.splitChecker(curDetails.splitToLiquid)) {
            revert("E03"); //Invalid Split Details Supplied
        }
        address treasuryAddr;
        initilized = true;
        if (Validator.addressChecker(curDetails.treasury)) {
            treasuryAddr = curDetails.treasury;
        } else {
            treasuryAddr = address(0);
        }
        state.config = RegistrarStorage.Config({
            owner: msg.sender,
            applicationsReview: msg.sender,
            indexFundContract: address(0),
            accountsContract: address(0),
            treasury: treasuryAddr,
            subdaoGovCode: address(0), // Sub dao implementation
            subdaoCw20TokenCode: address(0), // NewERC20 implementation
            subdaoBondingTokenCode: address(0), // Continous Token implementation
            subdaoCw900Code: address(0),
            subdaoDistributorCode: address(0),
            subdaoEmitter: address(0),
            donationMatchCode: address(0),
            rebalance: curDetails.rebalance,
            splitToLiquid: curDetails.splitToLiquid,
            haloToken: address(0),
            haloTokenLpContract: address(0),
            govContract: address(0),
            donationMatchCharitesContract: address(0),
            donationMatchEmitter: address(0),
            collectorAddr: address(0),
            collectorShare: 50,
            charitySharesContract: address(0),
            acceptedTokens: curDetails.acceptedTokens,
            fundraisingContract: address(0),
            swapsRouter: address(0),
            multisigFactory: address(0),
            multisigEmitter: address(0),
            charityProposal: address(0),
            lockedWithdrawal: address(0),
            proxyAdmin: address(0),
            usdcAddress: address(0),
            wethAddress: address(0),
            cw900lvAddress: address(0)
        });
        emit UpdateRegistrarConfig(state.config);

        // TODO change how decimals are represented
        state.FEES["vault_harvest"] = curDetails.taxRate;
        // TODO this is not 2 percent this should be 0.2 percent
        state.FEES["accounts_withdraw"] = 2;
        string[] memory feeKeys = new string[](2);
        feeKeys[0] = "vault_harvest";
        feeKeys[1] = "accounts_withdraw";

        uint256[] memory feeValues = new uint256[](2);
        feeValues[0] = curDetails.taxRate;
        feeValues[1] = 2;
        emit UpdateRegistrarFees(
            RegistrarMessages.UpdateFeeRequest({
                keys: feeKeys,
                values: feeValues
            })
        );

        //TODO: we cannot specify polygon chain id to ethereum chain id
        state.NETWORK_CONNECTIONS[block.chainid] = AngelCoreStruct.NetworkInfo({
            name: "Polygon",
            chainId: block.chainid,
            ibcChannel: "",
            transferChannel: "",
            gasReceiver: address(0),
            gasLimit: 0,
            router: curDetails.router,
            axelerGateway: curDetails.axelerGateway
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
     * @param curDetails details for the contract
     */
    function updateConfig(
        RegistrarMessages.UpdateConfigRequest memory curDetails
    ) public nonReentrant {
        require(msg.sender == state.config.owner, "E04"); //Account not authorized
        // Set applications review
        if (Validator.addressChecker(curDetails.applicationsReview)) {
            state.config.applicationsReview = curDetails.applicationsReview;
        }

        if (Validator.addressChecker(curDetails.accountsContract)) {
            state.config.accountsContract = curDetails.accountsContract;
        }

        if (Validator.addressChecker(curDetails.swapsRouter)) {
            state.config.swapsRouter = curDetails.swapsRouter;
        }

        if (Validator.addressChecker(curDetails.charitySharesContract)) {
            state.config.charitySharesContract = curDetails
                .charitySharesContract;
        }

        if (Validator.addressChecker(curDetails.indexFundContract)) {
            state.config.indexFundContract = curDetails.indexFundContract;
        }

        if (Validator.addressChecker(curDetails.treasury)) {
            state.config.treasury = curDetails.treasury;
        }

        require(curDetails.taxRate <= 100, "E06"); //Invalid tax rate input
        // change taxRate from optional to required field because theres no way to map default value to tax rate
        // since this is an update call, frontend will always send rebalance details
        state.config.rebalance = curDetails.rebalance;

        // check splits
        require(curDetails.splitMax <= 100, "E07"); //Invalid Max Split Input
        require(curDetails.splitMin < 100, "E08"); //Invalid Min Split Input
        require(curDetails.splitDefault <= 100, "E09"); //Invalid Default Split Input

        AngelCoreStruct.SplitDetails memory split_details = AngelCoreStruct
            .SplitDetails({
                max: curDetails.splitMax,
                min: curDetails.splitMin,
                defaultSplit: curDetails.splitDefault
            });

        if (Validator.splitChecker(split_details)) {
            state.config.splitToLiquid = split_details;
        } else {
            revert("e10"); //Invalid Split Details Supplied
        }

        if (
            Validator.addressChecker(curDetails.donationMatchCharitesContract)
        ) {
            state.config.donationMatchCharitesContract = curDetails
                .donationMatchCharitesContract;
        }
        if (Validator.addressChecker(curDetails.donationMatchEmitter)) {
            state.config.donationMatchEmitter = curDetails.donationMatchEmitter;
        }

        // TODO Accepted token set

        state.config.acceptedTokens = curDetails.acceptedTokens;

        if (Validator.addressChecker(curDetails.fundraisingContract)) {
            state.config.fundraisingContract = curDetails.fundraisingContract;
        }

        // TODO send update config message to collector contract
        // state.config.collectorAddr

        // TODO update decimal logic
        if (curDetails.collectorShare != 0) {
            state.config.collectorShare = curDetails.collectorShare;
        }

        if (Validator.addressChecker(curDetails.govContract)) {
            state.config.govContract = curDetails.govContract;
        }

        if (Validator.addressChecker(curDetails.subdaoGovCode)) {
            state.config.subdaoGovCode = curDetails.subdaoGovCode;
        }

        if (Validator.addressChecker(curDetails.subdaoBondingTokenCode)) {
            state.config.subdaoBondingTokenCode = curDetails
                .subdaoBondingTokenCode;
        }

        if (Validator.addressChecker(curDetails.subdaoCw20TokenCode)) {
            state.config.subdaoCw20TokenCode = curDetails.subdaoCw20TokenCode;
        }

        if (Validator.addressChecker(curDetails.subdaoCw900Code)) {
            state.config.subdaoCw900Code = curDetails.subdaoCw900Code;
        }

        if (Validator.addressChecker(curDetails.subdaoDistributorCode)) {
            state.config.subdaoDistributorCode = curDetails
                .subdaoDistributorCode;
        }
        if (Validator.addressChecker(curDetails.subdaoEmitter)) {
            state.config.subdaoEmitter = curDetails.subdaoEmitter;
        }

        if (Validator.addressChecker(curDetails.donationMatchCode)) {
            state.config.donationMatchCode = curDetails.donationMatchCode;
        }

        if (Validator.addressChecker(curDetails.haloToken)) {
            state.config.haloToken = curDetails.haloToken;
        }

        if (Validator.addressChecker(curDetails.haloTokenLpContract)) {
            state.config.haloTokenLpContract = curDetails.haloTokenLpContract;
        }

        if (Validator.addressChecker(curDetails.multisigEmitter)) {
            state.config.multisigEmitter = curDetails.multisigEmitter;
        }

        if (Validator.addressChecker(curDetails.multisigFactory)) {
            state.config.multisigFactory = curDetails.multisigFactory;
        }

        if (Validator.addressChecker(curDetails.charityProposal)) {
            state.config.charityProposal = curDetails.charityProposal;
        }

        if (Validator.addressChecker(curDetails.lockedWithdrawal)) {
            state.config.lockedWithdrawal = curDetails.lockedWithdrawal;
        }

        if (Validator.addressChecker(curDetails.proxyAdmin)) {
            state.config.proxyAdmin = curDetails.proxyAdmin;
        }

        if (Validator.addressChecker(curDetails.usdcAddress)) {
            state.config.usdcAddress = curDetails.usdcAddress;
        }

        if (Validator.addressChecker(curDetails.wethAddress)) {
            state.config.wethAddress = curDetails.wethAddress;
        }

        if (Validator.addressChecker(curDetails.cw900lvAddress)) {
            state.config.cw900lvAddress = curDetails.cw900lvAddress;
        }
        // state.config.acceptedTokens = AngelCoreStruct.AcceptedTokens({
        //     native: curDetails.accepted_tokens_native,
        //     cw20: curDetails.accepted_tokens_cw20
        // });
        emit UpdateRegistrarConfig(state.config);
    }

    /**
     * @dev Update the owner of the registrar
     * @param newOwner The new owner of the registrar
     */
    function updateOwner(address newOwner) public nonReentrant {
        require(msg.sender == state.config.owner, "Account not authorized");
        require(Validator.addressChecker(newOwner), "Invalid New Owner");

        state.config.owner = newOwner;
        emit UpdateRegistrarOwner(newOwner);
    }

    function updateFees(
        RegistrarMessages.UpdateFeeRequest memory curDetails
    ) public nonReentrant {
        require(
            curDetails.keys.length == curDetails.values.length,
            "Invalid input"
        );

        for (uint256 i = 0; i < curDetails.keys.length; i++) {
            require(curDetails.values[i] < 100, "invalid percentage value");
            state.FEES[curDetails.keys[i]] = curDetails.values[i];
        }
        emit UpdateRegistrarFees(curDetails);
    }

    /**
     * @dev Add a new vault to the registrar
     * @param curDetails The details of the vault to add
     */
    function vaultAdd(
        RegistrarMessages.VaultAddRequest memory curDetails
    ) public nonReentrant {
        require(msg.sender == state.config.owner, "Account not authorized");

        uint256 vaultNetwork;
        if (curDetails.network == 0) {
            vaultNetwork = block.chainid;
        } else {
            vaultNetwork = curDetails.network;
        }

        if (!(Validator.addressChecker(curDetails.yieldToken))) {
            revert("Failed to validate yield token address");
        }

        state.VAULTS[curDetails.stratagyName] = AngelCoreStruct.YieldVault({
            network: vaultNetwork,
            addr: curDetails.stratagyName,
            inputDenom: curDetails.inputDenom,
            yieldToken: curDetails.yieldToken,
            approved: true,
            restrictedFrom: curDetails.restrictedFrom,
            acctType: curDetails.acctType,
            vaultType: curDetails.vaultType
        });
        state.VAULT_POINTERS.push(curDetails.stratagyName);
        emit AddVault(
            curDetails.stratagyName,
            state.VAULTS[curDetails.stratagyName]
        );
    }

    /**
     * @dev Remove a vault from the registrar
     * @param _stratagyName The name of the vault to remove
     */
    function vaultRemove(string memory _stratagyName) public nonReentrant {
        require(msg.sender == state.config.owner, "Account not authorized");

        delete state.VAULTS[_stratagyName];
        uint256 delIndex;
        bool indexFound;
        (delIndex, indexFound) = StringArray.stringIndexOf(
            state.VAULT_POINTERS,
            _stratagyName
        );

        if (indexFound) {
            state.VAULT_POINTERS = StringArray.stringRemove(
                state.VAULT_POINTERS,
                delIndex
            );
        }
        emit RemoveVault(_stratagyName);
    }

    /**
     * @dev Update a vault in the registrar
     * @param _stratagyName The name of the vault to update
     * @param curApproved Whether the vault is approved or not
     * @param curRestrictedfrom The list of endowments that are restricted from using this vault
     */
    function vaultUpdate(
        string memory _stratagyName,
        bool curApproved,
        AngelCoreStruct.EndowmentType[] memory curRestrictedfrom
    ) public nonReentrant {
        require(msg.sender == state.config.owner, "Account not authorized");

        state.VAULTS[_stratagyName].approved = curApproved;
        state.VAULTS[_stratagyName].restrictedFrom = curRestrictedfrom;
        emit UpdateVault(_stratagyName, curApproved, curRestrictedfrom);
    }

    /**
     * @dev update network connections in the registrar
     * @param networkInfo The network info to update
     * @param action The action to perform (post or delete)
     */
    function updateNetworkConnections(
        AngelCoreStruct.NetworkInfo memory networkInfo,
        string memory action
    ) public nonReentrant {
        require(msg.sender == state.config.owner, "Account not authorized");

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

    /**
     * @dev Query the vaults in the registrar
     * @param network The network to query
     * @param endowmentType The endowment type to query
     * @param accountType The account type to query
     * @param vaultType The vault type to query
     * @param approved Whether the vault is approved or not
     * @param startAfter The index to start the query from
     * @param limit The number of vaults to return
     * @return The list of vaults
     */
    function queryVaultListDep(
        uint256 network,
        AngelCoreStruct.EndowmentType endowmentType,
        AngelCoreStruct.AccountType accountType,
        AngelCoreStruct.VaultType vaultType,
        AngelCoreStruct.BoolOptional approved,
        uint256 startAfter,
        uint256 limit
    ) public view returns (AngelCoreStruct.YieldVault[] memory) {
        uint256 lengthResponse = 0;
        if (limit != 0) {
            lengthResponse = limit;
        } else {
            lengthResponse = state.VAULT_POINTERS.length;
        }
        AngelCoreStruct.YieldVault[]
            memory response = new AngelCoreStruct.YieldVault[](lengthResponse);

        if (startAfter >= state.VAULT_POINTERS.length) {
            revert("Invalid start value");
        }

        for (uint256 i = startAfter; i < state.VAULT_POINTERS.length; i++) {
            //check filters here
            if (
                RegistrarLib.filterVault(
                    state.VAULTS[state.VAULT_POINTERS[i]],
                    network,
                    endowmentType,
                    accountType,
                    vaultType,
                    approved
                )
            ) {
                response[i] = state.VAULTS[state.VAULT_POINTERS[i]];
            }

            if (limit != 0) {
                if (response.length == limit) {
                    break;
                }
            }
        }
        return response;
    }

    /**
     * @dev Query the vaults in the registrar
     * @param network The network to query
     * @param endowmentType The endowment type to query
     * @param accountType The account type to query
     * @param vaultType The vault type to query
     * @param approved Whether the vault is approved or not
     * @param startAfter The index to start the query from
     * @param limit The number of vaults to return
     * @return The list of vaults
     */
    function queryVaultList(
        uint256 network,
        AngelCoreStruct.EndowmentType endowmentType,
        AngelCoreStruct.AccountType accountType,
        AngelCoreStruct.VaultType vaultType,
        AngelCoreStruct.BoolOptional approved,
        uint256 startAfter,
        uint256 limit
    ) public view returns (AngelCoreStruct.YieldVault[] memory) {
        uint256 lengthResponse = 0;

        if (limit != 0) {
            lengthResponse = limit;
        } else {
            lengthResponse = state.VAULT_POINTERS.length;
        }

        AngelCoreStruct.YieldVault[]
            memory response = new AngelCoreStruct.YieldVault[](lengthResponse);

        if (startAfter >= state.VAULT_POINTERS.length) {
            revert("Invalid start value");
        }

        uint256 count = 0;
        string[] memory indexArr = new string[](state.VAULT_POINTERS.length);

        for (uint256 i = startAfter; i < state.VAULT_POINTERS.length; i++) {
            //check filters here
            if (
                RegistrarLib.filterVault(
                    state.VAULTS[state.VAULT_POINTERS[i]],
                    network,
                    endowmentType,
                    accountType,
                    vaultType,
                    approved
                )
            ) {
                response[i] = state.VAULTS[state.VAULT_POINTERS[i]];
                indexArr[count] = state.VAULT_POINTERS[i];
                count++;
            }
        }

        AngelCoreStruct.YieldVault[]
            memory responseFinal = new AngelCoreStruct.YieldVault[](count);

        for (uint256 i = 0; i < count; i++) {
            responseFinal[i] = state.VAULTS[indexArr[i]];
        }

        return responseFinal;
    }

    /**
     * @dev Query the vaults in the registrar
     * @param _stratagyName The name of the vault to query
     * @return response The vault
     */
    function queryVaultDetails(
        string memory _stratagyName
    ) public view returns (AngelCoreStruct.YieldVault memory response) {
        response = state.VAULTS[_stratagyName];
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

    /**
     * @dev Query the fee in registrar
     * @param name The name of the fee to query
     * @return response The fee
     */
    function queryFee(
        string memory name
    ) public view returns (uint256 response) {
        response = state.FEES[name];
    }

    // returns true if the vault satisfies the given conditions
}
