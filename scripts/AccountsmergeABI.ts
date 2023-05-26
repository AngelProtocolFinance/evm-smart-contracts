import fs from "fs";

// List of ABI file paths to merge
const abiFiles = [
  "./abi/json/AccountDeployContract.json",
  "./abi/json/AccountDepositWithdrawEndowments.json",
  "./abi/json/AccountDonationMatch.json",
  "./abi/json/AccountsAllowance.json",
  "./abi/json/AccountsCreateEndowment.json",
  "./abi/json/AccountsDAOEndowments.json",
  "./abi/json/AccountsEvents.json",
  "./abi/json/AccountsQueryEndowments.json",
  "./abi/json/AccountsStrategiesCopyEndowments.json",
  "./abi/json/AccountsStrategiesUpdateEndowments.json",
  "./abi/json/AccountsSwapEndowments.json",
  "./abi/json/AccountStorage.json",
  "./abi/json/AccountsUpdate.json",
  "./abi/json/AccountsUpdateEndowments.json",
  "./abi/json/AccountsUpdateStatusEndowments.json",
  "./abi/json/AccountsVaultFacet.json",
];

// Array to store all the ABIs
let allAbis = [];

// Loop through each ABI file path and add its ABI to the array
for (let i = 0; i < abiFiles.length; i++) {
  const abiFile = abiFiles[i];

  // Read the contents of the ABI file
  const abiData = fs.readFileSync(abiFile, "utf8");

  // Parse the ABI data into a JavaScript object
  const abi = JSON.parse(abiData);

  for (const e of abi) {
    allAbis.push(e);
  }
}

// Merge all the ABIs into a single object
// const mergedAbi = Object.assign({}, ...allAbis);

// Convert the merged ABI object back into JSON
const mergedAbiJson = JSON.stringify(allAbis);

// Write the merged ABI to a file
fs.writeFileSync("./abi/json/AccountsmergedAbi.json", mergedAbiJson, "utf8");
