// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenMock is ERC20 {
	constructor() ERC20("Token Mock", "TMK") {
		_mint(msg.sender, 1000000000 * 1 ether);
	}

	function mint(address _to, uint256 _value) public {
		_mint(_to, _value);
	}
}