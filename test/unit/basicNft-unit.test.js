const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BasicNft Unit Test", function () {
          let basicNft, deployer, user1

          beforeEach(async function () {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user1 = accounts.user1

              await deployments.fixture("all")
              basicNft = await ethers.getContract("BasicNft")
          })

          it("Was deployed", async () => {
              assert(basicNft.address)
          })

          describe("constructor", () => {
              it("initializes the NFT correctly", async () => {
                  const name = (await basicNft.name()).toString()
                  assert.equal(name, "Dogie")

                  const symbol = (await basicNft.symbol()).toString()
                  assert.equal(symbol, "DOG")

                  const tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("Mint NFT", () => {
              beforeEach(async () => {
                  const txResponse = await basicNft.mintNft()
                  await txResponse.wait(1)
              })
              it("Allows users to mint an NFT, and updates appropriately", async function () {
                  const tokenURI = await basicNft.tokenURI(0)
                  const tokenCounter = await basicNft.getTokenCounter()

                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, await basicNft.TOKEN_URI())
              })
              it("Show the correct balance and owner of an NFT", async function () {
                  const deployerAddress = deployer.address
                  const deployerBalance = await basicNft.balanceOf(deployerAddress)
                  const owner = await basicNft.ownerOf("0")

                  assert.equal(deployerBalance.toString(), "1")
                  assert.equal(owner, deployerAddress)
              })
          })
      })
