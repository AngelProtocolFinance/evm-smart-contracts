import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import hre from "hardhat";
import {
  AccountsDeployContract,
  AccountsDeployContract__factory,
  Registrar,
  Registrar__factory,
  SubDao,
  SubDaoEmitter,
  SubDaoEmitter__factory,
  SubDaoLib,
  SubDaoLib__factory,
  SubDao__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {genWallet, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils/deployTestFacet";
import {FakeContract, smock} from "@defi-wonderland/smock";
import {expect, use} from "chai";
import {DEFAULT_REGISTRAR_CONFIG, EndowmentType, TokenType, VeTypeEnum} from "test/utils";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";

use(smock.matchers);

describe("AccountsDeployContract", function () {
  const {ethers} = hre;

  const endowId = 1;

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;

  let facet: AccountsDeployContract;
  let state: TestFacetProxyContract;

  let registrarFake: FakeContract<Registrar>;
  let subdaoFake: FakeContract<SubDao>;
  let subdaoEmitterFake: FakeContract<SubDaoEmitter>;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;

    const subdaoLibFake: FakeContract<SubDaoLib> = await smock.fake<SubDaoLib>(
      new SubDaoLib__factory()
    );
    subdaoFake = await smock.fake<SubDao>(
      new SubDao__factory({
        "contracts/normalized_endowment/subdao/SubDaoLib.sol:SubDaoLib": subdaoLibFake.address,
      })
    );
    subdaoEmitterFake = await smock.fake<SubDaoEmitter>(new SubDaoEmitter__factory());
    registrarFake = await smock.fake<Registrar>(new Registrar__factory());

    const config: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      subdaoGovContract: subdaoFake.address,
      proxyAdmin: proxyAdmin.address,
      subdaoEmitter: subdaoEmitterFake.address,
    };
    registrarFake.queryConfig.returns(config);
  });

  beforeEach(async function () {
    const Facet = new AccountsDeployContract__factory(accOwner);
    const facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    await state.setConfig({
      owner: accOwner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: registrarFake.address,
      nextAccountId: 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsDeployContract__factory.connect(state.address, accOwner);
  });

  describe("upon createDaoContract", () => {
    it("reverts if caller is not Accounts Diamond itself", async () => {
      await expect(
        facet.connect(endowOwner).createDaoContract({
          endowOwner: endowOwner.address,
          endowType: EndowmentType.Charity,
          expirationPeriod: 0,
          id: endowId,
          owner: endowOwner.address,
          proposalDeposit: 1,
          quorum: 1,
          registrarContract: registrarFake.address,
          snapshotPeriod: 0,
          threshold: 0,
          timelockPeriod: 0,
          token: {
            token: TokenType.New,
            data: {
              existingData: "",
              newInitialSupply: 0,
              newName: "",
              newSymbol: "",
              veBondingDecimals: 18,
              veBondingName: "",
              veBondingPeriod: 0,
              veBondingReserveDecimals: 18,
              veBondingReserveDenom: "",
              veBondingSymbol: "",
              veBondingType: {
                ve_type: VeTypeEnum.Constant,
                data: {
                  power: 0,
                  scale: 0,
                  slope: 0,
                  value: 0,
                },
              },
            },
          },
          votingPeriod: 0,
        })
      ).to.be.revertedWith("Unauthorized");
    });
  });
});
