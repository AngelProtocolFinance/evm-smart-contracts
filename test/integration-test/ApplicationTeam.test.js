const { expect } = require('chai');
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const endowmentData = require('../data/endowment.js');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

// Create a charity endowment using the charity proposal contract
describe('Charity Endowment Creation and Approval from Application Team', function () {
	let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
	let deployRes;
	let endowmentConfig;

	// let endowmentTxnReceipt;
	let endowment;

	let charityApplications;
	let charityProposal;

	this.beforeAll(async function () {
		[deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
		deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script

		// Fetch the USDC address from registrart config

		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		// console.log('Fetched USDC address', registrarConfig.usdcAddress);

		endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			0,
			true,
			(bondingCurveReserveDenom = registrarConfig.usdcAddress)
		);
		endowmentConfig.owner = deployer.address;

		// Send proposal to charity applications contract
		charityApplications = await ethers.getContractAt('CharityApplication', deployRes.addresses.charityApplicationsAddress);
		let tx = await charityApplications.connect(addrs[1]).proposeCharity(endowmentConfig, 'Charity Proposal Testing');

		let charityProposalTxnReceipt = await tx.wait();

		// console.log(charityProposalTxnReceipt.events);

		charityProposal = await charityApplications.proposals(1);
		// console.log(charityProposal);

		expect(charityProposal[0], 'Proposal ID is 1').to.equal(1);
		expect(charityProposal[1], 'Proposal is proposed by proper proposer').to.equal(addrs[1].address);
		expect(charityProposal[2].name, 'Proposal is for proper charity').to.equal('Test Endowment');
	});
	it('Applications Team should be able to approve creation of charity', async function () {
		// create a proposal on Applications Multisig to send approval for proposal with ID 1

		const applicationsMultisig = await ethers.getContractAt(
			'ApplicationsMultiSig',
			deployRes.addresses.multisigAddress.ApplicationsMultiSig
		);

		let tx = await applicationsMultisig
			.connect(admin1)
			.submitTransaction(
				'Approve Charity Proposal',
				'Approve Charity Proposal Testing ',
				deployRes.addresses.charityApplicationsAddress,
				0,
				charityApplications.interface.encodeFunctionData('approveCharity', [1])
			);

		let applicationsMultisigTxnReceipt = await tx.wait();

		let txId = applicationsMultisigTxnReceipt.events[0].args[0];

		// approve from admin 2

		tx = await applicationsMultisig.connect(admin2).confirmTransaction(txId);

		applicationsMultisigTxnReceipt = await tx.wait();

		// check for execution success event

		// console.log(applicationsMultisigTxnReceipt.events);
		let flag = 1;
		for (let i = 0; i < applicationsMultisigTxnReceipt.events.length; i++) {
			if (applicationsMultisigTxnReceipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}
		expect(flag === 1, 'Transaction executed successfully').to.equal(true);
	});
	it('Should have created a charity endowments on the accounts contract with id 1', async function () {
		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		endowment = await accountQuery.queryEndowmentDetails(1);
		// console.log(endowment);
		expect(endowment.endowType, 'Endowment is of type charity').to.equal(0);
	});

	it('Application team should be able to reject a charity proposal', async function () {
		// Fetch the USDC address from registrart config

		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		// console.log('Fetched USDC address', registrarConfig.usdcAddress);

		endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			0,
			true,
			(bondingCurveReserveDenom = registrarConfig.usdcAddress)
		);
		endowmentConfig.owner = deployer.address;

		// Send proposal to charity applications contract
		charityApplications = await ethers.getContractAt('CharityApplication', deployRes.addresses.charityApplicationsAddress);
		let tx = await charityApplications.connect(addrs[1]).proposeCharity(endowmentConfig, 'Charity Proposal Testing');

		let charityProposalTxnReceipt = await tx.wait();

		// console.log(charityProposalTxnReceipt.events);

		charityProposal = await charityApplications.proposals(2);
		// console.log(charityProposal);

		expect(charityProposal[0], 'Proposal ID is 2').to.equal(2);
		expect(charityProposal[1], 'Proposal is proposed by proper proposer').to.equal(addrs[1].address);
		expect(charityProposal[2].name, 'Proposal is for proper charity').to.equal('Test Endowment');

		const applicationsMultisig = await ethers.getContractAt(
			'ApplicationsMultiSig',
			deployRes.addresses.multisigAddress.ApplicationsMultiSig
		);

		tx = await applicationsMultisig
			.connect(admin1)
			.submitTransaction(
				'Reject Charity Proposal',
				'Reject Charity Proposal Testing ',
				deployRes.addresses.charityApplicationsAddress,
				0,
				charityApplications.interface.encodeFunctionData('rejectCharity', [2])
			);

		let applicationsMultisigTxnReceipt = await tx.wait();

		let txId = applicationsMultisigTxnReceipt.events[0].args[0];

		// approve from admin 2

		tx = await applicationsMultisig.connect(admin2).confirmTransaction(txId);

		applicationsMultisigTxnReceipt = await tx.wait();

		// check for execution success event

		// console.log(applicationsMultisigTxnReceipt.events);
		let flag = 1;
		for (let i = 0; i < applicationsMultisigTxnReceipt.events.length; i++) {
			if (applicationsMultisigTxnReceipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}
		expect(flag === 1, 'Transaction executed successfully').to.equal(true);
	});

	it('Should update charity proposal config with new config', async function () {
		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		const applicationsMultisig = await ethers.getContractAt(
			'ApplicationsMultiSig',
			deployRes.addresses.multisigAddress.ApplicationsMultiSig
		);

		tx = await applicationsMultisig
			.connect(admin1)
			.submitTransaction(
				'Update Config',
				'Update endow gas money and seed asset config',
				deployRes.addresses.charityApplicationsAddress,
				0,
				charityApplications.interface.encodeFunctionData('updateConfig', [
					0,
					ADDRESS_ZERO,
					ADDRESS_ZERO,
					0,
					true,
					ethers.utils.parseEther('1'),
					true,
					registrarConfig.usdcAddress,
					ethers.utils.parseUnits('1000', 6),
				])
			);

		let applicationsMultisigTxnReceipt = await tx.wait();

		let txId = applicationsMultisigTxnReceipt.events[0].args[0];

		// approve from admin 2

		tx = await applicationsMultisig.connect(admin2).confirmTransaction(txId);

		applicationsMultisigTxnReceipt = await tx.wait();

		// check for execution success event

		// console.log(applicationsMultisigTxnReceipt.events);
		let flag = 1;
		for (let i = 0; i < applicationsMultisigTxnReceipt.events.length; i++) {
			if (applicationsMultisigTxnReceipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}
		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		let config = await charityApplications.queryConfig();

		// console.log(config);

		expect(config.gasAmount, 'Endow gas money is updated').to.equal(ethers.utils.parseEther('1'));
		expect(config.seedAsset, 'Seed asset is updated').to.equal(registrarConfig.usdcAddress);
		expect(config.seedAssetAmount, 'Seed amount is updated').to.equal(ethers.utils.parseUnits('1000', 6));
		expect(config.fundSeedAsset, 'Fund seed asset is updated').to.equal(true);
		expect(config.newEndowGasMoney, 'New endow gas money is updated').to.equal(true);
	});

	it('Should send endow gas money to admin 1 and also deposit 1000 usdc into the created charity', async function () {
		let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

		// Send some 10 ether to charityProposal contract

		await deployer.sendTransaction({
			to: deployRes.addresses.charityApplicationsAddress,
			value: ethers.utils.parseEther('10.0'), // Sends exactly 10 ether
		});

		// Send some USDC to charityProposal contract

		const MockERC20 = await ethers.getContractAt('MockUSDC', registrarConfig.usdcAddress);

		await MockERC20.connect(deployer).transfer(
			deployRes.addresses.charityApplicationsAddress,
			ethers.utils.parseUnits('10000', 6)
		);

		// Fetch the USDC address from registrart config

		// console.log('Fetched USDC address', registrarConfig.usdcAddress);

		endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			0,
			true,
			(bondingCurveReserveDenom = registrarConfig.usdcAddress)
		);
		endowmentConfig.owner = deployer.address;

		// Send proposal to charity applications contract
		charityApplications = await ethers.getContractAt('CharityApplication', deployRes.addresses.charityApplicationsAddress);
		let tx = await charityApplications.connect(addrs[1]).proposeCharity(endowmentConfig, 'Charity Proposal Testing');

		let charityProposalTxnReceipt = await tx.wait();

		// console.log(charityProposalTxnReceipt.events);

		charityProposal = await charityApplications.proposals(2);
		// console.log(charityProposal);

		expect(charityProposal[0], 'Proposal ID is 2').to.equal(2);
		expect(charityProposal[1], 'Proposal is proposed by proper proposer').to.equal(addrs[1].address);
		expect(charityProposal[2].name, 'Proposal is for proper charity').to.equal('Test Endowment');

		const applicationsMultisig = await ethers.getContractAt(
			'ApplicationsMultiSig',
			deployRes.addresses.multisigAddress.ApplicationsMultiSig
		);

		tx = await applicationsMultisig
			.connect(admin1)
			.submitTransaction(
				'Reject Charity Proposal',
				'Reject Charity Proposal Testing ',
				deployRes.addresses.charityApplicationsAddress,
				0,
				charityApplications.interface.encodeFunctionData('approveCharity', [3])
			);

		let applicationsMultisigTxnReceipt = await tx.wait();

		let txId = applicationsMultisigTxnReceipt.events[0].args[0];

		// approve from admin 2

		tx = await applicationsMultisig.connect(admin2).confirmTransaction(txId);

		applicationsMultisigTxnReceipt = await tx.wait();

		// check for execution success event

		// console.log(applicationsMultisigTxnReceipt.events);
		let flag = 1;
		for (let i = 0; i < applicationsMultisigTxnReceipt.events.length; i++) {
			if (applicationsMultisigTxnReceipt.events[i].event == 'ExecutionFailure') {
				flag = 0;
				break;
			}
		}
		expect(flag === 1, 'Transaction executed successfully').to.equal(true);

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

		let liquid_balance = await accountQuery.queryTokenAmount(2, 1, registrarConfig.usdcAddress);
		let lockedBalance = await accountQuery.queryTokenAmount(2, 0, registrarConfig.usdcAddress);
		// console.log(depositTxnReceipt.events);

		expect(lockedBalance.toString(), 'Locked balance is 1000').to.equal(ethers.utils.parseUnits('1000', 6).toString());

		let provider = hre.ethers.provider;

		let balance = await provider.getBalance(admin1.address);

		expect(balance, 'Balance is greater than 10000 ether').to.be.above(ethers.utils.parseEther('10000'));
	});
});
