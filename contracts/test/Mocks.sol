// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {RevenueDistributor} from "../src/RevenueDistributor.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock", "MOCK") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/// @notice Token whose transfers always revert — malicious-asset case.
contract RevertingToken is ERC20 {
    constructor() ERC20("Revert", "RVT") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function transfer(address, uint256) public pure override returns (bool) {
        revert("nope");
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("nope");
    }
}

/// @notice Fee-on-transfer token: receiver gets 90% of the sent amount.
contract FeeToken is ERC20 {
    constructor() ERC20("Fee", "FEE") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) {
            uint256 fee = value / 10;
            super._update(from, address(0xdead), fee);
            super._update(from, to, value - fee);
        } else {
            super._update(from, to, value);
        }
    }
}

/// @notice Contract that attempts to re-enter the distributor when paid ETH.
contract ReentrantClaimer {
    RevenueDistributor public distributor;
    uint256 public tokenId;
    bool public attacked;

    constructor(RevenueDistributor d) {
        distributor = d;
    }

    function setToken(uint256 id) external {
        tokenId = id;
    }

    function doClaim() external {
        distributor.claim(tokenId, address(0));
    }

    receive() external payable {
        if (!attacked) {
            attacked = true;
            // Re-entering claim must fail (nonReentrant + cursor already moved).
            try distributor.claim(tokenId, address(0)) {
                revert("reentry succeeded");
            } catch {}
        }
    }

    function onERC721Received(address, address, uint256, bytes calldata)
        external
        pure
        returns (bytes4)
    {
        return this.onERC721Received.selector;
    }
}
