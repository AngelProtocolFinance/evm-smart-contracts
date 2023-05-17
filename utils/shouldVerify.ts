import { Network } from "hardhat/types"

export function shouldVerify(network: Network): boolean {
    return network.name !== "hardhat" && network.name !== "localhost"
}
