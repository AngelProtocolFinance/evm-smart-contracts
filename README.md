# AngelProtocol EVM

This repository contains smart contracts for Angel Protocol to be deployed on Polygon. These contracts should work on any EVM compatible chain.

Angel Protocol provides tools to fundraise, coordinate, and invest capital. It connects donors & investors with non-profits, social enterprises, and other changemakers around the world.

[Documentation](https://docs.angelimpact.io/)

## GETTING STARTED

### Requirements

- `Node.js` (v18.x) - https://github.com/nvm-sh/nvm#installing-and-updating
- `yarn` (v1.22.x) - https://yarnpkg.com/getting-started/install/

We recommend using a version manager like `nvm`. Assuming you are using nvm, you can install and use Node v18 with the following two commands:

```shell
nvm install v18
nvm use v18
```

We use `yarn` as a package manager. After installing yarn, simply run the package installer:

```shell
yarn install
```

Lastly, we have provided an example `.env` file as `.env.template`.
You'll need to copy this file to `.env` and then modify/add your relevant API and Private Keys:

```shell
cp .env.template .env
```

## INTERACTING WITH HARDHAT

Contract compilation creates local files (artifacts, typings and ABI JSONs) necessary for interfacing. Compile with:

`yarn compile`

_Note: Most calls to hardhat check for requisite artifacts and will auto-compile if need be or if changes between source and artifacts are detected._

To compile `clean` use: 

`yarn compile --clean`

The default behavior is for Hardhat to use a chain in memory at runtime. For persistent state, run a local node `yarn hardhat node` or use a testnet.
The network can be pointed to using the `--network` CLI flag.

To deploy a contract, call its relevant deployment task. Many tasks leverage data contained in the file `contract-address.json` to point at existing contracts on specific networks. As an example, to deploy the entirety of the Primary Chain contract set, call:

`yarn hardhat deploy:AngelProtocol --network localhost`

## Running tests

To run the Chai test suite, invoke:

`yarn test`

_Note: The full set of tests can take upwards of 30m to run_

Specific tests can be called by adding the path to the relevant test:

`yarn hardhat test tests/core/registrar/LocalRegistrar.ts`

## Running tasks

We've made use of the hardhat task functionality to allow easy manipulation of contracts.
In the `tasks/` directory, you can find the available tasks. Each should have a thoughtful help text if invoked like:

`yarn hardhat deploy:registrarAndRouter --help`

To override default arguments, call `--help` against a task to see which args are optional and can be overridden. 

## Tenderly Verification

To enable tenderly verification (which is called when deploying tasks with verification enabled), follow these steps: 
1. Request the project credentials from the repo admin
2. Install the tenderly CLI tool by following the instructions here (dependent on OS): https://github.com/Tenderly/tenderly-cli
3. Call `tenderly login --authentication-method access-key --access-key {your_access_key} --force` where the `access_key` matches the one provided by the repo admin. 
4. Call `mkdir deployments && tenderly init` to finish initializing the CLI 