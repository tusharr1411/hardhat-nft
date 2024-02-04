const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs");

async function storeImages(imagesFilePath){
    const fullImagesPath = path.resolve(imagesFilePath);// manage path standard ... like if you give ./image/ like so, it will manage
    const files = fs.readdirSync(fullImagesPath);

    console.log(files)


}

module.exports = {storeImages}