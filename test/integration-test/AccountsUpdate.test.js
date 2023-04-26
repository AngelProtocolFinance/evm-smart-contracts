const {
    createNetwork,
    relay,
    setupNetwork,
    getNetwork,
    networks
} = require("@axelar-network/axelar-local-dev");
const { mainRouter } = require("../../scripts/deploySetUp");
const { assert, expect } = require("chai");
const { ethers, artifacts } = require('hardhat');
const Web3 = require('web3');
const web3 = new Web3();
let { main } = require('../../scripts/deployMain');
const endowmentData = require('../data/endowment.js');
const data = require("./../../ethereum.json");
const ENV_CONFIG = require("./../../config/index");


// Create a charity endowment using the charity proposal contract
describe('Account Update', function () {
	let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
	let deployRes;
	let endowmentConfig;
	let account;
    let APMultisig;
    let accountQuery;
    let endowment;
    let gasPayerPolygon;
    let gatwayContractPolygon;
    let gasPayer;
    let gatwayContract;
    let polygon;
    let dummyGateway;
    
    this.beforeAll(async function () {
        //Get a account to deploy Axelar protocol
        const accounts = config.networks.hardhat.accounts;
        const index = 0; // first wallet, increment for next wallets
        const wallet1 = ethers.Wallet.fromMnemonic(
            accounts.mnemonic,
            accounts.path + `/${index}`
        );

        const gateway = await ethers.getContractFactory("DummyGateway");
        dummyGateway = await gateway.deploy();
        await dummyGateway.deployed();
        console.log("DummyGateway deployed to:", dummyGateway.address);



        const privateKey1 = wallet1.privateKey;

        //Additional accounts to deploy Angel protocol
        [deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] =
            await ethers.getSigners();
        console.log("deployer: ", deployer.address);
        console.log(deployer.getAddress());
        polygon = await setupNetwork(ethers.provider, {
            ownerKey: privateKey1,
            name: "Polygon",
        });
        
        let temp = polygon.getCloneInfo()
        gasPayerPolygon = temp.gasService// await polygon.deployGasReceiver();
        gatwayContractPolygon = temp.gateway//await polygon.deployGateway();
        console.log(polygon.getCloneInfo());
        console.log(polygon.gateway.address);
        // deploy eth token
        let usdcAddress = await polygon.deployToken("USDC", "USDC", 6, ethers.utils.parseUnits('100000000000000000', 6));
        polygon.giveToken(deployer.address,'USDC',ethers.utils.parseUnits('100000000000000000', 6))

        deployRes = await mainRouter([
            admin1.address,
            admin2.address,
            admin3.address,
        ],usdcAddress.address,false);


        const apMultisigAddress =
            deployRes.addresses.multisigAddress.APTeamMultiSig;
        APMultisig = await ethers.getContractAt(
            "APTeamMultiSig",
            apMultisigAddress
        );

        let tempEth = data;
        gasPayer = tempEth.gasService
        gatwayContract = tempEth.gateway

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
    
    });

    const statusMap = {
        Inactive: "0",
        Approved: "1",
        Frozen: "2",
        Closed: "3",
    }

	// this.beforeAll(async function () {
	// 	[deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
	// 	console.log("deployer: ", deployer.address);
	// 	deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script

    //     endowmentConfig = await endowmentData.getCreateEndowmentConfig(
	// 		deployer.address,
	// 		[admin1.address, admin2.address, admin3.address],
	// 		1,
	// 		true
	// 	);
	// 	endowmentConfig.owner = deployer.address;
	// 	endowmentConfig.maturityTime = Math.floor(Date.now() / 1000) + 100000000;

	// 	account = await ethers.getContractAt('AccountsCreateEndowment', deployRes.addresses.account);
		
    //     let tx = await account.createEndowment(endowmentConfig);

	// 	endowmentTxnReceipt = await tx.wait();

    //     const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
	// 	APMultisig = await ethers.getContractAt('APTeamMultiSig', apMultisigAddress);

	// 	accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
	// });

   //write it to add the network to the registrar contract
   it("it should add a network in registrar", async function () {
        console.log(deployRes.addresses.registrar);
        //get the registrar contract
        const registrar = await ethers.getContractAt(
            "Registrar",
            deployRes.addresses.registrar
        );

        const networkConfig = {
            name: "Ethereum",
            chainId: 1337,
            ibcChannel: "",
            transferChannel: "",
            gasReceiver: gasPayer,
            gasLimit: ethers.utils.parseEther("10"),
            router: ENV_CONFIG.ROUTER_ADDRESS,
            axelerGateway: gatwayContract,
        };
        console.log("adding:-----------",gatwayContract);
        const data = registrar.interface.encodeFunctionData(
            "updateNetworkConnections",
            [networkConfig, "post"]
        );

        let tx = await APMultisig.connect(admin3).submitTransaction(
            "update network connections",
            "update network connections",
            registrar.address,
            0,
            data
        );

        let receipt = await tx.wait();

        let confirmations = 0;
        const txId = receipt.events
            .filter((e) => e.event === "Confirmation")[0]
            .args.transactionId.toString();
        receipt.events.map((e) => {
            if (
                e.event === "Confirmation" &&
                e.args.transactionId.toString() === txId
            )
                confirmations += 1;
        });
        tx = await APMultisig.connect(admin1).confirmTransaction(txId);
        receipt = await tx.wait();
        let executed = false;
        receipt.events.map((e) => {
            if (
                e.event === "Confirmation" &&
                e.args.transactionId.toString() === txId
            )
                confirmations += 1;
            if (
                e.event === "Execution" &&
                e.args.transactionId.toString() === txId
            )
                executed = true;
        });
        assert(confirmations === 2, "confirmations not emitted");
        assert(executed, "transaction not executed");

        const senderConfig = {
            name: "Polygon",
            chainId: 8454,
            ibcChannel: "",
            transferChannel: "",
            gasReceiver: gasPayerPolygon,
            gasLimit: ethers.utils.parseEther("10"),
            router: ENV_CONFIG.ROUTER_ADDRESS,
            axelerGateway: gatwayContractPolygon,
        };
        console.log("adding:-----------",gatwayContractPolygon);

        const data1 = registrar.interface.encodeFunctionData(
            "updateNetworkConnections",
            [senderConfig, "post"]
        );

        let tx1 = await APMultisig.connect(admin3).submitTransaction(
            "update network connections",
            "update network connections",
            registrar.address,
            0,
            data1
        );

        let receipt1 = await tx1.wait();

        let confirmations1 = 0;
        const txId1 = receipt1.events
            .filter((e) => e.event === "Confirmation")[0]
            .args.transactionId.toString();
        receipt1.events.map((e) => {
            if (
                e.event === "Confirmation" &&
                e.args.transactionId.toString() === txId1
            )
                confirmations1 += 1;
        });
        tx1 = await APMultisig.connect(admin1).confirmTransaction(txId1);
        receipt1 = await tx1.wait();
        let executed1 = false;
        receipt1.events.map((e) => {
            if (
                e.event === "Confirmation" &&
                e.args.transactionId.toString() === txId1
            )
                confirmations1 += 1;
            if (
                e.event === "Execution" &&
                e.args.transactionId.toString() === txId1
            )
                executed1 = true;
        });
        assert(confirmations1 === 2, "confirmations not emitted");
        assert(executed1, "transaction not executed");
    });


    it("should update account contract's owner", async function() {
        account = await ethers.getContractAt('AccountsUpdate', deployRes.addresses.account);
        const data = account.interface.encodeFunctionData('updateOwner', [deployer.address]);
        let tx2 = await APMultisig.connect(admin1).submitTransaction(
			'updateOwner',
			'updateOwner',
			account.address,
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
        
        const config = await accountQuery.queryConfig();

        expect(config.owner.toString()).to.equal(deployer.address.toString());
    });
    it("should update accounts endowment status to Inactive", async function() {
        account = await ethers.getContractAt('AccountsUpdateStatusEndowments', deployRes.addresses.account);
        await account.updateEndowmentStatus(
            {
                endowmentId: "1", 
                status: statusMap.Inactive,
                beneficiary: {
                    data: {
                        id: "1",
                        addr: deployer.address,
                    },
                    enumData: "0"
                }
            }
        );
        const endowment = await accountQuery.queryEndowmentDetails(1);
        expect(endowment.status.toString()).to.equal(statusMap.Inactive);
    });
    it("should update accounts endowment status to Approved", async function(){
        account = await ethers.getContractAt('AccountsUpdateStatusEndowments', deployRes.addresses.account);
        await account.updateEndowmentStatus(
            {
                endowmentId: "1", 
                status: statusMap.Approved,
                beneficiary: {
                    data: {
                        id: "1",
                        addr: deployer.address,
                    },
                    enumData: "0"
                }
            }
        );
        const endowment = await accountQuery.queryEndowmentDetails(1);
        expect(endowment.status.toString()).to.equal(statusMap.Approved);
    });
    it("should update accounts endowment status to Frozen", async function(){
        account = await ethers.getContractAt('AccountsUpdateStatusEndowments', deployRes.addresses.account);
        await account.updateEndowmentStatus(
            {
                endowmentId: "1", 
                status: statusMap.Frozen,
                beneficiary: {
                    data: {
                        id: "1",
                        addr: deployer.address,
                    },
                    enumData: "0"
                }
            }
        );
        const endowment = await accountQuery.queryEndowmentDetails(1);
        expect(endowment.status.toString()).to.equal(statusMap.Frozen);
    });
    it("should update accounts endowment status to Closed", async function(){
        account = await ethers.getContractAt('AccountsUpdateStatusEndowments', deployRes.addresses.account);
        await account.updateEndowmentStatus(
            {
                endowmentId: "1", 
                status: statusMap.Closed,
                beneficiary: {
                    data: {
                        id: "1",
                        addr: deployer.address,
                    },
                    enumData: "0"
                }
            }
        );
        const endowment = await accountQuery.queryEndowmentDetails(1);
        expect(endowment.status.toString()).to.equal(statusMap.Closed);
    });
    it("should update the account config", async function() {
        account = await ethers.getContractAt('AccountsUpdate', deployRes.addresses.account);
        await account.updateConfig(addrs[0].address, 1);
    
        const config = await accountQuery.queryConfig();
        expect(config.registrarContract.toString()).to.equal(addrs[0].address.toString());
    });
});
