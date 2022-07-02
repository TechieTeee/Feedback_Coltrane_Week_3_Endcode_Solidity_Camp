// imports -> ethers lib, dotenv, and contract data compiled to json
import { ethers } from "ethers";
import "dotenv/config";
import * as tokenJSON from "../artifacts/contracts/Token.sol/MyToken.json";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  // we can attach the wallet to our private key, knowing we have it in the dotenv.
  // the exposed key is added to keep typescript happy (always returns a value)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  //.getBalance() returns of type BigNumber, we must parse this correctly to integrate w our scripts
  const balanceBigNumber = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBigNumber));

  console.log(`Wallet balance at ${wallet.address} is ${balance}`);

  // confirm wallet has enough ether to operate
  if (balance < 0.01) {
    throw new Error("The wallet provided does not have enough ether!");
  }

  console.log("Deploying Token Contract");

  // create contract factory with ethers, passing compiled json info as args
  const tokenFactory = new ethers.ContractFactory(
    tokenJSON.abi,
    tokenJSON.bytecode,
    signer
  );

  // use convertStringArray helper to deploy with args as Bytes32
  const tokenContract = await tokenFactory.deploy();

  console.log("Awaiting deployment confirmation...");

  await tokenContract.deployed();

  console.log("Completed");
  console.log(`Contract deployed at ${tokenContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
