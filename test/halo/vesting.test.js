const { assert, expect } = require("chai");
const {run, ethers, artifacts} = require("hardhat");
const MockDate = require('mockdate');

describe("Vesting", function () {
    let owner, addrs;
    let haloToken;
    let vesting, vestingId;
    this.beforeAll(async function(){
        [owner, updated_owner, ...addrs] = await ethers.getSigners();

        let HaloToken = await ethers.getContractFactory("HaloToken");
        haloToken = await HaloToken.deploy(100000);
        await haloToken.deployed();

        // deploy vesting contract
        let Vesting = await ethers.getContractFactory("Vesting");
        vesting = await Vesting.deploy();
        await vesting.deployed();

        await vesting.initialize({
            haloToken: haloToken.address,
        });

        haloToken.transfer(vesting.address, ethers.utils.parseEther("100"));
    });
    it("should vest halo token", async function(){
        
        await haloToken.approve(vesting.address, ethers.utils.parseEther("10"));
        expect(await vesting.deposit(ethers.utils.parseEther("10"))).to.changeTokenBalance(
            haloToken, 
            [owner, vesting], 
            [ethers.utils.parseEther("-10"), ethers.utils.parseEther("10")]
        );
        vestingId = await vesting.vestingNumber(owner.address);
        vestingId--;
    });
    it("should claim vested halo token", async function(){
        // set date to 91 days from now
        MockDate.set(new Date(Date.now() + 91 * 24 * 60 * 60 * 1000));
        const oldTotalVested = await vesting.totalVested();
        expect(await vesting.withdraw(vestingId)).to.changeTokenBalance(
            haloToken,
            [owner, vesting],
            [ethers.utils.parseEther("10"), ethers.utils.parseEther("-10")]
        );
        const newTotalVested = await vesting.totalVested();
        assert.equal(oldTotalVested.sub(newTotalVested).toString(), ethers.utils.parseEther("10").toString());
        MockDate.reset();
    });
    it("should update vesting duration", async function(){
        await vesting.modifyVestingDuration(180);
        assert.equal(await vesting.vestingDuration(), 180);
    });
});