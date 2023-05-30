import hre from "hardhat";
import deploy from "./deployAngelProtocol";

deploy(hre)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
