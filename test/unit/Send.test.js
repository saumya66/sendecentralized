const { assert, expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../../hardhat-helper-config");
!developmentChains.includes(network.name) ? describe.skip
: describe("Send", function () {
    let accounts, vrfCoordinatorV2MockContract, sendContract, send;
    beforeEach(async() => {
      deployer = (await getNamedAccounts()).deployer
      console.log("Testing Account : ",deployer)
      accounts = await ethers.getSigners();
      await deployments.fixture("all");
      vrfCoordinatorV2MockContract = await ethers.getContract("VRFCoordinatorV2Mock");
      sendContract = await ethers.getContract("SendContract");
      send = await sendContract.connect(deployer);
    })
    describe("Uploading a file", function () {
      it("Generates Random Code", async () => {
        await new Promise(async (resolve, reject) => {
          console.log("In the promise...")
          send.once("RequestFulfilled", async()=> {
            console.log("RequestFulfilled event fired...")
            let generatedrandomNum = await send.getRandomNum();
            console.log("Generated Random Code :", generatedrandomNum);
            resolve()
          })
          console.log("2")
          let txResponse = await send.uploadedFile("QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t",{gasLimit : 2000000});
          // console.log(txResponse.value.toString())
          console.log("let's wait...")
          const txReceipt = await txResponse.wait();
          const requestId = txReceipt.events[1].args.requestId;
          console.log("Generated RequestId : ",requestId)
          await vrfCoordinatorV2MockContract.fulfillRandomWords(
            requestId,
            send.address
          )
        })
      })
    })
});
