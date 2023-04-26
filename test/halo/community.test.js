const { assert, expect } = require("chai");
const {run, ethers, artifacts} = require("hardhat");
const MockDate = require('mockdate');
const {deployGov} = require("../../contracts/halo/gov/scripts/deploy");
// const Web3 = require('web3');
const { community } = require("../../contracts/halo/community/scripts/deploy");

// const web3 = new Web3();

describe("Community", function () {
    let owner, addrs;
    let haloToken;
    let tempGov;
    let community;
    this.beforeAll(async function(){
        [owner, tempGov, ...addrs] = await ethers.getSigners();

        let HaloToken = await ethers.getContractFactory("HaloToken");
        haloToken = await HaloToken.deploy(100000);
        await haloToken.deployed();

        //deploy community contract
        let Community = await ethers.getContractFactory("Community");
        community = await Community.deploy();
        await community.deployed();

        //initialize community contract
        community.initialize({
            haloToken: haloToken.address,
            timelockContract: tempGov.address,
            spendLimit: ethers.utils.parseEther("100")
        });

        // mint halo token to community
        await haloToken.mint(community.address, ethers.utils.parseEther("1000"));
    });
    it("should not allow non-gov contract to spend", async function(){
        await expect(
            community.connect(addrs[0]).spend(addrs[0].address, ethers.utils.parseEther("1"))
        ).to.be.revertedWith("Unauthorized");
    });
    it("should allow the gov contract to spend", async function(){
        // In production, the call to community must be made by passing a proposal through the gov contract
        expect(
            await community.connect(tempGov).spend(addrs[0].address, ethers.utils.parseEther("1"))
        ).to.changeTokenBalance(
            haloToken,
            [addrs[0], community],
            [ethers.utils.parseEther("1"), ethers.utils.parseEther("-1")]
        );
    });
    it("should not let amount of soend function be more than spend limit", async function(){
        await expect(
            community.connect(tempGov).spend(addrs[0].address, ethers.utils.parseEther("101"))
        ).to.be.revertedWith("Cannot spend more than spend limit");
    });
    it("should update config of community contract", async function(){
        await community.connect(tempGov).updateConfig(ethers.utils.parseEther("200"), addrs[0].address);
        const config = await community.queryConfig();
        assert(config.spendLimit.toString() === ethers.utils.parseEther("200").toString());
        assert(config.timelockContract === addrs[0].address);
    });
});