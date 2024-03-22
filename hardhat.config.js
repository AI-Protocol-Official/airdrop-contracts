/**
 * default Hardhat configuration which uses account mnemonic to derive accounts
 * script expects following environment variables to be set:
 *   - P_KEY1 – mainnet private key, should start with 0x
 *     or
 *   - MNEMONIC1 – mainnet mnemonic, 12 words
 *
 *   - P_KEY3 – ropsten private key, should start with 0x
 *     or
 *   - MNEMONIC3 – ropsten mnemonic, 12 words
 *
 *   - P_KEY4 – rinkeby private key, should start with 0x
 *     or
 *   - MNEMONIC4 – rinkeby mnemonic, 12 words
 *
 *   - P_KEY41 – kovan private key, should start with 0x
 *     or
 *   - MNEMONIC41 – kovan mnemonic, 12 words
 *
 *   - P_KEY5 – goerli private key, should start with 0x
 *     or
 *   - MNEMONIC5 – goerli mnemonic, 12 words
 *
 *   - P_KEY137 – polygon/matic private key, should start with 0x
 *     or
 *   - MNEMONIC137 – polygon/matic mnemonic, 12 words
 *
 *   - P_KEY80001 – mumbai (polygon testnet) private key, should start with 0x
 *     or
 *   - MNEMONIC80001 – mumbai (polygon testnet) mnemonic, 12 words
 *
 *   - P_KEY56 – Binance Smart Chain (BSC) mainnet private key, should start with 0x
 *     or
 *   - MNEMONIC56 – Binance Smart Chain (BSC) mainnet mnemonic, 12 words
 *
 *   - P_KEY97 – Binance Smart Chain (BSC) testnet private key, should start with 0x
 *     or
 *   - MNEMONIC97 – Binance Smart Chain (BSC) testnet mnemonic, 12 words
 *
 *   - P_KEY204 – Binance opBNB Optimistic Rollup (L2) mainnet private key, should start with 0x
 *     or
 *   - MNEMONIC204 – Binance opBNB Optimistic Rollup (L2) mainnet mnemonic, 12 words
 *
 *   - P_KEY5611 – Binance opBNB Optimistic Rollup (L2) testnet private key, should start with 0x
 *     or
 *   - MNEMONIC5611 – Binance opBNB Optimistic Rollup (L2) testnet mnemonic, 12 words
 *
 *   - P_KEY8453 – Base Mainnet Optimistic Rollup (L2) private key, should start with 0x
 *     or
 *   - MNEMONIC8453 – Base Mainnet Optimistic Rollup (L2) mnemonic, 12 words
 *
 *   - P_KEY84531 – Base Goerli (testnet) Optimistic Rollup (L2) private key, should start with 0x
 *     or
 *   - MNEMONIC84531 – Base Goerli (testnet) Optimistic Rollup (L2) mnemonic, 12 words
 *
 *   - ALCHEMY_KEY – Alchemy API key
 *     or
 *   - INFURA_KEY – Infura API key (Project ID)
 *
 *   - ETHERSCAN_KEY – Etherscan API key
 *
 *   - POLYSCAN_KEY – polygonscan API key
 *
 *   - BSCSCAN_KEY – BscScan API key
 *
 *   - BASESCAN_KEY – BaseScan API key
 */

// Loads env variables from .env file
require('dotenv').config()

// Enable Truffle 5 plugin for tests
// https://hardhat.org/guides/truffle-testing.html
require("@nomiclabs/hardhat-truffle5");

// enable Solidity-coverage
// https://hardhat.org/plugins/solidity-coverage.html
require("solidity-coverage");

// enable hardhat-gas-reporter
// https://hardhat.org/plugins/hardhat-gas-reporter.html
// require("hardhat-gas-reporter");

// compile Solidity sources directly from NPM dependencies
// https://github.com/ItsNickBarry/hardhat-dependency-compiler
require("hardhat-dependency-compiler");

// Before v2.5 we're using Ethers scripts to deploy in /scripts
// enable Ethers/Waffle for deployments
// https://hardhat.org/guides/deploying.html
// require("@nomiclabs/hardhat-waffle");

// Starting from v2.5 we're using hardhat-deploy scripts in /deploy
// adds a mechanism to deploy contracts to any network,
// keeping track of them and replicating the same environment for testing
// https://www.npmjs.com/package/hardhat-deploy
require("hardhat-deploy");

