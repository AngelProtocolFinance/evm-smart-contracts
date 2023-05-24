const { expect } = require('chai');
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const endowmentData = require('../data/endowment.js');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

describe('Endowment Members', function () {
	let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
	let deployRes;
	let endowmentConfig;
	let endowment;

	this.beforeAll(async function () {
		[deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
		deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script
		endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			1,
			true
		);
		endowmentConfig.owner = deployer.address;

		const account = await ethers.getContractAt('AccountsCreateEndowment', deployRes.addresses.account);

		let tx = await account.createEndowment(endowmentConfig);

		endowmentTxnReceipt = await tx.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		endowment = await accountQuery.queryEndowmentDetails(1);
	});

	it('Should create a endowment of type normal', async function () {
		// console.log('Endowment', endowment);
		expect(endowment.endowType, 'Endowment type is normal').to.equal(1);
	});

	it('Should have created a new endowment multisig and set owner of endowment to multisig', async function () {
		const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

		let endowmentMultisigID = await endowmentMultisig.ENDOWMENT_ID();
		// console.log('Endowment Multisig Id', endowmentMultisigID.toString());
		expect(endowmentMultisigID.toString(), 'Multisig for ID 1 deployed').to.equal('1');

		let endowmentOwners = await endowmentMultisig.getOwners();
		// console.log('Endowment Owners', endowmentOwners);
		expect(endowmentOwners, 'Endowment owners are multisig owners').to.deep.equal([
			admin1.address,
			admin2.address,
			admin3.address,
		]);

		expect(endowment.owner, 'Endowment owner is not deployer, new owner is multisig').not.equal(deployer.address);
	});

	it('Should be able to accept deposits and withdraw liquid deposits via txn from the endowment multisg ', async function () {
		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

		let donor = addrs[0];

		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		// console.log('Fetched USDC address', registrarConfig.usdcAddress);

		const MockERC20 = await ethers.getContractAt('MockUSDC', registrarConfig.usdcAddress);

		await MockERC20.connect(deployer).transfer(donor.address, ethers.utils.parseUnits('10000', 6));

		// Deposit to accounts

		const accountDeposit = await ethers.getContractAt('AccountDepositWithdrawEndowments', deployRes.addresses.account);

		MockERC20.connect(donor).approve(accountDeposit.address, ethers.utils.parseUnits('10000', 6));

		let depositTxn = await accountDeposit
			.connect(donor)
			.depositERC20(
				{ id: 1, lockedPercentage: 50, liquidPercentage: 50 },
				registrarConfig.usdcAddress,
				ethers.utils.parseUnits('1000', 6)
			);

		await depositTxn.wait();

		let liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
		let lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);
		// console.log(depositTxnReceipt.events);

		console.log('Locked balance', lockedBalance.toString());
		console.log('Liquid balance', liquid_balance.toString());
		expect(lockedBalance.toString(), 'Locked balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());
		expect(liquid_balance.toString(), 'Liquid balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());

		const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

		let endowmentMultisigID = await endowmentMultisig.ENDOWMENT_ID();
		// console.log('Endowment Multisig Id', endowmentMultisigID.toString());
		expect(endowmentMultisigID.toString(), 'Multisig for ID 1 deployed').to.equal('1');

		let endowmentOwners = await endowmentMultisig.getOwners();
		// console.log('Endowment Owners', endowmentOwners);
		expect(endowmentOwners, 'Endowment owners are multisig owners').to.deep.equal([
			admin1.address,
			admin2.address,
			admin3.address,
		]);

		expect(endowment.owner, 'Endowment owner is not deployer, new owner is multisig').not.equal(deployer.address);

		const data = accountDeposit.interface.encodeFunctionData('withdraw', [
			1,
			1,
			admin2.address,
			[registrarConfig.usdcAddress],
			[ethers.utils.parseUnits('100', 6)],
		]);

		let tx = await endowmentMultisig
			.connect(admin1)
			.submitTransaction('Withdraw', 'withdraw liquid in hand cash', deployRes.addresses.account, 0, data);

		let txnReceipt = await tx.wait();

		let txId = txnReceipt.events[0].args.transactionId;

		// approve the transaction for admin2

		tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

		let endowmentMultisigReceipt = await tx.wait();
		// console.log(endowmentMultisigReceipt.events);
		let flag = 1;
		for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
			if (endowmentMultisigReceipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}

		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		let balance = await MockERC20.balanceOf(admin2.address);

		expect(balance.toString(), 'Balance is 100').to.equal(ethers.utils.parseUnits('100', 6).toString());

		liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);

		expect(liquid_balance.toString(), 'Liquid balance is 400').to.equal(ethers.utils.parseUnits('400', 6).toString());
	});

	// it('owner can send txn to endowment multisig to update endowment name', async function () {});

	// it('it should give allowance to specific accounts', async function () {});

	// it('it should copycat strategies for endowment', async function () {});

	// it('it should update the endowment strategies', async function () {});

	// it('should update endowment settings', async function () {});

	// it('it should update endowment delegate', async function () {});

	// it('it should swap tokens', async function () {});

	// it('Should set up a donation match contract for a normal endowment', async function () {});
});
