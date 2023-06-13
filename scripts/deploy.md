## Deployment steps

1. (Optional) mention the network you want your contracts to deploy into .env in `NETWORK` variable Options are `[polygon, mumbai, goerli,hardhat]`
2. You will need two accounts
   1. Create `.env` file and copy `.env.example` to `.env`
   2. First account will be some generic `deployer` account, but it is mostly unused. Reason: we aim to be explicit about which address we use for deployments, leave nothing to "defaults"
   3. Second account will be the account who will be the admin of all the proxy contracts and also the admin of the account diamond
   4. 3rd, 4th an 5th are AP team's accounts
   5. Paste private key of both account into .env
3. You will need to update the config of the registrar once its deployed, Add the necessary parameters required for the deployment should be mentioned into the config file
4. Run `npx hardhat clean` && `npx hardhat compile` before deployment to remove old or unwanted artifacts.
5. Run `yarn deploy` to deploy the contracts
6. Additional tasks are also created to break the deployment process into sub task. All the task are listed under the `/tasks` folder.
7. Tasks should be run in a following sequence to deploy the protocol completely
   1. Deploy libraries
   2. Deploy Registrar
   3. Deploy Multisig
   4. Deploy Account Diamond
   5. Deploy Emitters
   6. Deploy Charity Application
   7. Deploy Index Fund
   8. Deploy Endowment Multisig Factory
   9. Deploy Gift Card
   10. Deploy FundRaising
   11. Deploy Halo Implementation
   12. Deploy Remaining implementation
   13. Deploy Router
