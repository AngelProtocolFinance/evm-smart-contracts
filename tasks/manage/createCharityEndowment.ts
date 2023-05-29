import {task} from "hardhat/config";
import {
  AccountsQueryEndowments__factory,
  ApplicationsMultiSig__factory,
  CharityApplication__factory,
  MultiSigGeneric__factory,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/IAccounts";
import {genWallet, getAddresses, logger} from "utils";

task("manage:createCharityEndowment", "Will create a new charity endowment").setAction(
  async (_taskArguments, hre) => {
    try {
      const [_deployer, _proxyAdmin, apTeam1, apTeam2] = await hre.ethers.getSigners();

      const addresses = await getAddresses(hre);

      const queryEndowmentFacet = AccountsQueryEndowments__factory.connect(
        addresses.accounts.diamond,
        apTeam1
      );

      const config = await queryEndowmentFacet.queryConfig();
      logger.out(`Current config: ${JSON.stringify(config, undefined, 2)}`);

      logger.out("Generating new wallet as owner...");
      const wallet = genWallet(true);

      const createEndowmentRequest: AccountMessages.CreateEndowmentRequestStruct = {
        owner: wallet.address,
        withdrawBeforeMaturity: false,
        maturityTime: 0,
        maturityHeight: 0,
        name: `Test Charity Endowment #${config.nextAccountId}`,
        categories: {
          sdgs: [1],
          general: [],
        },
        kycDonorsOnly: false,
        referralId: 0,
        tier: 3,
        endowType: 0, // Charity
        logo: "",
        image: "",
        members: [wallet.address, apTeam1.address],
        threshold: 1,
        maxVotingPeriod: {
          enumData: 0,
          data: {
            height: 0,
            time: 0,
          },
        },
        allowlistedBeneficiaries: [wallet.address, apTeam1.address],
        allowlistedContributors: [wallet.address, apTeam1.address],
        splitMax: 100,
        splitMin: 0,
        splitDefault: 50,
        earlyLockedWithdrawFee: {
          payoutAddress: apTeam1.address,
          percentage: 5,
        },
        withdrawFee: {
          payoutAddress: apTeam1.address,
          percentage: 2,
        },
        depositFee: {
          payoutAddress: apTeam1.address,
          percentage: 2,
        },
        balanceFee: {
          payoutAddress: apTeam1.address,
          percentage: 2,
        },
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
          allowlistedBeneficiaries: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          allowlistedContributors: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          balanceFee: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          categories: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          depositFee: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          earlyLockedWithdrawFee: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          ignoreUserSplits: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          image: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          liquidInvestmentManagement: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          lockedInvestmentManagement: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          logo: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          maturityAllowlist: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          maturityTime: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          name: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          splitToLiquid: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          strategies: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
          withdrawFee: {
            locked: false,
            delegate: {
              addr: apTeam1.address,
              expires: 0,
            },
          },
        },
        parent: 0,
        maturityAllowlist: [wallet.address, apTeam1.address],
        ignoreUserSplits: false,
        splitToLiquid: {
          max: 100,
          min: 0,
          defaultSplit: 50,
        },
      };

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
      const data = charityApplication.interface.encodeFunctionData("approveCharity", [proposalId]);
      const submitTransactionTx = await applicationMultisig.submitTransaction(
        `Approve endowment with proposal ID: ${proposalId}`,
        `Approve endowment with proposal ID: ${proposalId}`,
        addresses.charityApplication.proxy,
        0,
        data,
        "0x"
      );
      await submitTransactionTx.wait();

      const newEndowmentDetails = await queryEndowmentFacet.queryEndowmentDetails(
        config.nextAccountId
      );
      logger.out(`Added endowment: ${JSON.stringify(newEndowmentDetails, undefined, 2)}`);
      logger.out();

      const multisig = MultiSigGeneric__factory.connect(newEndowmentDetails.owner, apTeam1);
      logger.out("Listing newly created endowment's multisig wallet owners...");
      const owners = await multisig.getOwners();
      for (let i = 0; i < owners.length; i++) {
        logger.out(await multisig.owners(i));
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  }
);
