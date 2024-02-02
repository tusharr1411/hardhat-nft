// wer are going to skip a bit on these tests...

const { assert } = import("chai");

const { network, deployments, ethers } = require("hardhat");

const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT unit Tests", function () {
          let basicNFT, deployer;
          beforeEach(async () => {
              accounts = await ethers.getSigners();
              deployer = accounts[0];
              await deployments.fixture(["basicNFT"]);
              basicNFT = await ethers.getContract("BasicNFT");
              console.log("hhh")
          });

          describe("Constructor", () => {
              it("Initializes the NFT correctly", async () => {
                  const name = await basicNFT.name();
                  const symbol = await basicNFT.symbol();

                  const tokenCounter = await basicNFT.getTokenCounter();
                  assert.equal(name, "Dinosaur");
                  assert.equal(symbol, "DINO");
                  assert.equal(tokenCounter.toString(), "0");
              });
          });
      });
