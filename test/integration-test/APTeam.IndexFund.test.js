const { expect } = require('chai');
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const endowmentData = require('../data/endowment.js');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { config } = require('../../config/index');
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

describe('AP Team Interaction with Index Fund', function () {
	let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
	let allianceMember1, allianceMember2, allianceMember3;
	let deployRes;
	let endowmentConfig;

	let endowmentTxnReceipt;
	let endowment;

	this.beforeAll(async function () {
		[deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();

		allianceMember1 = addrs[10];
		allianceMember2 = addrs[11];
		allianceMember3 = addrs[12];

		deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script
	});

	it('Should create an Index Fund and donate to it', async function () {
		const account = await ethers.getContractAt('AccountsCreateEndowment', deployRes.addresses.account);

		endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			1,
			true,
			ADDRESS_ZERO,
			'For Index Fund #1'
		);

		endowmentConfig.owner = deployer.address;

		let tx = await account.createEndowment(endowmentConfig);

		endowmentTxnReceipt = await tx.wait();

		// created with id 1

		endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			1,
			true,
			ADDRESS_ZERO,
			'For Index Fund #2'
		);

		endowmentConfig.owner = deployer.address;

		tx = await account.createEndowment(endowmentConfig);

		endowmentTxnReceipt = await tx.wait();

		// created with id 2

		endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			1,
			true,
			ADDRESS_ZERO,
			'For Index Fund #3'
		);

		endowmentConfig.owner = deployer.address;

		tx = await account.createEndowment(endowmentConfig);

		endowmentTxnReceipt = await tx.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

		endowment = await accountQuery.queryEndowmentDetails(1);
		expect(endowment.endowType, 'Endowment type is normal').to.equal(1);

		endowment = await accountQuery.queryEndowmentDetails(2);
		expect(endowment.endowType, 'Endowment type is normal').to.equal(1);

		endowment = await accountQuery.queryEndowmentDetails(3);
		expect(endowment.endowType, 'Endowment type is normal').to.equal(1);

		// create an index fund using the ap team multisig

		const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
		APMultisig = await ethers.getContractAt('APTeamMultiSig', apMultisigAddress);

		const indexFund = await ethers.getContractAt('IndexFund', deployRes.addresses.indexFund);

		let data = indexFund.interface.encodeFunctionData('createIndexFund', [
			'Test Fund',
			'Test fund created for tesing index fund contract',
			[1, 2, 3],
			true,
			50,
			parseInt(Date.now() / 1000) + 24 * 60 * 60 * 90,
			0,
		]);

		let tx2 = await APMultisig.connect(admin1).submitTransaction(
			'Create Index Fund',
			'Proposal to create index fund for testing',
			indexFund.address,
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

		// index fund created with id 1

		let fundDetails = await indexFund.queryFundDetails(1);

		expect(fundDetails.members).to.deep.equal([1, 2, 3]);
		expect(fundDetails.name).to.equal('Test Fund');
		expect(fundDetails.splitToLiquid).to.equal(50);
	});

	it('Should be able to query fund list', async function () {
		const indexFund = await ethers.getContractAt('IndexFund', deployRes.addresses.indexFund);

		let fundList = await indexFund.queryFundsList(0, 1);

		expect(fundList.length).to.equal(1);
		expect(fundList[0].id).to.equal(1);
		expect(fundList[0].name).to.equal('Test Fund');
		expect(fundList[0].members).to.deep.equal([1, 2, 3]);
		expect(fundList[0].splitToLiquid).to.equal(50);
	});

	it('Should be able to add and remove alliance members', async function () {
		const indexFund = await ethers.getContractAt('IndexFund', deployRes.addresses.indexFund);

		const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
		APMultisig = await ethers.getContractAt('APTeamMultiSig', apMultisigAddress);

		let data = indexFund.interface.encodeFunctionData('updateAllianceMemberList', [allianceMember1.address, 'add']);

		let tx2 = await APMultisig.connect(admin1).submitTransaction(
			'Add alliance member',
			'Proposal to add alliance member in index fund',
			indexFund.address,
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

		data = indexFund.interface.encodeFunctionData('updateAllianceMemberList', [allianceMember2.address, 'add']);

		tx2 = await APMultisig.connect(admin1).submitTransaction(
			'Add alliance member',
			'Proposal to add alliance member in index fund',
			indexFund.address,
			0,
			data
		);

		tx2Receipt = await tx2.wait();

		tx2 = await APMultisig.connect(admin2).confirmTransaction(tx2Receipt.events[0].args.transactionId);

		tx2Receipt = await tx2.wait();

		flag = 1;
		for (let i = 0; i < tx2Receipt.events.length; i++) {
			if (tx2Receipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}
		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		data = indexFund.interface.encodeFunctionData('updateAllianceMemberList', [allianceMember1.address, 'remove']);

		tx2 = await APMultisig.connect(admin1).submitTransaction(
			'remove alliance member',
			'Proposal to remove alliance member in index fund',
			indexFund.address,
			0,
			data
		);

		tx2Receipt = await tx2.wait();

		tx2 = await APMultisig.connect(admin2).confirmTransaction(tx2Receipt.events[0].args.transactionId);

		tx2Receipt = await tx2.wait();

		flag = 1;
		for (let i = 0; i < tx2Receipt.events.length; i++) {
			if (tx2Receipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}
		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		let allianceMembers = await indexFund.queryAllianceMembers(0, 5);

		expect(allianceMembers).to.deep.equal([allianceMember2.address, ADDRESS_ZERO, ADDRESS_ZERO, ADDRESS_ZERO, ADDRESS_ZERO]);
	});

	it('Should create a new index fund and add members to it and remove members from it', async function () {
		const indexFund = await ethers.getContractAt('IndexFund', deployRes.addresses.indexFund);

		const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
		APMultisig = await ethers.getContractAt('APTeamMultiSig', apMultisigAddress);

		let data = indexFund.interface.encodeFunctionData('createIndexFund', [
			'Test Fund',
			'Test fund created for tesing index fund contract',
			[2, 3],
			true,
			50,
			parseInt(Date.now() / 1000) + 24 * 60 * 60 * 90,
			0,
		]);

		let tx2 = await APMultisig.connect(admin1).submitTransaction(
			'Create Index Fund',
			'Proposal to create index fund for testing',
			indexFund.address,
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

		// index fund created with id 1

		let fundDetails = await indexFund.queryFundDetails(2);

		expect(fundDetails.members).to.deep.equal([2, 3]);
		expect(fundDetails.name).to.equal('Test Fund');
		expect(fundDetails.splitToLiquid).to.equal(50);

		data = indexFund.interface.encodeFunctionData('updateFundMembers', [2, [1], [3]]);

		tx2 = await APMultisig.connect(admin1).submitTransaction(
			'update Index Fund',
			'Proposal to update index fund for testing',
			indexFund.address,
			0,
			data
		);

		tx2Receipt = await tx2.wait();

		tx2 = await APMultisig.connect(admin2).confirmTransaction(tx2Receipt.events[0].args.transactionId);

		tx2Receipt = await tx2.wait();

		flag = 1;
		for (let i = 0; i < tx2Receipt.events.length; i++) {
			if (tx2Receipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}

		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		// index fund created with id 1

		fundDetails = await indexFund.queryFundDetails(2);

		expect(fundDetails.members).to.deep.equal([2, 1]);
		expect(fundDetails.name).to.equal('Test Fund');
		expect(fundDetails.splitToLiquid).to.equal(50);
	});

	it('should remove a member from all index funds', async function () {
		const indexFund = await ethers.getContractAt('IndexFund', deployRes.addresses.indexFund);

		const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
		APMultisig = await ethers.getContractAt('APTeamMultiSig', apMultisigAddress);

		const data = indexFund.interface.encodeFunctionData('removeMember', [2]);

		let tx2 = await APMultisig.connect(admin1).submitTransaction(
			'remove member',
			'Proposal to remove member from all index funds',
			indexFund.address,
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

		let fundDetails = await indexFund.queryFundDetails(1);

		expect(fundDetails.members).to.deep.equal([1, 3]);

		// console.log(fundDetails.members);

		fundDetails = await indexFund.queryFundDetails(2);

		// expect(fundDetails.members).to.deep.equal([1]);

		// console.log(fundDetails.members);
	});

	it('Should remove an index fund', async function () {
		const indexFund = await ethers.getContractAt('IndexFund', deployRes.addresses.indexFund);

		const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
		APMultisig = await ethers.getContractAt('APTeamMultiSig', apMultisigAddress);

		const data = indexFund.interface.encodeFunctionData('removeIndexFund', [2]);

		let tx2 = await APMultisig.connect(admin1).submitTransaction(
			'remove index fund',
			'Proposal to remove index fund',
			indexFund.address,
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

		let fundDetails = await indexFund.queryFundDetails(2);

		// console.log(fundDetails);

		expect(fundDetails.id).to.equal(0);
		expect(fundDetails.name).to.equal('');
		expect(fundDetails.members).to.deep.equal([]);
		expect(fundDetails.splitToLiquid).to.equal(0);
	});

	it('Should update registrar in index fund', async function () {
		const indexFund = await ethers.getContractAt('IndexFund', deployRes.addresses.indexFund);

		const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
		APMultisig = await ethers.getContractAt('APTeamMultiSig', apMultisigAddress);

		const data = indexFund.interface.encodeFunctionData('updateRegistrar', [deployRes.addresses.registrar]);

		let tx2 = await APMultisig.connect(admin1).submitTransaction(
			'Update Registrar',
			'Proposal to update registrar in index fund',
			indexFund.address,
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

		let config = await indexFund.queryConfig();

		// console.log(config);

		expect(config.registrarContract).to.equal(deployRes.addresses.registrar);
	});
});
