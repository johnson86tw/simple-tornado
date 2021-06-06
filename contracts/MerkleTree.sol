//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface Hasher {
    function MiMCSponge(
        uint256 xL_in,
        uint256 xR_in,
        uint256 k
    ) external pure returns (uint256 xL, uint256 xR);
}

contract MerkleTree {
    uint256 public constant FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 public constant ZERO_VALUE = 21663839004416932945382355908790599225266501822907911457504978515578255421292; // = keccak256("tornado") % FIELD_SIZE

    uint32 public levels;
    address public hasherAddress;

    // for insert calculation
    bytes32[] public zeros;
    bytes32[] public filledSubtrees;
    uint32 public currentIndex = 0;
    uint32 public nextIndex = 0;
    uint32 public constant ROOT_HISTORY_SIZE = 100;
    bytes32[ROOT_HISTORY_SIZE] public roots;

    constructor(uint32 _levels, address _hasherAddress) {
        require(_levels > 0, "_level should be greater than zero");
        require(_levels < 32, "_level should be less than 32");
        levels = _levels;
        hasherAddress = _hasherAddress;

        // fill zeros and filledSubtrees depend on levels
        bytes32 currentZero = bytes32(ZERO_VALUE);
        zeros.push(currentZero);
        filledSubtrees.push(currentZero);
        for (uint32 i = 1; i < levels; i++) {
            currentZero = hashLeftRight(currentZero, currentZero);
            zeros.push(currentZero);
            filledSubtrees.push(currentZero);
        }

        roots[0] = hashLeftRight(currentZero, currentZero);
    }

    function hashLeftRight(bytes32 _left, bytes32 _right) public view returns (bytes32) {
        require(uint256(_left) < FIELD_SIZE, "_left should be inside the field");
        require(uint256(_right) < FIELD_SIZE, "_right should be inside the field");
        uint256 R = uint256(_left);
        uint256 C = 0;
        uint256 k = 0;
        (R, C) = Hasher(hasherAddress).MiMCSponge(R, C, k);
        R = addmod(R, uint256(_right), FIELD_SIZE);
        (R, C) = Hasher(hasherAddress).MiMCSponge(R, C, k);
        return bytes32(R);
    }

    function test() public pure returns (uint32) {
        return uint32(3) / 2;
    }
}
