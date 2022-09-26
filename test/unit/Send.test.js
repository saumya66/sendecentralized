const { assert, expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../hardhat-helper-config");

!developmentChains.includes(network.name) ? describe.skip
: describe("Send", function () {
    let accounts, vrfCoordinatorV2MockContract, sendContract, send;
    beforeEach(async() => {
      accounts = await ethers.getSigners();
      await deployments.fixture("all");
      vrfCoordinatorV2MockContract = await ethers.getContract("VRFCoordinatorV2Mock");
      sendContract = await ethers.getContract("SendContract");
      send = await sendContract.connect(accounts[1]);
    })
    describe("Request", function () {
      it("Request", async () => {
        await send.uploadedFile("QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t");
        let lastRandomNum = await send.getMapping();
        console.log(lastRandomNum);
        assert.equal(0,0) 
      })
    })
});
