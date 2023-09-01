import {task, types} from "hardhat/config";
import {
  AccountsCreateEndowment__factory,
  AccountsQueryEndowments__factory,
  CharityApplications__factory,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/multisigs/CharityApplications";
import {getAddresses, getEvents, getSigners, logger, structToObject} from "utils";

type TaskArgs = {endowType: 0 | 1};

task("manage:createEndowment", "Will create a new endowment")
  .addParam("endowType", "0 - charity, 1 - ast, 2 - daf ", 0, types.int)
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      const {apTeam2} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const queryEndowmentFacet = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeam2
      );

      const config = await queryEndowmentFacet.queryConfig();
      logger.out(`Current config:`);
      logger.out(structToObject(config));

      // logger.out("Generating new wallet as owner...");
      // const wallet = genWallet(true);

      const defaultSettingsPermissionsStruct = {
        locked: false,
        delegate: {
          addr: apTeam2.address,
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
        members: [apTeam2.address],
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
        logger.out("Creating a charity applications proposal...");
        const charityApplications = CharityApplications__factory.connect(
          addresses.multiSig.charityApplications.proxy,
          apTeam2
        );
        const tx = await charityApplications.proposeApplication(createEndowmentRequest, "0x");
        logger.out(`Tx hash: ${tx.hash}`);
        const receipt = await tx.wait();

        const applicationProposedEvent = getEvents(
          receipt.events,
          charityApplications,
          charityApplications.filters.ApplicationProposed()
        ).at(0);
        if (!applicationProposedEvent) {
          throw new Error("Unexpected: ApplicationProposed not emitted.");
        }

        const proposalId = applicationProposedEvent.args.proposalId;

        const isExecuted = (await charityApplications.proposals(proposalId)).executed;
        if (!isExecuted) {
          const isConfirmed = await charityApplications.isProposalConfirmed(proposalId);
          if (isConfirmed) {
            logger.out(
              `Proposal with ID "${proposalId}" submitted, awaiting confirmation by other owners.`
            );
            return;
          }
          logger.out(`Executing the new charity endowment with proposal ID: ${proposalId}...`);
          const tx2 = await charityApplications.executeProposal(proposalId);
          logger.out(`Tx hash: ${tx2.hash}`);
          await tx2.wait();
        }
      } else {
        const createEndowFacet = AccountsCreateEndowment__factory.connect(
          addresses.accounts.diamond,
          apTeam2
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
