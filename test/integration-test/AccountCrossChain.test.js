const {
    createNetwork,
    relay,
    setupNetwork,
    getNetwork
} = require("@axelar-network/axelar-local-dev");
const { assert, expect } = require("chai");

const CONFIG = require("./../../config/index");

const hre = require("hardhat");
const ethers = hre.ethers;
const Web3 = require("web3");
const web3 = new Web3();
let { main } = require("../../scripts/deployMain");
const { mainRouter } = require("../../scripts/deploySetUp");
const endowmentData = require("../data/endowment.js");
const data = require("./../../ethereum.json");

// Create a charity endowment using the charity proposal contract
describe("Account Update", function () {
    let deployer, addrs, proxyAdmin;
    let deployRes;
    let endowment;

    let gasPayerPolygon;
    let gatwayContractPolygon;
    let gasPayer;
    let gatwayContract;
    let APMultisig;
    this.beforeAll(async function () {
        //Get a account to deploy Axelar protocol
        const accounts = config.networks.hardhat.accounts;
        const index = 0; // first wallet, increment for next wallets
        const wallet1 = ethers.Wallet.fromMnemonic(
            accounts.mnemonic,
            accounts.path + `/${index}`
        );


        const privateKey1 = wallet1.privateKey;

        //Additional accounts to deploy Angel protocol
        [deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] =
            await ethers.getSigners();
        console.log("deployer: ", deployer.address);
        console.log(deployer.getAddress());
        const polygon = await setupNetwork(ethers.provider, {
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
        gasPayer = tempEth.gasService//await ethereum.deployGasReceiver();
        gatwayContract = tempEth.gateway//await ethereum.deployGateway();
        // // deploy ethereum token

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
            router: CONFIG.ROUTER_ADDRESS,
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
            router: CONFIG.ROUTER_ADDRESS,
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

        expect(endowment.endow_type, "Endowment type is normal").to.equal(1);
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

    it("update strategy for an endowment", async function () {
        const accountQuery = await ethers.getContractAt(
            "AccountsQueryEndowments",
            deployRes.addresses.account
        );
        let endowment = await accountQuery.queryEndowmentDetails(1);

        const endowmentMultisig = await ethers.getContractAt(
            "EndowmentMultiSig",
            endowment.owner
        );

        let account = await ethers.getContractAt(
            "AccountsStrategiesUpdateEndowments",
            deployRes.addresses.account
        );

        let data = account.interface.encodeFunctionData("updateStrategies", [
            1,
            1,
            [
                {
                    vault: "GoldFinch",
                    percentage: 100,
                }
            ],
        ]);

        let tx = await endowmentMultisig
            .connect(admin1)
            .submitTransaction(
                "Add strategy",
                "Add strategy description",
                deployRes.addresses.account,
                0,
                data
            );

        let txnReceipt = await tx.wait();

        let txId = txnReceipt.events[0].args.transactionId;

        // tx = await endowmentMultisig.connect(admin3).confirmTransaction(txId);
        // await tx.wait();

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

	it('Should create a endowment of type normal and deposit to it', async function () {
		// endowmentConfig = await endowmentData.getCreateEndowmentConfig(
		// 	deployer.address,
		// 	[admin1.address, admin2.address, admin3.address],
		// 	1,
		// 	true
		// );
		// endowmentConfig.owner = deployer.address;

		// const account = await ethers.getContractAt('AccountsCreateEndowment', deployRes.addresses.account);

		// let tx = await account.createEndowment(endowmentConfig);

		// endowmentTxnReceipt = await tx.wait();

		const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
		endowment = await accountQuery.queryEndowmentDetails(1);

		expect(endowment.endow_type, 'Endowment type is normal').to.equal(1);

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
	});

    it('should copycat endowment strategy', async function () {

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

        let tx1 = await account.createEndowment(endowmentConfig);

        await tx1.wait();

        const accountQuery = await ethers.getContractAt(
            "AccountsQueryEndowments",
            deployRes.addresses.account
        );
        let endowment = await accountQuery.queryEndowmentDetails(2);

        const endowmentMultisig = await ethers.getContractAt(
            "EndowmentMultiSig",
            endowment.owner
        );

        let account2 = await ethers.getContractAt(
            "AccountsStrategiesCopyEndowments",
            deployRes.addresses.account
        );

        let data = account2.interface.encodeFunctionData("copycatStrategies", [
            2,
            1,
            1
        ]);

        let tx = await endowmentMultisig
            .connect(admin1)
            .submitTransaction(
                "Add strategy",
                "Add strategy description",
                deployRes.addresses.account,
                0,
                data
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

    it('should query vault balance' , async function () {
        const accountQuery = await ethers.getContractAt(
            "AccountsQueryEndowments",
            deployRes.addresses.account
        );

        let vaultBalance = await accountQuery.queryVaultBalance(1, 1, "GoldFinch");

        expect(vaultBalance.toString(), "Liquid balance is 500").to.equal(
            ethers.utils.parseUnits("500", 6).toString()
        );
    });

    it('should query state of endowment', async function () {
        const accountQuery = await ethers.getContractAt(
            "AccountsQueryEndowments",
            deployRes.addresses.account
        );

        let endowment = await accountQuery.queryState(1);

        console.log(endowment);
    });
});
