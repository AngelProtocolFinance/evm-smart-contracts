
## Architecture
The Registrar architecture is split into two parts: 
1. `Registrar.sol` which is deployed on any network where the `Accounts` Diamond lives. Currently planned strictly for the Polygon network
2. `LocalRegistrar.sol` which is inherited by `Registrar.sol` for the Polygon deployment but whcih can also be deployed to any chain where Angel Protocol leverages cross-chain yield sources. 


It generally contains ecosystem contract addresses and global parameters related to fees andn rebalancing.  

### Local Registrar
![LocalRegistrar](https://user-images.githubusercontent.com/84420280/217927431-bff49264-1722-4132-ae36-65f05241198d.png)