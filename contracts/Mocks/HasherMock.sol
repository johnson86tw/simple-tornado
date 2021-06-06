//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface Hasher {
    function MiMCSponge(
        uint256 xL_in,
        uint256 xR_in,
        uint256 k
    ) external pure returns (uint256 xL, uint256 xR);
}

contract HasherMock {
    address public hasherAddress;

    constructor(address _hasher) {
        hasherAddress = _hasher;
    }

    function hashLeftRight(bytes32 _left, bytes32 _right) public view returns (bytes32) {
        uint256 R = uint256(_left);
        uint256 C = 0;
        (R, C) = Hasher(hasherAddress).MiMCSponge(R, C, 0);
        R = R + uint256(_right);
        (R, C) = Hasher(hasherAddress).MiMCSponge(R, C, 0);
        return bytes32(R);
    }
}
