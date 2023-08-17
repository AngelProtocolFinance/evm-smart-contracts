import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {deployDummyERC20} from "tasks/helpers";
import {
  DEFAULT_ACCOUNTS_CONFIG,
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_PERMISSIONS_STRUCT,
  DEFAULT_REGISTRAR_CONFIG,
  wait,
} from "test/utils";
import {
  AccountsSwapRouter,
  AccountsSwapRouter__factory,
  DummyAggregatorV3Interface,
  DummyAggregatorV3Interface__factory,
  DummyERC20,
  DummySwapRouter,
  DummySwapRouter__factory,
  DummyUniswapV3Factory,
  DummyUniswapV3Factory__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {VaultType, genWallet, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";
import {time} from "@nomicfoundation/hardhat-network-helpers";

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
  let chainlink: FakeContract<DummyAggregatorV3Interface>;
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

    chainlink = await smock.fake<DummyAggregatorV3Interface>(
      new DummyAggregatorV3Interface__factory()
    );

    const UniswapRouter = new DummySwapRouter__factory(owner);
    uniswapRouter = await UniswapRouter.deploy();

    const UniswapFactory = new DummyUniswapV3Factory__factory(owner);
    uniswapFactory = await UniswapFactory.deploy();

    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    const config = {
      ...DEFAULT_ACCOUNTS_CONFIG,
      registrarContract: registrar.address,
    };
    await wait(state.setConfig(config));

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

      it("reverts if tokenIn is the same as tokenOut", async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        let token = genWallet().address;
        await expect(
          facet.swapToken(ACCOUNT_ID, VaultType.LOCKED, token, 1, token, 0)
        ).to.be.revertedWith("Invalid Swap Input: Same Token");
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
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endow));
        await expect(
          facet
            .connect(user)
            .swapToken(ACCOUNT_ID, VaultType.LOCKED, genWallet().address, 1, genWallet().address, 1)
        ).to.be.revertedWith("Requested swap amount is greater than Endowment balance");
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
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endow));

        await expect(
          facet
            .connect(user)
            .swapToken(ACCOUNT_ID, VaultType.LIQUID, genWallet().address, 1, genWallet().address, 1)
        ).to.be.revertedWith("Requested swap amount is greater than Endowment balance");
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
          owner: owner.address,
        };
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endow));
        registrar.queryTokenPriceFeed.returns(ethers.constants.AddressZero);
        let token = genWallet().address;
        await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token, 100, 100));

        await expect(
          facet.swapToken(ACCOUNT_ID, VaultType.LIQUID, token, 1, genWallet().address, 1)
        ).to.be.revertedWith(
          "Chainlink Oracle Price Feed contracts are required for all tokens swapping to/from"
        );
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
          owner: owner.address,
        };
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endow));
        registrar.queryTokenPriceFeed.returns(chainlink.address);
        await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token.address, 100, 100));

        await expect(
          facet.swapToken(ACCOUNT_ID, VaultType.LIQUID, token.address, 1, genWallet().address, 1)
        ).to.be.revertedWith("SafeERC20: ERC20 operation did not succeed");
      });
    });

    describe("upon calling internal method `swap`", async function () {
      let token1: DummyERC20;
      let token2: DummyERC20;
      const AMT1 = 1000;
      beforeEach(async function () {
        registrar.queryConfig.returns({
          ...DEFAULT_REGISTRAR_CONFIG,
          uniswapRouter: uniswapRouter.address,
          uniswapFactory: uniswapFactory.address,
        });
        registrar.isTokenAccepted.returns(true);
        registrar.queryTokenPriceFeed.returns(chainlink.address);

        const endow = {
          ...DEFAULT_CHARITY_ENDOWMENT,
          owner: owner.address,
        };
        token1 = await deployDummyERC20(owner);
        token2 = await deployDummyERC20(owner);
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endow));
        await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token1.address, AMT1, 0));
      });

      describe("revert cases", async function () {
        beforeEach(async function () {
          await wait(token1.mint(facet.address, AMT1));
        });
        it("reverts if the price feed response is invalid", async function () {
          const ANSWER = 0;
          chainlink.latestRoundData.returns([0, ANSWER, 0, 0, 0]);
          await expect(
            facet.swapToken(ACCOUNT_ID, VaultType.LOCKED, token1.address, AMT1, token2.address, 1)
          ).to.be.revertedWith("Invalid price feed answer");
        });

        it("reverts if the factory cant find a pool", async function () {
          const ANSWER = 1;
          let currTime = await time.latest();
          chainlink.latestRoundData.returns([0, ANSWER, 0, currTime, 0]);
          await expect(
            facet.swapToken(ACCOUNT_ID, VaultType.LOCKED, token1.address, AMT1, token2.address, 1)
          ).to.be.revertedWith("No pool found to swap");
        });

        it("reverts if output is less than expected", async function () {
          const ANSWER = 1;
          let currTime = await time.latest();
          chainlink.latestRoundData.returns([0, ANSWER, 0, currTime, 0]);
          await wait(uniswapFactory.setPool(genWallet().address));
          await wait(uniswapRouter.setOutputValue(0));
          await expect(
            facet.swapToken(ACCOUNT_ID, VaultType.LOCKED, token1.address, AMT1, token2.address, 1)
          ).to.be.revertedWith("Output funds less than the minimum output");
        });
      });

      describe("successfully swaps", async function () {
        const AMT1 = 1000;
        const AMT2 = 1000;
        beforeEach(async function () {
          const ANSWER = 1;
          let currTime = await time.latest();
          chainlink.latestRoundData.returns([0, ANSWER, 0, currTime, 0]);
          await wait(uniswapFactory.setPool(genWallet().address));
          await wait(uniswapRouter.setOutputValue(AMT2));
        });

        it("swaps and updates the locked balance successfully", async function () {
          await wait(token1.mint(facet.address, AMT1));
          await wait(token2.mint(uniswapRouter.address, AMT2));
          await wait(uniswapRouter.setOutputValue(AMT2));
          await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token1.address, AMT1, 0));
          await expect(
            facet.swapToken(ACCOUNT_ID, VaultType.LOCKED, token1.address, AMT1, token2.address, 1)
          )
            .to.emit(facet, "TokenSwapped")
            .withArgs(ACCOUNT_ID, VaultType.LOCKED, token1.address, AMT1, token2.address, AMT2);

          const [lockBal_token1, liqBal_token1] = await state.getEndowmentTokenBalance(
            ACCOUNT_ID,
            token1.address
          );
          const [lockBal_token2, liqBal_token2] = await state.getEndowmentTokenBalance(
            ACCOUNT_ID,
            token2.address
          );
          expect(lockBal_token1).to.equal(0);
          expect(liqBal_token1).to.equal(0);
          expect(lockBal_token2).to.equal(AMT2);
          expect(liqBal_token2).to.equal(0);
        });

        it("swaps and updates the liquid balance successfully", async function () {
          await wait(token1.mint(facet.address, AMT1));
          await wait(token2.mint(uniswapRouter.address, AMT2));
          await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token1.address, 0, AMT1));
          await expect(
            facet.swapToken(ACCOUNT_ID, VaultType.LIQUID, token1.address, AMT1, token2.address, 1)
          )
            .to.emit(facet, "TokenSwapped")
            .withArgs(ACCOUNT_ID, VaultType.LIQUID, token1.address, AMT1, token2.address, AMT2);

          const [lockBal_token1, liqBal_token1] = await state.getEndowmentTokenBalance(
            ACCOUNT_ID,
            token1.address
          );
          const [lockBal_token2, liqBal_token2] = await state.getEndowmentTokenBalance(
            ACCOUNT_ID,
            token2.address
          );
          expect(lockBal_token1).to.equal(0);
          expect(liqBal_token1).to.equal(0);
          expect(lockBal_token2).to.equal(0);
          expect(liqBal_token2).to.equal(AMT2);
        });
      });
    });
  });
});
