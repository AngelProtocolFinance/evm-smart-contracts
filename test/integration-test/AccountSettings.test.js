const {expect} = require("chai");
const {ethers, artifacts} = require("hardhat");
const Web3 = require("web3");
const web3 = new Web3();
let {main} = require("../../scripts/deployMain");
const endowmentData = require("../data/endowment.js");
const MockDate = require("mockdate");

async function moveBlocks(amount) {
  console.log("Moving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`Moved ${amount} blocks`);
}

// Create a charity endowment using the charity proposal contract
describe("Account Settings Controller", function () {
  let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
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

    account = await ethers.getContractAt("AccountsCreateEndowment", deployRes.addresses.account);

    let tx = await account.createEndowment(endowmentConfig);

    endowmentTxnReceipt = await tx.wait();

    accountQuery = await ethers.getContractAt(
      "AccountsQueryEndowments",
      deployRes.addresses.account
    );
    endowment = await accountQuery.queryEndowmentDetails(1);

    endowmentMultisig = await ethers.getContractAt("EndowmentMultiSig", endowment.owner);
  });
  it("should update endowment details", async function () {
    account = await ethers.getContractAt("AccountsUpdateEndowments", deployRes.addresses.account);
    let endowmentUpdateData = {
      id: 1,
      owner: deployer.address,
      endowType: endowmentConfig.endowType,
      name: "testing name",
      categories: endowmentConfig.categories,
      tier: endowmentConfig.tier,
      logo: "www.bestlogo.com",
      image: "www.bestimage.com",
      rebalance: {
        rebalanceLiquidInvestedProfits: false,
        lockedInterestsToLiquid: false,
        interest_distribution: 20,
        lockedPrincipleToLiquid: false,
        principle_distribution: 0,
      },
    };
    let data = account.interface.encodeFunctionData("updateEndowmentDetails", [
      endowmentUpdateData,
    ]);
    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction(
        "update endowment details",
        "update endowment details",
        account.address,
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

    endowment = await accountQuery.queryEndowmentDetails(1);

    expect(endowment.name === endowmentUpdateData.name, "Name updated successfully").to.equal(true);
    expect(endowment.logo === endowmentUpdateData.logo, "Logo updated successfully").to.equal(true);
    expect(endowment.image === endowmentUpdateData.image, "Image updated successfully").to.equal(
      true
    );
  });
  it("should update delegate address", async function () {
    delegate = addrs[0];

    account = await ethers.getContractAt("AccountsUpdateEndowments", deployRes.addresses.account);
    // set action to keccak256(abi.encodePacked("set"))
    const data = account.interface.encodeFunctionData("updateDelegate", [
      1,
      "allowlistedBeneficiaries",
      "set",
      delegate.address,
      Math.floor(Date.now() / 1000) + 360 * 24 * 60 * 60, // delegate expires in 360 days
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("update delegate", "update delegate", account.address, 0, data);
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

    // check if delegate address can change ignoreUserSplits

    account = await ethers.getContractAt(
      "AccountsUpdateEndowmentSettingsController",
      deployRes.addresses.account
    );
    let endowmentSettingsData = {
      id: 1,
      donationMatchActive: true,
      allowlistedBeneficiaries: [addrs[0].address],
      allowlistedContributors: [],
      maturity_allowlist_add: [],
      maturity_allowlist_remove: [],
      splitToLiquid: endowmentConfig.splitToLiquid,
      ignoreUserSplits: true,
    };
    await account.connect(delegate).updateEndowmentSettings(endowmentSettingsData);

    endowment = await accountQuery.queryEndowmentDetails(1);
    expect(
      endowment.allowlistedBeneficiaries.length === 1 &&
        endowment.allowlistedBeneficiaries[0] === addrs[0].address,
      "allowlisted beneficiaries updated successfully"
    ).to.equal(true);
  });
  it("should revert with the string `Unauthorized` when trying to update endowment details", async function () {
    account = await ethers.getContractAt("AccountsUpdateEndowments", deployRes.addresses.account);
    let endowmentUpdateData = {
      id: 1,
      owner: deployer.address,
      endowType: endowmentConfig.endowType,
      name: "testing name",
      categories: endowmentConfig.categories,
      tier: endowmentConfig.tier,
      logo: "www.bestlogo.com",
      image: "www.bestimage.com",
      rebalance: {
        rebalanceLiquidInvestedProfits: false,
        lockedInterestsToLiquid: false,
        interest_distribution: 20,
        lockedPrincipleToLiquid: false,
        principle_distribution: 0,
      },
    };
    await expect(
      account.connect(addrs[0]).updateEndowmentDetails(endowmentUpdateData)
    ).to.be.revertedWith("Unauthorized");
  });
  it("should check whether delegate's access expires after the specified time period", async function () {
    MockDate.set(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
    account = await ethers.getContractAt(
      "AccountsUpdateEndowmentSettingsController",
      deployRes.addresses.account
    );
    let endowmentSettingsData = {
      id: 1,
      donationMatchActive: true,
      allowlistedBeneficiaries: [addrs[1].address],
      allowlistedContributors: [],
      maturity_allowlist_add: [],
      maturity_allowlist_remove: [],
      splitToLiquid: endowmentConfig.splitToLiquid,
      ignoreUserSplits: true,
    };
    await account.connect(delegate).updateEndowmentSettings(endowmentSettingsData);

    endowment = await accountQuery.queryEndowmentDetails(1);
    // console.log(endowment.allowlistedBeneficiaries);
    expect(
      endowment.allowlistedBeneficiaries.length === 1 &&
        endowment.allowlistedBeneficiaries[0] === addrs[0].address,
      "allowlisted beneficiaries not updated as delegate has expired"
    ).to.equal(true);

    MockDate.reset();
  });
  it("should not be able to update endowment settings if delegate is revoked", async function () {
    account = await ethers.getContractAt("AccountsUpdateEndowments", deployRes.addresses.account);
    // set action to keccak256(abi.encodePacked("set"))
    const data = account.interface.encodeFunctionData("updateDelegate", [
      1,
      "allowlistedBeneficiaries",
      "revoke",
      delegate.address,
      Math.floor(Date.now() / 1000) + 360 * 24 * 60 * 60,
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("update delegate", "update delegate", account.address, 0, data);
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

    // try updating allowlisted beneficiaries via delegate
    account = await ethers.getContractAt(
      "AccountsUpdateEndowmentSettingsController",
      deployRes.addresses.account
    );
    let endowmentSettingsData = {
      id: 1,
      donationMatchActive: true,
      allowlistedBeneficiaries: [addrs[1].address],
      allowlistedContributors: [],
      maturity_allowlist_add: [],
      maturity_allowlist_remove: [],
      splitToLiquid: endowmentConfig.splitToLiquid,
      ignoreUserSplits: true,
    };
    await account.connect(delegate).updateEndowmentSettings(endowmentSettingsData);

    endowment = await accountQuery.queryEndowmentDetails(1);
    // console.log(endowment.allowlistedBeneficiaries);
    expect(
      endowment.allowlistedBeneficiaries.length === 1 &&
        endowment.allowlistedBeneficiaries[0] === addrs[0].address,
      "allowlisted beneficiaries not updated as delegate has expired"
    ).to.equal(true);
  });
  it("should update endowment settings through owner", async function () {
    account = await ethers.getContractAt(
      "AccountsUpdateEndowmentSettingsController",
      deployRes.addresses.account
    );
    let endowmentSettingsData = {
      id: 1,
      donationMatchActive: true,
      allowlistedBeneficiaries: [addrs[1].address],
      allowlistedContributors: [addrs[1].address],
      maturity_allowlist_add: [addrs[1].address, addrs[2].address],
      maturity_allowlist_remove: [addrs[2].address],
      splitToLiquid: endowmentConfig.splitToLiquid,
      ignoreUserSplits: false,
    };
    const data = account.interface.encodeFunctionData("updateEndowmentSettings", [
      endowmentSettingsData,
    ]);
    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction(
        "update endowment settings",
        "update endowment settings",
        account.address,
        0,
        data
      );
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
    expect(flag === 1, "Transaction executed successfully").to.equal(true);

    endowment = await accountQuery.queryEndowmentDetails(1);

    expect(
      endowment.allowlistedBeneficiaries.length === 1 &&
        endowment.allowlistedBeneficiaries[0] === addrs[1].address,
      "allowlisted beneficiaries not updated"
    ).to.equal(true);
    expect(
      endowment.allowlistedContributors.length === 1 &&
        endowment.allowlistedContributors[0] === addrs[1].address,
      "allowlisted contributors not updated"
    ).to.equal(true);
    expect(
      endowment.maturityAllowlist.length === 1 &&
        endowment.maturityAllowlist[0] === addrs[1].address,
      "maturity allowlist not updated"
    ).to.equal(true);
    // expect(endowment.splitToLiquid === endowmentConfig.splitToLiquid, 'split to liquid not updated').to.equal(true);
    expect(endowment.ignoreUserSplits === false, "ignore user splits not updated").to.equal(true);
  });

  it("should update endowment controller", async function () {
    account = await ethers.getContractAt(
      "AccountsUpdateEndowmentSettingsController",
      deployRes.addresses.account
    );
    endowmentConfig.settingsController.name.govControlled = true;
    const updateEndowmentControllerData = {
      id: 1,
      endowmentController: endowmentConfig.settingsController.endowmentController,
      name: endowmentConfig.settingsController.name,
      image: endowmentConfig.settingsController.image,
      logo: endowmentConfig.settingsController.logo,
      categories: endowmentConfig.settingsController.categories,
      splitToLiquid: endowmentConfig.settingsController.splitToLiquid,
      ignoreUserSplits: endowmentConfig.settingsController.ignoreUserSplits,
      allowlistedBeneficiaries: endowmentConfig.settingsController.allowlistedBeneficiaries,
      allowlistedContributors: endowmentConfig.settingsController.allowlistedContributors,
      maturityAllowlist: endowmentConfig.settingsController.maturityAllowlist,
      earningsFee: endowmentConfig.settingsController.earningsFee,
      depositFee: endowmentConfig.settingsController.depositFee,
      withdrawFee: endowmentConfig.settingsController.withdrawFee,
      balanceFee: endowmentConfig.settingsController.balanceFee,
    };

    const data = account.interface.encodeFunctionData("updateEndowmentController", [
      updateEndowmentControllerData,
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction(
        "updateEndowmentController",
        "updateEndowmentController",
        account.address,
        0,
        data
      );
    let txnReceipt = await tx.wait();

    let txId = txnReceipt.events[0].args.transactionId;
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
    endowment = await accountQuery.queryEndowmentDetails(1);
    expect(
      endowment.settingsController.name.govControlled,
      "name gov controlled not updated"
    ).to.equal(true);
  });
  it("should update endowment fees", async function () {
    account = await ethers.getContractAt(
      "AccountsUpdateEndowmentSettingsController",
      deployRes.addresses.account
    );
    endowmentConfig.earningsFee.feePercentage = 100;
    const updateEndowmentFeesData = {
      id: 1,
      earningsFee: endowmentConfig.earningsFee,
      depositFee: endowmentConfig.depositFee,
      withdrawFee: endowmentConfig.withdrawFee,
      balanceFee: endowmentConfig.balanceFee,
    };

    const data = account.interface.encodeFunctionData("updateEndowmentFees", [
      updateEndowmentFeesData,
    ]);

    let tx = await endowmentMultisig
      .connect(admin1)
      .submitTransaction("updateEndowmentFees", "updateEndowmentFees", account.address, 0, data);
    let txnReceipt = await tx.wait();

    let txId = txnReceipt.events[0].args.transactionId;
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
    endowment = await accountQuery.queryEndowmentDetails(1);
    expect(
      endowment.earningsFee.feePercentage.toString() === "100",
      "name gov controlled not updated"
    ).to.equal(true);
  });
});
