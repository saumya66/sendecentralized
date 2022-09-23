const {network} = require('hardhat');

const BASE_FEE = "250000000000000000"  
const GAS_PRICE_LINK = 1e9 

module.exports = async({getNamedAccounts, deployments})=>{
    const {deploy, log} = await deployments;
    const {deployer} = await getNamedAccounts();
    
    const chainId = network.config.chainId;
    
    if(chainId == 31337){
        log("Local Network Detected");
        await deploy("VRFCoordinatorV2Mock",{
            from : deployer, 
            lot : true, 
            args : [BASE_FEE, GAS_PRICE_LINK]
        })
        log("Mocks Deployed!")
        log("----------------------------------------------------------")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log(
            "Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
        )
        log("----------------------------------------------------------")
    }
}

module.exports.tags =["all", "mocks"]