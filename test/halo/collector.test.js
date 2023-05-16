const { assert, expect } = require("chai");
const { keccak256 } = require("ethers/lib/utils");
const {run, ethers, artifacts} = require("hardhat");
const MockDate = require('mockdate');
const {main} = require("../../scripts/deployMain");

describe("Collector", function () {
    let owner, addrs;
    let haloToken;
    const rewardFactor = 90;
    this.beforeAll(async function(){
        [owner, tempGov, ...addrs] = await ethers.getSigners();

        let HaloToken = await ethers.getContractFactory("HaloToken");
        haloToken = await HaloToken.deploy(100000);
        await haloToken.deployed();

        // deploy collector contract
        let Collector = await ethers.getContractFactory("Collector");
        collector = await Collector.deploy();
        await collector.deployed();

        // deploy swapping contract
        let Swapping = await ethers.getContractFactory("SwapRouter");
        swapping = await Swapping.deploy();
        await swapping.deployed();

        console.log("swapping deployed", swapping.address)

        // deploy registrar contract using the deploy script
        const res = await main();

        // initalize the swapping contract
        swapping.intiSwapRouter({
            registrarContract: res.addresses.registrar,
            accountsContract: addrs[0].address,
            swapFactory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
            swapRouter: '0xE592427A0AEce92De3Edee1F18E0157C05861564'
        });

        // deploy the mock uniswap utils contract
        let UniswapUtils = await ethers.getContractFactory("UniswapUtils");
        uniswap_utils = await UniswapUtils.deploy();
        await uniswap_utils.deployed();

        // mint halo token to this contract
        await haloToken.mint(owner.address, ethers.utils.parseEther("100"));

        // create a uniswap pool for HALO and WETH
        const createUniswapPoolParams = {
            tokenA: haloToken.address,
            tokenB: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
            uniswapFee: 3000,
            amountA: ethers.utils.parseEther("100"),
            sqrtPriceX96: "79228162514264337593543950336",
            tickLower: "-138120",
            tickUpper: "138120"            
        }
        haloToken.approve(uniswap_utils.address, ethers.utils.parseEther("100"));
        await uniswap_utils.createPoolAndMintPosition(createUniswapPoolParams, {
            value: ethers.utils.parseEther("100")
        });
    });
    it("should initialize the collector contract by calling the initialize function", async function(){
        // initialize the collector contract
        await collector.initialize({
            timelockContract: addrs[0].address,
            govContract: addrs[4].address,
            swapFactory: swapping.address,
            distributorContract: addrs[1].address,
            rewardFactor: rewardFactor,
            haloToken: haloToken.address,
        });
        // check if the collector contract is initialized properly
        const config = await collector.queryConfig();
        assert(config.owner === owner.address && 
                config.rewardFactor.toString() === rewardFactor.toString() &&
                config.timelockContract === addrs[0].address &&
                config.swapFactory === swapping.address &&
                config.distributorContract === addrs[1].address &&
                config.haloToken === haloToken.address, "Incorrect config set"); 
    });
    it("should sweep the collected tokens", async function() {
        // sweep the collected tokens
        const oldGovContractBalance = await haloToken.balanceOf(addrs[4].address);
        const oldDistContractBalance = await haloToken.balanceOf(addrs[1].address);
        await collector.sweep({
            value: ethers.utils.parseEther("10")
        })
        const govContractBalance = await haloToken.balanceOf(addrs[4].address);
        const distContractBalance = await haloToken.balanceOf(addrs[1].address);

        let total = govContractBalance.add(distContractBalance).sub(oldGovContractBalance).sub(oldDistContractBalance);

        assert(total.mul(rewardFactor).div(100).div(100).toString() === 
                govContractBalance.sub(oldGovContractBalance).div(100).toString(), 
                "Incorrect gov contract balance"); // extra div by 100 to round off the decimals
        
        assert(total.mul(100 - rewardFactor).div(100).div(100).toString() === 
                distContractBalance.sub(oldDistContractBalance).div(100).toString(), 
                "Incorrect dist contract balance"); // extra div by 100 to round off the decimals
    });
    it("should update config of the collector contract", async function(){
        await collector.updateConfig(80, tempGov.address, addrs[4].address, swapping.address);
        const config = await collector.queryConfig();
        assert(config.rewardFactor.toString() === "80" && config.timelockContract === tempGov.address && config.govContract === addrs[4].address && config.swapFactory === swapping.address, "Incorrect config set");
    });
});