import { IDiamondCut } from "../../../../../typechain-types"

export type FacetCut = { facetName: string; cut: IDiamondCut.FacetCutStruct }
