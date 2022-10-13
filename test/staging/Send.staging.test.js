const { assert, expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../hardhat-helper-config");

developmentChains.includes(network.name) ? describe.skip
: describe("Send", function () {
  let deployer, sendContract,send,accounts;
  // console.log("asd")
  beforeEach(async() => {
        // accounts = await ethers.getSigners();
        deployer = (await getNamedAccounts()).deployer
        console.log(deployer)
        send = await ethers.getContract("SendContract", deployer)
        // send = await sendContract.connect(accounts[1]);
        console.log(send.address)
    })
    describe("Request", function () {
      it("Request", async () => {
        console.log("1")
        await new Promise(async (resolve, reject) => {
          console.log("3")
          send.once("RequestFulfilled", async()=> {
            try{
                console.log("Entered");
              let lastRandomNum = await send.getMapping();
              console.log(lastRandomNum.toString())
              resolve()
            } catch (error) {
              console.log(error)
              reject(error)
            }
          })
          console.log("2")
          let txResponse = await send.uploadedFile("QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t", {gasLimit:2000000});
          // console.log(txResponse.value.toString())
          console.log("let's wait...")
          await txResponse.wait(1);
          console.log("let's wait more...")
        })
      })
    })
});
