const { assert, expect } = require("chai");
const {run, ethers, artifacts} = require("hardhat");
const MockDate = require('mockdate');

describe("Staking", function () {
    let owner, addrs;
    let haloToken;
    let interestRate = 10;
    let stakingNumber
    let staking;
    this.beforeAll(async function(){
        [owner, updated_owner, ...addrs] = await ethers.getSigners();

        let HaloToken = await ethers.getContractFactory("HaloToken");
        haloToken = await HaloToken.deploy(100000);
        await haloToken.deployed();

        // deploy staking contract
        let Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(); // interest rate is 10%
        await staking.deployed();

        await staking.initialize({haloToken: haloToken.address, interestRate: interestRate});

        let ERC20Instance = await ethers.getContractAt("HaloToken", haloToken.address);
        await ERC20Instance.mint(staking.address, ethers.utils.parseEther("1000"));
    });
    it("should stake halo tokens", async function(){
        // stake halo tokens
        await haloToken.approve(staking.address, ethers.utils.parseEther("100"));
        const oldStakingTokenBalance = await staking.balanceOf(owner.address);
        const oldTotalStaked = await staking.totalStaked();
        const oldTotalStakedFor = await staking.totalStakedFor(owner.address);
        await staking.stake(ethers.utils.parseEther("100"), []);
        const newStakingTokenBalance = await staking.balanceOf(owner.address);
        const newTotalStaked = await staking.totalStaked();
        const newTotalStakedFor = await staking.totalStakedFor(owner.address);
        assert(newStakingTokenBalance.sub(oldStakingTokenBalance).eq(ethers.utils.parseEther("100")), "Incorrect staking token balance");
        assert(newTotalStaked.sub(oldTotalStaked).eq(ethers.utils.parseEther("100")), "Incorrect total staked");
        assert(newTotalStakedFor.sub(oldTotalStakedFor).eq(ethers.utils.parseEther("100")), "Incorrect total staked for");
    });
    it("should unstake halo tokens", async function(){
        // set curdate to 90 days from now
        MockDate.set(new Date(Date.now() + 91 * 24 * 60 * 60 * 1000));
        // unstake halo tokens
        const oldHaloTokenBalance = await haloToken.balanceOf(owner.address);
        const oldStakingTokenBalance = await staking.balanceOf(owner.address);
        const oldTotalStaked = await staking.totalStaked();
        const oldTotalStakedFor = await staking.totalStakedFor(owner.address);
        stakingNumber = staking.stakeNumber(owner.address);
        await staking.unstake(ethers.utils.parseEther("100"), stakingNumber, []);
        const newStakingTokenBalance = await staking.balanceOf(owner.address);
        const newTotalStaked = await staking.totalStaked();
        const newTotalStakedFor = await staking.totalStakedFor(owner.address);
        const newHaloTokenBalance = await haloToken.balanceOf(owner.address);
        assert(newHaloTokenBalance.sub(oldHaloTokenBalance).eq(ethers.utils.parseEther("100").mul(100 + interestRate).div(100)), "Incorrect halo token balance");
        assert(oldStakingTokenBalance.sub(newStakingTokenBalance).eq(ethers.utils.parseEther("100")), "Incorrect staking token balance");
        assert(oldTotalStaked.sub(newTotalStaked).eq(ethers.utils.parseEther("100")), "Incorrect total staked");
        assert(oldTotalStakedFor.sub(newTotalStakedFor).eq(ethers.utils.parseEther("100")), "Incorrect total staked for");
        MockDate.reset();
    });
    it("should verify that token() returns halo token address", async function(){
        const tokenAddress = await staking.token();
        assert(tokenAddress === haloToken.address);
    });
    it("should update interest rate", async function(){
        let interestRate = 11
        await staking.updateInterestRate(interestRate);
        const newInterestRate = await staking.interestRate();
        assert(newInterestRate.toString() === interestRate.toString(), "Incorrect interest rate");
    });
    it("should stake halo tokens for another address", async function(){
        // stake halo tokens
        await haloToken.approve(staking.address, ethers.utils.parseEther("100"));
        const oldStakingTokenBalance = await staking.balanceOf(addrs[0].address);
        const oldTotalStaked = await staking.totalStaked();
        const oldTotalStakedFor = await staking.totalStakedFor(addrs[0].address);
        await staking.stakeFor(addrs[0].address, ethers.utils.parseEther("100"), []);
        const newStakingTokenBalance = await staking.balanceOf(addrs[0].address);
        const newTotalStaked = await staking.totalStaked();
        const newTotalStakedFor = await staking.totalStakedFor(addrs[0].address);

        assert(newStakingTokenBalance.sub(oldStakingTokenBalance).eq(ethers.utils.parseEther("100")), "Incorrect staking token balance");
        assert(newTotalStaked.sub(oldTotalStaked).eq(ethers.utils.parseEther("100")), "Incorrect total staked");
        assert(newTotalStakedFor.sub(oldTotalStakedFor).eq(ethers.utils.parseEther("100")), "Incorrect total staked for");
    });
});