//SPDX-License-Identifier: MIT


pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error RandomIpfsNft__RangeOutOfBounds();

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721{
    // when we mint an NFT we will trigger chainlink VRF call to get a random number
    // using that number we will get a random NFT 
    // Pug, Shiba Inu , St. Bernard
    // Pug to be super rare
    // Shiba inu sort of rare
    // St. Bernard common

    // user have to pay to mint an NFT 
    // the owner of the contract can withdraw the ETH

    //Type declarations
    enum Breed{
        PUG,SHIBA_INU, ST_BERNARD
    }

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


    constructor(address vrfCoordinatorV2, uint64 subscriptipnId, bytes32 gasLane, uint32 callbackGasLimit) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random IPFS  NFT", "RIN"){
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptipnId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;

    }



    function requestNFT() public returns(uint256 requestId) {
        requestId = i_vrfCoordinator.requestRandomWords(i_gasLane,i_subscriptionId,REQUEST_CONFIRMATIONS, i_callbackGasLimit,NUM_WORDS);
        s_requestIdToSender[requestId] = msg.sender;

    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override{
        // we need owner because if we do msg.sender then it will be credited to the chainlink coordinator because it is the one who is calling fulfillrandomwords()
        address dinoOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;

        // what does this token look like 
        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        // 0-99
        // 7 -> PUG
        // 88 -> St. Bernard 
        // 45 -> St. Bernard
        // 12 -> Shiba inu

        Breed dogBreed = getBreedFromModdedRng(moddedRng);
        _safeMint(dinoOwner, newTokenId);


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

    function tokenURI(uint256) public view override returns(string memory){
 
    }

}