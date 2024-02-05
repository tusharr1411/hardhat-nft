const { developmentChains } = require("../helper-hardhat-config");
const { DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config");



module.exports = async function (hre) {
    const { deployments, getNamedAccounts, network, ethers } = hre;

    const BASE_FEE = ethers.parseEther("0.25"); // 0.25 is the premium. It costs 0.25 Link per request;
    const GAS_PRICE_LINK = 1e9; // 1000,000,000 // link per gas. Calculated value based on the gas price of the

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const args = [BASE_FEE, GAS_PRICE_LINK];

    if (developmentChains.includes(network.name)) {
        log("Local Network detected ! Deploying mocks...");
        // deploy a mock vrfCoordinator...
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        });

        
        await deploy("MockV3Aggregator", {
            from: deployer,
            args:[DECIMALS, INITIAL_PRICE],
            log: true,
        })
        


        log("Mocks Deployed !");
        log("--------------------------------------------");
    }
};

module.exports.tags = ["all", "mocks"];
