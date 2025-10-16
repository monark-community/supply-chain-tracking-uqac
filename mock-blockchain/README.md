# Mock blockchain (local test environment)

This folder contains a small Hardhat-based mock blockchain used for local
development and testing of the `SupplyChain` contract. It includes two
convenience scripts to populate and read example transactions.

## Quick start

1. Install dependencies (from repo root):

```pwsh
npm install
```

2. Start a local Hardhat node (recommended):

```pwsh
npx hardhat node
```

3. In another terminal, deploy contracts or ensure the `SupplyChain` contract
   is deployed to the local node. If you used Ignition to deploy, the
   address will be stored under `ignition/deployments/chain-31337/deployed_addresses.json`.

4. Populate transactions (reads `mock-blockchain/data/transactions.json`):

```pwsh
npx hardhat run ./scripts/addTransactions.ts --network localhost
```

5. Read stored transactions:

```pwsh
npx hardhat run ./scripts/getTransactions.ts --network localhost
```

## Files of interest

- `contracts/SupplyChain.sol` — the example contract used for tests.
- `scripts/addTransactions.ts` — reads `data/transactions.json` and calls
  `addTransaction` for each entry.
- `scripts/getTransactions.ts` — fetches transactions from the contract and
  prints them as JSON.
- `ignition/` — ignition modules and deployment outputs. After an Ignition
  deployment, addresses are available in `ignition/deployments/chain-<id>/`.

## Environment variables

- `RPC_URL` — custom RPC endpoint to use instead of the default `http://127.0.0.1:8545`.
- `SUPPLYCHAIN_ADDRESS` — override the address resolution if you want to point
  the scripts at a specific deployed contract.
- `TRANSACTIONS_FILE` — (not implemented by default) you may modify the
  scripts to consume this env var to point to a custom fixture.

## Notes and troubleshooting

- The scripts intentionally avoid depending on the `hardhat-ethers` plugin so
  they remain usable in a variety of contexts. They read compiled artifacts
  via `hre.artifacts` and use the standalone `ethers` library for RPC and
  signing.
- If `getTransactions.ts` fails with `Do not know how to serialize a BigInt`,
  ensure numeric fields are not outside JavaScript's safe integer range or
  change the script to stringify big integers as strings.

If you'd like, I can convert these scripts into proper Hardhat tasks for a
cleaner developer experience or add a sample `data/transactions.json` fixture.
# Sample Hardhat 3 Beta Project (`node:test` and `viem`)

This project showcases a Hardhat 3 Beta project using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.

To learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

## Project Overview

This example project includes:

- A simple Hardhat configuration file.
- Foundry-compatible Solidity unit tests.
- TypeScript integration tests using [`node:test`](nodejs.org/api/test.html), the new Node.js native test runner, and [`viem`](https://viem.sh/).
- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `node:test` tests:

```shell
npx hardhat test solidity
npx hardhat test nodejs
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
