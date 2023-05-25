const {
    createNetwork,
    relay,
    setupNetwork,
    getNetwork,
    networks
} = require("@axelar-network/axelar-local-dev");
const { assert, expect } = require("chai");

// const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;
const Web3 = require("web3");
const web3 = new Web3();
let { main } = require("../../scripts/deployMain");
const { mainRouter } = require("../../scripts/deploySetUp");
const endowmentData = require("../data/endowment.js");
const data = require("./../../ethereum.json");
const ENV_CONFIG = require("./../../config/index");

// Create a charity endowment using the charity proposal contract
describe("Account Update", function () {
    let deployer, addrs, proxyAdmin;
    let deployRes;
    let endowment;
    let accountQuery;
    let gasPayerPolygon;
    let gatwayContractPolygon;
    let gasPayer;
    let gatwayContract;
    let APMultisig;
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

        accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

    
    });

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

    it("it should add a vault in registrar", async function () {
        const registrar = await ethers.getContractAt(
            "Registrar",
            deployRes.addresses.registrar
        );

        let registrarConfig = await registrar.queryConfig();

        // native vault called gold finch
        const data = registrar.interface.encodeFunctionData("vaultAdd", [
            [1337, "GoldFinch", registrarConfig.usdcAddress, registrarConfig.usdcAddress, [2], 1, 0],
        ]);

        let tx = await APMultisig.connect(admin1).submitTransaction(
            "update registrar add vault",
            "update registrar add vault",
            registrar.address,
            0,
            data
        );
        let receipt = await tx.wait();
        let txId = receipt.events
            .filter((e) => e.event === "Submission")[0]
            .args.transactionId.toString();
        tx = await APMultisig.connect(admin2).confirmTransaction(txId);

        receipt = await tx.wait();

        let flag = 1;
        for (let i = 0; i < receipt.events.length; i++) {
            if (receipt.events[i].event === "ExecutionFailure") {
                flag = 0;
                break;
            }
        }
        expect(flag).to.equal(1, "transaction failed");

        let vaults = await registrar.queryVaultList(0, 2, 1, 3, 2, 0, 3);

        expect(vaults[0].addr).to.equal("GoldFinch", "vault not added");
    });

    it("Should setup a endowment", async function () {
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

        // dao should use halo token
        account = await ethers.getContractAt(
            "AccountsCreateEndowment",
            deployRes.addresses.account
        );

        let tx = await account.createEndowment(endowmentConfig);

        await tx.wait();

        const accountQuery = await ethers.getContractAt(
            "AccountsQueryEndowments",
            deployRes.addresses.account
        );
        let endowment = await accountQuery.queryEndowmentDetails(1);

        expect(endowment.endowType, "Endowment type is normal").to.equal(1);
        let donor = addrs[0];

        let registrar = await ethers.getContractAt(
            "Registrar",
            deployRes.addresses.registrar
        );
        let registrarConfig = await registrar.queryConfig();

        const MockERC20 = await ethers.getContractAt(
            "MockUSDC",
            registrarConfig.usdcAddress
        );

        await MockERC20.connect(deployer).transfer(
            donor.address,
            ethers.utils.parseUnits("10000", 6)
        );

        const accountDeposit = await ethers.getContractAt(
            "AccountDepositWithdrawEndowments",
            deployRes.addresses.account
        );

        MockERC20.connect(donor).approve(
            accountDeposit.address,
            ethers.utils.parseUnits("10000", 6)
        );

        let depositTxn = await accountDeposit
            .connect(donor)
            .depositERC20(
                { id: 1, lockedPercentage: 50, liquidPercentage: 50 },
                registrarConfig.usdcAddress,
                ethers.utils.parseUnits("1000", 6)
            );

        let depositTxnReceipt = await depositTxn.wait();

        let liquid_balance = await accountQuery.queryTokenAmount(
            1,
            1,
            registrarConfig.usdcAddress
        );
        let locked_balance = await accountQuery.queryTokenAmount(
            1,
            0,
            registrarConfig.usdcAddress
        );

        console.log("Locked balance", locked_balance.toString());
        console.log("Liquid balance", liquid_balance.toString());
        expect(locked_balance.toString(), "Locked balance is 500").to.equal(
            ethers.utils.parseUnits("500", 6).toString()
        );
        expect(liquid_balance.toString(), "Liquid balance is 500").to.equal(
            ethers.utils.parseUnits("500", 6).toString()
        );
    });

	it('Should create a endowment of type normal and deposit to it', async function () {

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
				ethers.utils.parseUnits('1000', 6),
                {value: ethers.utils.parseEther('10')}
			);

		let depositTxnReceipt = await depositTxn.wait();

        let liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
		let lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

		console.log('Locked balance', lockedBalance.toString());
		console.log('Liquid balance', liquid_balance.toString());

	});

    it('should invest into liquid vault', async function () {
        const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		endowment = await accountQuery.queryEndowmentDetails(1);

        let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();


        let usdcContract = await ethers.getContractAt('MockUSDC', registrarConfig.usdcAddress);

        let usdcBalance = await usdcContract.balanceOf(deployRes.addresses.account);

        console.log('Vault balance before  usdcBalance', usdcBalance.toString());

        const endowmentMultisig = await ethers.getContractAt(
            "EndowmentMultiSig",
            endowment.owner
        );

        let account = await ethers.getContractAt(
            "AccountsVaultFacet",
            deployRes.addresses.account
        );

        let data = account.interface.encodeFunctionData("vaultsInvest", [
            1,
            1,
            [
                'GoldFinch'
            ],
            [
                registrarConfig.usdcAddress
            ],
            [
                ethers.utils.parseUnits('100', 6)
            ]
        ]);

        // let txReceive = await endowmentMultisig.receive({value: ethers.utils.parseEther('10')});
        // await txReceive.wait();

        const transactionHash = await deployer.sendTransaction({
            to: endowment.owner,
            value: ethers.utils.parseEther("20"), // Sends exactly 1.0 ether
          });

        let tx = await endowmentMultisig
            .connect(admin1)
            .submitTransaction(
                "Vault invest",
                "Lets invest into vault",
                deployRes.addresses.account,
                ethers.utils.parseEther('10'),
                data,
            );

        let txnReceipt = await tx.wait();

        let txId = txnReceipt.events[0].args.transactionId;

        tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

        let endowmentMultisigReceipt = await tx.wait();

        let flag = 1;
        for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
            if (
                endowmentMultisigReceipt.events[i].event == "ExecutionFailure"
            ) {
                flag = 0;
                break;
            }
        }
        console.log(flag);
        expect(flag === 1, "Transaction executed successfully").to.equal(true);

        let queryContract = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

        let vaultBalanceBefore = await queryContract.queryVaultBalance(1,1,'GoldFinch');


        usdcBalance = await usdcContract.balanceOf(deployRes.addresses.account);

        console.log('Vault balance usdcBalance', usdcBalance.toString());

        console.log('Vault balance before', vaultBalanceBefore.toString());
    });

    it('should call vault redeem', async function () {
        const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		endowment = await accountQuery.queryEndowmentDetails(1);
        let queryContract = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

        let vaultBalanceBefore = await queryContract.queryVaultBalance(1,1,'GoldFinch');

        console.log('Vault balance before', vaultBalanceBefore.toString());
        let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();

        const endowmentMultisig = await ethers.getContractAt(
            "EndowmentMultiSig",
            endowment.owner
        );

        let account = await ethers.getContractAt(
            "AccountsVaultFacet",
            deployRes.addresses.account
        );

        let data = account.interface.encodeFunctionData("vaultsRedeem", [
            1,
            1,
            [
                'GoldFinch'
            ]
        ]);

        const transactionHash = await deployer.sendTransaction({
            to: endowment.owner,
            value: ethers.utils.parseEther("20"), // Sends exactly 1.0 ether
          });

        let tx = await endowmentMultisig
            .connect(admin1)
            .submitTransaction(
                "Vault redeem",
                "Vault redeem",
                deployRes.addresses.account,
                ethers.utils.parseEther('10'),
                data,
            );

        let txnReceipt = await tx.wait();

        let txId = txnReceipt.events[0].args.transactionId;

        tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

        let endowmentMultisigReceipt = await tx.wait();

        let flag = 1;
        for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
            if (
                endowmentMultisigReceipt.events[i].event == "ExecutionFailure"
            ) {
                flag = 0;
                break;
            }
        }
        console.log(flag);
        expect(flag === 1, "Transaction executed successfully").to.equal(true);
    });

    it("it should update network to dummy gateway ", async function () {
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
            axelerGateway: dummyGateway.address,
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
            axelerGateway: dummyGateway.address,
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

    //Close Endowment

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

    it('should invest into liquid vault second time', async function () {
        const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		endowment = await accountQuery.queryEndowmentDetails(1);

        let registrar = await ethers.getContractAt('Registrar', deployRes.addresses.registrar);
		let registrarConfig = await registrar.queryConfig();


        let usdcContract = await ethers.getContractAt('MockUSDC', registrarConfig.usdcAddress);

        let usdcBalance = await usdcContract.balanceOf(deployRes.addresses.account);

        console.log('Vault balance before  usdcBalance', usdcBalance.toString());

        const endowmentMultisig = await ethers.getContractAt(
            "EndowmentMultiSig",
            endowment.owner
        );

        let account = await ethers.getContractAt(
            "AccountsVaultFacet",
            deployRes.addresses.account
        );

        let data = account.interface.encodeFunctionData("vaultsInvest", [
            1,
            1,
            [
                'GoldFinch'
            ],
            [
                registrarConfig.usdcAddress
            ],
            [
                ethers.utils.parseUnits('100', 6)
            ]
        ]);

        const transactionHash = await deployer.sendTransaction({
            to: endowment.owner,
            value: ethers.utils.parseEther("20"), // Sends exactly 1.0 ether
          });

        let tx = await endowmentMultisig
            .connect(admin1)
            .submitTransaction(
                "Vault invest",
                "Lets invest into vault",
                deployRes.addresses.account,
                ethers.utils.parseEther('10'),
                data,
            );

        let txnReceipt = await tx.wait();

        let txId = txnReceipt.events[0].args.transactionId;

        tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

        let endowmentMultisigReceipt = await tx.wait();

        let flag = 1;
        for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
            if (
                endowmentMultisigReceipt.events[i].event == "ExecutionFailure"
            ) {
                flag = 0;
                break;
            }
        }
        console.log(flag);
        expect(flag === 1, "Transaction executed successfully").to.equal(true);

        usdcBalance = await usdcContract.balanceOf(deployRes.addresses.account);
    });

    it("should update accounts endowment status to Closed", async function(){
        const statusMap = {
            Inactive: "0",
            Approved: "1",
            Frozen: "2",
            Closed: "3",
        }
    
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
                    enumData: "2"
                }
            }
        );
        const endowment = await accountQuery.queryEndowmentDetails(1);
        expect(endowment.status.toString()).to.equal(statusMap.Closed);
    });

    it('it should receive the callback for Axelar network', async function(){

        let queryContract = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);

        let vaultBalanceBefore = await queryContract.queryVaultBalance(1,1,'GoldFinch');
 
        const registrar = await ethers.getContractAt(
            "Registrar",
            deployRes.addresses.registrar
        );        

        let registrarConfig = await registrar.queryConfig();

        let accountRouter = await ethers.getContractAt('AxelarExecutionContract', deployRes.addresses.account);

        let AbiCoder = ethers.utils.defaultAbiCoder; 
        
        let setUpAddress = await dummyGateway.setTestTokenAddress(registrarConfig.usdcAddress);
        await setUpAddress.wait();

        let data = AbiCoder.encode(['bytes4','bytes4','uint32[]','address','uint256','uint256'],['0x6dc4f3f6','0x6dc4f3f6',[1],registrarConfig.usdcAddress,BigInt(0),BigInt(100e6)]);

        let token = await ethers.getContractAt('MockUSDC', registrarConfig.usdcAddress);

        let transfer = await token.transfer(deployRes.addresses.account, BigInt(100e6));

        await transfer.wait();

        let tx = await accountRouter.executeWithToken(ethers.utils.formatBytes32String("true"), "Polygon", registrarConfig.usdcAddress, data ,'USDC',BigInt(100e6)); 


        console.log('Vault balance before', vaultBalanceBefore.toString());
        let vaultBalanceAfter = await queryContract.queryVaultBalance(1,1,'GoldFinch');
        console.log('Vault balance after', vaultBalanceAfter.toString());

    });
});
