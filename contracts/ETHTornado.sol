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

    function _processWithdraw(
        address payable _recipient,
        address payable _relayer,
        uint256 _fee,
        uint256 _refund
    ) internal override {
        require(msg.value == 0, "msg.value is supposed to be zero for ETH instance");
        require(_refund == 0, "refund value is supposed to be zero for ETH instance"); // refund is used by ERC20Tornado

        (bool success, ) = _recipient.call{value: denomination - _fee}("");
        require(success, "payment to _recipient did not go thru");

        if (_fee > 0) {
            (success, ) = _relayer.call{value: _fee}("");
            require(success, "payment to _relayer did not go thru");
        }
    }
}
