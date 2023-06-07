import {task} from "hardhat/config";
import {
  AccountsCreateEndowment__factory,
  AccountsQueryEndowments__factory,
  ApplicationsMultiSig__factory,
  CharityApplication__factory,
} from "typechain-types";
import {getAddresses, getSigners, logger} from "utils";

import {AccountMessages} from "typechain-types/contracts/core/accounts/IAccounts";

task("manage:createEndowment", "Will create a new endowment")
  .addParam("endowType", "0 - charity, 1 - normal")
  .setAction(async (_taskArguments, hre) => {
    try {
      const {apTeam1, apTeam2} = await getSigners(hre.ethers);

      const addresses = await getAddresses(hre);

      const queryEndowmentFacet = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeam1
      );

      const config = await queryEndowmentFacet.queryConfig();
      logger.out(`Current config: ${JSON.stringify(config, undefined, 2)}`);

      // logger.out("Generating new wallet as owner...");
      // const wallet = genWallet(true);

      const defaultSettingsPermissionsStruct = {
        locked: false,
        delegate: {
          addr: apTeam1.address,
          expires: 0,
        },
      };

      const defaultFeeStruct = {
        payoutAddress: hre.ethers.constants.AddressZero,
        bps: 0,
      };

      const createEndowmentRequest: AccountMessages.CreateEndowmentRequestStruct = {
        owner: apTeam1.address,
        withdrawBeforeMaturity: false,
        maturityTime: 0,
        maturityHeight: 0,
        name: `Test Charity Endowment #${config.nextAccountId}`,
        categories: {
          sdgs: [],
          general: [],
        },
        kycDonorsOnly: false,
        referralId: 0,
        tier: 0,
        endowType: _taskArguments.endowType, // Charity
        logo: "",
        image: "",
        members: [apTeam1.address],
        threshold: 1,
        maxVotingPeriod: {
          enumData: 1,
          data: {
            height: 0,
            time: 0,
          },
        },
        allowlistedBeneficiaries: [],
        allowlistedContributors: [],
        splitMax: 100,
        splitMin: 0,
        splitDefault: 50,
        earlyLockedWithdrawFee: defaultFeeStruct,
        withdrawFee: defaultFeeStruct,
        depositFee: defaultFeeStruct,
        balanceFee: defaultFeeStruct,
        dao: {
          quorum: 1,
          threshold: 1,
          votingPeriod: 0,
          timelockPeriod: 0,
          expirationPeriod: 0,
          proposalDeposit: 0,
          snapshotPeriod: 0,
          token: {
            token: 0,
            data: {
              existingData: apTeam1.address,
              newInitialSupply: 0,
              newName: "",
              newSymbol: "",
              veBondingType: {
                ve_type: 0,
                data: {
                  value: 0,
                  scale: 0,
                  slope: 0,
                  power: 0,
                },
              },
              veBondingName: "",
              veBondingSymbol: "",
              veBondingDecimals: 18,
              veBondingReserveDenom: apTeam1.address,
              veBondingReserveDecimals: 18,
              veBondingPeriod: 0,
            },
          },
        },
        createDao: false,
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
          categories: defaultSettingsPermissionsStruct,
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

      if (_taskArguments.endowType == 0) {
        logger.out("Creating a charity proposal...");
        const charityApplication = CharityApplication__factory.connect(
          addresses.charityApplication.proxy,
          apTeam1
        );
        const tx = await charityApplication.proposeCharity(createEndowmentRequest, "");
        const receipt = await tx.wait();

        if (!receipt.events?.length) {
          throw new Error("Unexpected behaviour: no events emitted.");
        }

        const charityProposedEvent = receipt.events[0];
        if (!charityProposedEvent.args?.length) {
          throw new Error("Unexpected behaviour: no args in CharityProposed event.");
        }
        if (!charityProposedEvent.args.at(1)) {
          throw new Error("Unexpected behaviour: no proposalId in CharityProposed args.");
        }

        const proposalId = charityProposedEvent.args[1];

        logger.out(`Approving the new charity endowment with proposal ID: ${proposalId}...`);
        const applicationMultisig = ApplicationsMultiSig__factory.connect(
          addresses.multiSig.applications.proxy,
          apTeam2
        );
        const data = charityApplication.interface.encodeFunctionData("approveCharity", [
          proposalId,
        ]);
        const submitTransactionTx = await applicationMultisig.submitTransaction(
          `Approve endowment with proposal ID: ${proposalId}`,
          `Approve endowment with proposal ID: ${proposalId}`,
          addresses.charityApplication.proxy,
          0,
          data,
          "0x"
        );
        await submitTransactionTx.wait();
      } else {
        const createEndowFacet = AccountsCreateEndowment__factory.connect(
          addresses.accounts.diamond,
          apTeam1
        );
        let tx = await createEndowFacet.createEndowment(createEndowmentRequest);
        await hre.ethers.provider.waitForTransaction(tx.hash);
      }

      const newEndowmentDetails = await queryEndowmentFacet.queryEndowmentDetails(
        config.nextAccountId
      );
      logger.out(`Added endowment: ${JSON.stringify(newEndowmentDetails, undefined, 2)}`);
      logger.out();
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
