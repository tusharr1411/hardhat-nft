const { network, ethers } = require("hardhat");
const {developmentChains,networkConfig,} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {storeImages,storeTokenURIMetadata,} = require("../utils/uploadToPinata");
require("dotenv").config();

const imagesLocation = "./images/randomIpfsNFT";

const metadataTemplate = {
    name: "",
    description: "",
    image: "", // image uri
    attributes: [ {trait_type: "Cuteness",value: 100,} , ],
};


const FUND_AMOUNT = "1000000000000000000000"

let tokenUris = [
    'ipfs://QmVp7BAyngvNKG2JCPNRcgqVm2Yc99MVMDvdmMqvtDaqb1',
    'ipfs://Qmf8vi9eT3FYpo8AsGMSUrBqmDf5gNAoF8UWvG1iZTPbBQ',
    'ipfs://QmVt7Hv6iTeBWPuumNN9Epidc5XY7GLrGX1R6Anv45Du5r'
];


module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfCoordinatorV2Address, subscriptionId;


    // get the Ipfs hashes of images programmatically
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris();
    }
    // 1. with our own IPFS node
    // 2. pinata
    // 3. NFT.storage ( filecoin) (best)


    // deploying mocks for development chains ------------------------------------------
    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = await VRFCoordinatorV2Mock.getAddress(); // .address is working no longer
        // lets create the subscription
        const tx = await VRFCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait(1);
        // subscriptionId = txReceipt.events[0].args.subId;
        subscriptionId = 1;
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    }
    else{
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }
    log("---------------------------------");
    //------------------------------------------------------------------------------------



    const args = [vrfCoordinatorV2Address,subscriptionId,networkConfig[chainId].gasLane,networkConfig[chainId].callbackGasLimit,tokenUris,networkConfig[chainId].mintFee,];

    const randomIpfsNFT = await deploy("RandomIpfsNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log("----------------------------------------");

    // for verification
    if (!developmentChains.includes(network.name) &&process.env.ETHERSCAN_API_KEY) {
        log("Verifying ...");
        await verify(randomIpfsNFT.address, args);
    }
    log("----------------------------------------");
};









async function handleTokenUris() {
    tokenUris = [];
    //store the both image and  then metadata
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation);

    for (imageUploadResponseIndex in imageUploadResponses) {
        // create metadata
        // upload metadata
        let tokenUriMetada = { ...metadataTemplate };
        tokenUriMetada.name = files[imageUploadResponseIndex].replace(".png","");
        tokenUriMetada.description = `An adorable ${tokenUriMetada.name} dino`;
        tokenUriMetada.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
        console.log(` Uploading ${tokenUriMetada.name} ...`);
        // store the JSON to ipfs/pinata
        const metadataUploadResponse = await storeTokenURIMetadata(tokenUriMetada);
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
    }
    console.log("Token URIs uploaded. They are");
    console.log(tokenUris);
    return tokenUris;
}






module.exports.tags = ["all", "randomipfs", "main"];
