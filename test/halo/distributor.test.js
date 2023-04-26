const { assert, expect } = require("chai");
const {run, ethers, artifacts} = require("hardhat");

describe("Distributor", function () {
    let owner, addrs;
    let haloToken;
    let gov;
    let tempGov;
    let distributor;
    this.beforeAll(async function(){
        [owner, tempGov, ...addrs] = await ethers.getSigners();

        let HaloToken = await ethers.getContractFactory("HaloToken");
        haloToken = await HaloToken.deploy(100000);
        await haloToken.deployed();

        // // deploy and initialize gov contract
        // const res = await main();
        // console.log("RES", res);
        // let registrar = await ethers.getContractAt("Registrar", res.registrar);
        
        // const config = await registrar.queryConfig();
        // console.log("Config: ", config);

        // gov = await ethers.getContractAt("Gov", config.timelockContract);

        //deploy distributor contract
        let Distributor = await ethers.getContractFactory("Distributor");
        distributor = await Distributor.deploy();
        await distributor.deployed();

        //initialize distributor contract
        distributor.initialize({
            haloToken: haloToken.address,
            whitelist: [owner.address],
            timelockContract: tempGov.address,
            spendLimit: ethers.utils.parseEther("100")
        });

        // mint halo token to distributor
        await haloToken.mint(distributor.address, ethers.utils.parseEther("100"));
    });
    it("should not allow a non-gov contract to add distributor", async function(){
        await expect(
            distributor.addDistributor(addrs[0].address)
        ).to.be.revertedWith("Unauthorized");
    });
    it("should not allow non-whitelisted address to spend", async function(){
        await expect(
            distributor.connect(addrs[0]).spend(addrs[0].address, ethers.utils.parseEther("1"))
        ).to.be.revertedWith("Unauthorized");
    });
    it("should add distributor and allow him to spend", async function(){
        // In production, the call to distributor must be made by passing a proposal through the gov contract
        await distributor.connect(tempGov).addDistributor(addrs[0].address);
        expect(
            await distributor.connect(addrs[0]).spend(addrs[0].address, ethers.utils.parseEther("1"))
        ).to.changeTokenBalance(
            haloToken,
            [addrs[0], distributor],
            [ethers.utils.parseEther("1"), ethers.utils.parseEther("-1")]
        );
    });
    it("should not allow distributor to spend more than spend limit", async function(){
        await expect(
            distributor.connect(addrs[0]).spend(addrs[0].address, ethers.utils.parseEther("101"))
        ).to.be.revertedWith("Cannot spend more than spend limit");
    });
    it("should remove distributor and not allow him to spend", async function(){
        // In production, the call to distributor must be made by passing a proposal through the gov contract
        await distributor.connect(tempGov).removeDistributor(addrs[0].address);
        await expect(
            distributor.connect(addrs[0]).spend(addrs[0].address, ethers.utils.parseEther("1"))
        ).to.be.revertedWith("Unauthorized");
    });
    it("should update config of the distributor contract", async function(){
        // In production, the call to distributor must be made by passing a proposal through the gov contract
        await distributor.connect(tempGov).updateConfig(ethers.utils.parseEther("200"), addrs[0].address);
        const config = await distributor.queryConfig();
        expect(config.spendLimit).to.equal(ethers.utils.parseEther("200"));
        expect(config.timelockContract).to.equal(addrs[0].address);
    });
});