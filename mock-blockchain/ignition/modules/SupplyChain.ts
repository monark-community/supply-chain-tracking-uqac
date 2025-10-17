import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Ignition module wrapper for the SupplyChain contract.
 *
 * This file registers the compiled `SupplyChain` contract with Hardhat
 * Ignition so that other ignition scripts can reference it by name and
 * deploy/interact with it during local environment startup.
 *
 * The module exposes a single property:
 * - `supplyChain`: a contract factory/handle corresponding to `SupplyChain`.
 */
const SupplyChainModule = buildModule("SupplyChainModule", (m) => {
  // Register the contract by its artifact name. Ignition will resolve
  // the contract's ABI and bytecode from the compiled artifacts.
  const supplyChain = m.contract("SupplyChain");

  // Return an object containing exported handles. Other ignition modules
  // or scripts that import this module will receive these properties.
  return { supplyChain };
});

// Default export so this module can be imported using `import SupplyChainModule from './SupplyChain'`
export default SupplyChainModule;
