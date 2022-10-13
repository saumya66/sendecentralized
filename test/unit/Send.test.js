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
      send = await sendContract.connect(accounts[0]);
    })
    describe("Request", function () {
      it("Request", async () => {
        console.log("1")
        await new Promise(async (resolve, reject) => {
          console.log("3")
          send.once("RequestFulfilled", async()=> {
            console.log("Entered");
            let lastRandomNum = await send.getMapping();
            console.log(lastRandomNum.toString())
            resolve()
          })
          console.log("2")
          let txResponse = await send.uploadedFile("QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t",{gasLimit : 300000});
          console.log(txResponse.value.toString())
          const txReceipt = await txResponse.wait();
          const requestId = txReceipt.events[1].args.requestId;
          console.log(requestId)
          await vrfCoordinatorV2MockContract.fulfillRandomWords(
            requestId,
            send.address
          )
        })
      })
    })
});
