require('dotenv').config()
const hre = require('hardhat')

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000));

async function main() {
  const ethers = hre.ethers
  console.log('network:', await ethers.provider.getNetwork())

  const signer = (await ethers.getSigners())[0]
  console.log('signer:', await signer.getAddress())

  const ERC721Demo = await ethers.getContractFactory('contracts/v2/ERC721Demo.sol:ERC721Demo', { signer: (await ethers.getSigners())[0] })
  let nftContract;

  nftContract = await ERC721Demo.deploy();
  await nftContract.deployed();
  await sleep(30);
  console.log("Mint extension deployed to: ", nftContract.address);

  const extensionAddress = '0x07Ced0EaFb546C9aEA2a32ab2dEda63916EB94E1';
  await nftContract.updateMinter(extensionAddress);
  console.log("Minter changed to extension contract ==> ", extensionAddress);

  await hre.run('verify:verify', {
    address: nftContract.address,
    constructorArguments: [],
    contract: "contracts/v2/ERC721Demo.sol:ERC721Demo"
  })
  console.log("Mint extension verified: ", nftContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
