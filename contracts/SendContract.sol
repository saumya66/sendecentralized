// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract SendContract is VRFConsumerBaseV2 { 
    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    string private lastRandomNum;
    string private fileHash;

    mapping(string => string) private randNumToFileHashMap;

    address private owner;
    
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, string lastRandomNum);

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

    /**
     * @dev This function finds the substring.
     */
    function substring(string memory str, uint startIndex, uint endIndex) public pure returns (string memory ) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex+1);
        for(uint i = startIndex; i <= endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }

    function uploadedFile(string calldata ipfsFileHash) public returns (uint256) {
        fileHash = ipfsFileHash;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestSent(requestId, NUM_WORDS);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords 
    ) internal override { 
        uint256 randomNum = randomWords[0];
        string memory str = Strings.toString(randomNum);
        string memory randomNumStr = substring(str,0,5);
        randNumToFileHashMap[randomNumStr] = fileHash;
        lastRandomNum  = randomNumStr;
        emit RequestFulfilled(requestId,lastRandomNum);
    }

    function getMapping() public view returns(string memory)
    {
        return lastRandomNum;
    }

}
