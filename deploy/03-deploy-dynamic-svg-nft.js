const { network, ethers } = require("hardhat");
const { developmentChains,networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs")
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let ethUsdPriceFeedAddress;



    if(developmentChains.includes(network.name)){
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator");
        ethUsdPriceFeedAddress = await EthUsdAggregator.getAddress();
    }
    else{
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }




    log("Deploying Dynamic SVG NFT....")
    

    const lowSVG = await fs.readFileSync("./images/dynamicNFT/frown.svg", {encoding:"utf8"});
    const highSVG = await fs.readFileSync("./images/dynamicNFT/happy.svg", {encoding: "utf8"});

    args = [ethUsdPriceFeedAddress, lowSVG,highSVG];

    const dynamicSvgNft = await deploy("DynamicSvgNft",{
        from:deployer,
        log:true,
        args: args,
        waitConfirmations : network.config.blockConfirmations || 1,

    })


    // verifications
    // if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
    //     log("Verifying on etherscan...");
    //     let nftAddress = await dynamicSvgNft.getAddress();
    //     await verify(nftAddress, args);
    // } 


};

module.exports.tags = ["all", "dynamicsvg", "main"]
