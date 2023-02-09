require('dotenv').config()
const hre = require('hardhat')

const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000));

async function main() {
  const ethers = hre.ethers
  console.log('network:', await ethers.provider.getNetwork())

  const signer = (await ethers.getSigners())[0]
  console.log('signer:', await signer.getAddress())

  const MintExtension = await ethers.getContractFactory('contracts/v2/MintExtension.sol:MintExtension', { signer: (await ethers.getSigners())[0] })
  let extensionContract;

  const extensionAddress = '0x07Ced0EaFb546C9aEA2a32ab2dEda63916EB94E1';
  const erc721DemoAddress = '0xD66f2a0971a17EA1c4dFC2078C02c1b0A01712A8'
  extensionContract = MintExtension.attach(extensionAddress);
  await extensionContract.updateNftContractAddress(erc721DemoAddress);
  console.log("ERC721 Demo address attatched ==> ", erc721DemoAddress);

  const receiveToken = '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C';
  const amount = '100000000';
  const paymentId = '948DF23C29D';
  const optional = '';
  const reserved = [];

  let receiveTokenContract = await ethers.getContractAt(IERC20_SOURCE, receiveToken, signer);
  await receiveTokenContract.approve(extensionAddress, amount);
  console.log('Token transfer approved');

  await extensionContract.receivePayment(receiveToken, amount, paymentId, optional, reserved);
  console.log('Payment received ');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
