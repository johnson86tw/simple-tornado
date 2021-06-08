// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "../MerkleTree.sol";

contract MerkleTreeMock is MerkleTree {
    constructor(uint32 _levels, Hasher _hasher) MerkleTree(_levels, _hasher) {}

    function insert(bytes32 _leaf) public returns (uint32 index) {
        return _insert(_leaf);
    }
}
