//SPDX-License-Identifier: MIT


pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // comes with only owner modifier

error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__NeedMoreETHSent();
error RandomIpfsNft__TransferFailed();

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage, Ownable{
    // when we mint an NFT we will trigger chainlink VRF call to get a random number
    // using that number we will get a random NFT 
    // Pidori, Red, Blue with rarity 
    // user have to pay to mint an NFT 
    // the owner of the contract can withdraw the ETH




    //Type declarations
    enum Breed{PIDORI,BLUE, RED}

    //Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3; 
    uint32 private constant NUM_WORDS = 1;

    //VRF Helpers
    mapping (uint256 => address) public s_requestIdToSender;



    ///NFT Variables
    uint256 public s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;
    string[] internal s_dinoTokenURIS;
    uint256 internal immutable i_mintFee;

    // events

    event NFTRequested(uint256 indexed requestId, address requester);
    event NFTMinted(Breed dinoBreed, address minter);


    //constructor for the contract
    constructor(address vrfCoordinatorV2, uint64 subscriptipnId, bytes32 gasLane, uint32 callbackGasLimit, string[3] memory dinoTokenURIs, uint256 mintFee) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random IPFS  NFT", "RIN"){
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptipnId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
        s_dinoTokenURIS = dinoTokenURIs;
        i_mintFee = mintFee;
        
    }



    function requestNFT() public payable returns(uint256 requestId) {
        if(msg.value< i_mintFee ){
            revert RandomIpfsNft__NeedMoreETHSent();
        }
        requestId = i_vrfCoordinator.requestRandomWords(i_gasLane,i_subscriptionId,REQUEST_CONFIRMATIONS, i_callbackGasLimit,NUM_WORDS);
        s_requestIdToSender[requestId] = msg.sender;
        emit NFTRequested(requestId , msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override{
        // we need owner because if we do msg.sender then it will be credited to the chainlink coordinator because it is the one who is calling fulfillrandomwords()
        address dinoOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;

        // what does this token look like 
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        Breed dinoBreed = getBreedFromModdedRng(moddedRng);

        _safeMint(dinoOwner, newTokenId);
        _setTokenURI(newTokenId,s_dinoTokenURIS[uint256(dinoBreed)] /*that breed's token URI*/);
        emit NFTMinted(dinoBreed,dinoOwner);
    }






    function getBreedFromModdedRng(uint256 moddedRng) public pure returns( Breed){
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        //moddedRng =25
        //i=0
        //cumulativeSum = 0
        for(uint256 i = 0; i<chanceArray.length;i++){
            if(moddedRng>= cumulativeSum && moddedRng< (cumulativeSum+ chanceArray[i])){
                return Breed(i);
            }
            cumulativeSum = chanceArray[i];
        }
        revert RandomIpfsNft__RangeOutOfBounds();
    }




    function getChanceArray() public pure returns(uint256[3] memory ){
        return [10,30,MAX_CHANCE_VALUE];
    }

    // view functions 
    function getMintFee() public view returns(uint256){return i_mintFee;}
    function getDinoTokenURIS(uint256 index) public view returns(string memory){return s_dinoTokenURIS[index];}
    function getTokenCounter() public view returns(uint256 ){return s_tokenCounter;}



}