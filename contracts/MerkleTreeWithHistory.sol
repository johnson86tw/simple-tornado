//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface Hasher {
    function MiMCSponge(uint256 in_xL, uint256 in_xR) external pure returns (uint256 xL, uint256 xR);
}

contract MerkleTreeWithHistory {
    uint256 public constant FIELD_SIZE =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // = keccak256("tornado") % FIELD_SIZE
    uint256 public constant ZERO_VALUE =
        21663839004416932945382355908790599225266501822907911457504978515578255421292;

    uint32 public levels;
    address public hasherAddress;

    constructor(address _hasher) {
        hasherAddress = _hasher;
    }

    function hashLeftRight(bytes32 _left, bytes32 _right) public view returns (bytes32) {
        uint256 R = uint256(_left);
        uint256 C = 0;
        (R, C) = Hasher(hasherAddress).MiMCSponge(R, C);
        R = R + uint256(_right);
        (R, C) = Hasher(hasherAddress).MiMCSponge(R, C);
        return bytes32(R);
    }
}
