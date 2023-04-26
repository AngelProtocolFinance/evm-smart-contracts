# AngelProtocol EVM 

## Architecture
This contract architecture allows an Angel Protocol deployed Router to act as an intermediary between the Axelar GMP protocol and Angel Protocol yield integrations. Supporting data, parameters, and configs are stored in the Registrar contract. Both the Router and Registrar are deployed as upgradable proxies and are manageable by a single, specified Owner/Admin account. This same admin account can modify the data stored in the Registrar. 

### Registrar
![registrar](https://user-images.githubusercontent.com/84420280/217927431-bff49264-1722-4132-ae36-65f05241198d.png)

### Router
![router](https://user-images.githubusercontent.com/84420280/217927446-36e6ebe0-13ed-4e7a-aff5-00250bb4ac25.png)

## INSTALLATION 

After cloning the repo, use yarn to install the packages: 

`yarn install`

Then copy the .env.template file and generate/add your relevant API and PKeys.

## INTERACTING WITH HARDHAT

Contract compilation creates local files (artifacts, typings and ABI JSONs) necessary for interfacing. Compile with: 

`npx hardhat compile`

_Note: Most calls to hardhat check for requisite artifacts and will auto-compile if need be or if changes between source and artifacts are detected._


The default behavior is for Hardhat to use a chain in memory at runtime. For persistent state, run a local node `npx hardhat node` or use a testnet. 
The network can be pointed to using the `--network` CLI flag. 

To deploy a contract, call its relevant deployment script with: 

`npx hardhat run scripts/deployRegistrar.ts --network localhost`

To run the Chai test suite, invoke: 

`npx hardhat test`

Specific tests can be called by adding the path to the relevant test: 

`npx hardhat test tests/Registrar.ts`

## Running tasks

We've made use of the hardhat task functionality to allow easy manipulation of contracts
in the `tasks/` directory, you can find the available tasks. Each should have a thoughtful help text if invoked like: 

`npx hardhat deploy:registrarAndRouter --help`


# Angel Protocol Polygon Contracts

This repository contains smart contracts for Angel Protocol to be deployed on polygon. These contracts should work on any EVM compatible chain. 

Angel Protocol provides tools to fundraise, coordinate, and invest capital. It connects donors &  investors with non-profits, social enterprises, and other changemakers around the world.

[Coverage Report](https://angel-protocol-coverage-report.vercel.app/)

[Auto-generated Documentation](https://doc-site-angel.vercel.app/)


## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/pedalsup/Angel-protocol
cd Angel-protocol
npm install
```

You can use the following environment variables to configure the deployment, **change account private keys**:

```
## Network where to deploy contracts
# options = [polygon, mumbai, goerli]
NETWORK = "hardhat"

VERIFY_CONTRACTS = false
PROD = true

## Account private keys
ACCOUNT_PRIVATE_KEY = "ec11f04d75c3fa18ba7539944f102e4828b760880a18dc42e1d3795dfa167fbf" #use your account
PROXY_ADMIN_KEY = "afae7bf9517d06427b1060ff41f5b3b51f845cb1b29bf66d48s6cc31898e2540"


## Goerli config

GOERLI_RPC_URL = "https://eth-goerli.g.alchemy.com/v2/CeoP2R9XWziBtq8fxExr5C44hMPqmddS"
POLYGON_RPC_URL = "https://polygon-mainnet.g.alchemy.com/v2/XKiRnDxNw8lsHJnjrwKbJxX-g91fGn2F"
MUMBAI_RPC_URL = "https://polygon-mumbai.g.alchemy.com/v2/lqjQFetx_5ankbviY3F5cqEPNatDrUb7"

ETHERSCAN_API_KEY = "CE7PBTYQPZXV5W1P2A4S78CKFYUIB7ITNE"

##Solidity config settings
OPTIMIZER_FLAG = true
OPTIMIZER_RUNS = 200

GANACHE_RPC_URL = "http://127.0.0.1:7545"
ROUTER_ADDRESS = "0xfE5243C714856387bf95124F7905f3e4C438A22B"
GANACHE_PRIVATE_KEY = "0x23a2ddd136264cd21dc374800753ef8c3b02988872308fbed01b6b199a26ff87"
```

## Information

Configuration information can be found in the `hardhat.config.ts` file. Deployment configuration can be defined in the files present in the `config` folder.

Solidity Compile Version: `0.8.16`

## Run options

To compile contracts 
  
```sh 
npx hardhat compile
```

To run tests

```sh
npx hardhat test
```

To run coverage 

```sh
npx hardhat coverage
```

## Deployment

We have a deploy script in the `scripts` folder. To deploy contracts run the following command:

```sh
npx hardhat run scripts/deploy.ts --network <network>
```

However, this requires the full configuration of other addresses that are supposed to be present on the network before the protocol can be deployed! This script has been tested on hardhat environment and should be modified to suit your needs.


### Slither Analysis

Slither: `slither . --json static_audit.json --checklist` or use the extension in vscode to run the analysis.


### Directory Information

- abi: Contains all the abi files for the protocol contracts
- config: Contains all the configuration files for the protocol deployments. Basically key-value pairs for the addresses of the contracts that are required to be present on a network for the protocol to work. Also contains contract's initial configuration.
- contracts: Contains all the contracts for the protocol (See tree below)
- scripts: Contains deploy script and some other helpers scripts that are usefull.
- test: Contains all the tests for the protocol (See tree below)

### Directory Tree

#### Contracts

```
├── accessory
│   ├── fundraising
│   │   ├── Fundraising.sol
│   │   ├── FundraisingLib.sol
│   │   ├── message.sol
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   └── storage.sol
│   └── gift-cards
│       ├── GiftCards.sol
│       ├── message.sol
│       ├── scripts
│       │   └── deploy.ts
│       └── storage.sol
├── core
│   ├── accounts
│   │   ├── AccountsDiamond.png
│   │   ├── FacetDocs.md
│   │   ├── IAccounts.sol
│   │   ├── diamond
│   │   │   ├── Diamond.sol
│   │   │   ├── facets
│   │   │   │   ├── DiamondCutFacet.sol
│   │   │   │   ├── DiamondLoupeFacet.sol
│   │   │   │   └── OwnershipFacet.sol
│   │   │   ├── interfaces
│   │   │   │   ├── IDiamondCut.sol
│   │   │   │   ├── IDiamondLoupe.sol
│   │   │   │   ├── IERC165.sol
│   │   │   │   └── IERC173.sol
│   │   │   ├── libraries
│   │   │   │   └── LibDiamond.sol
│   │   │   └── upgradeInitializers
│   │   │       └── DiamondInit.sol
│   │   ├── facets
│   │   │   ├── AccountDeployContract.sol
│   │   │   ├── AccountDepositWithdrawEndowments.sol
│   │   │   ├── AccountDonationMatch.sol
│   │   │   ├── AccountsAllowance.sol
│   │   │   ├── AccountsCreateEndowment.sol
│   │   │   ├── AccountsDAOEndowments.sol
│   │   │   ├── AccountsEvents.sol
│   │   │   ├── AccountsQueryEndowments.sol
│   │   │   ├── AccountsStrategiesCopyEndowments.sol
│   │   │   ├── AccountsStrategiesUpdateEndowments.sol
│   │   │   ├── AccountsSwapEndowments.sol
│   │   │   ├── AccountsUpdate.sol
│   │   │   ├── AccountsUpdateEndowmentSettingsController.sol
│   │   │   ├── AccountsUpdateEndowments.sol
│   │   │   ├── AccountsUpdateStatusEndowments.sol
│   │   │   ├── AccountsVaultFacet.sol
│   │   │   ├── AxelarCallExecutor.sol
│   │   │   └── ReentrancyGuardFacet.sol
│   │   ├── interface
│   │   │   ├── IAccountDeployContract.sol
│   │   │   ├── IAccountsCreateEndowment.sol
│   │   │   ├── IAccountsDepositWithdrawEndowments.sol
│   │   │   ├── IAccountsQuery.sol
│   │   │   └── IAxelarGateway.sol
│   │   ├── lib
│   │   │   ├── LibAccounts.sol
│   │   │   └── validator.sol
│   │   ├── message.sol
│   │   ├── scripts
│   │   │   ├── deploy.ts
│   │   │   └── libraries
│   │   │       └── diamond.ts
│   │   └── storage.sol
│   ├── index-fund
│   │   ├── Iindex-fund.sol
│   │   ├── IndexFund.sol
│   │   ├── message.sol
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   └── storage.sol
│   ├── proxy.sol
│   ├── registrar
│   │   ├── interface
│   │   │   └── IRegistrar.sol
│   │   ├── lib
│   │   │   ├── RegistrarEventsLib.sol
│   │   │   └── validator.sol
│   │   ├── message.sol
│   │   ├── registrar.sol
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   └── storage.sol
│   ├── struct.sol
│   └── swap-router
│       ├── Interface
│       │   ├── ISwappingV3.sol
│       │   └── Ipool.sol
│       ├── message.sol
│       ├── scripts
│       │   └── deploy.ts
│       ├── storage.sol
│       └── swapping.sol
├── halo
│   ├── ERC20Upgrade.sol
│   ├── airdrop
│   │   ├── Airdrop.sol
│   │   ├── message.sol
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   └── storage.sol
│   ├── collector
│   │   ├── Collector.sol
│   │   ├── message.sol
│   │   └── storage.sol
│   ├── community
│   │   ├── Community.sol
│   │   ├── message.sol
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   └── storage.sol
│   ├── distributor
│   │   ├── Distributor.sol
│   │   ├── message.sol
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   └── storage.sol
│   ├── gov
│   │   ├── ERC20.sol
│   │   ├── Gov.sol
│   │   ├── TimeLock.sol
│   │   └── scripts
│   │       └── deploy.ts
│   ├── gov-hodler
│   │   ├── GovHodler.sol
│   │   ├── events.sol
│   │   ├── message.sol
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   └── storage.sol
│   ├── scripts
│   │   └── deploy.ts
│   ├── staking
│   │   ├── Staking.sol
│   │   ├── message.sol
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   └── storage.sol
│   └── vesting
│       ├── Vesting.sol
│       ├── message.sol
│       ├── scripts
│       │   └── deploy.ts
│       └── storage.sol
├── lib
│   ├── Strings
│   │   └── string.sol
│   ├── address
│   │   └── array.sol
│   ├── array.sol
│   ├── uint256
│   └── utils.sol
├── mock
│   ├── INonfungiblePositionManager.sol
│   ├── MockERC20.sol
│   ├── MockUSDC.sol
│   ├── haloToken.sol
│   └── uniswapUtils.sol
├── multisigs
│   ├── APTeamMultiSig.sol
│   ├── ApplicationsMultiSig.sol
│   ├── MultiSigGeneric.sol
│   ├── charity_applications
│   │   ├── CharityApplication.sol
│   │   ├── interface
│   │   │   └── ICharityApplication.sol
│   │   ├── scripts
│   │   │   └── deploy.ts
│   │   └── storage.sol
│   ├── interfaces
│   │   ├── IMultiSigGeneric.sol
│   │   └── artifacts
│   │       ├── IMultiSigGeneric.json
│   │       ├── IMultiSigGeneric_metadata.json
│   │       └── build-info
│   │           └── 02ad8a3a2d5ec3d13b26f5bf44e1c86b.json
│   ├── scripts
│   │   └── deploy.ts
│   └── storage.sol
└── normalized_endowment
    ├── donation-match
    │   ├── DonationMatch.sol
    │   ├── DonationMatchCharity.sol
    │   ├── DonationMatchEmitter.sol
    │   ├── IDonationMatchEmitter.sol
    │   ├── IDonationMatching.sol
    │   ├── UniswapOracleLibrary.dep.txt
    │   ├── message.sol
    │   └── storage.sol
    ├── endowment-multisig
    │   ├── EndowmentMultiSig.sol
    │   ├── EndowmentMultiSigEmitter.sol
    │   ├── EndowmentMultiSigFactory.sol
    │   ├── interface
    │   │   ├── IEndowmentMultiSigEmitter.sol
    │   │   └── IEndowmentMultiSigFactory.sol
    │   └── scripts
    │       └── deploy.ts
    ├── fee-distributor
    │   └── FeeDistributorCurveToken.sol.unused.txt
    ├── incentivised-voting
    │   ├── IncentivisedVotingLockup.sol
    │   ├── interface
    │   │   ├── IIncentivisedVotingLockup.sol
    │   │   └── QueryIIncentivisedVotingLockup.sol
    │   └── lib
    │       ├── Root.sol
    │       ├── StableMath.sol
    │       └── shared
    │           ├── IBasicToken.sol
    │           └── IERC20WithCheckpointing.sol
    ├── locked-withdraw
    │   ├── LockedWithdraw.sol
    │   ├── interface
    │   │   └── ILockedWithdraw.sol
    │   ├── scripts
    │   │   └── deploy.ts
    │   └── storage.sol
    ├── scripts
    │   ├── deployEmitter.ts
    │   └── deployImplementation.ts
    ├── subdao
    │   ├── ISubdaoEmitter.sol
    │   ├── Isubdao.sol
    │   ├── SubdaoEmitter.sol
    │   ├── Token
    │   │   └── ERC20.sol
    │   ├── message.sol
    │   ├── storage.sol
    │   └── subdao.sol
    └── subdao-token
        ├── Token
        │   ├── BancorBondingCurve.sol
        │   ├── Continous.sol
        │   └── Power.sol
        ├── message.sol
        ├── storage.sol
        └── subdoa-token.sol
```

#### Tests

```
.
├── Token.ts
├── accessory
│   └── fundraising.test.ts
├── core
│   └── diamondFunctions.test.ts
├── data
│   ├── endowment.ts
│   └── registar.json
├── halo
│   ├── airdrop.test.ts
│   ├── collector.test.ts
│   ├── community.test.ts
│   ├── distributor.test.ts
│   ├── integration-test
│   │   └── collectorGovIntegration.test.ts
│   ├── staking.test.ts
│   └── vesting.test.ts
├── integration-test
│   ├── APTeam.IndexFund.test.ts
│   ├── APTeam.Registrar.test.ts
│   ├── APTeam.test.ts
│   ├── AccountCrossChain.test.ts
│   ├── AccountSettings.test.ts
│   ├── AccountStrategy.test.ts
│   ├── AccountVaultCrossChain.test.ts
│   ├── AccountsUpdate.test.ts
│   ├── ApplicationTeam.test.ts
│   ├── Donor.Accounts.Normal.DonationMatch.test.ts
│   ├── Donor.Accounts.test.ts
│   ├── Donor.GiftCard.test.ts
│   ├── Donor.IndexFund.test.ts
│   ├── Donor.SubdaoToken.BuySell.test.ts
│   ├── EndowmentMembersCharity.Accounts.test.ts
│   ├── EndowmentMembersNormal.Accounts.test.ts
│   ├── EndowmentMembersNormal.AccountsSwap.test.ts
│   ├── EndowmentMembersNormal.Multisig.test.ts
│   ├── SubDao.test.ts
│   └── Temp.ts.txt
└── scripts
```
