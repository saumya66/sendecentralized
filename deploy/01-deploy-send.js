const {network, ethers} = require('hardhat');
const { networkConfig, developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require('../hardhat-helper-config');
const { verify } = require("../utils/verify")

const FUND_AMOUNT = "1000000000000000000000"


module.exports = async({getNamedAccounts, deployments})=>{
    const {deploy, log} = await deployments;
    const {deployer} = await getNamedAccounts();
    console.log("Deployer :",deployer)
    let vrfCoordinatorV2Mock, vrfCoordinatorV2Address,subscriptionId;
    const chainId = network.config.chainId;
    
    if(chainId == 31337){
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        console.log("subscriptionId", subscriptionId.toString())
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    }
    else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[chainId]["subscriptionId"];
    }
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : 1

    log("----------------------------------------------------")
    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["callbackGasLimit"],
    ]
    log(deployer)
    const send = await deploy("SendContract", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(send.address, args)
    }

    // log("Enter lottery with command:")
    // const networkName = network.name == "hardhat" ? "localhost" : network.name
    // log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`)
    log("----------------------------------------------------")
}

module.exports.tags =["all", "send"]