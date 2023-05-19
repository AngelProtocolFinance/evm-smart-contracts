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

	it('Should replace admin3 with new owner', async function () {
		const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

		admin4 = addrs[10];

		const data = endowmentMultisig.interface.encodeFunctionData('replaceOwner', [admin3.address, admin4.address]);

		let tx = await endowmentMultisig
			.connect(admin1)
			.submitTransaction('Replace Owner', 'replace owner', endowmentMultisig.address, 0, data);

		let txnReceipt = await tx.wait();

		let txId = txnReceipt.events[0].args.transactionId;

		// for testing revoke confirmation from admin1

		tx = await endowmentMultisig.connect(admin1).revokeConfirmation(txId);

		endowmentMultisigReceipt = await tx.wait();

		// approve from admin2

		tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

		endowmentMultisigReceipt = await tx.wait();

		// approve from admin3

		tx = await endowmentMultisig.connect(admin3).confirmTransaction(txId);

		endowmentMultisigReceipt = await tx.wait();

		flag = 1;
		for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
			if (endowmentMultisigReceipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}

		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		let owners = await endowmentMultisig.getOwners();

		expect(owners, 'Admin3 replaced with admin4').to.deep.equal([admin1.address, admin2.address, admin4.address]);
	});

	it('remove the new owner admin 4 in the endowment multisig', async function () {
		const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

		admin4 = addrs[10];

		const data = endowmentMultisig.interface.encodeFunctionData('removeOwner', [admin4.address]);

		let tx = await endowmentMultisig
			.connect(admin1)
			.submitTransaction('Remove Owner', 'remove owner', endowmentMultisig.address, 0, data);

		let txnReceipt = await tx.wait();

		let txId = txnReceipt.events[0].args.transactionId;

		// approve admin 2

		tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

		endowmentMultisigReceipt = await tx.wait();

		flag = 1;
		for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
			if (endowmentMultisigReceipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}

		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		let owners = await endowmentMultisig.getOwners();

		expect(owners, 'Admin4 removed from owners').to.deep.equal([admin1.address, admin2.address]);

		let numConfirmations = await endowmentMultisig.getConfirmationCount(txId);

		expect(numConfirmations, 'Transaction confirmed by 2 owners').to.equal(2);
	});

	it('add a new owner admin 3 in the endowment multisig', async function () {
		const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

		const data = endowmentMultisig.interface.encodeFunctionData('addOwner', [admin3.address]);

		let tx = await endowmentMultisig
			.connect(admin1)
			.submitTransaction('Add Owner', 'add owner', endowmentMultisig.address, 0, data);

		let txnReceipt = await tx.wait();

		let txId = txnReceipt.events[0].args.transactionId;

		// approve admin 2

		tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

		endowmentMultisigReceipt = await tx.wait();

		flag = 1;

		for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
			if (endowmentMultisigReceipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}

		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		let owners = await endowmentMultisig.getOwners();

		expect(owners, 'Admin3 added to owners').to.deep.equal([admin1.address, admin2.address, admin3.address]);

		// check if proper confirmations are stored

		let confirmations = await endowmentMultisig.getConfirmations(txId);

		expect(confirmations, 'Admin1 and admin2 confirmed the transaction').to.deep.equal([admin1.address, admin2.address]);
	});

	it('Should change requirement to 3 signers in endowment multisig', async function () {
		const endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);

		const data = endowmentMultisig.interface.encodeFunctionData('changeRequirement', [3]);

		let tx = await endowmentMultisig
			.connect(admin1)
			.submitTransaction('Change Requirement', 'change requirement', endowmentMultisig.address, 0, data);

		let txnReceipt = await tx.wait();

		let txId = txnReceipt.events[0].args.transactionId;

		// approve admin 2

		tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

		endowmentMultisigReceipt = await tx.wait();

		flag = 1;
		for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
			if (endowmentMultisigReceipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}

		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		let required = await endowmentMultisig.required();

		expect(required, 'Required changed to 3').to.equal(3);
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
