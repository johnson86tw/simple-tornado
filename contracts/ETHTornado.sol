//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./Tornado.sol";

contract ETHTornado is Tornado {
    constructor(
        IVerifier _verifier,
        uint256 _denomination,
        uint32 _merkleTreeHieght,
        Hasher _hasher
    ) Tornado(_verifier, _denomination, _merkleTreeHieght, _hasher) {}

    function _processDeposit() internal override {
        require(msg.value == denomination, "Please send `mixDenomination` ETH along with transaction");
    }
}
