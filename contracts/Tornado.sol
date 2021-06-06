//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

abstract contract IVerifier {
    function verifyProof(bytes memory _proof, uint256[6] memory _input) public virtual returns (bool);
}

contract Tornado is ReentrancyGuard {
    uint256 public denomination;
    mapping(bytes32 => bool) public nullifierHashes;
    // we store all commitments just to prevent accidental deposits with the same commitment
    mapping(bytes32 => bool) public commitments;
    IVerifier public verifier;

    address public operator;
    modifier onlyOperator {
        require(msg.sender == operator, "Only operator can call this function.");
        _;
    }

    event Deposit(bytes32 indexed commitments, uint32 leafIndex, uint256 timestamp);
    event Withdrawal(address to, bytes32 nullifierHashes, address indexed relayer, uint256 fee);

    constructor() {}
}
