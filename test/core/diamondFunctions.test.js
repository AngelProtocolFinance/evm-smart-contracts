const { expect, assert } = require('chai');
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const endowmentData = require('../data/endowment.js');
const MockDate = require('mockdate');

// Create a charity endowment using the charity proposal contract
describe('Account Settings Controller', function () {
	let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
    const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
    let removeFaucetCut;
	let deployRes;
	let endowmentConfig;
	let account;
	let endowmentMultisig;
	let accoutnQuery;
	let delegate;
	let accountQuery;
	this.beforeAll(async function () {
		[deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
		console.log("deployer: ", deployer.address);
		deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script

		endowmentConfig = await endowmentData.getCreateEndowmentConfig(
			deployer.address,
			[admin1.address, admin2.address, admin3.address],
			1,
			true
		);
		endowmentConfig.owner = deployer.address;
		endowmentConfig.maturityTime = Math.floor(Date.now() / 1000) + 100000000;

		account = await ethers.getContractAt('AccountsCreateEndowment', deployRes.addresses.account);

		let tx = await account.createEndowment(endowmentConfig);

		endowmentTxnReceipt = await tx.wait();

		accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		endowment = await accountQuery.queryEndowmentDetails(1);

		endowmentMultisig = await ethers.getContractAt('EndowmentMultiSig', endowment.owner);
	});
	it('get all diamond faucet', async function(){
		diamond = await ethers.getContractAt('DiamondLoupeFacet', deployRes.addresses.account);

        let facets = await diamond.facets();

        assert.equal(facets.length, 19);
	});

    it('get all selector of a facets by address', async function(){
        diamond = await ethers.getContractAt('DiamondLoupeFacet', deployRes.addresses.account);

        let facets = await diamond.facets();
        let selector = await diamond.facetFunctionSelectors(facets[0][0]);

        assert.equal(selector.length, 1);
    });

    it ('get all faucet address', async function(){
        diamond = await ethers.getContractAt('DiamondLoupeFacet', deployRes.addresses.account);

        let facets = await diamond.facetAddresses();

        assert.equal(facets.length, 19);
    })

    it('get faucet address by the selector', async function(){
        diamond = await ethers.getContractAt('DiamondLoupeFacet', deployRes.addresses.account);

        let facets = await diamond.facets();
        let selector = await diamond.facetAddress(facets[0].functionSelectors[0]);

        assert.equal(facets[0][0], selector);

    });

    it('check it supports interface', async function(){
        diamond = await ethers.getContractAt('DiamondLoupeFacet', deployRes.addresses.account);

        let facets = await diamond.facets();
        let selector = await diamond.supportsInterface(facets[0].functionSelectors[0]);
        assert.equal(selector, true);
    });

    it('get owner of the diamond', async function(){
        diamond = await ethers.getContractAt('OwnershipFacet', deployRes.addresses.account);

        let ownerAddress = await diamond.owner();
        assert.equal(ownerAddress, proxyAdmin.address);
    });

    it('transfer ownership of the diamond', async function(){
        diamond = await ethers.getContractAt('OwnershipFacet', deployRes.addresses.account);

        let tx = await diamond.connect(proxyAdmin).transferOwnership(deployer.address);
        let receipt = await tx.wait();
        let ownerAddress = await diamond.owner();
        assert.equal(ownerAddress, deployer.address);
    });

    it('remove function form a diamond', async function(){
        diamond = await ethers.getContractAt('DiamondLoupeFacet', deployRes.addresses.account);

        let facets = await diamond.facets();
        removeFaucetCut = facets[18]
        let cutFaucet = await ethers.getContractAt('DiamondCutFacet', deployRes.addresses.account);

        let FaucetCut = [
            {
                facetAddress: ADDRESS_ZERO,
                action: 2,
                functionSelectors: facets[18][1]
            }
        ]
        let tx = await cutFaucet.connect(deployer).diamondCut(FaucetCut,ADDRESS_ZERO,'0x');
        await tx.wait();

        let facetsAfter = await diamond.facets();
        assert.equal(facetsAfter.length, 18);
    });

    it('add function to a diamond', async function(){
        diamond = await ethers.getContractAt('DiamondLoupeFacet', deployRes.addresses.account);

        let cutFaucet = await ethers.getContractAt('DiamondCutFacet', deployRes.addresses.account);
        let FaucetCut = [
            {
                facetAddress: removeFaucetCut[0],
                action: 0,
                functionSelectors: removeFaucetCut[1]
            }
        ]
        let tx = await cutFaucet.connect(deployer).diamondCut(FaucetCut,ADDRESS_ZERO,'0x');
        await tx.wait();
        let facetsAfter = await diamond.facets();
        assert.equal(facetsAfter.length, 19);
    });
});
