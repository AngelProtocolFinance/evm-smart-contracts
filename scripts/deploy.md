## Deployment steps

1. mention the network you want your contracts to deploy into .env in `NETWORK` variable Options are `[polygon, mumbai, goerli,hardhat]`
2. You will need two accounts 
   1. Create `.env` file and copy `.env.example` to `.env`
   2. First account will be primary account from where all the contracts will get deployed
   3. Second account will be the account who will be the admin of all the proxy contracts and also the admin of the account diamond
   4. Paste private key of both account into .env
3. You will need to update the config of the registrar once its deployed, Add the necessary parameters required for the deployment should be mentioned into the config file
4. run `nex hardhat clean` && `npx hardhat compile` before deployment to remove old or unwanted artifacts.
5. run `node ./script/deploy.ts` or `npx hardhat run scripts/deploy.ts --network hardhat` to deploy the contracts  
6. Additional task are also created to break the deployment process into sub task. All the task are listed under the `/task` folder.
7. task should be run in a following sequence to deploy the protocol completely
   1.  Deploy libraries
   2.  Deploy Registrar
   3.  Deploy Multisig
   4.  Deploy Account Diamond
   5.  Deploy Emitters
   6.  Deploy Charity Application
   7.  Deploy Swap Router
   8.  Deploy Index Fund
   9.  Deploy Endowment Multisig Factory
   10. Deploy Gift Card
   11. Deploy FundRaising 
   12. Deploy Halo Implementation
   13. Deploy Remaining implementation