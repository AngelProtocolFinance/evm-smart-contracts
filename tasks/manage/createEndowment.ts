import {task, types} from "hardhat/config";
import {proposeCharityApplication} from "tasks/helpers";
import {AccountsCreateEndowment__factory, AccountsQueryEndowments__factory} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/multisigs/CharityApplications";
import {getAddresses, getCharityApplicationsOwner, logger, structToObject} from "utils";

type TaskArgs = {
  appsSignerPkey?: string;
  endowType: 0 | 1;
};

task("manage:createEndowment", "Will create a new endowment")
  .addParam("endowType", "0 - charity, 1 - ast, 2 - daf ", 0, types.int)
  .addOptionalParam(
    "appsSignerPkey",
    "If running on prod, provide a pkey for a valid CharityApplications Multisig Owner."
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const appsSigner = await getCharityApplicationsOwner(hre, taskArgs.appsSignerPkey);

      const queryEndowmentFacet = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        hre.ethers.provider
      );

      const config = await queryEndowmentFacet.queryConfig();
      logger.out(`Current config:`);
      logger.out(structToObject(config));

      // logger.out("Generating new wallet as owner...");
      // const wallet = genWallet(true);

      const defaultSettingsPermissionsStruct = {
        locked: false,
        delegate: {
          addr: appsSigner.address,
          expires: 0,
        },
      };

      const defaultFeeStruct = {
        payoutAddress: hre.ethers.constants.AddressZero,
        bps: 0,
      };

      const createEndowmentRequest: AccountMessages.CreateEndowmentRequestStruct = {
        duration: 3600, // 1h
        withdrawBeforeMaturity: false,
        maturityTime: 0,
        name: `Test Charity Endowment #${config.nextAccountId}`,
        sdgs: [1],
        referralId: 0,
        tier: 0,
        endowType: taskArgs.endowType, // Charity
        logo: "",
        image: "",
        members: [appsSigner.address],
        threshold: 1,
        allowlistedBeneficiaries: [],
        allowlistedContributors: [],
        earlyLockedWithdrawFee: defaultFeeStruct,
        withdrawFee: defaultFeeStruct,
        depositFee: defaultFeeStruct,
        balanceFee: defaultFeeStruct,
        proposalLink: 0,
        settingsController: {
          acceptedTokens: defaultSettingsPermissionsStruct,
          lockedInvestmentManagement: defaultSettingsPermissionsStruct,
          liquidInvestmentManagement: defaultSettingsPermissionsStruct,
          allowlistedBeneficiaries: defaultSettingsPermissionsStruct,
          allowlistedContributors: defaultSettingsPermissionsStruct,
          maturityAllowlist: defaultSettingsPermissionsStruct,
          maturityTime: defaultSettingsPermissionsStruct,
          earlyLockedWithdrawFee: defaultSettingsPermissionsStruct,
          withdrawFee: defaultSettingsPermissionsStruct,
          depositFee: defaultSettingsPermissionsStruct,
          balanceFee: defaultSettingsPermissionsStruct,
          name: defaultSettingsPermissionsStruct,
          image: defaultSettingsPermissionsStruct,
          logo: defaultSettingsPermissionsStruct,
          sdgs: defaultSettingsPermissionsStruct,
          splitToLiquid: defaultSettingsPermissionsStruct,
          ignoreUserSplits: defaultSettingsPermissionsStruct,
        },
        parent: 0,
        maturityAllowlist: [],
        ignoreUserSplits: false,
        splitToLiquid: {
          max: 100,
          min: 0,
          defaultSplit: 50,
        },
      };

      if (taskArgs.endowType == 0) {
        await proposeCharityApplication(
          addresses.multiSig.charityApplications.proxy,
          appsSigner,
          createEndowmentRequest
        );
      } else {
        const createEndowFacet = AccountsCreateEndowment__factory.connect(
          addresses.accounts.diamond,
          appsSigner
        );
        let tx = await createEndowFacet.createEndowment(createEndowmentRequest);
        logger.out(`Creating endowment...\nTx hash: ${tx.hash}`);
        await tx.wait();
      }

      const newEndowmentDetails = await queryEndowmentFacet.queryEndowmentDetails(
        config.nextAccountId
      );
      logger.out(`Added endowment with ID: ${config.nextAccountId.toNumber()}`);
      logger.out(JSON.stringify(structToObject(newEndowmentDetails), undefined, 2));
      logger.out();
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
