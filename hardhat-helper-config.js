const networkConfig = {
    
    31337 :{
        name: "hardhat",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
        callbackGasLimit: "500000", // 500,000 gas
    },
    5:{
        name: "goerli",
        subscriptionId: "2189",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    },
    // 137:{
    //     name: "polygon",
    //     subscriptionId: "",
    //     gasLane: "0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93", // 200 gwei
    //     callbackGasLimit: "500000", // 500,000 gas
    //     vrfCoordinatorV2: "0xAE975071Be8F8eE67addBC1A82488F1C24858067",
    // },
    80001:{
        name: "mumbai",
        subscriptionId: "1972",
        gasLane: "0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93", // 200 gwei
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0xAE975071Be8F8eE67addBC1A82488F1C24858067",
    }
}


const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 1
const frontEndContractsFile = "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json"
const frontEndAbiFile = "../nextjs-smartcontract-lottery-fcc/constants/abi.json"

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndAbiFile,
}
