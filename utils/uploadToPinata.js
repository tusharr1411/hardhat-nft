const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs");
require("dotenv").config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET_KEY = process.env.PINATA_API_SECRET_KEY

const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET_KEY)

async function storeImages(imagesFilePath){
    const fullImagesPath = path.resolve(imagesFilePath);// manage path standard ... like if you give ./image/ like so, it will manage
    const files = fs.readdirSync(fullImagesPath);

    let responses = [];

    console.log("Uploading to IPFS via Pinata...");

    for (fileIndex in files){
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)

        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        }
        
        
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile,options) // pinata part
            responses.push(response);

        }
        catch(error){
            console.log(error)
        }

    }

    return {responses,files}

}


async function storeTokenURIMetadata(metadata){

    const options = {
        pinataMetadata: {
            name: metadata.name,
        },
    }
    try{
        const response = await pinata.pinJSONToIPFS(metadata,options);
        return response
    }
    catch (error){
        console.log(error)
    }
    return null

}

module.exports = {storeImages, storeTokenURIMetadata}