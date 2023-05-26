// const { expect, assert } = require('chai');
// const { ethers, artifacts } = require('hardhat');
// const Web3 = require('web3');
// const web3 = new Web3();
// let { main } = require('../../scripts/deployMain');
// const endowmentData = require('../data/endowment.js');
// const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
// const { CONFIG } = require('../../config/index');
// const MockDate = require('mockdate');
// const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// var buyer1;
// var buyer2;
// var buyer3;

// var buyer4;

// async function moveBlocks(amount) {
//   for (let index = 0; index < amount; index++) {
//     await network.provider.request({
//       method: 'evm_mine',
//       params: [],
//     });
//   }
// }

// describe('SubDao test', function () {
//   let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
//   let deployRes;
//   let subdaoTokenBalance;

//   let registrar;
//   let registrarConfig;

//   this.beforeAll(async function () {
//     [deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
//     deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script

//     buyer1 = addrs[0];
//     buyer2 = addrs[1];
//     buyer3 = addrs[2];
//     buyer4 = addrs[3];

//     registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
//     registrarConfig = await registrar.queryConfig();
//   });

//   it('Should setup a endowment', async function () {

//     let endowmentConfig = await endowmentData.getCreateEndowmentConfig(
//       deployer.address,
//       [admin1.address, admin2.address, admin3.address],
//       1,
//       true
//     );
//     endowmentConfig.owner = deployer.address;

//     // Setup dao with subdao bonding token (such that it has the execute donor match function)
//     // bonding curve reserve token is DAI. i.e subdao token can be bought with DAI or donation matched.
//     // curve type is 1, i.e linear bonding curve
//     // token type is 2 i.e bonding curve token

//     // dao should use halo token
//     account = await ethers.getContractAt('AccountsCreateEndowment', deployRes.addresses.account);

//     let tx = await account.createEndowment(endowmentConfig);

//     await tx.wait();

//     const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
//     let endowment = await accountQuery.queryEndowmentDetails(1);

//     expect(endowment.endowType, 'Endowment type is normal').to.equal(1);
//     let donor = addrs[0];

//     let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
//     let registrarConfig = await registrar.queryConfig();

//     const MockERC20 = await ethers.getContractAt('MockUSDC', registrarConfig.usdcAddress);

//     await MockERC20.connect(deployer).transfer(donor.address, ethers.utils.parseUnits('10000', 6));

//     const accountDeposit = await ethers.getContractAt('AccountDepositWithdrawEndowments', deployRes.addresses.account);

//     MockERC20.connect(donor).approve(accountDeposit.address, ethers.utils.parseUnits('10000', 6));

//     let depositTxn = await accountDeposit
//       .connect(donor)
//       .depositERC20(
//         { id: 1, lockedPercentage: 50, liquidPercentage: 50 },
//         registrarConfig.usdcAddress,
//         ethers.utils.parseUnits('1000', 6)
//       );

//     let depositTxnReceipt = await depositTxn.wait();

//     let liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
//     let locked_balance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

//     console.log('Locked balance', locked_balance.toString());
//     console.log('Liquid balance', liquid_balance.toString());
//     expect(locked_balance.toString(), 'Locked balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());
//     expect(liquid_balance.toString(), 'Liquid balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());
//   });

//   it('update strategy for an endowment', async function () {
//     const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
//     let endowment = await accountQuery.queryEndowmentDetails(1);

//     const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

//     let account = await ethers.getContractAt('AccountsStrategiesUpdateEndowments', deployRes.addresses.account);

//     let data = account.interface.encodeFunctionData('updateStrategies', [1,1,[{vault : '0xd37a3c47f66b826705b20593b1e0be090eec9ff46a2604cc7ec8a2cfd92e28bd',percentage : 20},{vault : '0xab58686e26eeaa187c92ba5c5357ab7bcb2ab6aeb8bfd307852ccdbfaf645854',percentage : 30}]]);

//     let tx = await endowmentMultisig.connect(admin1).submitTransaction('Add strategy', 'Add strategy description', deployRes.addresses.account, 0, data);

//     let txnReceipt = await tx.wait();

//     let txId = txnReceipt.events[0].args.transactionId;

//     tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

//     let endowmentMultisigReceipt = await tx.wait();

//     let flag = 1;
//     for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
//       if (endowmentMultisigReceipt.events[i].event == 'ExecutionFailure') {
//         flag = 0;
//         break;
//       }
//     }
//     console.log(flag);
//     expect(flag === 1, 'Transaction executed successfully').to.equal(true);
//   });
// });
