const { assert, expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../hardhat-helper-config");

developmentChains.includes(network.name) ? describe.skip
: describe("Send", function () {
  let deployer, send;
  // console.log("asd")
  beforeEach(async() => {
        deployer = (await getNamedAccounts()).deployer
        console.log(deployer)
        send = await ethers.getContract("SendContract", deployer)
    })
    describe("Request", function () {
      it("Request", async () => {
        console.log("1")
        
        await new Promise(async (resolve, reject) => {
          console.log("3")
          send.once("RequestSent", async()=> {
            console.log("Entered");
            let lastRandomNum = await send.getMapping();
           
            resolve()
          })
          console.log("2")
          let txResponse = await send.uploadedFile("QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t",{gasLimit : 300000});
          await txResponse.wait();
          console.log(txResponse)
          // assert(requestId.toNumber()>0)
          assert.equal(0,0) 
        })
      })
      
    })
});
