import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.7.0",
      },
      {
        version: "0.6.11",
      },
    ],
  },
  networks: {},
};

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default config;
