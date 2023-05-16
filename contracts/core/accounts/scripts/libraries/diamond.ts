import { Fragment, Interface } from "@ethersproject/abi"
import { Contract } from "@ethersproject/contracts"

interface Selectors extends Array<string> {
    contract: Contract
    remove: (functionNames: string[]) => Selectors
    get: (functionNames: string[]) => Selectors
}

enum FacetCutAction { Add = 0, Replace = 1, Remove = 2 }

// get function selectors from ABI
function getSelectors(contract: Contract): Selectors {
    const signatures = Object.keys(contract.interface.functions)
    const selectors = signatures.reduce((acc: string[], val: string) => {
        if (val !== "init(bytes)") {
            acc.push(contract.interface.getSighash(val))
        }
        return acc
    }, [])
    const result = selectors as Selectors
    result.contract = contract
    result.remove = remove
    result.get = get
    return result
}

// get function selector from function signature
function getSelector(func: string): string {
    const abiInterface = new Interface([func])
    return abiInterface.getSighash(Fragment.from(func))
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
function remove(this: Selectors, functionNames: string[]): Selectors {
    const selectors = this.filter((v) => {
        for (const functionName of functionNames) {
            if (v === this.contract.interface.getSighash(functionName)) {
                return false
            }
        }
        return true
    })
    const result = selectors as Selectors
    result.contract = this.contract
    result.remove = this.remove
    result.get = this.get
    return result
}

// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
function get(this: Selectors, functionNames: string[]): Selectors {
    const selectors = this.filter((v) => {
        for (const functionName of functionNames) {
            if (v === this.contract.interface.getSighash(functionName)) {
                return true
            }
        }
        return false
    })
    const result = selectors as Selectors
    result.contract = this.contract
    result.remove = this.remove
    result.get = this.get
    return result
}

// remove selectors using an array of signatures
function removeSelectors(selectors: string[], signatures: string[]): string[] {
    const iface = new Interface(signatures.map((v) => "function " + v))
    const removeSelectors = signatures.map((v) => iface.getSighash(v))
    selectors = selectors.filter((v) => !removeSelectors.includes(v))
    return selectors
}

// find a particular address position in the return value of diamondLoupeFacet.facets()
function findAddressPositionInFacets(facetAddress: string, facets: any[]) {
    for (let i = 0; i < facets.length; i++) {
        if (facets[i].facetAddress === facetAddress) {
            return i
        }
    }
}

export {
    getSelectors,
    getSelector,
    FacetCutAction,
    remove,
    removeSelectors,
    findAddressPositionInFacets,
}
