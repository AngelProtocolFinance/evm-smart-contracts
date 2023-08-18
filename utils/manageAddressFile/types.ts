export type AddressObj = {
  accounts: {
    diamond: string;
    facets: {
      accountsDepositWithdrawEndowments: string;
      accountsAllowance: string;
      accountsCreateEndowment: string;
      accountsGasManager: string;
      accountsQueryEndowments: string;
      accountsStrategy: string;
      accountsSwapRouter: string;
      accountsUpdate: string;
      accountsUpdateEndowments: string;
      accountsUpdateEndowmentSettingsController: string;
      accountsUpdateStatusEndowments: string;
      diamondCutFacet: string;
      diamondInitFacet: string;
      diamondLoupeFacet: string;
      ownershipFacet: string;
    };
  };
  axelar: {
    gasService: string;
    gateway: string;
  };
  fundraising: {
    implementation: string;
    proxy: string;
  };
  gasFwd: {
    implementation: string;
    factory: string;
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
  indexFund: {
    implementation: string;
    proxy: string;
  };
  multiSig: {
    charityApplications: {
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
  tokens: {
    dai: string;
    halo: string;
    reserveToken: string;
    seedAsset: string;
    usdc: string;
    wmatic: string;
  };
  uniswap: {
    factory: string;
    swapRouter: string;
  };
};
