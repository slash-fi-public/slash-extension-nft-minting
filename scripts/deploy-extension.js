require('dotenv').config()
const hre = require('hardhat')

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000));

async function main() {
  const ethers = hre.ethers
  console.log('network:', await ethers.provider.getNetwork())

  const signer = (await ethers.getSigners())[0]
  console.log('signer:', await signer.getAddress())

  const MintExtension = await ethers.getContractFactory('contracts/v2/MintExtension.sol:MintExtension', { signer: (await ethers.getSigners())[0] })
  let extensionContract;
  
  extensionContract = await MintExtension.deploy();
  await extensionContract.deployed();
  await sleep(30);
  console.log("Mint extension deployed to: ", extensionContract.address);

  await hre.run('verify:verify', {
    address: extensionContract.address,
    constructorArguments: []
  })
  console.log("Mint extension verified: ", extensionContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
