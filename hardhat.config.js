require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL 
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL 
const POLYGON_TESTNET_RPC_URL = process.env.POLYGON_TESTNET_RPC_URL;

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key"
const REPORT_GAS = process.env.REPORT_GAS || false

module.exports = {
  solidity: "0.8.17",
  defaultNetwork : "hardhat",
  networks:{
    hardhat : {
      chainId : 31337,
    },
    // mainnet: {
    //   url: MAINNET_RPC_URL,
    //   accounts: PRIVATE_KEY ,
    //   saveDeployments: true,
    //   chainId: 1,
    // },
    goerli : {
      url : GOERLI_RPC_URL,
      chainId : 5,
      accounts: [PRIVATE_KEY],
      saveDeployments : true,
      // gas: 30e6,
      // gasPrice: 10e6

    },
    polygon : {
      url : POLYGON_MAINNET_RPC_URL,
      chainId : 137,
      accounts: [PRIVATE_KEY],
      saveDeployments : true,
    },
    mumbai : {
      url : POLYGON_TESTNET_RPC_URL,
      chainId : 80001,
      accounts: [PRIVATE_KEY],
      // saveDeployments : true,
    },

  },
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
        goerli: ETHERSCAN_API_KEY,
        polygon: POLYGONSCAN_API_KEY,
        polygonMumbai : POLYGONSCAN_API_KEY
    },
  },
  gasReporter: {
      enabled: REPORT_GAS,
      currency: "USD",
      outputFile: "gas-report.txt",
      noColors: true,
      coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  contractSizer: {
      runOnCompile: false,
      only: ["SendContract"],
  },
  namedAccounts: {
      deployer: {
          default: 0, // here this will by default take the first account as deployer
          1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      },
  },
  solidity: {
      compilers: [
          {
              version: "0.8.9",
          },
          {
              version: "0.4.24",
          },
      ],
      solidity: {
        version: "0.8.8",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
  },
  mocha: {
      timeout: 1000000, // 200 seconds max for running tests
  },
};
