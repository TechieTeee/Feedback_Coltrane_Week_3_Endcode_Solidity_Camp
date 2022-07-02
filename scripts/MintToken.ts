import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as tokenJSON from "../artifacts/contracts/Token.sol/MyToken.json";

import { MyToken } from "../typechain";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

const DEPLOYMENT_ADDRESS = "0x99e7c2f1f28c7f151Db0b8BFa41C98e2AE3C71b0";

async function main() {
  // copy of wallet setup from deploy.ts
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  const tokenAddress = DEPLOYMENT_ADDRESS;

  console.log(
    `Attaching token contract interface to address given: ${tokenAddress}`
  );

  const tokenContract: MyToken = new Contract(
    tokenAddress,
    tokenJSON.abi,
    signer
  ) as MyToken;

  const receiver = process.argv[2];
  const amount = parseInt(process.argv[3]);

  console.log(`Minting ${amount} to ${receiver}`);

  const mintTx = await tokenContract.mint(receiver, amount);
  console.log("Awaiting confirmation...");
  await mintTx.wait();
  console.log(`Tokens succesfully minted to ${receiver}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
