const {assert, expect} = require("chai");
const {keccak256} = require("ethers/lib/utils");
const {run, ethers, artifacts, network} = require("hardhat");
const MockDate = require("mockdate");
const {main} = require("../../../scripts/deployAngelProtocol");

async function moveBlocks(amount) {
  console.log("Moving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`Moved ${amount} blocks`);
} // TODO: move this to a utils file

describe("Collector Gov Integration", function () {
  let owner, addrs;
  let haloToken;
  const rewardFactor = 90;
  let govContract;
  let votingERC20;
  let collector;
  let timeLockAddress;
  let govAddress;
  this.beforeAll(async function () {
    [owner, tempGov, ...addrs] = await ethers.getSigners();

    // deploy collector contract
    let Collector = await ethers.getContractFactory("Collector");
    collector = await Collector.deploy();
    await collector.deployed();

    // deploy swapping contract
    let Swapping = await ethers.getContractFactory("SwapRouter");
    swapping = await Swapping.deploy();
    await swapping.deployed();
    console.log("swapping deployed", swapping.address);

    // deploy registrar contract using the deploy script
    const res = await main();

    govAddress = res.addresses.haloGovContract;
    timeLockAddress = res.addresses.timelockContract;
    govContract = await ethers.getContractAt("Gov", govAddress);
    console.log("gov contract address", govContract.address);
    votingERC20 = await ethers.getContractAt("VotingERC20", res.addresses.votingERC20);
    console.log("votingERC20 address", votingERC20.address);
    haloToken = await ethers.getContractAt("ERC20Upgrade", res.addresses.haloAddress.Halo);

    // deposit halo token in voting contract to receive voting tokens
    haloToken.connect(owner).approve(votingERC20.address, ethers.utils.parseEther("400"));
    await votingERC20.depositFor(owner.address, ethers.utils.parseEther("100"));

    // initalize the swapping contract
    swapping.intiSwapRouter({
      registrarContract: res.addresses.registrar,
      accountsContract: addrs[0].address,
      swapFactory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    });

    // deploy the mock uniswap utils contract
    let UniswapUtils = await ethers.getContractFactory("UniswapUtils");
    uniswap_utils = await UniswapUtils.deploy();
    await uniswap_utils.deployed();

    // create a uniswap pool for HALO and WETH
    const createUniswapPoolParams = {
      tokenA: haloToken.address,
      tokenB: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
      uniswapFee: 3000,
      amountA: ethers.utils.parseEther("100"),
      sqrtPriceX96: "79228162514264337593543950336",
      tickLower: "-138120",
      tickUpper: "138120",
    };
    haloToken.approve(uniswap_utils.address, ethers.utils.parseEther("100"));
    await uniswap_utils.createPoolAndMintPosition(createUniswapPoolParams, {
      value: ethers.utils.parseEther("100"),
    });
  });
  it("should initialize the collector contract by calling the initialize function", async function () {
    // initialize the collector contract
    await collector.initialize({
      timelockContract: timeLockAddress,
      govContract: govAddress,
      swapFactory: swapping.address,
      distributorContract: addrs[1].address,
      rewardFactor: rewardFactor,
      haloToken: haloToken.address,
    });
    // check if the collector contract is initialized properly
    const config = await collector.queryConfig();
    assert(
      config.owner === owner.address &&
        config.rewardFactor.toString() === rewardFactor.toString() &&
        config.govContract === govAddress &&
        config.timelockContract === timeLockAddress &&
        config.swapFactory === swapping.address &&
        config.distributorContract === addrs[1].address &&
        config.haloToken === haloToken.address,
      "Incorrect config set"
    );
  });
  it("should update config", async function () {
    let tx, receipt;
    const data = collector.interface.encodeFunctionData("updateConfig", [
      80,
      timeLockAddress,
      govAddress,
      swapping.address,
    ]);
    const description = "update config";
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(description));

    // delegate voting power to owner account
    tx = await votingERC20.delegate(owner.address);
    await tx.wait(1);

    // create proposal
    tx = await govContract.propose([collector.address], [0], [data], description);
    receipt = await tx.wait();
    const proposalId = receipt.events.filter((e) => e.event === "ProposalCreated")[0].args
      .proposalId;
    console.log("Proposal created with ID", proposalId.toString());
    // move blocks
    await moveBlocks(2);

    // cast vote
    tx = await govContract.castVote(proposalId, 1);
    await tx.wait(1);

    // set date to 1 year from now
    MockDate.set(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
    await moveBlocks(2);
    await network.provider.send("hardhat_mine", ["0x284696"]);

    // // get current state of the proposal
    // const state = await govContract.state(proposalId);
    // console.log("state", state.toString());

    // add proposal to the queue
    console.log("Queueing...");
    tx = await govContract.queue([collector.address], [0], [data], descriptionHash);
    console.log("queued");
    MockDate.set(new Date().getTime() + 400 * 24 * 60 * 60 * 1000);
    await moveBlocks(2);

    // execute the proposal
    console.log("Executing...");

    tx = await govContract.execute([collector.address], [0], [data], descriptionHash);
    receipt = await tx.wait();

    MockDate.reset();

    const config = await collector.queryConfig();
    assert(config.rewardFactor.toString() === "80");
  });
});
