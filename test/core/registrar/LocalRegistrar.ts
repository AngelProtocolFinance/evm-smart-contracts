import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import hre from "hardhat";
import {FeeTypes, StrategyApprovalState, getSigners} from "utils";

import {LocalRegistrar, LocalRegistrar__factory} from "typechain-types";
import {DEFAULT_FEE_STRUCT, DEFAULT_NETWORK_INFO} from "test/utils";

describe("Local Registrar", function () {
  const {ethers, upgrades} = hre;

  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let Registrar: LocalRegistrar__factory;

  let defaultRebalParams = {
    rebalanceLiquidProfits: false,
    lockedRebalanceToLiquid: 75,
    interestDistribution: 20,
    lockedPrincipleToLiquid: false,
    principleDistribution: 0,
    basis: 100,
  };

  let defaultApParams = {
    routerAddr: ethers.constants.AddressZero,
    refundAddr: ethers.constants.AddressZero,
  };

  let mockUniswapAddresses = {
    router: "0x0000000000000000000000000000000000111111",
    factory: "0x0000000000000000000000000000000002222222",
  };

  let originatingChain = "polygon";
  let accountsContract = "0x000000000000000000000000000000000000dead";

  async function deployRegistrarAsProxy(): Promise<LocalRegistrar> {
    const {proxyAdmin, apTeam3} = await getSigners(hre);
    owner = proxyAdmin;
    user = apTeam3;
    Registrar = (await ethers.getContractFactory(
      "LocalRegistrar",
      proxyAdmin
    )) as LocalRegistrar__factory;
    const registrar = (await upgrades.deployProxy(Registrar)) as LocalRegistrar;
    await registrar.deployed();
    return registrar;
  }

  describe("Deployment", function () {
    let registrar: LocalRegistrar;
    beforeEach(async function () {
      registrar = await deployRegistrarAsProxy();
    });

    it("Should successfully deploy the contract as an upgradable proxy", async function () {
      expect(registrar.address);
      expect(await upgrades.upgradeProxy(registrar.address, Registrar));
    });

    it("Should set the right owner", async function () {
      expect(await registrar.owner()).to.equal(owner.address);
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

      let apParams = await registrar.getAngelProtocolParams();
      expect(apParams.routerAddr).to.equal(defaultApParams.routerAddr);
    });

    it("Should not allow a non-owner to run an upgrade", async function () {
      const UserRegistrar = (await ethers.getContractFactory(
        "LocalRegistrar",
        user
      )) as LocalRegistrar__factory;
      await expect(upgrades.upgradeProxy(registrar.address, UserRegistrar)).to.be.reverted;
    });
  });

  describe("Setters and Getters", function () {
    let registrar: LocalRegistrar;
    beforeEach(async function () {
      registrar = await deployRegistrarAsProxy();
    });

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

    describe("setAngelProtocolParams and getAngelProtocolParams", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setAngelProtocolParams(defaultApParams)).to.be
          .reverted;
      });

      it("Should accept and set the values", async function () {
        let newValues = defaultApParams;
        newValues.routerAddr = user.address;
        await expect(registrar.setAngelProtocolParams(newValues)).to.not.be.reverted;
        let returnedValues = await registrar.getAngelProtocolParams();
        expect(returnedValues.routerAddr).to.equal(newValues.routerAddr);
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
        await expect(registrar.connect(user).setTokenAccepted(user.address, true)).to.be.reverted;
      });

      it("Should accept and set the new value", async function () {
        await expect(registrar.setTokenAccepted(user.address, true)).to.not.be.reverted;
        let returnedValue = await registrar.isTokenAccepted(user.address);
        expect(returnedValue).to.be.true;
      });
    });

    describe("setGasByToken and getGasByToken", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setGasByToken(user.address, 1)).to.be.reverted;
      });

      it("Should accept and set the new value", async function () {
        await expect(registrar.setGasByToken(user.address, 1)).to.not.be.reverted;
        let returnedValue = await registrar.getGasByToken(user.address);
        expect(returnedValue.toNumber()).to.equal(1);
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
      let strategyParams = {
        approvalState: StrategyApprovalState.NOT_APPROVED,
        network: originatingChain,
        Locked: {
          Type: 0,
          vaultAddr: "0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990",
        },
        Liquid: {
          Type: 1,
          vaultAddr: "0x000000000000000000000000000000000000dEaD",
        },
      };

      it("Should be an owner restricted method", async function () {
        await expect(
          registrar
            .connect(user)
            .setStrategyParams(
              strategyId,
              strategyParams.network,
              strategyParams.Locked.vaultAddr,
              strategyParams.Liquid.vaultAddr,
              strategyParams.approvalState
            )
        ).to.be.reverted;
      });

      it("Should accept and set new values", async function () {
        await expect(
          registrar.setStrategyParams(
            strategyId,
            strategyParams.network,
            strategyParams.Locked.vaultAddr,
            strategyParams.Liquid.vaultAddr,
            strategyParams.approvalState
          )
        ).to.not.be.reverted;
        let returnedValue = await registrar.getStrategyParamsById(strategyId);
        expect(returnedValue.network).to.equal(strategyParams.network);
        expect(returnedValue.approvalState).to.equal(strategyParams.approvalState);
        expect(returnedValue.Locked.Type).to.equal(strategyParams.Locked.Type);
        expect(returnedValue.Locked.vaultAddr).to.equal(strategyParams.Locked.vaultAddr);
        expect(returnedValue.Liquid.Type).to.equal(strategyParams.Liquid.Type);
        expect(returnedValue.Liquid.vaultAddr).to.equal(strategyParams.Liquid.vaultAddr);
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
        await expect(registrar.connect(user).setVaultOperatorApproved(user.address, true)).to.be
          .reverted;
      });
      it("Should set and get the vault operator approval status", async function () {
        expect(await registrar.getVaultOperatorApproved(user.address)).to.be.false;
        await expect(registrar.setVaultOperatorApproved(user.address, true)).to.not.be.reverted;
        expect(await registrar.getVaultOperatorApproved(user.address)).to.be.true;
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
      it("Should set and get the vault operator approval status", async function () {
        await expect(registrar.setFeeSettingsByFeesType(FeeTypes.Harvest, 1, user.address)).to.not
          .be.reverted;
        let afterHarvestFee = await registrar.getFeeSettingsByFeeType(FeeTypes.Harvest);
        expect(afterHarvestFee.bps).to.equal(1);
        expect(afterHarvestFee.payoutAddress).to.equal(user.address);
      });
    });
  });

  describe("Events", function () {
    let registrar: LocalRegistrar;
    beforeEach(async function () {
      registrar = await deployRegistrarAsProxy();
    });
    let strategyId = "0xffffffff"; // random 4-byte hash
    let strategyParams = {
      approvalState: StrategyApprovalState.APPROVED,
      network: originatingChain,
      Locked: {
        Type: 0,
        vaultAddr: "0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990",
      },
      Liquid: {
        Type: 1,
        vaultAddr: "0x000000000000000000000000000000000000dEaD",
      },
    };

    it("should emit RebalanceParamsUpdated", async function () {
      await expect(registrar.setRebalanceParams(defaultRebalParams)).to.emit(
        registrar,
        "RebalanceParamsUpdated"
      );
    });

    it("should emit AngelProtocolParamsUpdated", async function () {
      await expect(registrar.setAngelProtocolParams(defaultApParams)).to.emit(
        registrar,
        "AngelProtocolParamsUpdated"
      );
    });

    it("should emit TokenAcceptanceUpdated", async function () {
      await expect(registrar.setTokenAccepted(user.address, true)).to.emit(
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
          strategyParams.Liquid.vaultAddr,
          strategyParams.Locked.vaultAddr,
          strategyParams.approvalState
        )
      ).to.emit(registrar, "StrategyParamsUpdated");
    });

    it("should emit GasFeeUpdated", async function () {
      await expect(registrar.setGasByToken(user.address, 1)).to.emit(registrar, "GasFeeUpdated");
    });
  });
});
