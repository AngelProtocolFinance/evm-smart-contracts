import {BigNumber} from "ethers";
import {AddressObj} from "../utils";

export type Config = {
  AP_TEAM_MULTISIG_DATA: {
    threshold: number;
    requireExecution: boolean;
    transactionExpiry: number;
  };
  PROXY_ADMIN_MULTISIG_DATA: {
    threshold: number;
    requireExecution: boolean;
    transactionExpiry: number;
  };
  REGISTRAR_DATA: {
    taxRate: number;
    acceptedTokens: {
      erc20: (keyof AddressObj["tokens"])[];
    };
    rebalance: {
      rebalanceLiquidInvestedProfits: boolean;
      lockedInterestsToLiquid: boolean;
      interest_distribution: number;
      lockedPrincipleToLiquid: boolean;
      principle_distribution: number;
    };
  };
  CHARITY_APPLICATIONS_DATA: {
    threshold: number;
    requireExecution: boolean;
    transactionExpiry: number;
    seedSplitToLiquid: number;
    gasAmount: BigNumber;
    seedAmount: number;
  };
  DONATION_MATCH_CHARITY_DATA: {
    poolFee: number;
  };
  INDEX_FUND_DATA: {
    fundRotation: number;
    fundMemberLimit: number;
    fundingGoal: BigNumber;
  };
  HALO_IMPLEMENTATION_DATA: {
    GovHodlerOwner: string;
    CommunitySpendLimit: number;
    distributorSpendLimit: number;
  };
  PROD_CONFIG: {
    APTeamMultiSigOwners: string[];
    CharityApplicationsOwners: string[];
    ProxyAdminMultiSigOwners: string[];
    Treasury: string;
  };
};
