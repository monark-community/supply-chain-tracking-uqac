import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import fs from "fs";
import path from "path";


import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

// Read RPC URL, contract address, private key from environment variables
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;


// Infos pour Tenderly verification automatique
const TENDERLY_PROJECT = "chainproof"; // ton projet Tenderly
const TENDERLY_USERNAME = "syphaxlch"; // ton username Tenderly
const TENDERLY_AUTOMATIC_VERIFICATION = true;

// --- Wallet client pour signer les transactions ---
const walletClient = createWalletClient({
  account: privateKeyToAccount(PRIVATE_KEY as `0x${string}`),
  chain: sepolia,
  transport: http(RPC_URL),
});

(async () => {
  try {
    // Charge l'artefact compilé du contrat
    const contractJson = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../artifacts/contracts/SupplyChain.sol/SupplyChain.json"),
        "utf8"
      )
    );

    // Déploiement
    const deployed = await walletClient.deployContract({
      abi: contractJson.abi,
      bytecode: contractJson.bytecode,
      args: [], // constructeur
    });

    console.log("✅ Contract deployed at:", deployed);

    if (TENDERLY_AUTOMATIC_VERIFICATION) {
      console.log(
        `🔹 Tenderly automatic verification enabled for project "${TENDERLY_PROJECT}" and user "${TENDERLY_USERNAME}"`
      );
      console.log(
        "You should see your contract source automatically linked in your Tenderly dashboard."
      );
    }
  } catch (error) {
    console.error("❌ Deployment failed:", error);
  }
})();
