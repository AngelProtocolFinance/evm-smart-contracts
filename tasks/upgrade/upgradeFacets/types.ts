import {ContractFactory} from "ethers";
import {IDiamondCut} from "typechain-types";
import {Deployment} from "types";

export type FacetCut = {deployment: Deployment<ContractFactory>; cut: IDiamondCut.FacetCutStruct};
