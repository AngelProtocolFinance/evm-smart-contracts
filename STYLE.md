# Solidity Style Guide

## Variables

**Generic Variable** `useCamelCase`

**Structs** 

`struct UseCapsCase {}`

**Mappings** 

*be descriptive of what is being stored BY what, use CapsCase:*

`mapping (address => uint256) BalanceByAddress`

**Function Arguments** `_usePrefixUnderscore`

**Function Return Values** *If defined in the function declaration*

`function exampleMethod() public returns (uint useTrailingUnderscore_)`

**Constants**
`ALL_CAPS_WITH_UNDERSCORES`

**Arrays**
`use_snake_case`

&nbsp;
### Specific Variable Naming Convention

Token Addresses: `usdcTokenAddress` 

Percents/Fees: *indicates what the basis should be* 

`ratePercent`, `withdrawFee`

&nbsp;
## Methods 

**EventDeclarations**
`event UseCapsCase()`

**Extnerla/Public Function Names**
`useCamelCase()`

**Internal/Private Function Names**
`_usePrefixUnderscore()`

**Modifiers** *Use naming that describes the restriction*

`modifier onlyOwner()`

`modifier validTokenAddress(address _token)`

&nbsp;
### Specific Method Naming Convention

**View method naming** *Use get or query as prefix*

`function getValue() external view returns (uint) {}`

`function queryState() external view returns (Struct storage) {}`

**Math/calculation helpers** *If the method is pure, prefix with calc*

`function _calcValue() internal pure returns (uint) {}`

&nbsp;
## Contracts

**Contract Name** *Use CapsCase*
`contract UseCapsCase {}`

**Interfaces** *Prefix with I, CapsCase*
`interface IContract {}`

**Libraries**  *Suffix name with Lib*
`library DoStuffLib {}c`