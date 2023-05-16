const { assert, expect } = require("chai");
const { keccak256 } = require("ethers/lib/utils");
const {run, ethers, artifacts} = require("hardhat");
const MockDate = require('mockdate');
const keccak = require('keccak');
const { MerkleTree } = require('merkletreejs');
const Web3 = require('web3');
// import keccak256 from 'keccak256'
// import { MerkleTree } from 'merkletreejs'
const web3 = new Web3();

let amounts = [1, 200,300].map((amount) => ethers.utils.parseEther(amount.toString()));

describe("Airdrop", function () {
    // @copilot check ./airdrop.test.rs rust file to create similar tests for this js file. 
    // keep in mind that we have to test the following solidity file: contracts/halo/airdrop/Airdrop.sol
    let owner, addrs;
    let haloToken;
    let merkleTree;
    let leafNodes;
    this.beforeAll(async function(){
        [owner, updated_owner, ...addrs] = await ethers.getSigners();

        let HaloToken = await ethers.getContractFactory("HaloToken");
        haloToken = await HaloToken.deploy(100000);
        await haloToken.deployed();

        // deploy airdrop contract
        let Airdrop = await ethers.getContractFactory("Airdrop");
        airdrop = await Airdrop.deploy();
        await airdrop.deployed();
        
        haloToken.mint(airdrop.address, ethers.utils.parseEther("100000"));
    });
    it("should initialize the airdrop contract by calling the initialize function", async function(){
        // initialize the airdrop contract
        await airdrop.initialize({
            owner: owner.address,
            haloToken: haloToken.address,
        });
        // check if the airdrop contract is initialized properly
        const config = await airdrop.queryConfig();
        assert(config.owner === owner.address && config.haloToken == haloToken.address, "Incorrect config set");
    })
    it("should not allow non-owner to update config", async function() {
        await expect(airdrop.connect(addrs[0]).updateConfig(owner.address)).to.be.revertedWith("only owner can update config");
    });
    it("should register merkle root", async function() {
        const balances = [];
        for(let i = 0; i < amounts.length; i++){
            balances.push({
                addr: addrs[i].address,
                amount: web3.eth.abi.encodeParameter('uint256', amounts[i]),
            })
        }
        leafNodes = balances.map((balance) =>
            keccak256(
                Buffer.concat([Buffer.from  (balance.addr.replace('0x', ''), 'hex'), Buffer.from(balance.amount.replace('0x', ''), 'hex')])
            )
        );
        merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });;
        const root = merkleTree.getHexRoot();
        await airdrop.registerMerkleRoot(root);
        const latestStage = await airdrop.queryLatestStage();
        const merkleRoot = await airdrop.queryMerkleRoot(latestStage - 1);
        assert(merkleRoot.merkleRoot === root, "Incorrect merkle root set");
    });
    it("should claim tokens", async function() {
        for(let i = 0; i < 3; i++){
            let proof = merkleTree.getHexProof(leafNodes[i]);
            const oldHaloTokenBalance = await haloToken.balanceOf(addrs[i].address);
            await airdrop.connect(addrs[i]).claim(amounts[i], proof);
            const newHaloTokenBalance = await haloToken.balanceOf(addrs[i].address);
            assert(newHaloTokenBalance.sub(oldHaloTokenBalance).toString() === amounts[i].toString(), "Incorrect amount claimed");
        }
    });
    it("should update config of airdrop contract", async function(){
        await airdrop.updateConfig(updated_owner.address);
        const config = await airdrop.queryConfig();
        assert(config.owner === updated_owner.address, "Incorrect config set");
    });
});