/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: API_URL, // Alchemy or other RPC URL
      accounts: [`0x${PRIVATE_KEY}`],
      gas: "auto",
      gasPrice: "auto",
    },
  },
};