// verify environment setup, display warning if required, replace missing values with fakes
const FAKE_MNEMONIC = "test test test test test test test test test test test junk";
if (!process.env.MNEMONIC8453 && !process.env.P_KEY8453) {
	console.warn("neither MNEMONIC8453 nor P_KEY8453 is not set. Base Mainnet deployments won't be available");
	process.env.MNEMONIC8453 = FAKE_MNEMONIC;
}
else if (process.env.P_KEY8453 && !process.env.P_KEY8453.startsWith("0x")) {
	console.warn("P_KEY8453 doesn't start with 0x. Appended 0x");
	process.env.P_KEY8453 = "0x" + process.env.P_KEY8453;
}
if (!process.env.MNEMONIC84531 && !process.env.P_KEY84531) {
	console.warn("neither MNEMONIC84531 nor P_KEY84531 is not set. Base Goerli (testnet) deployments won't be available");
	process.env.MNEMONIC84531 = FAKE_MNEMONIC;
}
else if (process.env.P_KEY84531 && !process.env.P_KEY84531.startsWith("0x")) {
	console.warn("P_KEY84531 doesn't start with 0x. Appended 0x");
	process.env.P_KEY84531 = "0x" + process.env.P_KEY84531;
}
if (!process.env.INFURA_KEY && !process.env.ALCHEMY_KEY) {
	console.warn("neither INFURA_KEY nor ALCHEMY_KEY is not set. Deployments may not be available");
	process.env.INFURA_KEY = "";
	process.env.ALCHEMY_KEY = "";
}
if (!process.env.BASESCAN_KEY) {
	console.warn("BASESCAN_KEY is not set. Deployed smart contract code verification won't be available on BaseScan");
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		// https://hardhat.org/hardhat-network/
		hardhat: {
			// set networkId to 0xeeeb04de as for all local networks
			chainId: 0xeeeb04de,
			// set the gas price to one for convenient tx costs calculations in tests
			// gasPrice: 1,
			// London hard fork fix: impossible to set gas price lower than baseFeePerGas (875,000,000)
			initialBaseFeePerGas: 0,
			accounts: {
				count: 35,
			},
			/*
						forking: {
							url: "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY, // create a key: https://infura.io/
							enabled: !!(process.env.HARDHAT_FORK),
						},
			*/
		},

		localhost: {
			url: "http://127.0.0.1:8545/",
			accounts: { mnemonic: FAKE_MNEMONIC },
		},
	
		// Base Mainnet Optimistic Rollup (L2)
		base_mainnet: {
			url: get_endpoint_url("base_mainnet"),
			accounts: get_accounts(process.env.P_KEY8453, process.env.MNEMONIC8453),
		},
		// Base Testnet Optimistic Rollup (L2)
		base_goerli: {
			url: get_endpoint_url("base_goerli"),
			accounts: get_accounts(process.env.P_KEY84531, process.env.MNEMONIC84531),
			gasPrice: 1_000_000_000,
		},
	},

	// Configure Solidity compiler
	solidity: {
		// https://hardhat.org/guides/compile-contracts.html
		compilers: [
			{
				// Release v2.5
				version: "0.8.15",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			},
		]
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		// timeout: 100000,

		// disable mocha timeouts:
		// https://mochajs.org/api/mocha#enableTimeouts
		enableTimeouts: false,
		// https://github.com/mochajs/mocha/issues/3813
		timeout: false,
	},

	// hardhat-gas-reporter will be disabled by default, use REPORT_GAS environment variable to enable it
	// https://hardhat.org/plugins/hardhat-gas-reporter.html
	gasReporter: {
		enabled: !!(process.env.REPORT_GAS)
	},

	// compile Solidity sources directly from NPM dependencies
	// https://github.com/ItsNickBarry/hardhat-dependency-compiler
	dependencyCompiler: {
		paths: [
			// ERC1967 is used to deploy upgradeable contracts
			"@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol",
			"@openzeppelin/contracts/token/ERC20/ERC20.sol"
		],
	},

	// namedAccounts allows you to associate names to addresses and have them configured per chain
	// https://github.com/wighawag/hardhat-deploy#1-namedaccounts-ability-to-name-addresses
	namedAccounts: {
		// deployer account is always the account #0 derived from the mnemonic/private key
		deployer: {
			default: 0,
		},
		rewardSystemImpl: {
			"base_mainnet": "0xde04862Ba04E8641e32cD9Ab57F6E816928301E0"
		},
		dptToken: {
			"base_mainnet": process.env.DPT_TOKEN_ADDRESS
		}
	},
}

/**
 * Determines a JSON-RPC endpoint to use to connect to the node
 * based on the requested network name and environment variables set
 *
 * Tries to use custom RPC URL first (MAINNET_RPC_URL/ROPSTEN_RPC_URL/RINKEBY_RPC_URL/KOVAN_RPC_URL)
 * Tries to use alchemy RPC URL next (if ALCHEMY_KEY is set)
 * Fallbacks to infura RPC URL
 *
 * @param network_name one of mainnet/ropsten/rinkeby/kovan
 * @return JSON-RPC endpoint URL
 */
function get_endpoint_url(network_name) {
	// try custom RPC endpoint first (private node, quicknode, etc.)
	// create a quicknode key: https://www.quicknode.com/
	if (process.env.BASE_RPC_URL && network_name === "base_mainnet") {
		return process.env.BASE_RPC_URL;
	}
	if (process.env.BASE_GOERLI_RPC_URL && network_name === "base_goerli") {
		return process.env.BASE_GOERLI_RPC_URL;
	}

	// try the alchemy next
	// create a key: https://www.alchemy.com/
	if (process.env.ALCHEMY_KEY) {
		switch (network_name) {
			case "base_mainnet": return "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_KEY;
			case "base_goerli": return "https://base-goerli.g.alchemy.com/v2/" + process.env.ALCHEMY_KEY;
		}
	}

	// some networks don't require API key
	switch (network_name) {
		case "base_mainnet": return "https://mainnet.base.org";
		case "base_goerli": return "https://goerli.base.org";
	}

	// fallback to default JSON_RPC_URL (if set)
	return process.env.JSON_RPC_URL || "";
}

/**
 * Depending on which of the inputs are available (private key or mnemonic),
 * constructs an account object for use in the hardhat config
 *
 * @param p_key account private key, export private key from mnemonic: https://metamask.io/
 * @param mnemonic 12 words mnemonic, create 12 words: https://metamask.io/
 * @return either [p_key] if p_key is defined, or {mnemonic} if mnemonic is defined
 */
function get_accounts(p_key, mnemonic) {
	return p_key ? [p_key] : mnemonic ? { mnemonic, initialIndex: 0 } : undefined;
}
