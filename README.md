# AngelProtocol EVM

This repository contains smart contracts for Angel Protocol to be deployed on Polygon. These contracts should work on any EVM compatible chain.

Angel Protocol provides tools to fundraise, coordinate, and invest capital. It connects donors & investors with non-profits, social enterprises, and other changemakers around the world.

[Coverage Report](https://angel-protocol-coverage-report.vercel.app/)

[Auto-generated Documentation](https://doc-site-angel.vercel.app/)

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

`npx hardhat compile`

_Note: Most calls to hardhat check for requisite artifacts and will auto-compile if need be or if changes between source and artifacts are detected._

The default behavior is for Hardhat to use a chain in memory at runtime. For persistent state, run a local node `npx hardhat node` or use a testnet.
The network can be pointed to using the `--network` CLI flag.

To deploy a contract, call its relevant deployment task. Many tasks leverage data contained in the file `config/index.ts` and `contract-address.json`. Make sure these files are current before deploying:

`npx hardhat deploy:AngelProtocol --network localhost`

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
