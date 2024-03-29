const networkConfig = {
    31337: {
        name: "localhost",

        wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        lendingPoolAddressesProvider:"0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
        daiToken: "0x6B175474E89094C44Da98b954EedeAC495271d0F",


        interval: "30",
        subscriptionId:"9120",
        callbackGasLimit: "500000",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", //mocs doesn't care about gasLane
        mintFee: "100000000000000000"//0.01 eth
    },

    // Due to the changing testnets, this testnet might not work as shown in the video
    5: {
        name: "goerli",
        wethToken: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
        lendingPoolAddressesProvider:"0x5E52dEc931FFb32f609681B8438A51c675cc232d",// This is the AaveV2 Lending Pool Addresses Provider
        daiEthPriceFeed: "0xb4c4a493AB6356497713A78FFA6c60FB53517c63",// This is LINK/ETH feed
        daiToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",// This is the LINK token
        
        
        interval: "30",
        subscriptionId: "9120",
        callbackGasLimit: "500000",
        gasLane:"0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        mintFee: "100000000000000000",//0.01 eth
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    // Due to the different testnets, we are leaving kovan in as a reference
    11155111: {
        name: "sepolia",
        wethToken:" ",
        lendingPoolAddressesProvider: " ",
        daiEthPriceFeed: " ",
        daiToken: " ",
        
        interval: "30",
        subscriptionId: "9120",
        callbackGasLimit: "500000", // 500,000
        gasLane:"0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        mintFee: "100000000000000000",//0.01 eth
        ethUsdPriceFeed:"0x694AA1769357215DE4FAC081bf1f309aDC325306",
        
    },
    
    42: {
        name: "kovan",
        ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
        wethToken: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
        lendingPoolAddressesProvider:"0x88757f2f99175387aB4C6a4b3067c77A695b0349",
        daiEthPriceFeed: "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541",
        daiToken: "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",

        mintFee: "100000000000000000"//0.01 eth
    },

};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000"

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_PRICE,
};
