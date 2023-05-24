const { expect } = require('chai');
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const endowmentData = require('../data/endowment.js');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { config } = require('../../config/index');
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

describe('Donor donating from Accounts', function () {
	let deployer, addrs, proxyAdmin;
	let deployRes;
	let endowmentConfig;

	let endowmentTxnReceipt;
	let endowment;

	this.beforeAll(async function () {
		[deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
		deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script
	});

	it('Should create a endowment of type normal and deposit to it', async function () {
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

		expect(endowment.endowType, 'Endowment type is normal').to.equal(1);

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

		let depositTxnReceipt = await depositTxn.wait();

		let liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
		let lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

		console.log('Locked balance', lockedBalance.toString());
		console.log('Liquid balance', liquid_balance.toString());
		expect(lockedBalance.toString(), 'Locked balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());
		expect(liquid_balance.toString(), 'Liquid balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());
	});

	it('Should create a endowment of type normal and deposit usdc by swapping it with ETH', async function () {
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
		endowment = await accountQuery.queryEndowmentDetails(2);

		expect(endowment.endowType, 'Endowment type is normal').to.equal(1);

		let donor = addrs[0];

		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		// console.log('Fetched USDC address', registrarConfig.usdcAddress);

		const accountDeposit = await ethers.getContractAt('AccountDepositWithdrawEndowments', deployRes.addresses.account);

		const amountIn = ethers.utils.parseEther('100');
		let depositTxn = await accountDeposit
			.connect(donor)
			.depositEth({ id: 2, lockedPercentage: 50, liquidPercentage: 50 }, { value: amountIn });

		let depositTxnReceipt = await depositTxn.wait();
		const amountSwapped = depositTxnReceipt.events.filter((e) => e.event === 'SwappedToken')[0].args.amountOut;

		let liquid_balance = await accountQuery.queryTokenAmount(2, 1, registrarConfig.usdcAddress);
		let lockedBalance = await accountQuery.queryTokenAmount(2, 0, registrarConfig.usdcAddress);

		expect(lockedBalance.toString(), 'Locked balance is 50%').to.equal(amountSwapped.div(2).toString());
		expect(liquid_balance.toString(), 'Liquid balance is 50%').to.equal(amountSwapped.div(2).toString());
	});
	it('Should create a endowment of type normal and deposit usdc by swapping it with DAI', async function () {
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
		endowment = await accountQuery.queryEndowmentDetails(3);

		expect(endowment.endowType, 'Endowment type is normal').to.equal(1);

		let donor = addrs[0];

		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		// console.log('Fetched USDC address', registrarConfig.usdcAddress);

		const accountDeposit = await ethers.getContractAt('AccountDepositWithdrawEndowments', deployRes.addresses.account);

		const amountIn = ethers.utils.parseEther('100');

		const dai = await ethers.getContractAt('MockERC20', config.REGISTRAR_UPDATE_CONFIG.DAI_address);

		await dai.mint(donor.address, amountIn);

		await dai.connect(donor).approve(deployRes.addresses.account, amountIn);

		let depositTxn = await accountDeposit
			.connect(donor)
			.depositERC20(
				{ id: 3, lockedPercentage: 50, liquidPercentage: 50 },
				config.REGISTRAR_UPDATE_CONFIG.DAI_address,
				amountIn
			);

		let depositTxnReceipt = await depositTxn.wait();
		const amountSwapped = depositTxnReceipt.events.filter((e) => e.event === 'SwappedToken')[0].args.amountOut;

		let liquid_balance = await accountQuery.queryTokenAmount(3, 1, registrarConfig.usdcAddress);
		let lockedBalance = await accountQuery.queryTokenAmount(3, 0, registrarConfig.usdcAddress);

		expect(lockedBalance.toString(), 'Locked balance is 50%').to.equal(amountSwapped.div(2).toString());
		expect(liquid_balance.toString(), 'Liquid balance is 50%').to.equal(amountSwapped.div(2).toString());
	});
});
