import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "tenderly",
  networks: {
    tenderly: {
      url: process.env.RPC_URL!, // read RPC URL from .env
      accounts: [process.env.PRIVATE_KEY!], // read private key from .env
      chainId: 11155111, // Sepolia
    },
  },
};

export default config;
