const { expect, assert } = require('chai');
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const endowmentData = require('../data/endowment.js');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { config } = require('../../config/index');
const MockDate = require('mockdate');

async function moveBlocks(amount) {
	console.log('Moving blocks...');
	for (let index = 0; index < amount; index++) {
		await network.provider.request({
			method: 'evm_mine',
			params: [],
		});
	}
	console.log(`Moved ${amount} blocks`);
}

describe('Donor buy sell subdao token', function () {
	let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
	let buyer;
	let deployRes;
	let subdaoTokenBalance;

	this.beforeAll(async function () {
		[deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
		deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script
	});

	it('Should setup endowment with bancor bonding curve subdao token linear', async function () {
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
				bondingCurveUnbondingPeriod: 0,
			},
		};

		// dao should use halo token

		account = await ethers.getContractAt('AccountsCreateEndowment', deployRes.addresses.account);

		let tx = await account.createEndowment(endowmentConfig);

		await tx.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(1);

		expect(endowment.endow_type, 'Endowment type is normal').to.equal(1);

		buyer = addrs[0];

		// should have to send some dai token to buyer to buy subdao token

		const daiToken = await ethers.getContractAt('MockERC20', deployRes.addresses.dai);

		let balance = await daiToken.balanceOf(deployer.address);

		assert(balance.gt(ethers.utils.parseUnits('10000', 18)), 'Deployer should have some dai');

		// send 6000 dai for donation matching to donation match contract

		let tx3 = await daiToken.connect(deployer).transfer(buyer.address, ethers.utils.parseUnits('6000', 18));

		await tx3.wait();
	});

	it('Should buy subdao token with dai', async function () {
		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(1);

		const subdaoToken = await ethers.getContractAt('SubDaoToken', endowment.daoToken);

		const daiToken = await ethers.getContractAt('MockERC20', deployRes.addresses.dai);

		let balance = await daiToken.balanceOf(buyer.address);

		assert(balance.gt(ethers.utils.parseUnits('5999', 18)), 'Buyer should have some dai');

		await daiToken.connect(buyer).approve(subdaoToken.address, ethers.utils.parseUnits('6000', 18));

		let tx = await subdaoToken.connect(buyer).executeBuyCw20(ethers.utils.parseUnits('6000', 18));

		await tx.wait();

		// console.log('Balance of buyer SD Token after buy ', (await subdaoToken.balanceOf(buyer.address)).toString());

		// console.log('Balance of buyer Dai Token after buy', (await daiToken.balanceOf(buyer.address)).toString());

		expect(await subdaoToken.balanceOf(buyer.address)).to.not.equal(0);

		expect(await daiToken.balanceOf(buyer.address)).to.be.equal(0);

		subdaoTokenBalance = await subdaoToken.balanceOf(buyer.address);
	});

	it('Should sell subdao token for dai', async function () {
		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(1);

		const subdaoToken = await ethers.getContractAt('SubDaoToken', endowment.daoToken);

		const daiToken = await ethers.getContractAt('MockERC20', deployRes.addresses.dai);

		let balance = await subdaoToken.balanceOf(buyer.address);

		// assert(balance.gt(ethers.utils.parseUnits('1000', 18)), 'Buyer should have some subdao token');

		await subdaoToken.connect(buyer).approve(subdaoToken.address, subdaoTokenBalance);

		let tx = await subdaoToken.connect(buyer).executeSell(buyer.address, subdaoTokenBalance);

		await tx.wait();

		// MockDate.set(new Date(Date.now() + 10000000));

		await moveBlocks(2);

		claimtokensCheck = await subdaoToken.connect(buyer).checkClaimableTokens();

		expect(claimtokensCheck).to.not.equal(0);

		// console.log('claimable Tokens', claimtokensCheck);

		await subdaoToken.connect(buyer).claimTokens();

		// console.log('Balance of buyer SD Token after sell', (await subdaoToken.balanceOf(buyer.address)).toString());

		// console.log('Balance of buyer Dai Token after sell', (await daiToken.balanceOf(buyer.address)).toString());

		expect(await subdaoToken.balanceOf(buyer.address)).to.equal(0);

		expect(await daiToken.balanceOf(buyer.address)).to.not.equal(0);
	});

	it('Should buy subdao token, lock it in incentivsed voting lockup and query voting balance', async function () {
		const daiToken = await ethers.getContractAt('MockERC20', deployRes.addresses.dai);

		let balance = await daiToken.balanceOf(deployer.address);

		assert(balance.gt(ethers.utils.parseUnits('10000', 18)), 'Deployer should have some dai');

		// send 6000 dai for donation matching to donation match contract

		let tx3 = await daiToken.connect(deployer).transfer(buyer.address, ethers.utils.parseUnits('6000', 18));

		await tx3.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(1);

		const subdaoToken = await ethers.getContractAt('SubDaoToken', endowment.daoToken);

		balance = await daiToken.balanceOf(buyer.address);

		assert(balance.gt(ethers.utils.parseUnits('5999', 18)), 'Buyer should have some dai');

		await daiToken.connect(buyer).approve(subdaoToken.address, ethers.utils.parseUnits('6000', 18));

		let tx = await subdaoToken.connect(buyer).executeBuyCw20(ethers.utils.parseUnits('6000', 18));

		await tx.wait();

		// console.log('Balance of buyer SD Token after buy ', (await subdaoToken.balanceOf(buyer.address)).toString());

		// console.log('Balance of buyer Dai Token after buy', (await daiToken.balanceOf(buyer.address)).toString());

		expect(await subdaoToken.balanceOf(buyer.address)).to.not.equal(0);

		subdaoTokenBalance = await subdaoToken.balanceOf(buyer.address);

		const subdao = await ethers.getContractAt('SubDao', endowment.dao);

		let subdaoConfig = await subdao.queryConfig();

		// console.log(subdaoConfig);

		let lockupAddress = subdaoConfig.veToken;

		const lockup = await ethers.getContractAt('IncentivisedVotingLockup', lockupAddress);

		await subdaoToken.connect(buyer).approve(lockup.address, subdaoTokenBalance);

		// lock for 30 days
		let tx2 = await lockup.connect(buyer).createLock(subdaoTokenBalance, parseInt(Date.now() / 1000) + 90 * 24 * 60 * 60);

		await tx2.wait();

		console.log('Balance of buyer SD Token after lockup ', (await subdaoToken.balanceOf(buyer.address)).toString());

		console.log('Balance of voting Token after lockup', (await lockup.balanceOf(buyer.address)).toString());

		expect(await lockup.balanceOf(buyer.address)).to.not.equal(0);
	});

	// it('Should withdraw vested from incentivised voting lockup', async function () {
	// 	await moveBlocks(100);

	// 	const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
	// 	let endowment = await accountQuery.queryEndowmentDetails(1);

	// 	const subdaoToken = await ethers.getContractAt('SubDaoToken', endowment.daoToken);

	// 	const subdao = await ethers.getContractAt('SubDao', endowment.dao);

	// 	let subdaoConfig = await subdao.queryConfig();

	// 	// console.log(subdaoConfig);

	// 	let lockupAddress = subdaoConfig.veToken;

	// 	const lockup = await ethers.getContractAt('IncentivisedVotingLockup', lockupAddress);

	// 	let vestAmount = await lockup.connect(buyer).getVestedAmount(buyer.address);

	// 	console.log(vestAmount);

	// 	let tx = await lockup.connect(buyer).withdrawVested(buyer.address, Math.floor(vestAmount / 2).toString());

	// 	await tx.wait();

	// 	// console.log('Balance of buyer SD Token after withdraw ', (await subdaoToken.balanceOf(buyer.address)).toString());

	// 	expect(await subdaoToken.balanceOf(buyer.address)).to.equal(Math.floor(vestAmount / 2).toString());
	// });

	it('should increase lock amount', async function () {
		const daiToken = await ethers.getContractAt('MockERC20', deployRes.addresses.dai);

		let balance = await daiToken.balanceOf(deployer.address);

		assert(balance.gt(ethers.utils.parseUnits('1000', 18)), 'Deployer should have some dai');

		// send 6000 dai for donation matching to donation match contract

		let tx3 = await daiToken.connect(deployer).transfer(buyer.address, ethers.utils.parseUnits('600', 18));

		await tx3.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(1);

		const subdaoToken = await ethers.getContractAt('SubDaoToken', endowment.daoToken);

		await daiToken.connect(buyer).approve(subdaoToken.address, ethers.utils.parseUnits('600', 18));
		let tx = await subdaoToken.connect(buyer).executeBuyCw20(ethers.utils.parseUnits('600', 18));

		await tx.wait();

		let subdaoTokenBalance = await subdaoToken.balanceOf(buyer.address);

		const subdao = await ethers.getContractAt('SubDao', endowment.dao);

		let subdaoConfig = await subdao.queryConfig();

		// console.log(subdaoConfig);

		await subdaoToken.connect(buyer).approve(subdaoConfig.veToken, subdaoTokenBalance);

		let lockupAddress = subdaoConfig.veToken;

		const lockup = await ethers.getContractAt('IncentivisedVotingLockup', lockupAddress);

		let bal = await lockup.balanceOf(buyer.address);

		tx = await lockup.connect(buyer).increaseLockAmount(subdaoTokenBalance);

		await tx.wait();

		expect(await lockup.balanceOf(buyer.address)).to.above(bal);
	});

	it('should increase lock time', async function () {
		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(1);

		const subdao = await ethers.getContractAt('SubDao', endowment.dao);

		let subdaoConfig = await subdao.queryConfig();

		// console.log(subdaoConfig);

		let lockupAddress = subdaoConfig.veToken;

		const lockup = await ethers.getContractAt('IncentivisedVotingLockup', lockupAddress);

		let tx = await lockup.connect(buyer).increaseLockLength(parseInt(Date.now() / 1000) + 300 * 24 * 60 * 60);

		await tx.wait();
	});

	it('Should test balanceOfAt and totalSupplyAt', async function () {
		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		let endowment = await accountQuery.queryEndowmentDetails(1);

		const subdao = await ethers.getContractAt('SubDao', endowment.dao);

		let subdaoConfig = await subdao.queryConfig();

		// console.log(subdaoConfig);

		let lockupAddress = subdaoConfig.veToken;

		const lockup = await ethers.getContractAt('IncentivisedVotingLockup', lockupAddress);

		const latestBlock = await hre.ethers.provider.getBlock('latest');

		let bal = await lockup.balanceOfAt(buyer.address, 0);

		expect(bal.toString()).to.equal('0');

		bal = await lockup.balanceOfAt(buyer.address, latestBlock.number);

		expect(bal.toString()).to.not.equal('0');

		bal = await lockup.totalSupplyAt(0);

		expect(bal.toString()).to.equal('0');

		bal = await lockup.totalSupplyAt(latestBlock.number);

		expect(bal.toString()).to.not.equal('0');
	});
});
