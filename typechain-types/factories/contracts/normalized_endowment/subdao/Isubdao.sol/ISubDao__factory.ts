/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ISubDao,
  ISubDaoInterface,
} from "../../../../../contracts/normalized_endowment/subdao/Isubdao.sol/ISubDao";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "quorum",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "threshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "votingPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timelockPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "proposalDeposit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "snapshotPeriod",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "enum AngelCoreStruct.TokenType",
                name: "token",
                type: "uint8",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "existingCw20Data",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "newCw20InitialSupply",
                    type: "uint256",
                  },
                  {
                    internalType: "string",
                    name: "newCw20Name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "newCw20Symbol",
                    type: "string",
                  },
                  {
                    components: [
                      {
                        internalType: "enum AngelCoreStruct.CurveTypeEnum",
                        name: "curve_type",
                        type: "uint8",
                      },
                      {
                        components: [
                          {
                            internalType: "uint128",
                            name: "value",
                            type: "uint128",
                          },
                          {
                            internalType: "uint256",
                            name: "scale",
                            type: "uint256",
                          },
                          {
                            internalType: "uint128",
                            name: "slope",
                            type: "uint128",
                          },
                          {
                            internalType: "uint128",
                            name: "power",
                            type: "uint128",
                          },
                        ],
                        internalType: "struct AngelCoreStruct.CurveTypeData",
                        name: "data",
                        type: "tuple",
                      },
                    ],
                    internalType: "struct AngelCoreStruct.CurveType",
                    name: "bondingCurveCurveType",
                    type: "tuple",
                  },
                  {
                    internalType: "string",
                    name: "bondingCurveName",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "bondingCurveSymbol",
                    type: "string",
                  },
                  {
                    internalType: "uint256",
                    name: "bondingCurveDecimals",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "bondingCurveReserveDenom",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "bondingCurveReserveDecimals",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "bondingCurveUnbondingPeriod",
                    type: "uint256",
                  },
                ],
                internalType: "struct AngelCoreStruct.DaoTokenData",
                name: "data",
                type: "tuple",
              },
            ],
            internalType: "struct AngelCoreStruct.DaoToken",
            name: "token",
            type: "tuple",
          },
          {
            internalType: "enum AngelCoreStruct.EndowmentType",
            name: "endow_type",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "endowOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "registrarContract",
            type: "address",
          },
        ],
        internalType: "struct subDaoMessage.InstantiateMsg",
        name: "curMsg",
        type: "tuple",
      },
    ],
    name: "buildDaoTokenMesage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "curPollid",
        type: "uint256",
      },
      {
        internalType: "enum subDaoStorage.VoteOption",
        name: "vote",
        type: "uint8",
      },
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "curProposer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "curDepositamount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "curTitle",
        type: "string",
      },
      {
        internalType: "string",
        name: "curDescription",
        type: "string",
      },
      {
        internalType: "string",
        name: "curLink",
        type: "string",
      },
      {
        components: [
          {
            internalType: "uint256[]",
            name: "order",
            type: "uint256[]",
          },
          {
            internalType: "address[]",
            name: "contractAddress",
            type: "address[]",
          },
          {
            internalType: "bytes[]",
            name: "execution_message",
            type: "bytes[]",
          },
        ],
        internalType: "struct subDaoStorage.ExecuteData",
        name: "curExecuteMsgs",
        type: "tuple",
      },
    ],
    name: "createPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "curPollid",
        type: "uint256",
      },
    ],
    name: "endPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "curPollid",
        type: "uint256",
      },
    ],
    name: "executePoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "curPollid",
        type: "uint256",
      },
    ],
    name: "expirePoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "queryConfig",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "daoToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "veToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "swapFactory",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "quorum",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "threshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "votingPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timelockPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "proposalDeposit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "snapshotPeriod",
            type: "uint256",
          },
        ],
        internalType: "struct subDaoMessage.QueryConfigResponse",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "queryState",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "pollCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalShare",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalDeposit",
            type: "uint256",
          },
        ],
        internalType: "struct subDaoStorage.State",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "curVetoken",
        type: "address",
      },
      {
        internalType: "address",
        name: "curSwapfactory",
        type: "address",
      },
    ],
    name: "registerContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "curOwner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "curQuorum",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "curThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "curVotingperiod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "curTimelockperiod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "curExpirationperiod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "curProposaldeposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "curSnapshotperiod",
        type: "uint256",
      },
    ],
    name: "updateConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ISubDao__factory {
  static readonly abi = _abi;
  static createInterface(): ISubDaoInterface {
    return new utils.Interface(_abi) as ISubDaoInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISubDao {
    return new Contract(address, _abi, signerOrProvider) as ISubDao;
  }
}
