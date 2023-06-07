const {expect, assert} = require("chai");
const {ethers, artifacts} = require("hardhat");
const Web3 = require("web3");
const web3 = new Web3();
let {main} = require("../../scripts/deployAngelProtocol");
const endowmentData = require("../data/endowment.js");
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const {CONFIG} = require("../../config/index");
const MockDate = require("mockdate");
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

var buyer1;
var buyer2;
var buyer3;

var buyer4;

async function moveBlocks(amount) {
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
}

describe("SubDao test", function () {
  let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
  let deployRes;
  let subdaoTokenBalance;

  let registrar;
  let registrarConfig;

  this.beforeAll(async function () {
    [deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
    deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script

    buyer1 = addrs[0];
    buyer2 = addrs[1];
    buyer3 = addrs[2];
    buyer4 = addrs[3];

    registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    registrarConfig = await registrar.queryConfig();
  });

  it("Should setup a endowment without sub dao", async function () {
    let endowmentConfig = await endowmentData.getCreateEndowmentConfig(
      deployer.address,
      [admin1.address, admin2.address, admin3.address],
      1,
      false
    );
    endowmentConfig.owner = deployer.address;

    // Setup dao with subdao bonding token (such that it has the execute donor match function)
    // bonding curve reserve token is DAI. i.e subdao token can be bought with DAI or donation matched.
    // curve type is 1, i.e linear bonding curve
    // token type is 2 i.e bonding curve token

    // dao should use halo token
    account = await ethers.getContractAt("AccountsCreateEndowment", deployRes.addresses.account);

    let tx = await account.createEndowment(endowmentConfig);

    await tx.wait();

    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

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

    let depositTxnReceipt = await depositTxn.wait();

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

  it("Should set up sub dao for the endowment", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const endowmentMultisig = await ethers.getContractAt("EndowmentMultiSig", endowment.owner);

    let endowmentMultisigID = await endowmentMultisig.ENDOWMENT_ID();
    // console.log('Endowment Multisig Id', endowmentMultisigID.toString());
    expect(endowmentMultisigID.toString(), "Multisig for ID 1 deployed").to.equal("1");

    let endowmentOwners = await endowmentMultisig.getOwners();
    // console.log('Endowment Owners', endowmentOwners);
    expect(endowmentOwners, "Endowment owners are multisig owners").to.deep.equal([
      admin1.address,
      admin2.address,
      admin3.address,
    ]);

    expect(endowment.owner, "Endowment owner is not deployer, new owner is multisig").not.equal(
      deployer.address
    );

    let setUpDao = await ethers.getContractAt("AccountsDaoEndowments", deployRes.addresses.account);

    let dao = {
      quorum: 10,
      threshold: 10,
      votingPeriod: 10,
      timelockPeriod: 10,
      expirationPeriod: 10,
      proposalDeposit: 0,
      snapshotPeriod: 10,
      token: {
        token: 2,
        data: {
          existingData: registrarConfig.haloToken,
          newCw20InitialSupply: "100000",
          newCw20Name: "TEST",
          newCw20Symbol: "TEST",
          bondingCurveCurveType: {
            curve_type: 1,
            data: {
              value: 0, // TODO: not used in code
              scale: 0, // TODO: not used in code
              slope: 0, // TODO: not used in code
              power: 0, // TODO: not used in code
            },
          },
          bondingCurveName: "TEST",
          bondingCurveSymbol: "TEST",
          bondingCurveDecimals: 18,
          bondingCurveReserveDenom: deployRes.addresses.dai,
          bondingCurveReserveDecimals: 18,
          bondingCurveUnbondingPeriod: 0,
        },
      },
    };

    const data = setUpDao.interface.encodeFunctionData("setupDao", [1, dao]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("Set up dao", "Set up dao", deployRes.addresses.account, 0, data);

    let txnReceipt = await tx.wait();

    let txId = txnReceipt.events[0].args.transactionId;

    tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

    let endowmentMultisigReceipt = await tx.wait();

    let flag = 1;
    for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    endowment = await accountQuery.queryEndowmentDetails(1);

    expect(endowment.dao != ADDRESS_ZERO, "DAO Created successfully").to.equal(true);

    let daoContract = await ethers.getContractAt("ProxyContract", endowment.dao);

    let admin = await daoContract.getAdmin();
    assert(admin === proxyAdmin.address, "invalid admin address");
    let implementation = await daoContract.getImplementation();
    console.log("Implementation", implementation);
  });

  it("Should buy subdao token with dai", async function () {
    const daiToken = await ethers.getContractAt("MockERC20", deployRes.addresses.dai);

    let balance = await daiToken.balanceOf(deployer.address);

    assert(balance.gt(ethers.utils.parseUnits("10000", 18)), "Deployer should have some dai");

    let tx1 = await daiToken
      .connect(deployer)
      .transfer(buyer1.address, ethers.utils.parseUnits("3000", 18));
    let tx2 = await daiToken
      .connect(deployer)
      .transfer(buyer2.address, ethers.utils.parseUnits("3000", 18));
    let tx3 = await daiToken
      .connect(deployer)
      .transfer(buyer3.address, ethers.utils.parseUnits("3000", 18));
    let tx4 = await daiToken
      .connect(deployer)
      .transfer(buyer4.address, ethers.utils.parseUnits("1000", 18));

    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdaoToken = await ethers.getContractAt("SubDaoToken", endowment.daoToken);

    //buyer 1
    await daiToken
      .connect(buyer1)
      .approve(subdaoToken.address, ethers.utils.parseUnits("3000", 18));

    let tx = await subdaoToken.connect(buyer1).executeBuyCw20(ethers.utils.parseUnits("3000", 18));

    await tx.wait();

    //buyer 2
    await daiToken
      .connect(buyer2)
      .approve(subdaoToken.address, ethers.utils.parseUnits("3000", 18));

    tx = await subdaoToken.connect(buyer2).executeBuyCw20(ethers.utils.parseUnits("3000", 18));

    await tx.wait();

    //buyer 3
    await daiToken
      .connect(buyer3)
      .approve(subdaoToken.address, ethers.utils.parseUnits("3000", 18));

    tx = await subdaoToken.connect(buyer3).executeBuyCw20(ethers.utils.parseUnits("3000", 18));

    await tx.wait();

    //buyer 4
    await daiToken
      .connect(buyer4)
      .approve(subdaoToken.address, ethers.utils.parseUnits("1000", 18));

    tx = await subdaoToken.connect(buyer4).executeBuyCw20(ethers.utils.parseUnits("1000", 18));

    await tx.wait();
  });

  it("Should lock subdao token to get 900lv", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdaoToken = await ethers.getContractAt("SubDaoToken", endowment.daoToken);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    let subdaoConfig = await subdao.queryConfig();

    let lockupAddress = subdaoConfig.veToken;

    const lockup = await ethers.getContractAt("IncentivisedVotingLockup", lockupAddress);

    console.log(
      "Balance of buyer SD Token before lockup ",
      (await subdaoToken.balanceOf(buyer1.address)).toString()
    );

    let buyer1Balance = await subdaoToken.balanceOf(buyer1.address);

    await subdaoToken.connect(buyer1).approve(lockup.address, buyer1Balance);

    let tx2 = await lockup
      .connect(buyer1)
      .createLock(buyer1Balance, parseInt(Date.now() / 1000) + 90 * 24 * 60 * 60);

    await tx2.wait();

    console.log(
      "Balance of buyer SD Token after lockup ",
      (await subdaoToken.balanceOf(buyer1.address)).toString()
    );

    console.log(
      "Balance of voting Token after lockup",
      (await lockup.balanceOf(buyer1.address)).toString()
    );

    console.log(
      "Balance of buyer SD Token before lockup ",
      (await subdaoToken.balanceOf(buyer2.address)).toString()
    );

    let buyer2Balance = await subdaoToken.balanceOf(buyer2.address);

    await subdaoToken.connect(buyer2).approve(lockup.address, buyer2Balance);

    tx2 = await lockup
      .connect(buyer2)
      .createLock(buyer2Balance, parseInt(Date.now() / 1000) + 90 * 24 * 60 * 60);

    await tx2.wait();

    console.log(
      "Balance of buyer SD Token after lockup ",
      (await subdaoToken.balanceOf(buyer2.address)).toString()
    );

    console.log(
      "Balance of voting Token after lockup",
      (await lockup.balanceOf(buyer2.address)).toString()
    );

    console.log(
      "Balance of buyer SD Token before lockup ",
      (await subdaoToken.balanceOf(buyer3.address)).toString()
    );

    let buyer3Balance = await subdaoToken.balanceOf(buyer3.address);

    await subdaoToken.connect(buyer3).approve(lockup.address, buyer3Balance);

    tx2 = await lockup
      .connect(buyer3)
      .createLock(buyer3Balance, parseInt(Date.now() / 1000) + 90 * 24 * 60 * 60);

    await tx2.wait();

    console.log(
      "Balance of buyer SD Token after lockup ",
      (await subdaoToken.balanceOf(buyer3.address)).toString()
    );

    console.log(
      "Balance of voting Token after lockup",
      (await lockup.balanceOf(buyer3.address)).toString()
    );
  });

  it("create poll to change the endowment withdraw fees", async function () {
    moveBlocks(1);
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    const account = await ethers.getContractAt(
      "AccountsUpdateEndowmentSettingsController",
      deployRes.addresses.account
    );

    let UpdateEndowmentFeeRequest = {
      id: 1,
      earningsFee: {
        payoutAddress: ADDRESS_ZERO,
        feePercentage: 0,
        active: false,
      },
      depositFee: {
        payoutAddress: ADDRESS_ZERO,
        feePercentage: 0,
        active: false,
      },
      withdrawFee: {
        payoutAddress: addrs[4].address,
        feePercentage: 10,
        active: true,
      },
      balanceFee: {
        payoutAddress: ADDRESS_ZERO,
        feePercentage: 0,
        active: false,
      },
    };

    let data = account.interface.encodeFunctionData("updateEndowmentFees", [
      UpdateEndowmentFeeRequest,
    ]);

    let ExecuteData = {
      order: [1],
      contractAddress: [deployRes.addresses.account],
      execution_message: [data],
    };

    let tx = await subdao.createPoll(
      0,
      "Creating a poll",
      "creating a poll to change the withdrawal fees",
      "https://dumylink.com",
      ExecuteData
    );

    await tx.wait();
  });

  it("cast vote for the poll", async function () {
    //take poll id 1 and cast vote for it from buyer1, buyer2, buyer3
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    let vote1 = await subdao.connect(buyer1).castVote(1, 0);
    await vote1.wait();

    let vote2 = await subdao.connect(buyer2).castVote(1, 0);
    await vote2.wait();

    let vote3 = await subdao.connect(buyer3).castVote(1, 0);
    await vote3.wait();
  });

  it("should end the poll once voting time is over", async function () {
    moveBlocks(100);
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    moveBlocks(2);

    let endpoll = await subdao.endPoll(1);
    await endpoll.wait();
  });

  it("execute the passed poll", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    let tx = await subdao.executePoll(1);
    await tx.wait();

    endowment = await accountQuery.queryEndowmentDetails(1);

    assert.equal(endowment.withdrawFee.feePercentage, 10);
  });

  it("grant allowance to the subDao to spend funds", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const endowmentMultisig = await ethers.getContractAt("EndowmentMultiSig", endowment.owner);

    const allowance = await ethers.getContractAt("AccountsAllowance", deployRes.addresses.account);

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    let AllowanceData = {
      height: 0,
      timestamp: 0,
      expires: false,
      allowanceAmount: ethers.utils.parseUnits("1000", 6),
      configured: true,
    };

    let data = allowance.interface.encodeFunctionData("manageAllowances", [
      1,
      "add",
      endowment.dao,
      AllowanceData,
      registrarConfig.usdcAddress,
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction(
        "Set up allowance",
        "Set up allowance",
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
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);
  });

  it("spend the fund allowance is granted for", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    let AccountsAllowance = await ethers.getContractAt(
      "AccountsAllowance",
      deployRes.addresses.account
    );

    // let spendAllowance_data = {
    //   _id: 1,
    //   _amount: ethers.utils.parseUnits('100', 6),
    //   _tokenAddress: registrarConfig.usdcAddress,
    // };
    console.log(registrarConfig.usdcAddress);

    let data = AccountsAllowance.interface.encodeFunctionData("spendAllowance", [
      1,
      registrarConfig.usdcAddress,
      ethers.utils.parseUnits("100", 6),
      endowment.dao,
    ]);

    let ExecuteData = {
      order: [1],
      contractAddress: [deployRes.addresses.account],
      execution_message: [data],
    };

    let tx = await subdao.createPoll(
      0,
      "Creating a poll",
      "creating a poll to withdraw money",
      "https://dumylink.com",
      ExecuteData
    );

    await tx.wait();

    //take poll id 1 and cast vote for it from buyer1, buyer2, buyer3
    // const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
    // let endowment = await accountQuery.queryEndowmentDetails(1);

    // const subdao = await ethers.getContractAt('SubDao', endowment.dao);
    moveBlocks(20);

    let vote1 = await subdao.connect(buyer1).castVote(2, 0);
    await vote1.wait();

    let vote2 = await subdao.connect(buyer2).castVote(2, 0);
    await vote2.wait();

    let vote3 = await subdao.connect(buyer3).castVote(2, 0);
    await vote3.wait();

    let endpoll = await subdao.endPoll(2);
    await endpoll.wait();

    const MockERC20 = await ethers.getContractAt("MockUSDC", registrarConfig.usdcAddress);

    let x = await MockERC20.balanceOf(endowment.dao);

    let execute = await subdao.executePoll(2);
    await execute.wait();

    let y = await MockERC20.balanceOf(endowment.dao);

    assert.equal(
      parseInt(y.toString()) - parseInt(x.toString()),
      ethers.utils.parseUnits("100", 6)
    );
  });

  it("Expire the poll instead of executing it", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    let AccountsAllowance = await ethers.getContractAt(
      "AccountsAllowance",
      deployRes.addresses.account
    );

    // let spendAllowance_data = {
    //   _id: 1,
    //   _amount: ethers.utils.parseUnits('100', 6),
    //   _tokenAddress: registrarConfig.usdcAddress,
    // };
    console.log(registrarConfig.usdcAddress);

    let data = AccountsAllowance.interface.encodeFunctionData("spendAllowance", [
      1,
      registrarConfig.usdcAddress,
      ethers.utils.parseUnits("100", 6),
      endowment.dao,
    ]);

    let ExecuteData = {
      order: [1],
      contractAddress: [deployRes.addresses.account],
      execution_message: [data],
    };

    let tx = await subdao.createPoll(
      0,
      "Creating a poll",
      "creating a poll to withdraw money",
      "https://dumylink.com",
      ExecuteData
    );

    await tx.wait();

    //take poll id 1 and cast vote for it from buyer1, buyer2, buyer3
    // const accountQuery = await ethers.getContractAt('AccountsQueryEndowments', deployRes.addresses.account);
    // let endowment = await accountQuery.queryEndowmentDetails(1);

    // const subdao = await ethers.getContractAt('SubDao', endowment.dao);
    moveBlocks(20);
    let vote1 = await subdao.connect(buyer1).castVote(3, 0);
    await vote1.wait();

    let vote2 = await subdao.connect(buyer2).castVote(3, 0);
    await vote2.wait();

    let vote3 = await subdao.connect(buyer3).castVote(3, 0);
    await vote3.wait();

    moveBlocks(40);

    let endpoll = await subdao.endPoll(3);
    await endpoll.wait();

    moveBlocks(20);
    let execute = await subdao.expirePoll(3);
    await execute.wait();
  });

  it("update the config of the endowment", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    let curOwner = endowment.owner;
    let curQuorum = 10;
    let curThreshold = 10;
    let curVotingperiod = 10;
    let curTimelockperiod = 10;
    let curExpirationperiod = 10;
    let curProposaldeposit = 10;
    let curSnapshotperiod = 10;

    const endowmentMultisig = await ethers.getContractAt("EndowmentMultiSig", endowment.owner);

    let data = subdao.interface.encodeFunctionData("updateConfig", [
      curOwner,
      curQuorum,
      curThreshold,
      curVotingperiod,
      curTimelockperiod,
      curExpirationperiod,
      curProposaldeposit,
      curSnapshotperiod,
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("Update config", "Update config", endowment.dao, 0, data);

    let txnReceipt = await tx.wait();

    let txId = txnReceipt.events[0].args.transactionId;

    tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

    let endowmentMultisigReceipt = await tx.wait();

    let flag = 1;
    for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    let endowmentConfig = await subdao.queryConfig();

    assert.equal(endowmentConfig.quorum, curQuorum);
  });

  it("create the poll with the deposit", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdaoToken = await ethers.getContractAt("SubDaoToken", endowment.daoToken);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    let AccountsAllowance = await ethers.getContractAt(
      "AccountsAllowance",
      deployRes.addresses.account
    );

    let data = AccountsAllowance.interface.encodeFunctionData("spendAllowance", [
      1,
      registrarConfig.usdcAddress,
      ethers.utils.parseUnits("100", 6),
      endowment.dao,
    ]);

    let ExecuteData = {
      order: [1],
      contractAddress: [deployRes.addresses.account],
      execution_message: [data],
    };

    subdaoToken.connect(buyer4).approve(subdao.address, ethers.utils.parseUnits("10", 6));

    let tx1 = await subdao
      .connect(buyer4)
      .createPoll(
        ethers.utils.parseUnits("10", 6),
        "Creating a poll",
        "creating a poll to withdraw money",
        "https://dumylink.com",
        ExecuteData
      );

    await tx1.wait();

    moveBlocks(20);

    let vote1 = await subdao.connect(buyer1).castVote(4, 0);
    await vote1.wait();

    let vote2 = await subdao.connect(buyer2).castVote(4, 0);
    await vote2.wait();

    let vote3 = await subdao.connect(buyer3).castVote(4, 0);
    await vote3.wait();

    moveBlocks(5000);
    let endpoll = await subdao.endPoll(4);
    await endpoll.wait();

    moveBlocks(20);

    let execute = await subdao.executePoll(4);
    await execute.wait();
  });

  it("update the registrar contract address", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    let endowment = await accountQuery.queryEndowmentDetails(1);

    const subdao = await ethers.getContractAt("SubDao", endowment.dao);

    let curSwapfactory = addrs[1].address;
    let curVetoken = addrs[0].address;

    const endowmentMultisig = await ethers.getContractAt("EndowmentMultiSig", endowment.owner);

    let data = subdao.interface.encodeFunctionData("registerContract", [
      curVetoken,
      curSwapfactory,
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("Update config", "Update config", endowment.dao, 0, data);

    let txnReceipt = await tx.wait();

    let txId = txnReceipt.events[0].args.transactionId;

    tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

    let endowmentMultisigReceipt = await tx.wait();

    let flag = 1;
    for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    let endowmentConfig = await subdao.queryConfig();

    assert.equal(endowmentConfig.veToken, curVetoken);
  });
});
