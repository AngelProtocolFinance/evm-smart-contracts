const {expect} = require("chai");
const {ethers, artifacts} = require("hardhat");
const Web3 = require("web3");
const web3 = new Web3();
let {main} = require("../../scripts/deployAngelProtocol");
const endowmentData = require("../data/endowment.js");
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const MockDate = require("mockdate");

// Create a charity endowment using the charity proposal contract
describe("Charity Endowment Creation and Approval from Application Team", function () {
  let deployer, addrs, proxyAdmin;
  let deployRes;
  let endowmentConfig;

  // let endowmentTxnReceipt;
  let endowment;

  let charityApplications;
  let charityProposal;

  MockDate.set(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000));

  this.beforeAll(async function () {
    [deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
    deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script

    // Fetch the USDC address from registrart config

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
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
    charityApplications = await ethers.getContractAt(
      "CharityApplication",
      deployRes.addresses.charityApplicationsAddress
    );
    let tx = await charityApplications
      .connect(addrs[1])
      .proposeCharity(endowmentConfig, "Charity Proposal Testing");

    let charityProposalTxnReceipt = await tx.wait();

    // console.log(charityProposalTxnReceipt.events);

    charityProposal = await charityApplications.proposals(1);
    // console.log(charityProposal);

    expect(charityProposal[0], "Proposal ID is 1").to.equal(1);
    expect(charityProposal[1], "Proposal is proposed by proper proposer").to.equal(
      addrs[1].address
    );
    expect(charityProposal[2].name, "Proposal is for proper charity").to.equal("Test Endowment");
  });
  it("Applications Team should be able to approve creation of charity", async function () {
    // create a proposal on Applications Multisig to send approval for proposal with ID 1

    const applicationsMultisig = await ethers.getContractAt(
      "ApplicationsMultiSig",
      deployRes.addresses.multisigAddress.ApplicationsMultiSig
    );

    let tx = await applicationsMultisig
      .connect(admin1)
      .submitTransaction(
        "Approve Charity Proposal",
        "Approve Charity Proposal Testing ",
        deployRes.addresses.charityApplicationsAddress,
        0,
        charityApplications.interface.encodeFunctionData("approveCharity", [1])
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
      if (applicationsMultisigTxnReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }
    expect(flag === 1, "Transaction executed successfully").to.equal(true);
  });
  it("Should have created a charity endowments on the accounts contract with id 1", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    endowment = await accountQuery.queryEndowmentDetails(1);
    // console.log(endowment);
    expect(endowment.endowType, "Endowment is of type charity").to.equal(0);
  });

  it("Should have created a new endowment multisig and set owner of endowment to multisig", async function () {
    const endowmentMultisig = await ethers.getContractAt("EndowmentMultiSig", endowment.owner);

    let endowmentMultisigID = await endowmentMultisig.ENDOWMENT_ID();
    // console.log('Endowment Multisig Id', endowmentMultisigID.toString());
    expect(endowmentMultisigID.toString(), "Owner for endowment is multisig").to.equal("1");

    let endowmentOwners = await endowmentMultisig.getOwners();
    // console.log('Endowment Owners', endowmentOwners);
    expect(endowmentOwners, "Charity endowment owners are multisig owners").to.deep.equal([
      admin1.address,
      admin2.address,
      admin3.address,
    ]);

    expect(endowment.owner, "Endowment owner is not deployer, new owner is multisig").not.equal(
      deployer.address
    );
  });

  it("Should be able to accept deposits and withdraw liquid deposits via txn from the endowment multisg ", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );

    let donor = addrs[0];

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    // console.log('Fetched USDC address', registrarConfig.usdcAddress);

    const MockERC20 = await ethers.getContractAt("MockUSDC", registrarConfig.usdcAddress);

    await MockERC20.connect(deployer).transfer(donor.address, ethers.utils.parseUnits("10000", 6));

    // Deposit to accounts

    const accountDeposit = await ethers.getContractAt(
      "AccountsDepositWithdrawEndowments",
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
    let lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);
    // console.log(depositTxnReceipt.events);

    console.log("Locked balance", lockedBalance.toString());
    console.log("Liquid balance", liquid_balance.toString());
    expect(lockedBalance.toString(), "Locked balance is 500").to.equal(
      ethers.utils.parseUnits("500", 6).toString()
    );
    expect(liquid_balance.toString(), "Liquid balance is 500").to.equal(
      ethers.utils.parseUnits("500", 6).toString()
    );

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

    const data = accountDeposit.interface.encodeFunctionData("withdraw", [
      1,
      1,
      admin2.address,
      [registrarConfig.usdcAddress],
      [ethers.utils.parseUnits("100", 6)],
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction(
        "Withdraw",
        "withdraw liquid in hand cash",
        deployRes.addresses.account,
        0,
        data
      );

    let txnReceipt = await tx.wait();

    let txId = txnReceipt.events[0].args.transactionId;

    // approve the transaction for admin2

    tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

    let endowmentMultisigReceipt = await tx.wait();
    // console.log(endowmentMultisigReceipt.events);
    let flag = 1;
    for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    let balance = await MockERC20.balanceOf(admin2.address);

    expect(balance.toString(), "Balance is 100").to.equal(
      ethers.utils.parseUnits("100", 6).toString()
    );

    liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);

    expect(liquid_balance.toString(), "Liquid balance is 400").to.equal(
      ethers.utils.parseUnits("400", 6).toString()
    );

    expect(await MockERC20.balanceOf(deployRes.addresses.account), "Total Balance is 900").to.equal(
      ethers.utils.parseUnits("900", 6).toString()
    );
  });

  it("Should be able to accept deposits and withdraw locked deposits via txn from the endowment multisig, AP team multisig and Locked withdraw contract ", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );

    let donor = addrs[0];

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    // console.log('Fetched USDC address', registrarConfig.usdcAddress);

    const MockERC20 = await ethers.getContractAt("MockUSDC", registrarConfig.usdcAddress);

    await MockERC20.connect(deployer).transfer(donor.address, ethers.utils.parseUnits("10000", 6));

    // Deposit to accounts

    const accountDeposit = await ethers.getContractAt(
      "AccountsDepositWithdrawEndowments",
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
    let lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);
    // console.log(depositTxnReceipt.events);

    // console.log('Locked balance', lockedBalance.toString());
    // console.log('Liquid balance', liquid_balance.toString());
    expect(lockedBalance.toString(), "Locked balance is 1000").to.equal(
      ethers.utils.parseUnits("1000", 6).toString()
    );
    expect(liquid_balance.toString(), "Liquid balance is 900").to.equal(
      ethers.utils.parseUnits("900", 6).toString()
    );

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

    const lockedWithdraw = await ethers.getContractAt(
      "LockedWithdraw",
      deployRes.addresses.lockedWithdraw
    );

    const data = lockedWithdraw.interface.encodeFunctionData("propose", [
      1,
      admin2.address,
      [registrarConfig.usdcAddress],
      [ethers.utils.parseUnits("100", 6)],
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("Locked Withdraw", "withdraw locked", lockedWithdraw.address, 0, data);

    let txnReceipt = await tx.wait();

    let txId = txnReceipt.events[0].args.transactionId;

    // approve the transaction for admin2

    tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

    let endowmentMultisigReceipt = await tx.wait();

    let flag = 1;
    for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    // console.log(endowmentMultisigReceipt.events);

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    // approve from ap team multisig

    const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
    APMultisig = await ethers.getContractAt("APTeamMultiSig", apMultisigAddress);

    let apdata = lockedWithdraw.interface.encodeFunctionData("approve", [1]);

    tx = await APMultisig.connect(admin1).submitTransaction(
      "Locked Withdraw",
      "charity approval for withdraw locked",
      lockedWithdraw.address,
      0,
      apdata
    );

    txnReceipt = await tx.wait();

    // console.log(txnReceipt.events);

    txId = txnReceipt.events[0].args.transactionId;

    // approve the transaction for admin2

    console.log("Accounts", deployRes.addresses.account);

    tx = await APMultisig.connect(admin2).confirmTransaction(txId);

    apTeamMultisigReceipt = await tx.wait();

    flag = 1;
    for (let i = 0; i < apTeamMultisigReceipt.events.length; i++) {
      if (apTeamMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    expect(await MockERC20.balanceOf(admin2.address), "Balance of address 2 is 200").to.equal(
      ethers.utils.parseUnits("200", 6).toString()
    );

    liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
    lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

    // expect locked balance is 900
    expect(lockedBalance.toString(), "Locked balance is 900").to.equal(
      ethers.utils.parseUnits("900", 6).toString()
    );

    // expect liquid balance is 900
    expect(liquid_balance.toString(), "Liquid balance is 900").to.equal(
      ethers.utils.parseUnits("900", 6).toString()
    );

    // expect total balance is 1800
    expect(
      await MockERC20.balanceOf(deployRes.addresses.account),
      "Total balance is 1800"
    ).to.equal(ethers.utils.parseUnits("1800", 6).toString());

    // second locked withdraw to check if it works fine

    tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("Locked Withdraw", "withdraw locked", lockedWithdraw.address, 0, data);

    txnReceipt = await tx.wait();

    txId = txnReceipt.events[0].args.transactionId;

    // approve the transaction for admin2

    tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

    endowmentMultisigReceipt = await tx.wait();

    flag = 1;
    for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    // console.log(endowmentMultisigReceipt.events);

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    // approve from ap team multisig

    tx = await APMultisig.connect(admin1).submitTransaction(
      "Locked Withdraw",
      "charity approval for withdraw locked",
      lockedWithdraw.address,
      0,
      apdata
    );

    txnReceipt = await tx.wait();

    // console.log(txnReceipt.events);

    txId = txnReceipt.events[0].args.transactionId;

    // approve the transaction for admin2

    console.log("Accounts", deployRes.addresses.account);

    tx = await APMultisig.connect(admin2).confirmTransaction(txId);

    apTeamMultisigReceipt = await tx.wait();

    flag = 1;
    for (let i = 0; i < apTeamMultisigReceipt.events.length; i++) {
      if (apTeamMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
    lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

    expect(await MockERC20.balanceOf(admin2.address), "Balance of address 2 is 300").to.equal(
      ethers.utils.parseUnits("300", 6).toString()
    );

    // expect locked balance is 800
    expect(lockedBalance.toString(), "Locked balance is 800").to.equal(
      ethers.utils.parseUnits("800", 6).toString()
    );

    // expect liquid balance is 900
    expect(liquid_balance.toString(), "Liquid balance is 900").to.equal(
      ethers.utils.parseUnits("900", 6).toString()
    );

    // expect total balance is 1700
    expect(
      await MockERC20.balanceOf(deployRes.addresses.account),
      "Total balance is 1700"
    ).to.equal(ethers.utils.parseUnits("1700", 6).toString());
  });

  it("Should be able to accept deposits, add another request after a locked withdraw is rejected ", async function () {
    const accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );

    let donor = addrs[0];

    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    // console.log('Fetched USDC address', registrarConfig.usdcAddress);

    const MockERC20 = await ethers.getContractAt("MockUSDC", registrarConfig.usdcAddress);

    await MockERC20.connect(deployer).transfer(donor.address, ethers.utils.parseUnits("10000", 6));

    // Deposit to accounts

    const accountDeposit = await ethers.getContractAt(
      "AccountsDepositWithdrawEndowments",
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
    let lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);
    // console.log(depositTxnReceipt.events);

    // console.log('Locked balance', lockedBalance.toString());
    // console.log('Liquid balance', liquid_balance.toString());
    expect(lockedBalance.toString(), "Locked balance is 1300").to.equal(
      ethers.utils.parseUnits("1300", 6).toString()
    );
    expect(liquid_balance.toString(), "Liquid balance is 1400").to.equal(
      ethers.utils.parseUnits("1400", 6).toString()
    );

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

    const lockedWithdraw = await ethers.getContractAt(
      "LockedWithdraw",
      deployRes.addresses.lockedWithdraw
    );

    const data = lockedWithdraw.interface.encodeFunctionData("propose", [
      1,
      admin2.address,
      [registrarConfig.usdcAddress],
      [ethers.utils.parseUnits("100", 6)],
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("Locked Withdraw", "withdraw locked", lockedWithdraw.address, 0, data);

    let txnReceipt = await tx.wait();

    let txId = txnReceipt.events[0].args.transactionId;

    // approve the transaction for admin2

    tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

    let endowmentMultisigReceipt = await tx.wait();

    let flag = 1;
    for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    // console.log(endowmentMultisigReceipt.events);

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    // approve from ap team multisig

    const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
    APMultisig = await ethers.getContractAt("APTeamMultiSig", apMultisigAddress);

    let apdata = lockedWithdraw.interface.encodeFunctionData("reject", [1]);

    tx = await APMultisig.connect(admin1).submitTransaction(
      "Locked Withdraw",
      "charity approval for withdraw locked",
      lockedWithdraw.address,
      0,
      apdata
    );

    txnReceipt = await tx.wait();

    // console.log(txnReceipt.events);

    txId = txnReceipt.events[0].args.transactionId;

    // approve the transaction for admin2

    console.log("Accounts", deployRes.addresses.account);

    tx = await APMultisig.connect(admin2).confirmTransaction(txId);

    apTeamMultisigReceipt = await tx.wait();

    flag = 1;
    for (let i = 0; i < apTeamMultisigReceipt.events.length; i++) {
      if (apTeamMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    expect(await MockERC20.balanceOf(admin2.address), "Balance of address 2 is 300").to.equal(
      ethers.utils.parseUnits("300", 6).toString()
    );

    liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
    lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

    expect(lockedBalance.toString(), "Locked balance is 1300").to.equal(
      ethers.utils.parseUnits("1300", 6).toString()
    );

    expect(liquid_balance.toString(), "Liquid balance is 1400").to.equal(
      ethers.utils.parseUnits("1400", 6).toString()
    );

    expect(
      await MockERC20.balanceOf(deployRes.addresses.account),
      "Total balance is 2700"
    ).to.equal(ethers.utils.parseUnits("2700", 6).toString());

    // second locked withdraw after reject to check if it works fine

    tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("Locked Withdraw", "withdraw locked", lockedWithdraw.address, 0, data);

    txnReceipt = await tx.wait();

    txId = txnReceipt.events[0].args.transactionId;

    // approve the transaction for admin2

    tx = await endowmentMultisig.connect(admin2).confirmTransaction(txId);

    endowmentMultisigReceipt = await tx.wait();

    flag = 1;
    for (let i = 0; i < endowmentMultisigReceipt.events.length; i++) {
      if (endowmentMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    apdata = lockedWithdraw.interface.encodeFunctionData("approve", [1]);
    // approve from ap team multisig

    tx = await APMultisig.connect(admin1).submitTransaction(
      "Locked Withdraw",
      "charity approval for withdraw locked",
      lockedWithdraw.address,
      0,
      apdata
    );

    txnReceipt = await tx.wait();

    txId = txnReceipt.events[0].args.transactionId;

    // approve the transaction for admin2

    console.log("Accounts", deployRes.addresses.account);

    tx = await APMultisig.connect(admin2).confirmTransaction(txId);

    apTeamMultisigReceipt = await tx.wait();

    flag = 1;
    for (let i = 0; i < apTeamMultisigReceipt.events.length; i++) {
      if (apTeamMultisigReceipt.events[i].event == "ExecutionFailure") {
        flag = 0;
        break;
      }
    }

    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    liquid_balance = await accountQuery.queryTokenAmount(1, 1, registrarConfig.usdcAddress);
    lockedBalance = await accountQuery.queryTokenAmount(1, 0, registrarConfig.usdcAddress);

    // expect(await MockERC20.balanceOf(admin2.address), 'Balance of address 2 is 400').to.equal(
    // 	ethers.utils.parseUnits('400', 6).toString()
    // );

    expect(lockedBalance.toString(), "Locked balance is 1200").to.equal(
      ethers.utils.parseUnits("1200", 6).toString()
    );

    expect(liquid_balance.toString(), "Liquid balance is 1400").to.equal(
      ethers.utils.parseUnits("1400", 6).toString()
    );

    expect(
      await MockERC20.balanceOf(deployRes.addresses.account),
      "Total balance is 2600"
    ).to.equal(ethers.utils.parseUnits("2600", 6).toString());
  });

  it("Should check if proper donation match is performed for all above donations", async () => {
    donor = addrs[0];
    let registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    let registrarConfig = await registrar.queryConfig();

    // console.log(registrarConfig);

    let haloToken = await ethers.getContractAt("ERC20", registrarConfig.haloToken);

    // up until now we have donated 1500 USDC (6 decimals) (500*3) to locked, for this we should have 40% match
    // 1500 * 40% = 600 Halo (18 decimals)

    console.log("Halo Balance for donor", await haloToken.balanceOf(donor.address));

    // This should be parseEthers after Xsqrt price change in uniswap pool creator
    expect(await haloToken.balanceOf(donor.address), "Halo balance of donor is 600").to.be.above(
      ethers.utils.parseUnits("590", 18)
    );
  });
});
