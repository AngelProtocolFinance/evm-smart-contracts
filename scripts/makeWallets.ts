import { genWallet } from "../utils";

async function main() {
  let a = genWallet(true)
} 

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
