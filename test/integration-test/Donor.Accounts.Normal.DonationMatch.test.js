const { expect, assert } = require('chai');
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const endowmentData = require('../data/endowment.js');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { config } = require('../../config/index');

describe('Donor donation matching for normal endowments', function () {
	let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
	let deployRes;
	let donationMatchAmount;

	this.beforeAll(async function () {
		[deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
		deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script
	});

	it('Create a normal endowment with id 1 and setup donation match with Halo as reserve token', async function () {
		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		let endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			1,
			true
		);
		endowmentConfig.owner = deployer.address;

		endowmentConfig.dao.token = {
			token: 0,
			data: {
				existingCw20Data: registrarConfig.haloToken,
				newCw20InitialSupply: '100000',
				newCw20Name: 'TEST',
				newCw20Symbol: 'TEST',
				bondingCurveCurveType: {
					curve_type: 0,
					data: {
						value: 0,
						scale: 0,
						slope: 0,
						power: 0,
					},
				},
				bondingCurveName: 'TEST',
				bondingCurveSymbol: 'TEST',
				bondingCurveDecimals: 18,
				bondingCurveReserveDenom: registrarConfig.usdcAddress,
				bondingCurveReserveDecimals: 18,
				bondingCurveUnbondingPeriod: 10,
			},
		};

		// dao should use halo token

		account = await ethers.getContractAt('AccountsCreateEndowment', deployRes.addresses.account);

		let tx = await account.createEndowment(endowmentConfig);

		await tx.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(1);

		expect(endowment.endowType, 'Endowment type is normal').to.equal(1);

		const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

		let endowmentMultisigID = await endowmentMultisig.ENDOWMENT_ID();
		expect(endowmentMultisigID.toString(), 'Multisig for ID 1 deployed').to.equal('1');

		let endowmentOwners = await endowmentMultisig.getOwners();
		expect(endowmentOwners, 'Endowment owners are multisig owners').to.deep.equal([
			admin1.address,
			admin2.address,
			admin3.address,
		]);

		expect(endowment.owner, 'Endowment owner is not deployer, new owner is multisig').not.equal(deployer.address);

		// setup donation match

		const accountDonationMatch = await ethers.getContractAt('AccountDonationMatch', deployRes.addresses.account);

		const data = accountDonationMatch.interface.encodeFunctionData('setupDonationMatch', [
			1,
			[0, [registrarConfig.haloToken, config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS, 3000]],
		]);

		let tx2 = await endowmentMultisig
			.connect(admin1)
			.submitTransaction(
				'Setup donation match',
				'Setup donation match for endowment',
				accountDonationMatch.address,
				0,
				data
			);

		let tx2Receipt = await tx2.wait();

		tx2 = await endowmentMultisig.connect(admin2).confirmTransaction(tx2Receipt.events[0].args.transactionId);

		tx2Receipt = await tx2.wait();

		let flag = 1;
		for (let i = 0; i < tx2Receipt.events.length; i++) {
			if (tx2Receipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
			}
		}
		expect(flag, 'Donation match setup should be successful').to.equal(1);

		endowment = await accountQuery.queryEndowmentDetails(1);

		const haloToken = await ethers.getContractAt('MockERC20', registrarConfig.haloToken);

		haloToken.transfer(endowment.donationMatchContract, ethers.utils.parseUnits('10000', 18));

		// send halo to donation match conrtact of endowment to perform donation matching

		let donor = addrs[5];

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

		expect(lockedBalance.toString(), 'Locked balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());
		expect(liquid_balance.toString(), 'Liquid balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());
	});

	it('Should check proper donation match for endowment with halo reserve token', async function () {
		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		const haloToken = await ethers.getContractAt('MockERC20', registrarConfig.haloToken);

		let donor = addrs[5];

		expect(await haloToken.balanceOf(donor.address), 'Donation Matched Amount is approxe 200').to.be.above(
			ethers.utils.parseUnits('198', 18)
		);
	});

	it('Create a normal endowment with id 2 setup donation match with DAI as reserve token and match with subdao token', async function () {
		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		let endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			1,
			true
		);
		endowmentConfig.owner = deployer.address;

		// Setup dao with subdao bonding token (such that it has the execute donor match function)
		// bonding curve reserve token is DAI. i.e subdao token can be bought with DAI or donation matched.
		// curve type is 1, i.e linear bonding curve
		// token type is 2 i.e bonding curve token
		endowmentConfig.dao.token = {
			token: 2,
			data: {
				existingCw20Data: registrarConfig.haloToken,
				newCw20InitialSupply: '100000',
				newCw20Name: 'TEST',
				newCw20Symbol: 'TEST',
				bondingCurveCurveType: {
					curve_type: 1,
					data: {
						value: 0, // TODO: not used in code
						scale: 0, // TODO: not used in code
						slope: 0, // TODO: not used in code
						power: 0, // TODO: not used in code
					},
				},
				bondingCurveName: 'TEST',
				bondingCurveSymbol: 'TEST',
				bondingCurveDecimals: 18,
				bondingCurveReserveDenom: deployRes.addresses.dai,
				bondingCurveReserveDecimals: 18,
				bondingCurveUnbondingPeriod: 10,
			},
		};

		// dao should use halo token

		account = await ethers.getContractAt('AccountsCreateEndowment', deployRes.addresses.account);

		let tx = await account.createEndowment(endowmentConfig);

		await tx.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(2);

		expect(endowment.endowType, 'Endowment type is normal').to.equal(1);

		const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

		let endowmentMultisigID = await endowmentMultisig.ENDOWMENT_ID();
		expect(endowmentMultisigID.toString(), 'Multisig for ID 2 deployed').to.equal('2');

		let endowmentOwners = await endowmentMultisig.getOwners();
		expect(endowmentOwners, 'Endowment owners are multisig owners').to.deep.equal([
			admin1.address,
			admin2.address,
			admin3.address,
		]);

		expect(endowment.owner, 'Endowment owner is not deployer, new owner is multisig').not.equal(deployer.address);

		// setup donation match for endowment with DAI as the donation match reserve token

		const accountDonationMatch = await ethers.getContractAt('AccountDonationMatch', deployRes.addresses.account);

		const data = accountDonationMatch.interface.encodeFunctionData('setupDonationMatch', [
			2,
			[1, [deployRes.addresses.dai, config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS, 3000]],
		]);

		let tx2 = await endowmentMultisig
			.connect(admin1)
			.submitTransaction(
				'Setup donation match',
				'Setup donation match for endowment',
				accountDonationMatch.address,
				0,
				data
			);

		let tx2Receipt = await tx2.wait();

		tx2 = await endowmentMultisig.connect(admin2).confirmTransaction(tx2Receipt.events[0].args.transactionId);

		tx2Receipt = await tx2.wait();

		let flag = 1;
		for (let i = 0; i < tx2Receipt.events.length; i++) {
			if (tx2Receipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
			}
		}
		expect(flag, 'Donation match setup should be successful').to.equal(1);

		endowment = await accountQuery.queryEndowmentDetails(2);

		// should have to send some dai to donation match contract

		const daiToken = await ethers.getContractAt('MockERC20', deployRes.addresses.dai);

		let balance = await daiToken.balanceOf(deployer.address);

		assert(balance.gt(ethers.utils.parseUnits('10000', 18)), 'Deployer should have some dai');

		// send 6000 dai for donation matching to donation match contract

		let tx3 = await daiToken
			.connect(deployer)
			.transfer(endowment.donationMatchContract, ethers.utils.parseUnits('6000', 18));

		await tx3.wait();

		// check donation match balance

		let donationMatchBalance = await daiToken.balanceOf(endowment.donationMatchContract);

		expect(donationMatchBalance, 'Donation match balance should be 6000').to.equal(ethers.utils.parseUnits('6000', 18));

		// donate 1000 USDC to endowment

		let donor = addrs[7];

		const mockUSDC = await ethers.getContractAt('MockUSDC', registrarConfig.usdcAddress);

		let tx4 = await mockUSDC.connect(deployer).transfer(donor.address, ethers.utils.parseUnits('1000', 6));

		await tx4.wait();

		// Deposit to accounts

		const accountDeposit = await ethers.getContractAt('AccountDepositWithdrawEndowments', deployRes.addresses.account);

		mockUSDC.connect(donor).approve(accountDeposit.address, ethers.utils.parseUnits('1000', 6));

		let depositTxn = await accountDeposit
			.connect(donor)
			.depositERC20(
				{ id: 2, lockedPercentage: 50, liquidPercentage: 50 },
				registrarConfig.usdcAddress,
				ethers.utils.parseUnits('1000', 6)
			);

		await depositTxn.wait();

		let liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
		let lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

		expect(lockedBalance.toString(), 'Locked balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());
		expect(liquid_balance.toString(), 'Liquid balance is 500').to.equal(ethers.utils.parseUnits('500', 6).toString());
	});

	it('Should check proper donation match for endowment with DAI reserve token', async function () {
		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(2);

		const subdaoToken = await ethers.getContractAt('SubDaoToken', endowment.daoToken);

		let donor = addrs[7];

		expect(await subdaoToken.balanceOf(donor.address)).to.equal(await subdaoToken.balanceOf(deployRes.addresses.account));

		donationMatchAmount = await subdaoToken.balanceOf(deployRes.addresses.account);
	});

	it('should be able to withdraw donation matched fund from endowment', async function () {
		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(2);

		const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

		const accountsDonationMatch = await ethers.getContractAt('AccountDonationMatch', deployRes.addresses.account);

		receipient = addrs[10];

		const data = accountsDonationMatch.interface.encodeFunctionData('withdrawDonationMatchErC20', [
			2,
			receipient.address,
			donationMatchAmount,
		]);

		let tx2 = await endowmentMultisig
			.connect(admin1)
			.submitTransaction(
				'Withdraw donation match',
				'Withdraw donation match for endowment',
				accountsDonationMatch.address,
				0,
				data
			);

		let tx2Receipt = await tx2.wait();

		tx2 = await endowmentMultisig.connect(admin2).confirmTransaction(tx2Receipt.events[0].args.transactionId);

		tx2Receipt = await tx2.wait();

		let flag = 1;
		for (let i = 0; i < tx2Receipt.events.length; i++) {
			if (tx2Receipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
			}
		}
		expect(flag, 'Donation match withdraw should be successful').to.equal(1);

		const subdaoToken = await ethers.getContractAt('SubDaoToken', endowment.daoToken);

		expect(await subdaoToken.balanceOf(receipient.address)).to.equal(donationMatchAmount);
	});
});
