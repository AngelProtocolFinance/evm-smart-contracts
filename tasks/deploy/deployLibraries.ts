import { task } from "hardhat/config"
import { saveFrontendFiles } from "scripts/readWriteFile"
import { logger } from "utils"

task("Deploy:DeployLibraries", "Will deploy Libraries")
    .addParam("verify", "Want to verify contract")
    .setAction(async (taskArgs, hre) => {
        try {
            const { network, run, ethers } = hre;
            const angel_core_struct = await ethers.getContractFactory(
                "AngelCoreStruct"
            );
            let ANGEL_CORE_STRUCT = await angel_core_struct.deploy();
            await ANGEL_CORE_STRUCT.deployed();

            const string_library = await ethers.getContractFactory(
                "StringArray"
            );
            let STRING_LIBRARY = await string_library.deploy();
            await STRING_LIBRARY.deployed();

            console.log("Libraries Deployed as", {
                "STRING_LIBRARY Deployed at ": STRING_LIBRARY.address,
                "ANGEL_CORE_STRUCT_LIBRARY Deployed at ":
                    ANGEL_CORE_STRUCT.address,
            });

            let libraries = {
                STRING_LIBRARY: STRING_LIBRARY.address,
                ANGEL_CORE_STRUCT_LIBRARY: ANGEL_CORE_STRUCT.address,
            };

            await saveFrontendFiles({ libraries });

            var isTrueSet = taskArgs.verify === "true";

            if (network.name !== "hardhat" && isTrueSet) {
                await run(`verify:verify`, {
                    address: ANGEL_CORE_STRUCT.address,
                    constructorArguments: [],
                });
                await run(`verify:verify`, {
                    address: STRING_LIBRARY.address,
                    constructorArguments: [],
                });
            }
        } catch (error) {
            logger.out(error, logger.Level.Error)
        }
    });
