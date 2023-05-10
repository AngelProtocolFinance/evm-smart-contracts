import { Network } from "hardhat/types"

export default function shouldVerify(network: Network): boolean {
    return network.name !== "hardhat" && network.name !== "localhost"
}
