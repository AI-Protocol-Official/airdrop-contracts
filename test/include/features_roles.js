// copy and export all the features and roles constants from different contracts

// Auxiliary BN stuff
const BN = web3.utils.BN;
const TWO = new BN(2);


// Start: ===== RewardSystem =====

// FEATURE_CLAIM_ACTIVE must be enabled in order to allow user to claim pending reward
const FEATURE_CLAIM_ACTIVE = 0x0000_0001;

// ROLE_DATA_ROOT_MANAGER allows setting the Merkle tree root via setInputDataRoot()
const ROLE_DATA_ROOT_MANAGER = 0x0001_0000;

// End: ===== RewardSystem =====


// export all the copied constants
module.exports = {
	FEATURE_CLAIM_ACTIVE,
	ROLE_DATA_ROOT_MANAGER,
};
