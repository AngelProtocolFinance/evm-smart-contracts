# AngelProtocol EVM 

This repository contains smart contracts for Angel Protocol to be deployed on Polygon. These contracts should work on any EVM compatible chain. 

Angel Protocol provides tools to fundraise, coordinate, and invest capital. It connects donors &  investors with non-profits, social enterprises, and other changemakers around the world.

[Coverage Report](https://angel-protocol-coverage-report.vercel.app/)

[Auto-generated Documentation](https://doc-site-angel.vercel.app/)

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

To deploy a contract, call its relevant deployment task. Many tasks leverage data contained in the file `config/index.ts` and `contract-address.json`. Make sure these files are current before deploying: 

`npx hardhat Deploy:deployAngelProtocol.ts --network localhost`

To run the Chai test suite, invoke: 

`npx hardhat test`

Specific tests can be called by adding the path to the relevant test: 

`npx hardhat test tests/Registrar.ts`

## Running tasks

We've made use of the hardhat task functionality to allow easy manipulation of contracts
in the `tasks/` directory, you can find the available tasks. Each should have a thoughtful help text if invoked like: 

`npx hardhat deploy:registrarAndRouter --help`

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

### Slither Analysis

Slither: `slither . --json static_audit.json --checklist` or use the extension in vscode to run the analysis.


### Directory Information

- config: Contains all the configuration files for the protocol deployments. Basically key-value pairs for the addresses of the contracts that are required to be present on a network for the protocol to work. Also contains contract's initial configuration.
- contracts: Contains all the contracts for the protocol 
- tasks: Contains deployment, upgrade and manaagement tools
- test: Contains all the tests for the protocol