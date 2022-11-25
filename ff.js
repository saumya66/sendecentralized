const { ethers } = require("hardhat");

async function updateContractAbi(){
    const sendContract = await ethers.getContract("SendContract");
    console.log(sendContract.interface.format(ethers.utils.FormatTypes.json));
    
}

updateContractAbi();