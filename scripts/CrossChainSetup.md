# Cross chain Test Setup

To perform cross chain testing you will need to run [ganache](https://trufflesuite.com/ganache/) chain locally. We have a setup where hardhat chain works as an instance of polygon chain and ganache chain works as a instance of the ethereum chain. We have configured the [Axelar](https://axelar.network/) network on both local chain using [axelar-local-dev](https://github.com/axelarnetwork/axelar-local-dev).

## Steps to set things up.

1. Run ganache instance and copy the private key of account1 and RPC url of ganache into .env.
2. Run  ` node ./script/setUpCrossChain.ts` (This will deploy Axelar network on the ganache chain).
3. Clone [Router-Contract](https://github.com/AngelProtocolFinance/evm-smart-contracts) from github and deploy it on the ganache chain.
4. Now past the address of the router you got from the step-3 into the .env.
5. now we can run `npx hardhat test` && `npx hardhat coverage`.