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
  it("should create and pass a proposal in AP multisig to update index fund config", async function () {
    const indexFundConfig = {
      fundRotation: 1,
      fundMemberLimit: 2,
      fundingGoal: 3,
    };
    const indexFund = await ethers.getContractAt("IndexFund", deployRes.addresses.indexFund);
    const data = indexFund.interface.encodeFunctionData("updateConfig", [indexFundConfig]);
    let tx = await APMultisig.connect(admin3).submitTransaction(
      "update index fund config",
      "update index fund config",
      indexFund.address,
      0,
      data
    );
    let receipt = await tx.wait();
    let txId = receipt.events
      .filter((e) => e.event === "Submission")[0]
      .args.transactionId.toString();
    await APMultisig.connect(admin1).confirmTransaction(txId);

    const config = await indexFund.queryConfig();
    assert(config.fundRotation.toString() === "1", "fund rotation not updated");
    assert(config.fundMemberLimit.toString() === "2", "fund member limit not updated");
    assert(config.fundingGoal.toString() === "3", "funding goal not updated");
  });
});
