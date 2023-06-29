const {assert, expect} = require("chai");
const {keccak256} = require("ethers/lib/utils");
const {run, ethers, artifacts} = require("hardhat");
const MockDate = require("mockdate");
const keccak = require("keccak");
const {MerkleTree} = require("merkletreejs");
const Web3 = require("web3");
// import keccak256 from 'keccak256'
// import { MerkleTree } from 'merkletreejs'
const web3 = new Web3();
let {main} = require("../../scripts/deployAngelProtocol");
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
const ADDRESS_ONE = "0x0000000000000000000000000000000000000001";

let amounts = [1, 200, 300].map((amount) => ethers.utils.parseEther(amount.toString()));

describe("APTeam", function () {
  let deployer, addrs, proxyAdmin;
  let APMultisig, deployRes;
  this.beforeAll(async function () {
    // runs once before all `it` blocks
    [deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
    deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script

    const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
    APMultisig = await ethers.getContractAt("APTeamMultiSig", apMultisigAddress);
  });
  it("should create and pass a proposal in AP multisig to update registrar config", async function () {
    deployRes.registrarConfig.collectorShare = 3;
    const registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    const data = registrar.interface.encodeFunctionData("updateConfig", [
      deployRes.registrarConfig,
    ]);
    let tx = await APMultisig.connect(admin3).submitTransaction(
      "update registrar config",
      "update registrar config",
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
      if (e.event === "Confirmation" && e.args.transactionId.toString() === txId)
        confirmations += 1;
    });
    tx = await APMultisig.connect(admin1).confirmTransaction(txId);
    receipt = await tx.wait();
    let executed = false;
    receipt.events.map((e) => {
      if (e.event === "Confirmation" && e.args.transactionId.toString() === txId)
        confirmations += 1;
      if (e.event === "Execution" && e.args.transactionId.toString() === txId) executed = true;
    });
    // console.log(receipt.events.filter((e) => e.event === "Confirmation"));
    // console.log(receipt.events.filter((e) => e.event === "Execution"));

    const config = await registrar.queryConfig();
    assert(config.collectorShare.toString() === "3", "tax rate not updated");
    assert(confirmations === 2, "confirmations not emitted");
    assert(executed, "transaction not executed");
  });
  it("should update fees in registrar", async function () {
    const registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);
    const data = registrar.interface.encodeFunctionData("updateFees", [
      [["testing_fee_set"], [20]],
    ]);
    let tx = await APMultisig.connect(admin1).submitTransaction(
      "update registrar fees",
      "update registrar fees",
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

    set_fee = await registrar.queryFee("testing_fee_set");

    console.log(set_fee);

    expect(set_fee).to.equal(20, "fee not updated");
  });

  it("should add a network connection in registrar", async function () {
    const registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);

    const data = registrar.interface.encodeFunctionData("updateNetworkConnections", [
      ["Polygon", 137, ADDRESS_ZERO, ADDRESS_ZERO, "", "", ADDRESS_ZERO, 25000],
      "post",
    ]);

    let tx = await APMultisig.connect(admin1).submitTransaction(
      "update registrar fees",
      "update registrar fees",
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

    let network = await registrar.queryNetworkConnection(137);

    expect(network.name).to.equal("Polygon", "network not updated");
  });

  it("should add a vault in registrar", async function () {
    const registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);

    // native vault called gold finch
    const data = registrar.interface.encodeFunctionData("vaultAdd", [
      [137, "GoldFinch", ADDRESS_ZERO, ADDRESS_ONE, [2], 0, 0],
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

    let vaults = await registrar.queryVaultList(0, 2, 2, 3, 2, 0, 3);

    expect(vaults[0].addr).to.equal("GoldFinch", "vault not added");
  });

  it("should update a vault in registrar", async function () {
    const registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);

    // native vault called gold finch
    const data = registrar.interface.encodeFunctionData("vaultUpdate", ["GoldFinch", false, [2]]);
    let tx = await APMultisig.connect(admin1).submitTransaction(
      "update registrar update vault",
      "update registrar update vault",
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

    let vaults = await registrar.queryVaultList(0, 2, 2, 3, 2, 0, 3);

    expect(vaults[0].approved).to.equal(false, "vault not updated");
  });

  it("should remove a vault in registrar", async function () {
    const registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);

    // native vault called gold finch
    const data = registrar.interface.encodeFunctionData("vaultRemove", ["GoldFinch"]);
    let tx = await APMultisig.connect(admin1).submitTransaction(
      "update registrar remove vault",
      "update registrar remove vault",
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
  });
});
