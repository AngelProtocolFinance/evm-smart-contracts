import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_REGISTRAR_CONFIG,
  DEFAULT_STRATEGY_SELECTOR,
} from "test/utils";
import {
  AccountsDonationMatch,
  AccountsDonationMatch__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {LibAccounts} from "typechain-types/contracts/core/accounts/facets/AccountsDonationMatch";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils/deployTestFacet";

use(smock.matchers);

describe("AccountsDonationMatch", function () {
  const {ethers} = hre;

  const accountId = 1;

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;

  let facet: AccountsDonationMatch;
  let state: TestFacetProxyContract;

  let endowment: AccountStorage.EndowmentStruct;
  let treasuryAddress: string;

  let registrarFake: FakeContract<Registrar>;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;
    treasuryAddress = signers.apTeam2.address;

    endowment = {...DEFAULT_CHARITY_ENDOWMENT, owner: endowOwner.address};
  });

  beforeEach(async function () {
    let Facet = new AccountsDonationMatch__factory(accOwner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });

    const config: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      treasury: treasuryAddress,
    };
    registrarFake.queryConfig.returns(config);

    await state.setEndowmentDetails(accountId, endowment);
    await state.setConfig({
      owner: accOwner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: registrarFake.address,
      nextAccountId: accountId + 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsDonationMatch__factory.connect(state.address, endowOwner);
  });

  describe("upon depositDonationMatchERC20", () => {
    it("reverts ");
  });
});
