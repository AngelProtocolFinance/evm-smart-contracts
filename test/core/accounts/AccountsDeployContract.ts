import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {DEFAULT_REGISTRAR_CONFIG, EndowmentType, TokenType, VeTypeEnum} from "test/utils";
import {
  AccountsDeployContract,
  AccountsDeployContract__factory,
  Registrar,
  Registrar__factory,
  SubDao,
  SubDaoEmitter,
  SubDaoEmitter__factory,
  SubDao__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {genWallet, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils/deployTestFacet";

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

    subdaoFake = await smock.fake<SubDao>(
      new SubDao__factory({
        "contracts/normalized_endowment/subdao/SubDaoLib.sol:SubDaoLib": genWallet().address,
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
          expirationPeriod: 1,
          id: endowId,
          owner: endowOwner.address,
          proposalDeposit: 1,
          quorum: 1,
          registrarContract: registrarFake.address,
          snapshotPeriod: 1,
          threshold: 1,
          timelockPeriod: 1,
          token: {
            token: TokenType.New,
            data: {
              existingData: genWallet().address,
              newInitialSupply: 1,
              newName: "newname",
              newSymbol: "NEW",
              veBondingDecimals: 18,
              veBondingName: "VENAME",
              veBondingPeriod: 1,
              veBondingReserveDecimals: 18,
              veBondingReserveDenom: genWallet().address,
              veBondingSymbol: "DSFN",
              veBondingType: {
                ve_type: VeTypeEnum.Constant,
                data: {
                  power: 1,
                  scale: 1,
                  slope: 1,
                  value: 1,
                },
              },
            },
          },
          votingPeriod: 1,
        })
      ).to.be.revertedWith("Unauthorized");
    });
  });
});
