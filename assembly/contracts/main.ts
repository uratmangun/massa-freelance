import { generateEvent, Storage, Context } from "@massalabs/massa-as-sdk";

const GREETING_KEY = "greeting";

/**
 * This function is called only once during the contract deployment.
 * It initializes the contract storage.
 */
export function constructor(_: StaticArray<u8>): void {
  // Ensure this function is only called during deployment
  assert(Context.isDeployingContract());

  // Store the "Hello, World!" string in the persistent storage
  Storage.set(GREETING_KEY, "Hello, World!");

  // Emit an event to the blockchain
  generateEvent("Greeting has been set");
}
