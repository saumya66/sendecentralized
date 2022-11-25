// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
 
error FileRetrievedAlready();
error AccessDenied();

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
    string private generatedrandomNum;

    mapping(string => string) private randNumToFileHashMap;

    address private owner;
    
    event RequestSent(uint256 requestId);
    event FileRetrieved(string fileHash);
    event RequestFulfilled(string randomNum );

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

    function uploadedFile(string calldata ipfsFileHash) public{
        fileHash = ipfsFileHash;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestSent(requestId);
    }

    function fulfillRandomWords(
        uint256,/*requestId*/ 
        uint256[] memory randomWords 
    ) internal override { 
        uint256 randomNum = randomWords[0];
        string memory str = Strings.toString(randomNum);
        string memory randomNumStr = substring(str,0,5);
        randNumToFileHashMap[randomNumStr] = fileHash;
        generatedrandomNum = randomNumStr;
        emit RequestFulfilled(randomNumStr);
    }

    function getFile(string calldata randNum) public{
        if(keccak256(abi.encodePacked(randNumToFileHashMap[randNum]))==keccak256(abi.encodePacked(""))){
            revert ("File Retrieved Already");
        }
        string memory ipfsFileHash = randNumToFileHashMap[randNum];
        delete randNumToFileHashMap[randNum];
        emit FileRetrieved(ipfsFileHash);
    }
    function getRandomNum() public view returns(string memory){
        return generatedrandomNum;
    }
    function getFileHash(string memory randNum) public view returns(string memory){
        if(msg.sender != owner){
            revert AccessDenied();
        }
        if(keccak256(abi.encodePacked(randNumToFileHashMap[randNum]))==keccak256(abi.encodePacked(""))){
            revert ("File Retrieved Already");
        }
        return randNumToFileHashMap[randNum];
    }
}
