const {expect} = require("chai");
const {ethers, artifacts} = require("hardhat");
const Web3 = require("web3");
const web3 = new Web3();
let {main} = require("../../scripts/deployAngelProtocol");
const endowmentData = require("../data/endowment.js");
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const {config} = require("../../config/index");
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

describe("Donor donates from Index Fund", function () {
  let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
  let deployRes;
  let endowmentConfig;

  let endowmentTxnReceipt;
  let endowment;

  this.beforeAll(async function () {
    [deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
    deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script
  });

  it("Should create an Index Fund and donate to it", async function () {
    const account = await ethers.getContractAt(
      "AccountsCreateEndowment",
      deployRes.addresses.account
    );

    endowmentConfig = await endowmentData.getCreateEndowmentConfig(
      deployer.address,
      [admin1.address, admin2.address, admin3.address],
      1,
      true,
      ADDRESS_ZERO,
      "For Index Fund #1"
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
      "For Index Fund #2"
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
      "For Index Fund #3"
    );

    endowmentConfig.owner = deployer.address;

    tx = await account.createEndowment(endowmentConfig);

    endowmentTxnReceipt = await tx.wait();

    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );

    endowment = await accountQuery.queryEndowmentDetails(1);
    expect(endowment.endowType, "Endowment type is normal").to.equal(1);

    endowment = await accountQuery.queryEndowmentDetails(2);
    expect(endowment.endowType, "Endowment type is normal").to.equal(1);

    endowment = await accountQuery.queryEndowmentDetails(3);
    expect(endowment.endowType, "Endowment type is normal").to.equal(1);

    // create an index fund using the ap team multisig

    const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
    APMultisig = await ethers.getContractAt("APTeamMultiSig", apMultisigAddress);

    const indexFund = await ethers.getContractAt("IndexFund", deployRes.addresses.indexFund);

    let data = indexFund.interface.encodeFunctionData("createIndexFund", [
      "Test Fund",
      "Test fund created for tesing index fund contract",
      [1, 2, 3],
      true,
      50,
      parseInt(Date.now() / 1000) + 24 * 60 * 60 * 90,
      0,
    ]);

    let tx2 = await APMultisig.connect(admin1).submitTransaction(
      "Create Index Fund",
      "Proposal to create index fund for testing",
      indexFund.address,
      0,
      data
    );

    let tx2Receipt = await tx2.wait();

    tx2 = await APMultisig.connect(admin2).confirmTransaction(
      tx2Receipt.events[0].args.transactionId
    );

    tx2Receipt = await tx2.wait();

    let flag = 1;
    for (let i = 0; i < tx2Receipt.events.length; i++) {
      if (tx2Receipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    // index fund created with id 1

    let fundDetails = await indexFund.queryFundDetails(1);

    expect(fundDetails.members).to.deep.equal([1, 2, 3]);
    expect(fundDetails.name).to.equal("Test Fund");
    expect(fundDetails.splitToLiquid).to.equal(50);

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    // donate to index fund

    let donor = addrs[0];

    const MockERC20 = await ethers.getContractAt("MockUSDC", registrarConfig.usdcAddress);

    await MockERC20.connect(deployer).transfer(
      addrs[0].address,
      ethers.utils.parseUnits("3000", 6)
    );

    await MockERC20.connect(addrs[0]).approve(
      indexFund.address,
      ethers.utils.parseUnits("3000", 6)
    );

    let donateTxn = await indexFund
      .connect(donor)
      .depositERC20(
        donor.address,
        [1, 50],
        [0, ethers.utils.parseUnits("3000", 6), registrarConfig.usdcAddress, "USDC"]
      );

    await MockERC20.connect(deployer).transfer(
      addrs[0].address,
      ethers.utils.parseUnits("3000", 6)
    );

    await MockERC20.connect(addrs[0]).approve(
      indexFund.address,
      ethers.utils.parseUnits("3000", 6)
    );

    // donate twice

    donateTxn = await indexFund
      .connect(donor)
      .depositERC20(
        donor.address,
        [1, 50],
        [0, ethers.utils.parseUnits("3000", 6), registrarConfig.usdcAddress, "USDC"]
      );

    // let donateTxnReceipt = await donateTxn.wait();

    // Total donated 6000 to 1,2,3 at 50% split
    // expect locked balance to be 1000 for each
    // expect liquid balance to be 1000 for each

    let liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
    let lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

    expect(liquid_balance.toString()).to.equal(ethers.utils.parseUnits("1000", 6).toString());
    expect(lockedBalance.toString()).to.equal(ethers.utils.parseUnits("1000", 6).toString());

    // console.log('Locked balance #1', lockedBalance.toString());
    // console.log('Liquid balance #1', liquid_balance.toString());

    liquid_balance = await accountQuery.queryTokenAmount(2, 1, registrarConfig.usdcAddress);
    lockedBalance = await accountQuery.queryTokenAmount(2, 0, registrarConfig.usdcAddress);

    expect(liquid_balance.toString()).to.equal(ethers.utils.parseUnits("1000", 6).toString());
    expect(lockedBalance.toString()).to.equal(ethers.utils.parseUnits("1000", 6).toString());

    // console.log('Locked balance #2', lockedBalance.toString());
    // console.log('Liquid balance #2', liquid_balance.toString());

    liquid_balance = await accountQuery.queryTokenAmount(3, 1, registrarConfig.usdcAddress);
    lockedBalance = await accountQuery.queryTokenAmount(3, 0, registrarConfig.usdcAddress);

    expect(liquid_balance.toString()).to.equal(ethers.utils.parseUnits("1000", 6).toString());
    expect(lockedBalance.toString()).to.equal(ethers.utils.parseUnits("1000", 6).toString());

    // console.log('Locked balance #3', lockedBalance.toString());
    // console.log('Liquid balance #3', liquid_balance.toString());
  });

  it("Should add 1 more index fund with member 1,3", async function () {
    // create an index fund using the ap team multisig

    const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
    APMultisig = await ethers.getContractAt("APTeamMultiSig", apMultisigAddress);

    const indexFund = await ethers.getContractAt("IndexFund", deployRes.addresses.indexFund);

    let data = indexFund.interface.encodeFunctionData("createIndexFund", [
      "Test Fund",
      "Test fund created for tesing index fund contract",
      [1, 3],
      true,
      50,
      parseInt(Date.now() / 1000) + 24 * 60 * 60 * 90,
      0,
    ]);

    let tx2 = await APMultisig.connect(admin1).submitTransaction(
      "Create Index Fund",
      "Proposal to create index fund for testing",
      indexFund.address,
      0,
      data
    );

    let tx2Receipt = await tx2.wait();

    tx2 = await APMultisig.connect(admin2).confirmTransaction(
      tx2Receipt.events[0].args.transactionId
    );

    tx2Receipt = await tx2.wait();

    let flag = 1;
    for (let i = 0; i < tx2Receipt.events.length; i++) {
      if (tx2Receipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    // index fund created with id 2

    let fundDetails = await indexFund.queryFundDetails(2);

    expect(fundDetails.members).to.deep.equal([1, 3]);
    expect(fundDetails.name).to.equal("Test Fund");
    expect(fundDetails.splitToLiquid).to.equal(50);
  });

  it("Should add 3000 funding goal to index fund config", async function () {
    const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
    APMultisig = await ethers.getContractAt("APTeamMultiSig", apMultisigAddress);

    const indexFund = await ethers.getContractAt("IndexFund", deployRes.addresses.indexFund);

    let state = await indexFund.queryState();

    expect(state.totalFunds).to.be.equal(2, "Total funds should be 2");
    expect(state.activeFund).to.be.equal(1, "Active fund should be 1");

    let config = await indexFund.queryConfig();

    expect(config.fundingGoal).to.be.equal(10000000000, "Funding goal should be 10000000000");

    // update config funding goal set to 1000 USDC

    let data = indexFund.interface.encodeFunctionData("updateConfig", [
      [500, 30, ethers.utils.parseUnits("3000", 6)],
    ]);

    let tx2 = await APMultisig.connect(admin1).submitTransaction(
      "Update Index Fund Config",
      "Proposal to update index fund config",
      indexFund.address,
      0,
      data
    );

    let tx2Receipt = await tx2.wait();

    tx2 = await APMultisig.connect(admin2).confirmTransaction(
      tx2Receipt.events[0].args.transactionId
    );

    tx2Receipt = await tx2.wait();

    let flag = 1;
    for (let i = 0; i < tx2Receipt.events.length; i++) {
      if (tx2Receipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    config = await indexFund.queryConfig();

    expect(config.fundingGoal).to.be.equal(
      ethers.utils.parseUnits("3000", 6),
      "Funding goal should be 3000 USDC"
    );
  });

  it("Should donate to active fund 9000 USDC", async function () {
    // All funds have locked and liquid balance of 2000
    // total 9000 USDC is donated via index fund
    // initially active fund is 1 with endowment 1,2,3 with 3000 USDC distributed equally
    // next active fund is 2 with endowment 1,3 with 3000 USDC distributed equally
    // next active fund is 1 with endowment 1,2,3 with 3000 USDC distributed equally

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );

    const indexFund = await ethers.getContractAt("IndexFund", deployRes.addresses.indexFund);

    // donate to index fund

    let donor = addrs[0];

    const MockERC20 = await ethers.getContractAt("MockUSDC", registrarConfig.usdcAddress);

    await MockERC20.connect(deployer).transfer(
      addrs[0].address,
      ethers.utils.parseUnits("9000", 6)
    );

    await MockERC20.connect(addrs[0]).approve(
      indexFund.address,
      ethers.utils.parseUnits("9000", 6)
    );

    await indexFund
      .connect(donor)
      .depositERC20(
        donor.address,
        [0, 50],
        [0, ethers.utils.parseUnits("9000", 6), registrarConfig.usdcAddress, "USDC"]
      );

    let liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
    let lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

    // expect 2750 USDC in liquid balance because 1000 +  1) (3000/(3))/2 = 500 2) (3000/(2))/2 = 750 3) (3000/(3))/2 = 500
    // 1000 + 500 + 750 + 500 = 2750 USDC
    expect(liquid_balance.toString()).to.equal(ethers.utils.parseUnits("2750", 6).toString());
    expect(lockedBalance.toString()).to.equal(ethers.utils.parseUnits("2750", 6).toString());

    // console.log('Locked balance #1', lockedBalance.toString());
    // console.log('Liquid balance #1', liquid_balance.toString());

    liquid_balance = await accountQuery.queryTokenAmount(2, 1, registrarConfig.usdcAddress);
    lockedBalance = await accountQuery.queryTokenAmount(2, 0, registrarConfig.usdcAddress);

    // expect 2750 USDC in liquid balance because 1000 +  1) (3000/(3))/2 = 500  2) (3000/(3))/2 = 500
    // 1000 + 500  + 500 = 2000 USDC
    expect(liquid_balance.toString()).to.equal(ethers.utils.parseUnits("2000", 6).toString());
    expect(lockedBalance.toString()).to.equal(ethers.utils.parseUnits("2000", 6).toString());

    // console.log('Locked balance #2', lockedBalance.toString());
    // console.log('Liquid balance #2', liquid_balance.toString());

    liquid_balance = await accountQuery.queryTokenAmount(3, 1, registrarConfig.usdcAddress);
    lockedBalance = await accountQuery.queryTokenAmount(3, 0, registrarConfig.usdcAddress);

    // expect 2750 USDC in liquid balance because 1000 +  1) (3000/(3))/2 = 500 2) (3000/(2))/2 = 750 3) (3000/(3))/2 = 500
    // 1000 + 500 + 750 + 500 = 2750 USDC
    expect(liquid_balance.toString()).to.equal(ethers.utils.parseUnits("2750", 6).toString());
    expect(lockedBalance.toString()).to.equal(ethers.utils.parseUnits("2750", 6).toString());

    // console.log('Locked balance #3', lockedBalance.toString());
    // console.log('Liquid balance #3', liquid_balance.toString());

    // console.log(await MockERC20.balanceOf(deployRes.addresses.account));

    let involvedFunds = await indexFund.queryInvolvedFunds(1);

    expect(involvedFunds[0].id).to.equal(1);
    expect(involvedFunds[1].id).to.equal(2);
  });
});
