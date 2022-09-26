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
        send = await ethers.getContract("Send", deployer)
    })
    describe("Request", function () {
      it("Request", async () => {
        let txResponse = await send.uploadedFile("QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t");
        let txReceipt = await txResponse.wait(1);
        let requestId = txReceipt.events[1].args.requestId;
        let lastRandomNum = await send.getMapping();
        console.log(requestId);
        console.log(lastRandomNum);
        assert(requestId.toNumber()>0)
        assert.equal(0,0) 
      })
    })
});
