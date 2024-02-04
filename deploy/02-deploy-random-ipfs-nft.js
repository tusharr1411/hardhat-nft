const { network, ethers } = require("hardhat");
const { developmentChains,networkConfig,} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const { storeImages} = require("../utils/uploadToPinata");
require("dotenv").config();


const imagesLocation = "./images/randomIpfsNFT"



module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let tokenUris;
    // get the Ipfs hashes of images programmatically 
    if(process.env.UPLOAD_TO_PINATA == "true"){
        tokenUris = await handleTokenUris();

    }
    // with our own IPFS node
    //2. 
    // 3. NFT.storage ( filecoin) (best)




    let vrfCoordinatorV2Address, subscriptionId;

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        );
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address;

        // lets create the subscription
        const tx = await VRFCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait(1);

        // subscriptionId = txReceipt.events[0].args.subId;
        subscriptionId = 1;
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

    log("---------------------------------");
    await storeImages(imagesLocation);

    // const args = [
    //     vrfCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[chainId].gasLane,
    //     networkConfig[chainId].callbackGasLimit,
    //     // toekn URI
    //     networkConfig[chainId].mintFee,

    // ];
};


async function handleTokenUris(){
    tokenUris = []
    //store the both image and  then metadata



    return tokenUris;
}


module.exports.tags = ["all" , "randomipfs", "main"]