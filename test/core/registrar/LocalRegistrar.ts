import {SnapshotRestorer, takeSnapshot} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {BigNumber, Signer} from "ethers";
import hre from "hardhat";
import {DEFAULT_NETWORK_INFO} from "test/utils";
import {LocalRegistrar, LocalRegistrar__factory} from "typechain-types";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {FeeTypes, StrategyApprovalState} from "types";
import {getSigners} from "utils";

describe("LocalRegistrar", function () {
  const {ethers, upgrades} = hre;

  let owner: Signer;
  let user: Signer;

  let Registrar: LocalRegistrar__factory;

  let registrar: LocalRegistrar;

  let defaultRebalParams = {
    rebalanceLiquidProfits: false,
    lockedRebalanceToLiquid: 75,
    interestDistribution: 20,
    lockedPrincipleToLiquid: false,
    principleDistribution: 0,
    basis: 100,
  };

  let mockUniswapAddresses = {
    router: "0x0000000000000000000000000000000000111111",
    factory: "0x0000000000000000000000000000000002222222",
  };

  let originatingChain = "polygon";
  let accountsContract = "0x000000000000000000000000000000000000dead";

  before(async function () {
    const signers = await getSigners(hre);
    user = signers.apTeam1;
    owner = signers.apTeam2;

    Registrar = new LocalRegistrar__factory(owner);
    registrar = (await upgrades.deployProxy(Registrar, [originatingChain])) as LocalRegistrar;
  });

  let snapshot: SnapshotRestorer;

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("Deployment", function () {
    it("Should successfully deploy the contract as an upgradable proxy", async function () {
      await expect(upgrades.upgradeProxy(registrar.address, Registrar)).to.not.be.reverted;
    });

    it("Should set the right owner", async function () {
      expect(await registrar.owner()).to.equal(await owner.getAddress());
    });

    it("Should set the default parameters as specified by the Registrar Config", async function () {
      let rebalParams = await registrar.getRebalanceParams();
      expect(rebalParams.rebalanceLiquidProfits).to.equal(
        defaultRebalParams.rebalanceLiquidProfits
      );
      expect(rebalParams.lockedRebalanceToLiquid).to.equal(
        defaultRebalParams.lockedRebalanceToLiquid
      );
      expect(rebalParams.interestDistribution).to.equal(defaultRebalParams.interestDistribution);
      expect(rebalParams.lockedPrincipleToLiquid).to.equal(
        defaultRebalParams.lockedPrincipleToLiquid
      );
      expect(rebalParams.principleDistribution).to.equal(defaultRebalParams.principleDistribution);
    });

    it("Should not allow a non-owner to run an upgrade", async function () {
      await expect(upgrades.upgradeProxy(registrar.address, Registrar.connect(user))).to.be
        .reverted;
    });
  });

  describe("Setters and Getters", function () {
    describe("setRebalanceParams and getRebalanceParams", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setRebalanceParams(defaultRebalParams)).to.be.reverted;
      });

      it("Should accept and set the values", async function () {
        let newValues = defaultRebalParams;
        newValues.rebalanceLiquidProfits = true;
        await expect(registrar.setRebalanceParams(newValues)).to.not.be.reverted;
        let returnedValues = await registrar.getRebalanceParams();
        expect(returnedValues.rebalanceLiquidProfits).to.equal(newValues.rebalanceLiquidProfits);
      });
    });

    describe("get and set UniswapFactoryAddress & UniswapRouterAddress", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(
          registrar
            .connect(user)
            .setUniswapAddresses(mockUniswapAddresses.router, mockUniswapAddresses.factory)
        ).to.be.reverted;
      });

      it("Should accept and set the values", async function () {
        await expect(
          registrar.setUniswapAddresses(mockUniswapAddresses.router, mockUniswapAddresses.factory)
        ).to.not.be.reverted;
        let newFactoryAddr = await registrar.getUniswapFactoryAddress();
        let newRouterAddr = await registrar.getUniswapRouterAddress();
        expect(newFactoryAddr).to.equal(mockUniswapAddresses.factory);
        expect(newRouterAddr).to.equal(mockUniswapAddresses.router);
      });
    });

    describe("setAccountsContractAddressByChain and getAccountsContractAddressByChain", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(
          registrar
            .connect(user)
            .setAccountsContractAddressByChain(originatingChain, accountsContract)
        ).to.be.reverted;
      });

      it("Should accept and set the new value", async function () {
        await expect(
          registrar.setAccountsContractAddressByChain(originatingChain, accountsContract)
        ).to.not.be.reverted;
        let storedAddressString = await registrar.getAccountsContractAddressByChain(
          originatingChain
        );
        expect(storedAddressString).to.equal(accountsContract);
      });

      it("Should return the zero address for an unset chain", async function () {
        let testAddressString = await registrar.getAccountsContractAddressByChain("Avalanche");
        expect(testAddressString).to.equal("");
      });
    });

    describe("setTokenAccepted and isTokenAccepted", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setTokenAccepted(await user.getAddress(), true)).to.be
          .reverted;
      });

      it("Should accept and set the new value", async function () {
        await expect(registrar.setTokenAccepted(await user.getAddress(), true)).to.not.be.reverted;
        let returnedValue = await registrar.isTokenAccepted(await user.getAddress());
        expect(returnedValue).to.be.true;
      });
    });

    describe("setGasByToken and getGasByToken", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setGasByToken(await user.getAddress(), 1)).to.be
          .reverted;
      });

      it("Should accept and set the new value", async function () {
        await expect(registrar.setGasByToken(await user.getAddress(), 1)).to.not.be.reverted;
        let returnedValue = await registrar.getGasByToken(await user.getAddress());
        expect(returnedValue.toNumber()).to.equal(1);
      });
    });

    describe("thisChain", async function () {
      it("Should return the chain set during init", async function () {
        let returnedValue = await registrar.thisChain();
        expect(returnedValue).to.equal(originatingChain);
      });
    });

    describe("updateNetworkConnections and queryNetworkConnection", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(
          registrar.connect(user).updateNetworkConnections(
            "TestNet",
            DEFAULT_NETWORK_INFO,
            1 // POST
          )
        ).to.be.reverted;
      });

      it("Should revert if an invalid action is taken", async function () {
        await expect(
          registrar.updateNetworkConnections(
            "TestNet",
            DEFAULT_NETWORK_INFO,
            0 // POST
          )
        ).to.be.reverted;
      });

      it("Should accept and set the new value", async function () {
        let networkInfo = {
          ...DEFAULT_NETWORK_INFO,
          chainId: 42,
        };
        await registrar.updateNetworkConnections(
          "TestNet",
          networkInfo,
          1 // POST
        );
        let returnedValue = await registrar.queryNetworkConnection("TestNet");
        expect(returnedValue.chainId).to.equal(42);
      });

      it("Should delete a mapping when requested", async function () {
        let networkInfo = {
          ...DEFAULT_NETWORK_INFO,
          chainId: 42,
        };
        await registrar.updateNetworkConnections(
          "TestNet",
          networkInfo,
          1 // POST
        );
        let beforeReturnedValue = await registrar.queryNetworkConnection("TestNet");
        expect(beforeReturnedValue.chainId).to.equal(42);
        await registrar.updateNetworkConnections(
          "TestNet",
          networkInfo,
          2 // DELETE
        );
        let afterReturnedValue = await registrar.queryNetworkConnection("TestNet");
        expect(afterReturnedValue.chainId).to.equal(0);
      });
    });

    describe("set and get Strategy params", async function () {
      let strategyId = "0xffffffff"; // random 4-byte hash
      let strategyParams: LocalRegistrarLib.StrategyParamsStruct = {
        approvalState: StrategyApprovalState.NOT_APPROVED,
        network: originatingChain,
        lockedVaultAddr: "0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990",
        liquidVaultAddr: "0x000000000000000000000000000000000000dEaD",
      };

      it("Should be an owner restricted method", async function () {
        await expect(
          registrar
            .connect(user)
            .setStrategyParams(
              strategyId,
              strategyParams.network,
              strategyParams.lockedVaultAddr,
              strategyParams.liquidVaultAddr,
              strategyParams.approvalState
            )
        ).to.be.reverted;
      });

      it("Should accept and set new values", async function () {
        await expect(
          registrar.setStrategyParams(
            strategyId,
            strategyParams.network,
            strategyParams.lockedVaultAddr,
            strategyParams.liquidVaultAddr,
            strategyParams.approvalState
          )
        ).to.not.be.reverted;
        let returnedValue = await registrar.getStrategyParamsById(strategyId);
        expect(returnedValue.network).to.equal(strategyParams.network);
        expect(returnedValue.approvalState).to.equal(strategyParams.approvalState);
        expect(returnedValue.lockedVaultAddr).to.equal(strategyParams.lockedVaultAddr);
        expect(returnedValue.liquidVaultAddr).to.equal(strategyParams.liquidVaultAddr);
      });

      it("Should let the owner change the approval state", async function () {
        await expect(registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.APPROVED))
          .to.not.be.reverted;
        let returnedValue = await registrar.getStrategyApprovalState(strategyId);
        expect(returnedValue).to.equal(StrategyApprovalState.APPROVED);
        await expect(
          registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.WITHDRAW_ONLY)
        ).to.not.be.reverted;
        returnedValue = await registrar.getStrategyApprovalState(strategyId);
        expect(returnedValue).to.equal(StrategyApprovalState.WITHDRAW_ONLY);
        await expect(
          registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.DEPRECATED)
        ).to.not.be.reverted;
        returnedValue = await registrar.getStrategyApprovalState(strategyId);
        expect(returnedValue).to.equal(StrategyApprovalState.DEPRECATED);
        await expect(
          registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.NOT_APPROVED)
        ).to.not.be.reverted;
        returnedValue = await registrar.getStrategyApprovalState(strategyId);
        expect(returnedValue).to.equal(StrategyApprovalState.NOT_APPROVED);
      });
    });

    describe("set and get vaultOperatorApproved", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(
          registrar.connect(user).setVaultOperatorApproved(await user.getAddress(), true)
        ).to.be.reverted;
      });
      it("Should set and get the vault operator approval status", async function () {
        expect(await registrar.getVaultOperatorApproved(await user.getAddress())).to.be.false;
        await expect(registrar.setVaultOperatorApproved(await user.getAddress(), true)).to.not.be
          .reverted;
        expect(await registrar.getVaultOperatorApproved(await user.getAddress())).to.be.true;
      });
    });

    describe("set and get FeeSettingsByFeesType", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(
          registrar
            .connect(user)
            .setFeeSettingsByFeesType(FeeTypes.Default, 1, ethers.constants.AddressZero)
        ).to.be.reverted;
      });

      it("Should revert if a single fee meets or exceeds 100%", async function () {
        // setting to 100% should fail outright
        await expect(
          registrar.setFeeSettingsByFeesType(FeeTypes.Deposit, 10000, await user.getAddress())
        ).to.be.revertedWith("Fees meet or exceed 100%");
      });

      it("Should revert if combined Withdraw-related fees meet or exceeds 100%", async function () {
        // First set a Withdraw Fee as 50%
        await expect(
          registrar.setFeeSettingsByFeesType(FeeTypes.Withdraw, 5000, await user.getAddress())
        ).to.not.be.reverted;

        // Trying to set an Early Locked Withdraw Fee at, or above, 50% should fail
        await expect(
          registrar.setFeeSettingsByFeesType(
            FeeTypes.EarlyLockedWithdraw,
            BigNumber.from(6000),
            await user.getAddress()
          )
        ).to.be.revertedWith("Fees meet or exceed 100%");
      });

      it("Should set a fee rate (in bps) and a payout address", async function () {
        await expect(
          registrar.setFeeSettingsByFeesType(
            FeeTypes.Harvest,
            BigNumber.from(5000),
            await user.getAddress()
          )
        ).to.not.be.reverted;
        let afterHarvestFee = await registrar.getFeeSettingsByFeeType(FeeTypes.Harvest);
        expect(afterHarvestFee.bps).to.equal(5000);
        expect(afterHarvestFee.payoutAddress).to.equal(await user.getAddress());
      });
    });
  });

  describe("Events", function () {
    let strategyId = "0xffffffff"; // random 4-byte hash
    let strategyParams: LocalRegistrarLib.StrategyParamsStruct = {
      approvalState: StrategyApprovalState.APPROVED,
      network: originatingChain,
      lockedVaultAddr: "0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990",
      liquidVaultAddr: "0x000000000000000000000000000000000000dEaD",
    };

    it("should emit RebalanceParamsUpdated", async function () {
      await expect(registrar.setRebalanceParams(defaultRebalParams)).to.emit(
        registrar,
        "RebalanceParamsUpdated"
      );
    });

    it("should emit TokenAcceptanceUpdated", async function () {
      await expect(registrar.setTokenAccepted(await user.getAddress(), true)).to.emit(
        registrar,
        "TokenAcceptanceUpdated"
      );
    });

    it("should emit StrategyApprovalUpdated", async function () {
      await expect(
        registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.APPROVED)
      ).to.emit(registrar, "StrategyApprovalUpdated");
    });

    it("should emit StrategyParamsUpdated", async function () {
      await expect(
        registrar.setStrategyParams(
          strategyId,
          strategyParams.network,
          strategyParams.liquidVaultAddr,
          strategyParams.lockedVaultAddr,
          strategyParams.approvalState
        )
      ).to.emit(registrar, "StrategyParamsUpdated");
    });

    it("should emit GasFeeUpdated", async function () {
      await expect(registrar.setGasByToken(await user.getAddress(), 1)).to.emit(
        registrar,
        "GasFeeUpdated"
      );
    });
  });
});
