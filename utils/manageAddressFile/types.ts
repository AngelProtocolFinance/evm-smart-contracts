export type AddressObj = {
  accounts: {
    diamond: string;
    facets: {
      accountDeployContract: string;
      accountDepositWithdrawEndowments: string;
      accountDonationMatch: string;
      accountsAllowance: string;
      accountsCreateEndowment: string;
      AccountsDAOEndowments: string;
      accountsQueryEndowments: string;
      accountsSwapRouter: string;
      accountsUpdate: string;
      accountsUpdateEndowments: string;
      accountsUpdateEndowmentSettingsController: string;
      accountsUpdateStatusEndowments: string;
      accountsVaultFacet: string;
      diamondCutFacet: string;
      diamondInitFacet: string;
      diamondLoupeFacet: string;
      ownershipFacet: string;
    };
  };
  charityApplication: {
    implementation: string;
    proxy: string;
  };
  donationMatch: {
    emitter: string;
    implementation: string;
  };
  donationMatchCharity: {
    implementation: string;
    proxy: string;
  };
  fundraising: {
    implementation: string;
    library: string;
    proxy: string;
  };
  giftcards: {
    implementation: string;
    proxy: string;
  };
  goldfinch: {
    liquidVault: string;
    lockedVault: string;
  };
  halo: {
    airdrop: {
      implementation: string;
      proxy: string;
    };
    collector: {
      implementation: string;
      proxy: string;
    };
    community: {
      implementation: string;
      proxy: string;
    };
    distributor: {
      implementation: string;
      proxy: string;
    };
    erc20Upgrade: {
      implementation: string;
      proxy: string;
    };
    gov: {
      implementation: string;
      proxy: string;
    };
    govHodler: {
      implementation: string;
      proxy: string;
    };
    staking: {
      implementation: string;
      proxy: string;
    };
    timelock: {
      implementation: string;
      proxy: string;
    };
    token: string;
    vesting: {
      implementation: string;
      proxy: string;
    };
    votingERC20: {
      implementation: string;
      proxy: string;
    };
  };
  incentivisedVotingLockup: {
    implementation: string;
  };
  indexFund: {
    implementation: string;
    proxy: string;
  };
  libraries: {
    ANGEL_CORE_STRUCT_LIBRARY: string;
    STRING_LIBRARY: string;
  };
  multiSig: {
    applications: {
      implementation: string;
      proxy: string;
    };
    apTeam: {
      implementation: string;
      proxy: string;
    };
    endowment: {
      emitter: {
        implementation: string;
        proxy: string;
      };
      factory: string;
      implementation: string;
    };
  };
  registrar: {
    implementation: string;
    proxy: string;
  };
  router: {
    implementation: string;
    proxy: string;
  };
  subDao: {
    emitter: {
      implementation: string;
      proxy: string;
    };
    implementation: string;
    token: string;
    veBondingToken: string;
  };
  swapRouter: {
    implementation: string;
    proxy: string;
  };
  tokens: {
    halo: string;
    usdc: string;
    wmatic: string;
  };
};
