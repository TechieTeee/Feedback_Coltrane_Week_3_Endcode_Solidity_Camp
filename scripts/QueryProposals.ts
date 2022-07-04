import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJSON from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

import { CustomBallot } from "../typechain";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

const DEPLOYMENT_ADDRESS = "0xA5dE12Da726dAd66d4739feF9Cb6E5Bca46614C5";

async function main() {
  // copy of wallet setup from deploy.ts
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  const ballotAddress = DEPLOYMENT_ADDRESS;

  console.log(
    `Attaching ballot contract interface to address given: ${ballotAddress}`
  );

  const ballotContract: CustomBallot = new Contract(
    ballotAddress,
    ballotJSON.abi,
    signer
  ) as CustomBallot;

  console.log("Proposal Names: ");

  // log the names of each
  for (let i = 0; i < 3; i++) {
    const prop = (await ballotContract.proposals(i)).name;
    console.log(ethers.utils.parseBytes32String(prop));
  }

  await ballotContract.winningProposal();
  const winner = await ballotContract.winnerName();

  console.log(
    `The current winning proposal is ${ethers.utils.parseBytes32String(winner)}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
