import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {FakeContract, smock} from "@defi-wonderland/smock";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {getSigners, genWallet} from "utils";
import {
  DEFAULT_ACCOUNTS_CONFIG,
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_REGISTRAR_CONFIG,
  DEFAULT_PERMISSIONS_STRUCT,
  VaultType,
} from "test/utils";
import {
  AccountsSwapRouter,
  AccountsSwapRouter__factory,
  TestFacetProxyContract,
  Registrar,
  Registrar__factory,
  DummySwapRouter,
  DummySwapRouter__factory,
  DummyUniswapV3Factory,
  DummyUniswapV3Factory__factory,
} from "typechain-types";
import "../../utils/setup";
import {endowmentMultisig} from "typechain-types/contracts/normalized_endowment";
import { deployDummyERC20 } from "tasks/helpers";

use(smock.matchers);

describe("AccountsSwapRouter", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;
  let facet: AccountsSwapRouter;
  let facetImpl: AccountsSwapRouter;
  let state: TestFacetProxyContract;
  let registrar: FakeContract<Registrar>;
  let uniswapRouter: DummySwapRouter;
  let uniswapFactory: DummyUniswapV3Factory;

  const ACCOUNT_ID = 1;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    user = signers.deployer;

    let Facet = new AccountsSwapRouter__factory(owner);
    facetImpl = await Facet.deploy();
  });

  beforeEach(async function () {
    registrar = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });

    const UniswapRouter = new DummySwapRouter__factory(owner);
    uniswapRouter = await UniswapRouter.deploy();

    const UniswapFactory = new DummyUniswapV3Factory__factory(owner);
    uniswapFactory = await UniswapFactory.deploy();

    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    const config = {
      ...DEFAULT_ACCOUNTS_CONFIG,
      registrarContract: registrar.address,
    };
    await state.setConfig(config);

    facet = AccountsSwapRouter__factory.connect(state.address, owner);
  });

  describe("upon swapToken", async function () {
    describe("revert cases", async function () {
      it("reverts if the uniswapRouter isn't set", async function () {
        await expect(
          facet.swapToken(
            ACCOUNT_ID,
            VaultType.LOCKED,
            ethers.constants.AddressZero,
            0,
            ethers.constants.AddressZero,
            0
          )
        ).to.be.revertedWith("Uniswap Router address is not set in Registrar");
      });
  
      it("reverts if the uniswap Factory isn't set", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
        });
        await expect(
          facet.swapToken(
            ACCOUNT_ID,
            VaultType.LOCKED,
            ethers.constants.AddressZero,
            0,
            ethers.constants.AddressZero,
            0
          )
        ).to.be.revertedWith("Uniswap Factory addresses is not set in Registrar");
      });
  
      it("reverts if the amountIn is zero", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        await expect(
          facet.swapToken(
            ACCOUNT_ID,
            VaultType.LOCKED,
            ethers.constants.AddressZero,
            0,
            ethers.constants.AddressZero,
            0
          )
        ).to.be.revertedWith("Invalid Swap Input: Zero Amount");
      });
  
      it("reverts if the tokenIn is the zero address", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        await expect(
          facet.swapToken(
            ACCOUNT_ID,
            VaultType.LOCKED,
            ethers.constants.AddressZero,
            1,
            genWallet().address,
            0
          )
        ).to.be.revertedWith("Invalid Swap Input: Zero Address");
      });
  
      it("reverts if the tokenOut is the zero address", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        await expect(
          facet.swapToken(
            ACCOUNT_ID,
            VaultType.LOCKED,
            genWallet().address,
            1,
            ethers.constants.AddressZero,
            0
          )
        ).to.be.revertedWith("Invalid Swap Input: Zero Address");
      });
  
      it("reverts if the slippage is too high", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        await expect(
          facet.swapToken(
            ACCOUNT_ID,
            VaultType.LOCKED,
            genWallet().address,
            1,
            genWallet().address,
            ethers.BigNumber.from(10).pow(18)
          )
        ).to.be.revertedWith("Invalid Swap Input: Token Out slippage set too high");
      });
  
      it("reverts if the token isn't accepted", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        registrar.isTokenAccepted.returns(false);
  
        await expect(
          facet.swapToken(
            ACCOUNT_ID,
            VaultType.LOCKED,
            genWallet().address,
            1,
            genWallet().address,
            1
          )
        ).to.be.revertedWith("Output token not in an Accepted Tokens List");
      });
  
      it("reverts if locked vault mgmt isnt allowed", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        registrar.isTokenAccepted.returns(true);
  
        await expect(
          facet.swapToken(
            ACCOUNT_ID,
            VaultType.LOCKED,
            genWallet().address,
            1,
            genWallet().address,
            1
          )
        ).to.be.revertedWith("Unauthorized");
      });
  
      it("reverts if liquid vault mgmt isnt allowed", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        registrar.isTokenAccepted.returns(true);
  
        await expect(
          facet.swapToken(
            ACCOUNT_ID,
            VaultType.LIQUID,
            genWallet().address,
            1,
            genWallet().address,
            1
          )
        ).to.be.revertedWith("Unauthorized");
      });
  
      it("reverts if locked token balance is insufficient", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        registrar.isTokenAccepted.returns(true);
        const endow = DEFAULT_CHARITY_ENDOWMENT;
        endow.settingsController.lockedInvestmentManagement = {
          ...DEFAULT_PERMISSIONS_STRUCT,
          delegate: {
            expires: 0,
            addr: user.address,
          },
        };
        await state.setEndowmentDetails(ACCOUNT_ID, endow);
        await expect(
          facet
            .connect(user)
            .swapToken(ACCOUNT_ID, VaultType.LOCKED, genWallet().address, 1, genWallet().address, 1)
        ).to.be.revertedWith("Requested swap amount is greater than Endowment Locked balance");
      });
  
      it("reverts if liquid token balance is insufficient", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        registrar.isTokenAccepted.returns(true);
        const endow = DEFAULT_CHARITY_ENDOWMENT;
        endow.settingsController.liquidInvestmentManagement = {
          ...DEFAULT_PERMISSIONS_STRUCT,
          delegate: {
            expires: 0,
            addr: user.address,
          },
        };
        await state.setEndowmentDetails(ACCOUNT_ID, endow);
  
        await expect(
          facet
            .connect(user)
            .swapToken(ACCOUNT_ID, VaultType.LIQUID, genWallet().address, 1, genWallet().address, 1)
        ).to.be.revertedWith("Requested swap amount is greater than Endowment Liquid balance");
      });
  
      it("reverts if the chainlink price oracle contract is not set in the registrar nor in state PriceFeeds", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        registrar.isTokenAccepted.returns(true);
        const endow = {
          ...DEFAULT_CHARITY_ENDOWMENT,
          owner: owner.address
        }
        await state.setEndowmentDetails(ACCOUNT_ID, endow);
        registrar.queryTokenPriceFeed.returns(ethers.constants.AddressZero);
        let token = genWallet().address;
        await state.setEndowmentTokenBalance(ACCOUNT_ID, token, 100, 100)
  
        await expect(
          facet.swapToken(
            ACCOUNT_ID, 
            VaultType.LIQUID, 
            token, 
            1, 
            genWallet().address, 
            1
          )
        ).to.be.revertedWith("Chainlink Oracle Price Feed contracts are required for all tokens swapping to/from");
      });

      it("reverts if the token approval fails", async function () {
        let token = await deployDummyERC20(owner);
        await token.setApproveAllowed(false);
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        registrar.isTokenAccepted.returns(true);
        const endow = {
          ...DEFAULT_CHARITY_ENDOWMENT,
          owner: owner.address
        }
        await state.setEndowmentDetails(ACCOUNT_ID, endow);
        registrar.queryTokenPriceFeed.returns(genWallet().address);
        await state.setEndowmentTokenBalance(ACCOUNT_ID, token.address, 100, 100)

        await expect(
          facet.swapToken(
            ACCOUNT_ID, 
            VaultType.LIQUID, 
            token.address, 
            1, 
            genWallet().address, 
            1
          )
        ).to.be.revertedWith("Approval failed");
      });
    });
  });
});
