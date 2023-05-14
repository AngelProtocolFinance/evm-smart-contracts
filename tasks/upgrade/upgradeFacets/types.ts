import { Contract } from "ethers"
import { IDiamondCut } from "typechain-types"

export type Facet = { name: string; contract: Contract }

export type FacetCut = { facetName: string; cut: IDiamondCut.FacetCutStruct }
