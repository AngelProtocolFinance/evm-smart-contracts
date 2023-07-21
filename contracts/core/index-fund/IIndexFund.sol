// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IndexFundStorage} from "./storage.sol";

interface IIndexFund {
  /*////////////////////////////////////////////////
                        EVENTS
  */ ////////////////////////////////////////////////
  event Instantiated(address registrarContract, uint256 fundRotation, uint256 fundingGoal);
  event ConfigUpdated(address registrarContract, uint256 fundingGoal, uint256 fundRotation);
  event FundCreated(uint256 id);
  event FundRemoved(uint256 id);
  event MemberRemoved(uint256 fundId, uint32 endowmentId);
  event MembersUpdated(uint256 fundId, uint32[] endowments);
  event DonationProcessed(uint256 fundId);
  event ActiveFundUpdated(uint256 fundId);
  event StateUpdated();

  /*////////////////////////////////////////////////
                    ENDPOINTS
 */ ////////////////////////////////////////////////

  struct StateResponse {
    uint256 activeFund; // index ID of the Active IndexFund
    uint256 roundDonations; // total donations given to active charity this round
    uint256 nextRotationBlock; // block height to perform next rotation on
  }

  /**
   * @notice function to update config of index fund
   * @dev can be called by owner to set new config
   * @param registrarContract Registrar Contract address
   * @param fundRotation how many blocks are in a rotation cycle for the active IndexFund
   * @param fundingGoal donation funding limit to trigger early cycle of the Active IndexFund
   */
  function updateConfig(
    address registrarContract,
    uint256 fundRotation,
    uint256 fundingGoal
  ) external;

  /**
   * @notice function to create a new Fund
   * @dev can be called by owner to create a new Fund
   * @param name name of the Fund
   * @param description description of the Fund
   * @param endowments array of endowments in the Fund
   * @param rotatingFund boolean to indicate if the Fund is rotating fund
   * @param splitToLiquid split of Fund donations to liquid portion of endowment account
   * @param expiryTime expiry time of the Fund
   */
  function createIndexFund(
    string memory name,
    string memory description,
    uint32[] memory endowments,
    bool rotatingFund,
    uint256 splitToLiquid,
    uint256 expiryTime
  ) external;

  /**
   * @notice function to remove index fund
   * @dev can be called by owner to remove an index fund
   * @param fundId id of index fund to be removed
   */
  function removeIndexFund(uint256 fundId) external;

  /**
   *  @notice function to remove endowment member from all Funds globally. Used by Accounts contract when an Endowment closes down.
   *  @dev can be called by owner to remove a endowment from all the index funds
   *  @param endowment endowment to be removed from index fund
   */
  function removeMember(uint32 endowment) external;

  /**
   *  @notice Function to update a Fund's endowment members
   *  @dev Can be called by owner to add/remove endowments to a Fund
   *  @param fundId The id of the Fund to be updated
   *  @param endowments An array of endowments to be set for a Fund
   */
  function updateFundMembers(uint256 fundId, uint32[] memory endowments) external;

  /**
   * @notice deposit function which can be called by user to add funds to index fund
   * @dev converted from rust implementation, handles donations by managing limits and rotating active fund
   * @param fundId index fund ID
   * @param token address of Token being deposited
   * @param amount amount of Token being deposited
   * @param splitToLiquid integer % of deposit to be split to liquid balance
   */
  function depositERC20(
    uint256 fundId,
    address token,
    uint256 amount,
    uint256 splitToLiquid
  ) external;

  /**
   * @dev Query config
   * @return Config
   */
  function queryConfig() external view returns (IndexFundStorage.Config memory);

  /**
   * @dev Query state
   * @return State
   */
  function queryState() external view returns (StateResponse memory);

  /**
   * @dev Query rotating funds list
   * @return List of rotating fund IDs
   */
  function queryRotatingFunds() external view returns (uint256[] memory);

  /**
   * @dev Query fund details
   * @param fundId Fund id
   * @return Fund details
   */
  function queryFundDetails(uint256 fundId) external view returns (IndexFundStorage.Fund memory);

  /**
   * @dev Query in which index funds is an endowment part of
   * @param endowmentId Endowment id
   * @return Fund details
   */
  function queryInvolvedFunds(uint32 endowmentId) external view returns (uint256[] memory);

  /**
   * @dev Query active fund details
   * @return Fund details
   */
  function queryActiveFundDetails() external view returns (IndexFundStorage.Fund memory);
}
