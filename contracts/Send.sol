// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";


contract Send is VRFConsumerBaseV2 { 
    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    mapping(uint256 => string) private randNumToFileHashMap;

    address private owner;
    
    event RequestedRandomCode(uint256 indexed requestId);

    constructor(
        address vrfCoordinator, 
        uint64 subscriptionId,
        bytes32 gasLane, 
        uint32 callbackGasLimit) VRFConsumerBaseV2(vrfCoordinator) {
        owner = msg.sender;
        i_subscriptionId = subscriptionId;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
    } 

    function uploadedFile(string calldata fileHash) public{
        uint requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRandomCode(requestId);
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords 
    ) internal override { 
        uint256 randomNum = randomWords[0];
        console.log(randomNum);
        
    }



}
