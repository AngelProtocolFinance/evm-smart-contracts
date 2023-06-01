const {expect} = require("chai");
const {ethers, artifacts} = require("hardhat");
const Web3 = require("web3");
const web3 = new Web3();
let {main} = require("../../scripts/deployAngelProtocol");
const endowmentData = require("../data/endowment.js");
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");

describe("Endowment Members", function () {
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

    const account = await ethers.getContractAt(
      "AccountsCreateEndowment",
      deployRes.addresses.account
    );

    let tx = await account.createEndowment(endowmentConfig);

    endowmentTxnReceipt = await tx.wait();

    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    endowment = await accountQuery.queryEndowmentDetails(1);
  });

  it("Should create a endowment of type normal", async function () {
    // console.log('Endowment', endowment);
    expect(endowment.endowType, "Endowment type is normal").to.equal(1);
  });

  it("Should create a endowment of type normal and deposit to it", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    endowment = await accountQuery.queryEndowmentDetails(1);

    expect(endowment.endowType, "Endowment type is normal").to.equal(1);

    let donor = addrs[0];

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    // console.log('Fetched USDC address', registrarConfig.usdcAddress);

    const MockERC20 = await ethers.getContractAt("MockUSDC", registrarConfig.usdcAddress);

    await MockERC20.connect(deployer).transfer(donor.address, ethers.utils.parseUnits("10000", 6));

    // Deposit to accounts

    const accountDeposit = await ethers.getContractAt(
      "AccountDepositWithdrawEndowments",
      deployRes.addresses.account
    );

    MockERC20.connect(donor).approve(accountDeposit.address, ethers.utils.parseUnits("10000", 6));

    let depositTxn = await accountDeposit
      .connect(donor)
      .depositERC20(
        {id: 1, lockedPercentage: 50, liquidPercentage: 50},
        registrarConfig.usdcAddress,
        ethers.utils.parseUnits("1000", 6)
      );

    await depositTxn.wait();

    let liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
    let locked_balance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

    console.log("Locked balance", locked_balance.toString());
    console.log("Liquid balance", liquid_balance.toString());
    expect(locked_balance.toString(), "Locked balance is 500").to.equal(
      ethers.utils.parseUnits("500", 6).toString()
    );
    expect(liquid_balance.toString(), "Liquid balance is 500").to.equal(
      ethers.utils.parseUnits("500", 6).toString()
    );
  });

  it("Should swap some USDC balance with Dai Token", async function () {
    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    const endowmentMultisig = await ethers.getContractAt("EndowmentMultiSig", endowment.owner);

    const accountsSwap = await ethers.getContractAt(
      "AccountsSwapEndowments",
      deployRes.addresses.account
    );

    const data = accountsSwap.interface.encodeFunctionData("swapToken", [
      1,
      1,
      ethers.utils.parseUnits("300", 6),
      registrarConfig.usdcAddress,
      deployRes.addresses.dai,
    ]);
    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("Swap Token TXN", "Swap Token TXN", accountsSwap.address, 0, data);

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
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );

    let liquid_balance = await accountQuery.queryTokenAmount(1, 1, deployRes.addresses.dai);

    expect(liquid_balance.toString(), "Liquid balance is not 0").to.not.equal("0");

    console.log("Liquid balance", liquid_balance.toString());
  });
});
