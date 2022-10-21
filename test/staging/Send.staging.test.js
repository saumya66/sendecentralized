const { assert, expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../hardhat-helper-config");

developmentChains.includes(network.name) ? describe.skip
: describe("Send", function () {
  let deployer, sendContract,send,accounts;
  beforeEach(async() => {
        deployer = (await getNamedAccounts()).deployer
        console.log("Testing Account : ",deployer)
        send = await ethers.getContract("SendContract", deployer)
        console.log("Contract Address : ",send.address)
    })
    describe("Uploading a file", function () {
      it("Generates Random Code", async () => {
        await new Promise(async (resolve, reject) => {
          console.log("In the promise...")
          send.once("RequestFulfilled", async()=> {
            try{
              console.log("RequestFulfilled event fired...");
              let generatedrandomNum = await send.getRandomNum();
              console.log("Generated Random Code :",generatedrandomNum);
              assert.equal(generatedrandomNum.length, 6)
              // let fileHash = await send.getFileHash();
              let txResponse = await send.getFile(generatedrandomNum);
              console.log("a");
              let txReceipt = await txResponse.wait();
              console.log("b");
              let uploadedFileHash = txReceipt.events[0].args.fileHash;
              console.log("c");
              console.log("FileHash", uploadedFileHash)
              assert.equal(uploadedFileHash , "QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t" )
              resolve()
            } catch (error) {
              console.log(error)
              reject(error)
            }
          })
          console.log("2")
          let txResponse = await send.uploadedFile("QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t", {gasLimit:2000000});
          console.log("let's wait...")
          await txResponse.wait(1);
          console.log("let's wait more...")
        })
      })
    })
});
