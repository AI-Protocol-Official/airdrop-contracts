// Run: npx hardhat run ./scripts/merkle_tree/generate_merkle_tree.js --network base_mainnet

// import Merkle tree related stuff
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");


// we use assert to fail fast in case of any errors
const assert = require("assert");

// we use fs to read/write CSV
const fs = require("fs");

const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const { isAddress } = web3.utils;

/**
 * Calculates keccak256(abi.encodePacked(...)) for the air data - (address, totalReward) pair
 *
 * @param air_data (address, totalReward) pair
 * @return {Buffer} keccak256 hash of tightly packed PlotData fields
 */
function air_data_to_leaf(air_data) {
	// flatten the input land plot object
	const values = Object.values(air_data);
	// feed the soliditySha3 to get a hex-encoded keccak256
	const hash = web3.utils.soliditySha3(...values);

	// return as Buffer
	return MerkleTree.bufferify(hash);
}

async function main() {
	const airdrop_csv_data = fs.readFileSync(`${__dirname}/data.csv`, { encoding: "utf8" })
	const airdrop_csv_rows = airdrop_csv_data.replaceAll("\"", "").split(/[\r\n]+/);

	const airdrop_csv_header = airdrop_csv_rows[0].split(",");
	const address_idx = airdrop_csv_header.indexOf("Address");
	const amount_idx = airdrop_csv_header.indexOf("Amount");
	assert(address_idx >= 0, "malformed CSV data (header \"Address\" not found)");
	assert(amount_idx >= 0, "malformed CSV data (header \"Amount\" not found)");


	const airdrop_csv_body = airdrop_csv_rows.slice(1).filter(row => row.length).map(row => row.split(","));
	assert(airdrop_csv_body.length !== 0, "no CSV data read");
	console.log("%o data rows read", airdrop_csv_body.length);

	const parsed_airdrop_csv_body_object = {};

	airdrop_csv_body.forEach((row) => {
		const address = row[0].toLowerCase(), amount = row[1]

		assert(isAddress(address), `${address} not a valid address`);

		assert(amount && !isNaN(Number(amount)), `${amount} is not a valid amount`)

		assert(!parsed_airdrop_csv_body_object[address], `duplicate address not allowed ${address}`)

		parsed_airdrop_csv_body_object[address] = { to: address, totalReward: amount }
	})

	const parsed_airdrop_csv_body = Object.values(parsed_airdrop_csv_body_object)

	// generate an array of the leaves for a Merkle tree, the tree itself, and its root
	const leaves = parsed_airdrop_csv_body.map(air_data => air_data_to_leaf(air_data));
	const tree = new MerkleTree(leaves, keccak256, { hashLeaves: false, sortPairs: true });
	const root = tree.getHexRoot();

	const rewardList = parsed_airdrop_csv_body.map((row, i) => ({ ...row, leaf: MerkleTree.bufferToHex(tree.getLeaf(i)), proof: tree.getHexProof(leaves[i]) }))

	fs.writeFileSync(`${__dirname}/merkle_tree.json`, JSON.stringify({ root, rewardList }))
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
