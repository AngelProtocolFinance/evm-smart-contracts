const {expect, assert} = require("chai");
const {ethers, artifacts} = require("hardhat");
const Web3 = require("web3");
const web3 = new Web3();
let {main} = require("../../scripts/deployMain");
const endowmentData = require("../data/endowment.js");
const {config} = require("../../config/index");
const MockDate = require("mockdate");

describe("Fundraising", function () {
  let deployer, addrs, proxyAdmin, admin1, admin2, admin3;
  let deployRes;
  let registrar;
  let fundraising;
  let projectToken;
  let endowmentConfig;
  let endowment;
  let lockedAmount = ethers.utils.parseEther("100");
  let taxRate;

  this.beforeAll(async function () {
    // run deploy script only once
    [deployer, proxyAdmin, admin1, admin2, admin3, ...addrs] = await ethers.getSigners();
    deployRes = await main([admin1.address, admin2.address, admin3.address]); // runs the deploy script

    // create an endowment of type normal
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

    // console.log("endowment: ", endowment);

    // get the registrar contract
    registrar = await ethers.getContractAt("Registrar", deployRes.addresses.registrar);

    // set registrar owner to deployer
    const apMultisigAddress = deployRes.addresses.multisigAddress.APTeamMultiSig;
    APMultisig = await ethers.getContractAt("APTeamMultiSig", apMultisigAddress);

    const data = registrar.interface.encodeFunctionData("updateOwner", [deployer.address]);

    let tx2 = await APMultisig.connect(admin1).submitTransaction(
      "Change registrar owner",
      "Proposal to change the registrar owner to the deployer",
      registrar.address,
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

    // get the fundraising contract
    fundraising = await ethers.getContractAt("Fundraising", deployRes.addresses.fundraisingAddress);

    // deploy a dummy project token
    const ProjectToken = await ethers.getContractFactory("MockERC20");
    projectToken = await ProjectToken.deploy("Project Token", "PT", "100000000");
    await projectToken.deployed();

    // mint project tokens in addrs[0] and addrs[1]
    await projectToken.mint(addrs[0].address, ethers.utils.parseEther("100000"));
    await projectToken.mint(addrs[1].address, ethers.utils.parseEther("100000"));
  });
  it("should update config of fundraising", async function () {
    const campaignPeriodSeconds = 10 * 24 * 60 * 60;
    taxRate = 20;
    await fundraising.executeUpdateConfig(campaignPeriodSeconds, taxRate, {
      coinNativeAmount: 0,
      Cw20CoinVerified_amount: [0],
      Cw20CoinVerified_addr: [projectToken.address],
    });
    const config = await fundraising.queryConfig();
    assert(
      config.campaignPeriodSeconds.toString() === campaignPeriodSeconds.toString(),
      "campaignPeriodSeconds should be updated"
    );
    assert(config.taxRate.toString() === taxRate.toString(), "taxRate should be updated");
    assert(
      config.acceptedTokens.Cw20CoinVerified_addr[0].toString() === projectToken.address,
      "accpeted_tokens should be updated"
    );
  });
  it("should create a campaign", async function () {
    const endTimeEpoch = Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60;
    const fundraisingCreateMsg = {
      title: "test campaign",
      description: "test campaign description",
      imageUrl: "https://test.com",
      endTimeEpoch: endTimeEpoch,
      fundingGoal: {
        coinNativeAmount: 0,
        Cw20CoinVerified_amount: [ethers.utils.parseEther("2000")],
        Cw20CoinVerified_addr: [projectToken.address],
      },
      rewardThreshold: 20,
    };
    const balance = {
      coinNativeAmount: 0,
      cw20Addr: projectToken.address,
      cw20Amount: lockedAmount,
    };
    // approve transfer of project tokens
    await projectToken.approve(fundraising.address, lockedAmount);
    const tx = await fundraising.executeCreate(
      1, // endowment id
      fundraisingCreateMsg,
      balance,
      deployRes.addresses.account
    );
    const txReceipt = await tx.wait();
    campaignId = txReceipt.events.filter((e) => e.event === "FundraisingCampaignCreated")[0].args
      .campaignId;

    const campaignDetails = await fundraising.queryDetails(campaignId);
    // console.log(campaignDetails);
    assert(campaignDetails.title === fundraisingCreateMsg.title, "title should be same");
    assert(
      campaignDetails.description === fundraisingCreateMsg.description,
      "description should be same"
    );
    assert(
      campaignDetails.fundingGoal.Cw20CoinVerified_amount[0].toString() ===
        fundraisingCreateMsg.fundingGoal.Cw20CoinVerified_amount[0].toString(),
      "fundingGoal should be same"
    );
    assert(
      campaignDetails.fundingThreshold.Cw20CoinVerified_amount[0].toString() ===
        fundraisingCreateMsg.fundingGoal.Cw20CoinVerified_amount[0]
          .mul(fundraisingCreateMsg.rewardThreshold)
          .div(100)
          .toString(),
      "fundingGoal should be same"
    );
    assert(
      campaignDetails.lockedBalance.Cw20CoinVerified_amount[0].toString() ===
        balance.cw20Amount.toString(),
      "lockedBalance should be same"
    );
  });
  it("should execute top up in a campaign", async function () {
    const balance = {
      coinNativeAmount: 0,
      cw20Addr: projectToken.address,
      cw20Amount: lockedAmount,
    };
    // approve transfer of project tokens
    await projectToken.approve(fundraising.address, lockedAmount);
    const tx = await fundraising.executeTopUp(campaignId, balance);
    const txReceipt = await tx.wait();
    const campaignDetails = await fundraising.queryDetails(campaignId);
    assert(
      campaignDetails.lockedBalance.Cw20CoinVerified_amount[0].toString() ===
        balance.cw20Amount.add(lockedAmount).toString(),
      "lockedBalance should be same"
    );
    lockedAmount = lockedAmount.add(lockedAmount);
  });
  it("should execute contribute in a campaign", async function () {
    const balance = {
      coinNativeAmount: 0,
      cw20Addr: projectToken.address,
      cw20Amount: ethers.utils.parseEther("1000"),
    };
    // approve transfer of project tokens
    await projectToken.connect(addrs[0]).approve(fundraising.address, balance.cw20Amount);
    await projectToken.connect(addrs[1]).approve(fundraising.address, balance.cw20Amount);

    const tx = await fundraising.connect(addrs[0]).executeContribute(campaignId, balance);
    const txReceipt = await tx.wait();

    const tx2 = await fundraising.connect(addrs[1]).executeContribute(campaignId, balance);
    const tx2Receipt = await tx2.wait();
    const campaignDetails = await fundraising.queryDetails(campaignId);
    assert(
      campaignDetails.contributedBalance.Cw20CoinVerified_amount[0].toString() ===
        balance.cw20Amount.mul(2).toString(),
      "lockedBalance should be same"
    );
  });
  it("should revert with Not expired when trying to close campaign", async function () {
    await expect(fundraising.executeCloseCampaign(campaignId)).to.be.revertedWith("Not expired");
  });
  it("should revert with `Campaign is open` while trying to refund contributions", async function () {
    await expect(fundraising.executeRefundContributions(campaignId)).to.be.revertedWith(
      "Campaign is open"
    );
  });
  it("should close the campaign", async function () {
    // set date to 11 days from now
    MockDate.set(new Date(Date.now() + 91 * 24 * 60 * 60 * 1000));
    // get old balances
    const oldPTBalance = await projectToken.balanceOf(deployer.address);
    const oldRegistrarTreasuryPTBalance = await projectToken.balanceOf(
      config.REGISTRAR_DATA.treasury
    );
    let campaignDetails = await fundraising.queryDetails(campaignId);
    const contributedBalance = campaignDetails.contributedBalance.Cw20CoinVerified_amount[0];
    // close the campaign
    await fundraising.executeCloseCampaign(campaignId);
    campaignDetails = await fundraising.queryDetails(campaignId);
    // get new balances
    const newPTBalance = await projectToken.balanceOf(deployer.address);
    if (campaignDetails.success) {
      const newRegistrarTreasuryPTBalance = await projectToken.balanceOf(
        config.REGISTRAR_DATA.treasury
      );
      assert(
        newPTBalance.sub(oldPTBalance).toString() ===
          contributedBalance
            .mul(100 - taxRate)
            .div(100)
            .toString(),
        "PT balance should be updated for deployer"
      );
      assert(
        newRegistrarTreasuryPTBalance.sub(oldRegistrarTreasuryPTBalance).toString() ===
          contributedBalance.mul(taxRate).div(100).toString(),
        "PT balance should be updated for registrar treasury"
      );
    } else {
      assert(
        newPTBalance.sub(oldPTBalance).toString() === contributedBalance.toString(),
        "PT balance should be updated for deployer when campaign is not successful"
      );
    }
    assert(!campaignDetails.open, "campaign should be closed");
    MockDate.reset();
  });
  it("should execute claim rewards", async function () {
    await expect(
      fundraising.connect(addrs[0]).executeClaimRewards(campaignId)
    ).to.changeTokenBalance(
      projectToken,
      addrs[0],
      ethers.utils.parseEther("1000").mul(lockedAmount).div(ethers.utils.parseEther("2000"))
    );
    await expect(
      fundraising.connect(addrs[1]).executeClaimRewards(campaignId)
    ).to.changeTokenBalance(
      projectToken,
      addrs[1],
      ethers.utils.parseEther("1000").mul(lockedAmount).div(ethers.utils.parseEther("2000"))
    );
  });
  // it("should execute refund contributions", async function(){
  //     console.log((await projectToken.balanceOf(fundraising.address)).toString());
  //     const oldPTBalance = await projectToken.balanceOf(addrs[0].address);
  //     await fundraising.connect(addrs[0]).executeRefundContributions(campaignId);
  //     const newPTBalance = await projectToken.balanceOf(addrs[0].address);

  //     console.log(newPTBalance.sub(oldPTBalance).toString());
  //     // await expect(
  //     //     fundraising.connect(addrs[0]).executeRefundContributions(campaignId)
  //     // ).to.changeTokenBalance(
  //     //     projectToken,
  //     //     addrs[0],
  //     //     ethers.utils.parseEther("1000")
  //     // );
  // });
});
