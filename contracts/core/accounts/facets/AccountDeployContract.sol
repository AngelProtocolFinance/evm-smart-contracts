// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {SubDao, subDaoMessage} from "./../../../normalized_endowment/subdao/subdao.sol";
import {AccountStorage} from "../storage.sol";
import {LibAccounts} from "../lib/LibAccounts.sol";
import {ProxyContract} from "./../../proxy.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {IRegistrar} from "../../registrar/interface/IRegistrar.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import {ISubdaoEmitter} from "../../../normalized_endowment/subdao/ISubdaoEmitter.sol";
import {ISubDao} from "../../../normalized_endowment/subdao/Isubdao.sol";

/**
 * @title AccountDeployContract
 * @notice This contract is used to deploy contracts from accounts diamond
 * @dev Created so that deploying facets (which call this) don't have size conflicts
 * @dev Is always going to be called by address(this)
 */
contract AccountDeployContract is ReentrancyGuardFacet, AccountsEvents {
    /**
     * @notice Create a new Dao for endowment
     * @param createdaomessage Dao creation message with initial configuration
     */
    function createDaoContract(
        subDaoMessage.InstantiateMsg memory createdaomessage
    ) public nonReentrant returns (address daoAddress) {
        // will be called by self, as this is deployment facet
        require(msg.sender == address(this), "Unauthorized");
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        address implementation = registrar_config.subdaoGovCode;
        address admin = registrar_config.proxyAdmin;

        bytes memory subDaoData = abi.encodeWithSignature(
            "initializeSubDao((uint256,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,(uint8,(address,uint256,string,string,(uint8,(uint128,uint256,uint128,uint128)),string,string,uint256,address,uint256,uint256)),uint8,address,address),address)",
            createdaomessage,
            registrar_config.subdaoEmitter
        );

        daoAddress = address(
            new ProxyContract(implementation, admin, subDaoData)
        );
        ISubdaoEmitter(registrar_config.subdaoEmitter).initializeSubdao(
            daoAddress,
            createdaomessage
        );

        ISubDao(daoAddress).buildDaoTokenMesage(createdaomessage);
        emit DaoContractCreated(createdaomessage, daoAddress);
    }
}
