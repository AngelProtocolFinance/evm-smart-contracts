type Proxied = {
  implementation: string;
  proxy: string;
};

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
      diamondInit: string;
      diamondLoupeFacet: string;
      ownershipFacet: string;
    };
  };
  axelar: {
    gasService: string;
    gateway: string;
  };
  fundraising: Proxied;
  gasFwd: {
    implementation: string;
    factory: string;
  };
  giftcards: Proxied;
  goldfinch: {
    liquidVault: string;
    lockedVault: string;
  };
  halo: {
    airdrop: Proxied;
    collector: Proxied;
    community: Proxied;
    distributor: Proxied;
    erc20Upgrade: Proxied;
    gov: Proxied;
    govHodler: Proxied;
    staking: Proxied;
    timelock: Proxied;
    token: string;
    vesting: Proxied;
    votingERC20: Proxied;
  };
  indexFund: Proxied;
  multiSig: {
    charityApplications: Proxied;
    apTeam: Proxied;
    endowment: {
      emitter: Proxied;
      factory: Proxied;
      implementation: string;
    };
    proxyAdmin: string;
  };
  registrar: Proxied;
  router: Proxied;
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
  vaultEmitter: Proxied;
};
