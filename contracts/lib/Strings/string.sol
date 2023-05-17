// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library StringArray {

    function stringIndexOf(string[] memory arr, string memory searchFor)
        public
        pure
        returns (uint256, bool)
    {
        for (uint256 i = 0; i < arr.length; i++) {
            if (keccak256(abi.encodePacked(arr[i])) == keccak256(abi.encodePacked(searchFor))) {
                return (i, true);
            }
        }
        return (0, false);
    }

    function stringRemove(string[] storage data, uint256 index)
        public
        returns (string[] memory)
    {
        if (index >= data.length) {
            revert("Error in remove: internal");
        }

        for (uint256 i = index; i < data.length - 1; i++) {
            data[i] = data[i + 1];
        }
        data.pop();
        return data;
    }

    function stringCompare(string memory s1, string memory s2) public pure returns (bool result){
        result = (keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2)));
    }

    function addressToString(address addr) public pure returns(string memory) 
    {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";
    
        bytes memory str = new bytes(51);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}

