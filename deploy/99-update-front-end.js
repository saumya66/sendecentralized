const {ethers} = require('hardhat');
const fs = require('fs')
module.exports = async function(){
    if(process.env.UPDATE_FRONTEND){
        console.log("Updating front end...");
        updateContractAddresses();
        updateContractAbi();
    }
}

const FRONT_END_ADDRESSES_FILE = "../send-f/constants/contractAddresses.json";
const FRONT_END_ABI_FILE = "../send-f/constants/abi.json"

async function updateContractAbi(){
    const sendContract = await ethers.getContract("SendContract");
    fs.writeFileSync(FRONT_END_ABI_FILE, sendContract.interface.format(ethers.utils.FormatTypes.json));
    
}

async function updateContractAddresses(){
    const sendContract = await ethers.getContract("SendContract");
    const contractAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE,"utf-8"));
    const chainId = network.config.chainId.toString();

    if(contractAddress[chainId])
    {
        if(!contractAddress[chainId].includes(sendContract.address)){
            contractAddress[chainId].push(sendContract.address);
        }
    }
    else {
        contractAddress[chainId] = sendContract.address;
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(contractAddress))
}

module.exports.tags= ["all", "frontend"]