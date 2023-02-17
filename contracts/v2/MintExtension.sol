// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/ISlashCustomPlugin.sol";
import "./libs/UniversalERC20.sol";

interface IERC721Demo {
    function mint(address to) external returns (uint256);
}

contract MintExtension is ISlashCustomPlugin, Ownable {
    using UniversalERC20 for IERC20;

    IERC721Demo private nftDemo;

    mapping(bytes => uint256) public purchaseInfo;

    function updateNftContractAddress(
        address nftContractAddress
    ) external onlyOwner {
        nftDemo = IERC721Demo(nftContractAddress);
    }

    function receivePayment(
        address receiveToken,
        uint256 amount,
        bytes calldata paymentId,
        string calldata optional,
        bytes calldata /** reserved */
    ) external payable override {
        require(amount > 0, "invalid amount");

        IERC20(receiveToken).universalTransferFrom(msg.sender, owner(), amount);
        // do something
        afterReceived(paymentId, optional);
    }

    function afterReceived(bytes memory paymentId, string memory) internal {
        uint256 tokenId = nftDemo.mint(tx.origin);
        purchaseInfo[paymentId] = tokenId;
    }

    function withdrawToken(address tokenContract) external onlyOwner {
        require(
            IERC20(tokenContract).universalBalanceOf(address(this)) > 0,
            "balance is zero"
        );

        IERC20(tokenContract).universalTransfer(
            msg.sender,
            IERC20(tokenContract).universalBalanceOf(address(this))
        );

        emit TokenWithdrawn(
            tokenContract,
            IERC20(tokenContract).universalBalanceOf(address(this))
        );
    }

    event TokenWithdrawn(address tokenContract, uint256 amount);

    /**
     * @dev Check if the contract is Slash Plugin
     *
     * Requirement
     * - Implement this function in the contract
     * - Return true
     */
    function supportSlashExtensionInterface()
        external
        pure
        override
        returns (uint8)
    {
        return 2;
    }
}
