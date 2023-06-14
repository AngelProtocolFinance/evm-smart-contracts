import {BigNumber} from "ethers";
import {AddressObj} from "../utils";

export type Config = {
  AP_TEAM_MULTISIG_DATA: {
    threshold: number;
    requireExecution: boolean;
  };
  APPLICATION_MULTISIG_DATA: {
    threshold: number;
    requireExecution: boolean;
  };
  REGISTRAR_DATA: {
    taxRate: number;
    acceptedTokens: {
      cw20: (keyof AddressObj["tokens"])[];
    };
    rebalance: {
      rebalanceLiquidInvestedProfits: boolean;
      lockedInterestsToLiquid: boolean;
      interest_distribution: number;
      lockedPrincipleToLiquid: boolean;
      principle_distribution: number;
    };
    splitToLiquid: {
      max: number;
      min: number;
      defaultSplit: number;
    };
  };
  CHARITY_APPLICATION_DATA: {
    expiry: number;
    seedSplitToLiquid: number;
    newEndowGasMoney: boolean;
    gasAmount: number;
    fundSeedAsset: boolean;
    seedAssetAmount: number;
  };
  DONATION_MATCH_CHARITY_DATA: {
    poolFee: number;
  };
  REGISTRAR_UPDATE_CONFIG: {
    collectorShare: number;
  };
  INDEX_FUND_DATA: {
    fundRotation: number;
    fundMemberLimit: number;
    fundingGoal: BigNumber;
  };
  FundraisingDataInput: {
    nextId: number;
    campaignPeriodSeconds: number;
    taxRate: number;
    acceptedTokens: {
      coinNativeAmount: number;
      Cw20CoinVerified_amount: number[];
      Cw20CoinVerified_addr: string[];
    };
  };
  HALO_IMPLEMENTATION_DATA: {
    GovHodlerOwner: string;
    CommunitySpendLimit: number;
    distributorSpendLimit: number;
  };
};
