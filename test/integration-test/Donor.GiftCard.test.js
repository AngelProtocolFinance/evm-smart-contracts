const { expect, assert } = require('chai');
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const endowmentData = require('../data/endowment.js');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { config } = require('../../config/index');
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

describe('Donor donates from Gift Card', function () {
	let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
	let deployRes;
	let endowmentConfig;

	let endowmentTxnReceipt;
	let endowment;

	this.beforeAll(async function () {
		// run deploy script only once
		[deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
		deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script

		// create endowment which will be donated to using gift card

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

	it('Should create a Gift Card from USDC and donate from it', async function () {
		const giftCard = await ethers.getContractAt('GiftCards', deployRes.addresses.giftCardAddress);

		// set owner to ap team multisig

		await giftCard
			.connect(deployer)
			.updateConfig(
				deployRes.addresses.multisigAddress.APTeamMultiSig,
				deployRes.addresses.multisigAddress.APTeamMultiSig,
				deployRes.addresses.registrar
			);

		// updated config

		let config = await giftCard.queryConfig();

		expect(config.owner).to.equal(deployRes.addresses.multisigAddress.APTeamMultiSig);
		expect(config.keeper).to.equal(deployRes.addresses.multisigAddress.APTeamMultiSig);

		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		let creator = addrs[0];
		let spender = addrs[1];

		const MockERC20 = await ethers.getContractAt('MockUSDC', registrarConfig.usdcAddress);

		await MockERC20.connect(deployer).transfer(creator.address, ethers.utils.parseUnits('3000', 6));

		await MockERC20.connect(creator).approve(giftCard.address, ethers.utils.parseUnits('3000', 6));

		let tx = await giftCard
			.connect(creator)
			.executeDepositERC20(creator.address, spender.address, [
				0,
				ethers.utils.parseUnits('3000', 6),
				registrarConfig.usdcAddress,
				'USDC',
			]);

		// todo: fetch deposit id from event

		await tx.wait();

		let depositDetails = await giftCard.queryDeposit(1);

		// console.log('depositDetails', depositDetails);

		expect(depositDetails.token.info).to.equal(0);

		expect(depositDetails.token.amount).to.equal(ethers.utils.parseUnits('3000', 6));

		expect(depositDetails.token.addr).to.equal(registrarConfig.usdcAddress);

		let balanceDetails = await giftCard.queryBalance(spender.address);

		expect(balanceDetails.Cw20CoinVerified_amount).to.deep.equal([ethers.utils.parseUnits('3000', 6)]);

		expect(balanceDetails.Cw20CoinVerified_addr).to.deep.equal([registrarConfig.usdcAddress]);

		// test execute spend using erc 20 balance of spender

		let spendTx = await giftCard
			.connect(spender)
			.executeSpend([0, ethers.utils.parseUnits('3000', 6), registrarConfig.usdcAddress, 'USDC'], 1, 50, 50);

		await spendTx.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

		liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
		lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

		expect(liquid_balance.toString()).to.equal(ethers.utils.parseUnits('1500', 6).toString());
		expect(lockedBalance.toString()).to.equal(ethers.utils.parseUnits('1500', 6).toString());
	});

	it('Should create a Gift Card from Native and donate from it', async function () {
		const giftCard = await ethers.getContractAt('GiftCards', deployRes.addresses.giftCardAddress);
		// updated config

		let config = await giftCard.queryConfig();

		expect(config.owner).to.equal(deployRes.addresses.multisigAddress.APTeamMultiSig);
		expect(config.keeper).to.equal(deployRes.addresses.multisigAddress.APTeamMultiSig);

		let creator = addrs[0];
		let spender = addrs[1];

		let provider = hre.ethers.provider;

		let balance = await provider.getBalance(creator.address);

		assert(balance.gt(ethers.utils.parseUnits('100', 18)));

		let tx = await giftCard.executeDeposit(creator.address, spender.address, {
			value: ethers.utils.parseUnits('100', 18),
		});

		await tx.wait();

		let depositDetails = await giftCard.queryDeposit(2);

		expect(depositDetails.token.info).to.equal(1);

		expect(depositDetails.token.amount).to.equal(ethers.utils.parseUnits('100', 18));

		expect(depositDetails.token.addr).to.equal(ADDRESS_ZERO);

		let balanceDetails = await giftCard.queryBalance(spender.address);

		expect(balanceDetails.coinNativeAmount).to.equal(ethers.utils.parseUnits('100', 18));

		let spendTx = await giftCard
			.connect(spender)
			.executeSpend([1, ethers.utils.parseUnits('100', 18), ADDRESS_ZERO, 'Mattic'], 1, 50, 50);

		await spendTx.wait();

		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

		liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
		lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

		console.log(liquid_balance);
		console.log(lockedBalance);

		expect(liquid_balance).to.be.above(ethers.utils.parseUnits('1501', 6));
		expect(lockedBalance).to.be.above(ethers.utils.parseUnits('1501', 6));
	});

	it('Should create a Gift Card from USDC without recepient and keeper (APMultiSig should execute claim)', async function () {
		const giftCard = await ethers.getContractAt('GiftCards', deployRes.addresses.giftCardAddress);
		// updated config

		let config = await giftCard.queryConfig();

		expect(config.owner).to.equal(deployRes.addresses.multisigAddress.APTeamMultiSig);
		expect(config.keeper).to.equal(deployRes.addresses.multisigAddress.APTeamMultiSig);

		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		// change addresses
		let creator = addrs[2];
		let spender = addrs[3];

		const MockERC20 = await ethers.getContractAt('MockUSDC', registrarConfig.usdcAddress);

		await MockERC20.connect(deployer).transfer(creator.address, ethers.utils.parseUnits('3000', 6));

		await MockERC20.connect(creator).approve(giftCard.address, ethers.utils.parseUnits('3000', 6));

		let tx = await giftCard
			.connect(creator)
			.executeDepositERC20(creator.address, ADDRESS_ZERO, [
				0,
				ethers.utils.parseUnits('3000', 6),
				registrarConfig.usdcAddress,
				'USDC',
			]);

		await tx.wait();

		let depositDetails = await giftCard.queryDeposit(3);

		expect(depositDetails.token.info).to.equal(0);

		expect(depositDetails.token.amount).to.equal(ethers.utils.parseUnits('3000', 6));

		expect(depositDetails.token.addr).to.equal(registrarConfig.usdcAddress);

		const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
		APMultisig = await ethers.getContractAt('APTeamMultiSig', apMultisigAddress);

		const data = giftCard.interface.encodeFunctionData('executeClaim', [3, spender.address]);

		let tx2 = await APMultisig.connect(admin1).submitTransaction(
			'Execute claim as keeper',
			'Proposal to execute claim as keeper',
			giftCard.address,
			0,
			data
		);

		let tx2Receipt = await tx2.wait();

		tx2 = await APMultisig.connect(admin2).confirmTransaction(tx2Receipt.events[0].args.transactionId);

		tx2Receipt = await tx2.wait();

		let flag = 1;
		for (let i = 0; i < tx2Receipt.events.length; i++) {
			if (tx2Receipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}

		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		let balanceDetails = await giftCard.queryBalance(spender.address);

		expect(balanceDetails.Cw20CoinVerified_amount).to.deep.equal([ethers.utils.parseUnits('3000', 6)]);

		expect(balanceDetails.Cw20CoinVerified_addr).to.deep.equal([registrarConfig.usdcAddress]);

		let spendTx = await giftCard
			.connect(spender)
			.executeSpend([0, ethers.utils.parseUnits('3000', 6), registrarConfig.usdcAddress, 'USDC'], 1, 50, 50);

		await spendTx.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

		// approx locked and liquid is 2000 each + 1500 is 3500 approx

		liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
		lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

		console.log(liquid_balance);
		console.log(lockedBalance);

		expect(liquid_balance).to.be.above(ethers.utils.parseUnits('3001', 6));
		expect(lockedBalance).to.be.above(ethers.utils.parseUnits('3001', 6));
	});
});
