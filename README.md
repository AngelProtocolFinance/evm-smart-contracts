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
