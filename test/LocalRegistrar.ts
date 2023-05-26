import {expect} from "chai";
import {ethers, upgrades} from "hardhat";
import {LocalRegistrar, LocalRegistrar__factory} from "../typechain-types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {StrategyApprovalState} from "../utils/test/ILocalRegistrarHelpers";

describe("Local Registrar", function () {
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
    protocolTaxRate: 2,
    protocolTaxBasis: 100,
    protocolTaxCollector: ethers.constants.AddressZero,
    routerAddr: ethers.constants.AddressZero,
    refundAddr: ethers.constants.AddressZero,
  };

  let originatingChain = "polygon";
  let accountsContract = "0x000000000000000000000000000000000000dead";

  async function deployRegistrarAsProxy(): Promise<LocalRegistrar> {
    [owner, user] = await ethers.getSigners();
    Registrar = (await ethers.getContractFactory("LocalRegistrar")) as LocalRegistrar__factory;
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
      expect(apParams.protocolTaxRate).to.equal(defaultApParams.protocolTaxRate);
      expect(apParams.protocolTaxBasis).to.equal(defaultApParams.protocolTaxBasis);
      expect(apParams.protocolTaxCollector).to.equal(defaultApParams.protocolTaxCollector);
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
        await registrar.setRebalanceParams(newValues);
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
        newValues.protocolTaxRate = 0;
        await registrar.setAngelProtocolParams(newValues);
        let returnedValues = await registrar.getAngelProtocolParams();
        expect(returnedValues.protocolTaxRate).to.equal(newValues.protocolTaxRate);
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
        await registrar.setAccountsContractAddressByChain(originatingChain, accountsContract);
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
        await registrar.setTokenAccepted(user.address, true);
        let returnedValue = await registrar.isTokenAccepted(user.address);
        expect(returnedValue).to.be.true;
      });
    });

    describe("setGasByToken and getGasByToken", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setGasByToken(user.address, 1)).to.be.reverted;
      });

      it("Should accept and set the new value", async function () {
        await registrar.setGasByToken(user.address, 1);
        let returnedValue = await registrar.getGasByToken(user.address);
        expect(returnedValue.toNumber()).to.equal(1);
      });
    });

    describe("set and get Strategy params", async function () {
      let strategyId = "0xffffffff"; // random 4-byte hash
      let strategyParams = {
        approvalState: StrategyApprovalState.NOT_APPROVED,
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
              strategyParams.Locked.vaultAddr,
              strategyParams.Liquid.vaultAddr,
              strategyParams.approvalState
            )
        ).to.be.reverted;
      });

      it("Should accept and set new values", async function () {
        await registrar.setStrategyParams(
          strategyId,
          strategyParams.Locked.vaultAddr,
          strategyParams.Liquid.vaultAddr,
          strategyParams.approvalState
        );
        let returnedValue = await registrar.getStrategyParamsById(strategyId);
        expect(returnedValue.approvalState).to.equal(strategyParams.approvalState);
        expect(returnedValue.Locked.Type).to.equal(strategyParams.Locked.Type);
        expect(returnedValue.Locked.vaultAddr).to.equal(strategyParams.Locked.vaultAddr);
        expect(returnedValue.Liquid.Type).to.equal(strategyParams.Liquid.Type);
        expect(returnedValue.Liquid.vaultAddr).to.equal(strategyParams.Liquid.vaultAddr);
      });

      it("Should let the owner change the approval state", async function () {
        await registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.APPROVED);
        let returnedValue = await registrar.getStrategyApprovalState(strategyId);
        expect(returnedValue).to.equal(StrategyApprovalState.APPROVED);
        await registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.WITHDRAW_ONLY);
        returnedValue = await registrar.getStrategyApprovalState(strategyId);
        expect(returnedValue).to.equal(StrategyApprovalState.WITHDRAW_ONLY);
        await registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.DEPRECATED);
        returnedValue = await registrar.getStrategyApprovalState(strategyId);
        expect(returnedValue).to.equal(StrategyApprovalState.DEPRECATED);
        await registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.NOT_APPROVED);
        returnedValue = await registrar.getStrategyApprovalState(strategyId);
        expect(returnedValue).to.equal(StrategyApprovalState.NOT_APPROVED);
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
      Locked: {
        Type: 0,
        vaultAddr: "0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990",
      },
      Liquid: {
        Type: 1,
        vaultAddr: "0x000000000000000000000000000000000000dEaD",
      },
    };

    it("should emit RebalanceParamsChanged", async function () {
      await expect(registrar.setRebalanceParams(defaultRebalParams)).to.emit(
        registrar,
        "RebalanceParamsChanged"
      );
    });

    it("should emit AngelProtocolParamsChanged", async function () {
      await expect(registrar.setAngelProtocolParams(defaultApParams)).to.emit(
        registrar,
        "AngelProtocolParamsChanged"
      );
    });

    it("should emit TokenAcceptanceChanged", async function () {
      await expect(registrar.setTokenAccepted(user.address, true)).to.emit(
        registrar,
        "TokenAcceptanceChanged"
      );
    });

    it("should emit StrategyApprovalChanged", async function () {
      await expect(
        registrar.setStrategyApprovalState(strategyId, StrategyApprovalState.APPROVED)
      ).to.emit(registrar, "StrategyApprovalChanged");
    });

    it("should emit StrategyParams Changed", async function () {
      await expect(
        registrar.setStrategyParams(
          strategyId,
          strategyParams.Liquid.vaultAddr,
          strategyParams.Locked.vaultAddr,
          strategyParams.approvalState
        )
      ).to.emit(registrar, "StrategyParamsChanged");
    });

    it("should emit GasFeeUpdated", async function () {
      await expect(registrar.setGasByToken(user.address, 1)).to.emit(registrar, "GasFeeUpdated");
    });
  });
});
