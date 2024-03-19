// Run: npx hardhat run ./scripts/update_merkle_root.js --network base_mainnet root_that_needs_to_be_set

const { web3, deployments } = require("hardhat");
// BN utils
const {
    toBN,
    print_amt,
} = require("./include/bn_utils");
// we use assert to fail fast in case of any errors
const assert = require("assert");

const tree_data = require("./merkle_tree/merkle_tree.json")

async function main() {
    // argv[2] will be the root provided when this script is called
    const root = tree_data.root

    assert(root && root.length == 66, "Invalid root provided")

    // print some useful info on the account we're using for the deployment
    const accounts = await web3.eth.getAccounts();
    const chainId = await web3.eth.getChainId()

    const A0 = network.name === "hardhat" ? accounts[1] : accounts[0];

    const nonce = await web3.eth.getTransactionCount(A0);
    const balance = await web3.eth.getBalance(A0);

    // print initial debug information
    console.log("script: %o", require("path").basename(__filename));
    console.log("network %o %o", chainId, network.name);
    console.log("accounts: %o, service account %o, nonce: %o, balance: %o ETH", accounts.length, A0, nonce, print_amt(balance));

    const deployment = await deployments.get("RewardSystem_Proxy");

    const RewardSystem = artifacts.require("./RewardSystem");

    const contract = new web3.eth.Contract(RewardSystem.abi, deployment.address);

    const tx = await contract.methods.setInputDataRoot(root).send({ from: A0 })

    console.log("reward system %O, is being updated with root %O, tx hash %O", deployment.address, root, tx.transactionHash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
