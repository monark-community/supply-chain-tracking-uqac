import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Find the nearest .env by walking up from the current working directory.
// This avoids using `import.meta` so TypeScript doesn't require changing the module target.
function findEnvPath(startDir = process.cwd(), filename = ".env") {
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, filename);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const envPath = findEnvPath(process.cwd()) || path.resolve(process.cwd(), "../../.env");
dotenv.config({ path: envPath });

// --- Environment variables ---
const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT!;
const TENDERLY_USERNAME = process.env.TENDERLY_USERNAME!;
const TENDERLY_AUTOMATIC_VERIFICATION =
  process.env.TENDERLY_AUTOMATIC_VERIFICATION === "true";

// --- Create wallet client ---
const walletClient = createWalletClient({
  account: privateKeyToAccount(PRIVATE_KEY as `0x${string}`),
  chain: sepolia,
  transport: http(RPC_URL),
});

(async () => {
  try {
    const contractJson = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "../artifacts/contracts/SupplyChain.sol/SupplyChain.json"
        ),
        "utf8"
      )
    );

    const deployed = await walletClient.deployContract({
      abi: contractJson.abi,
      bytecode: contractJson.bytecode,
      args: [],
    });

    console.log("🚀 Contract deployed at:", deployed);

    if (TENDERLY_AUTOMATIC_VERIFICATION) {
      console.log(
        `🔹 Tenderly automatic verification enabled for "${TENDERLY_PROJECT}" / "${TENDERLY_USERNAME}".`
      );
    }
  } catch (error) {
    console.error("❌ Deployment failed:", error);
  }
})();
