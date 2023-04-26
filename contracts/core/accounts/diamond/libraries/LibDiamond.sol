// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
/******************************************************************************/
import {IDiamondCut} from "../interfaces/IDiamondCut.sol";

// Remember to add the loupe functions from DiamondLoupeFacet to the diamond.
// The loupe functions are required by the EIP2535 Diamonds standard

error InitializationFunctionReverted(
    address curInitializationcontractaddress,
    bytes curCalldata
);

library LibDiamond {
    bytes32 constant DIAMOND_STORAGE_POSITION =
        keccak256("diamond.standard.diamond.storage");

    struct FacetAddressAndPosition {
        address facetAddress;
        uint96 functionSelectorPosition; // position in facetFunctionSelectors.functionSelectors array
    }

    struct FacetFunctionSelectors {
        bytes4[] functionSelectors;
        uint256 facetAddressPosition; // position of facetAddress in facetAddresses array
    }

    struct DiamondStorage {
        // maps function selector to the facet address and
        // the position of the selector in the facetFunctionSelectors.selectors array
        mapping(bytes4 => FacetAddressAndPosition) selectorToFacetAndPosition;
        // maps facet addresses to function selectors
        mapping(address => FacetFunctionSelectors) facetFunctionSelectors;
        // facet addresses
        address[] facetAddresses;
        // Used to query if a contract implements an interface.
        // Used to implement ERC-165.
        mapping(bytes4 => bool) supportedInterfaces;
        // owner of the contract
        address contractOwner;
    }

    function diamondStorage()
        internal
        pure
        returns (DiamondStorage storage ds)
    {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    function setContractOwner(address curNewowner) internal {
        DiamondStorage storage ds = diamondStorage();
        address previousOwner = ds.contractOwner;
        ds.contractOwner = curNewowner;
        emit OwnershipTransferred(previousOwner, curNewowner);
    }

    function contractOwner() internal view returns (address curContractowner) {
        curContractowner = diamondStorage().contractOwner;
    }

    function enforceIsContractOwner() internal view {
        require(
            msg.sender == diamondStorage().contractOwner,
            "LibDiamond: Must be contract owner"
        );
    }

    event DiamondCut(
        IDiamondCut.FacetCut[] curDiamondcut,
        address curInit,
        bytes curCalldata
    );

    // Internal function version of diamondCut
    function diamondCut(
        IDiamondCut.FacetCut[] memory curDiamondcut,
        address curInit,
        bytes memory curCalldata
    ) internal {
        for (
            uint256 facetIndex = 0;
            facetIndex < curDiamondcut.length;
            facetIndex++
        ) {
            IDiamondCut.FacetCutAction action = curDiamondcut[facetIndex].action;
            if (action == IDiamondCut.FacetCutAction.Add) {
                addFunctions(
                    curDiamondcut[facetIndex].facetAddress,
                    curDiamondcut[facetIndex].functionSelectors
                );
            } else if (action == IDiamondCut.FacetCutAction.Replace) {
                replaceFunctions(
                    curDiamondcut[facetIndex].facetAddress,
                    curDiamondcut[facetIndex].functionSelectors
                );
            } else if (action == IDiamondCut.FacetCutAction.Remove) {
                removeFunctions(
                    curDiamondcut[facetIndex].facetAddress,
                    curDiamondcut[facetIndex].functionSelectors
                );
            } else {
                revert("LibDiamondCut: Incorrect FacetCutAction");
            }
        }
        emit DiamondCut(curDiamondcut, curInit, curCalldata);
        initializeDiamondCut(curInit, curCalldata);
    }

    function addFunctions(
        address curFacetaddress,
        bytes4[] memory curFunctionselectors
    ) internal {
        require(
            curFunctionselectors.length > 0,
            "LibDiamondCut: No selectors in facet to cut"
        );
        DiamondStorage storage ds = diamondStorage();
        require(
            curFacetaddress != address(0),
            "LibDiamondCut: Add facet can't be address(0)"
        );
        uint96 selectorPosition = uint96(
            ds.facetFunctionSelectors[curFacetaddress].functionSelectors.length
        );
        // add new facet address if it does not exist
        if (selectorPosition == 0) {
            addFacet(ds, curFacetaddress);
        }
        for (
            uint256 selectorIndex = 0;
            selectorIndex < curFunctionselectors.length;
            selectorIndex++
        ) {
            bytes4 selector = curFunctionselectors[selectorIndex];
            address oldFacetAddress = ds
                .selectorToFacetAndPosition[selector]
                .facetAddress;
            require(
                oldFacetAddress == address(0),
                "LibDiamondCut: Can't add function that already exists"
            );
            addFunction(ds, selector, selectorPosition, curFacetaddress);
            selectorPosition++;
        }
    }

    function replaceFunctions(
        address curFacetaddress,
        bytes4[] memory curFunctionselectors
    ) internal {
        require(
            curFunctionselectors.length > 0,
            "LibDiamondCut: No selectors in facet to cut"
        );
        DiamondStorage storage ds = diamondStorage();
        require(
            curFacetaddress != address(0),
            "LibDiamondCut: Add facet can't be address(0)"
        );
        uint96 selectorPosition = uint96(
            ds.facetFunctionSelectors[curFacetaddress].functionSelectors.length
        );
        // add new facet address if it does not exist
        if (selectorPosition == 0) {
            addFacet(ds, curFacetaddress);
        }
        for (
            uint256 selectorIndex = 0;
            selectorIndex < curFunctionselectors.length;
            selectorIndex++
        ) {
            bytes4 selector = curFunctionselectors[selectorIndex];
            address oldFacetAddress = ds
                .selectorToFacetAndPosition[selector]
                .facetAddress;
            require(
                oldFacetAddress != curFacetaddress,
                "LibDiamondCut: Can't replace function with same function"
            );
            removeFunction(ds, oldFacetAddress, selector);
            addFunction(ds, selector, selectorPosition, curFacetaddress);
            selectorPosition++;
        }
    }

    function removeFunctions(
        address curFacetaddress,
        bytes4[] memory curFunctionselectors
    ) internal {
        require(
            curFunctionselectors.length > 0,
            "LibDiamondCut: No selectors in facet to cut"
        );
        DiamondStorage storage ds = diamondStorage();
        // if function does not exist then do nothing and return
        require(
            curFacetaddress == address(0),
            "LibDiamondCut: Remove facet address must be address(0)"
        );
        for (
            uint256 selectorIndex = 0;
            selectorIndex < curFunctionselectors.length;
            selectorIndex++
        ) {
            bytes4 selector = curFunctionselectors[selectorIndex];
            address oldFacetAddress = ds
                .selectorToFacetAndPosition[selector]
                .facetAddress;
            removeFunction(ds, oldFacetAddress, selector);
        }
    }

    function addFacet(DiamondStorage storage ds, address curFacetaddress)
        internal
    {
        enforceHasContractCode(
            curFacetaddress,
            "LibDiamondCut: New facet has no code"
        );
        ds.facetFunctionSelectors[curFacetaddress].facetAddressPosition = ds
            .facetAddresses
            .length;
        ds.facetAddresses.push(curFacetaddress);
    }

    function addFunction(
        DiamondStorage storage ds,
        bytes4 curSelector,
        uint96 curSelectorPosition,
        address curFacetaddress
    ) internal {
        ds
            .selectorToFacetAndPosition[curSelector]
            .functionSelectorPosition = curSelectorPosition;
        ds.facetFunctionSelectors[curFacetaddress].functionSelectors.push(
            curSelector
        );
        ds.selectorToFacetAndPosition[curSelector].facetAddress = curFacetaddress;
    }

    function removeFunction(
        DiamondStorage storage ds,
        address curFacetaddress,
        bytes4 curSelector
    ) internal {
        require(
            curFacetaddress != address(0),
            "LibDiamondCut: Can't remove function that doesn't exist"
        );
        // an immutable function is a function defined directly in a diamond
        require(
            curFacetaddress != address(this),
            "LibDiamondCut: Can't remove immutable function"
        );
        // replace selector with last selector, then delete last selector
        uint256 selectorPosition = ds
            .selectorToFacetAndPosition[curSelector]
            .functionSelectorPosition;
        uint256 lastSelectorPosition = ds
            .facetFunctionSelectors[curFacetaddress]
            .functionSelectors
            .length - 1;
        // if not the same then replace curSelector with lastSelector
        if (selectorPosition != lastSelectorPosition) {
            bytes4 lastSelector = ds
                .facetFunctionSelectors[curFacetaddress]
                .functionSelectors[lastSelectorPosition];
            ds.facetFunctionSelectors[curFacetaddress].functionSelectors[
                    selectorPosition
                ] = lastSelector;
            ds
                .selectorToFacetAndPosition[lastSelector]
                .functionSelectorPosition = uint96(selectorPosition);
        }
        // delete the last selector
        ds.facetFunctionSelectors[curFacetaddress].functionSelectors.pop();
        delete ds.selectorToFacetAndPosition[curSelector];

        // if no more selectors for facet address then delete the facet address
        if (lastSelectorPosition == 0) {
            // replace facet address with last facet address and delete last facet address
            uint256 lastFacetAddressPosition = ds.facetAddresses.length - 1;
            uint256 facetAddressPosition = ds
                .facetFunctionSelectors[curFacetaddress]
                .facetAddressPosition;
            if (facetAddressPosition != lastFacetAddressPosition) {
                address lastFacetAddress = ds.facetAddresses[
                    lastFacetAddressPosition
                ];
                ds.facetAddresses[facetAddressPosition] = lastFacetAddress;
                ds
                    .facetFunctionSelectors[lastFacetAddress]
                    .facetAddressPosition = facetAddressPosition;
            }
            ds.facetAddresses.pop();
            delete ds
                .facetFunctionSelectors[curFacetaddress]
                .facetAddressPosition;
        }
    }

    function initializeDiamondCut(address curInit, bytes memory curCalldata)
        internal
    {
        if (curInit == address(0)) {
            return;
        }
        enforceHasContractCode(
            curInit,
            "LibDiamondCut: curInit address has no code"
        );
        (bool success, bytes memory error) = curInit.delegatecall(curCalldata);
        if (!success) {
            if (error.length > 0) {
                // bubble up error
                /// @solidity memory-safe-assembly
                assembly {
                    let returndata_size := mload(error)
                    revert(add(32, error), returndata_size)
                }
            } else {
                revert InitializationFunctionReverted(curInit, curCalldata);
            }
        }
    }

    function enforceHasContractCode(
        address curContract,
        string memory curErrorMessage
    ) internal view {
        uint256 contractSize;
        assembly {
            contractSize := extcodesize(curContract)
        }
        require(contractSize > 0, curErrorMessage);
    }
}
