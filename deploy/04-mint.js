const { ethers, network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async function ({ getNamedAccounts }) {
    const { deployer } = await getNamedAccounts();

    //Mint Basic NFT
    const basicNFT = await ethers.getContract("BasicNFT", deployer);
    const basicMintTx = await basicNFT.mintNFT();
    await basicMintTx.wait(1);
    console.log(`Basic NFT index 0 has token URI: ${await basicNFT.tokenURI(0)}`);

    
    
    // Dynamic SVG NFT
    const highValue = ethers.parseEther("2330");
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer);
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue.toString());
    await dynamicSvgNftMintTx.wait(1);
    console.log("kkkkkkkkkkkkkkkkkkkk")
    console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`);




    //Mint  Random IPFS  NFT
    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
    const mintFee = await randomIpfsNft.getMintFee();
    const randomIpfsNftMintTx = await randomIpfsNft.requestNFT({value: mintFee.toString()});
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);
    
    await new Promise(async (resolve, reject) => {
        setTimeout(()=> reject("Timeout: NFTMinted event did not fire"), 300000); // 300 seconds
        
        randomIpfsNft.once("NftMinted", async () =>{
            console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`);
            resolve();
        });
        
        if (developmentChains.includes(network.name)) {
            const requestId = randomIpfsNftMintTxReceipt.event[1].args.requestId.toString();
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock",deployer);
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId,await randomIpfsNft.getAddress());
        }
    });


};
