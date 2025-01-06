require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",

  networks: {
    localhost:{
      //hardhat node workinh on 8545
      url: "http://127.0.0.1:8545/",
    },
    // sepolia:{
    //   url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`,
    //   accounts:[process.env.PRIVATE_KEY]
    // }
    // hosky:{
    //   url: `https://eth-holesky.g.alchemy.com/v2/Hf4lYAuPOw2agbHN7PqZPLCjPX6FHTvx'
    //   accounts:[process.env.PRIVATE_KEY]
    // }
  }
};
