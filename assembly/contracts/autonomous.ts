import { generateEvent, Storage, Context, Address, Coins, deferredCallRegister, transferCoins } from "@massalabs/massa-as-sdk";
import { Args, stringToBytes, bytesToString } from "@massalabs/as-types";

const RECIPIENT_KEY = "recipient";
const AMOUNT_KEY = "amount";
const INTERVAL_KEY = "interval"; // in slots
const STATE_KEY = "state"; // "RUNNING" or "STOPPED"
const THREAD_COUNT: u64 = 32;

/**
 * Initialize the contract with recipient address, amount per transfer, and interval
 */
export function constructor(args: StaticArray<u8>): void {
  assert(Context.isDeployingContract());

  const parsedArgs = new Args(args);
  const recipient = parsedArgs.nextString().unwrap();
  const amount = parsedArgs.nextU64().unwrap();
  const interval = parsedArgs.nextU64().unwrap(); // in slots

  Storage.set(stringToBytes(RECIPIENT_KEY), stringToBytes(recipient));
  Storage.set(stringToBytes(AMOUNT_KEY), new Args().add(amount).serialize());
  Storage.set(stringToBytes(INTERVAL_KEY), new Args().add(interval).serialize());
  
  // Initialize as STOPPED by default
  Storage.set(stringToBytes(STATE_KEY), stringToBytes("STOPPED"));

  generateEvent(`Contract initialized: recipient=${recipient}, amount=${amount}, interval=${interval}`);
}

/**
 * Start the autonomous coin sending
 */
export function start(_: StaticArray<u8>): void {
  assert(Context.caller() == Context.transactionCreator(), "Caller is not the contract deployer");

  const state = bytesToString(Storage.get(stringToBytes(STATE_KEY)));
  if (state == "RUNNING") {
    generateEvent("Already running");
    return;
  }

  Storage.set(stringToBytes(STATE_KEY), stringToBytes("RUNNING"));
  generateEvent("Started autonomous execution");

  // Kick off the loop immediately
  const intervalBytes = Storage.get(stringToBytes(INTERVAL_KEY));
  const intervalArgs = new Args(intervalBytes);
  const interval = intervalArgs.nextU64().unwrap();

  const currentSlot = Context.currentPeriod() * THREAD_COUNT + u64(Context.currentThread());
  const nextExecutionSlot = currentSlot + interval;

  const nextPeriod = nextExecutionSlot / THREAD_COUNT;
  const nextThread = u8(nextExecutionSlot % THREAD_COUNT);
  
  deferredCallRegister(
    Context.callee().toString(),
    "sendCoinsAutonomously",
    new Context.Slot(nextPeriod, nextThread),
    10_000_000, // 10M gas for execution
    new Args().serialize(),
    0 // no coins to send
  );
}

/**
 * Stop the autonomous coin sending
 */
export function stop(_: StaticArray<u8>): void {
  assert(Context.caller() == Context.transactionCreator(), "Caller is not the contract deployer");

  const state = bytesToString(Storage.get(stringToBytes(STATE_KEY)));
  if (state == "STOPPED") {
    generateEvent("Already stopped");
    return;
  }

  Storage.set(stringToBytes(STATE_KEY), stringToBytes("STOPPED"));
  generateEvent("Stopped autonomous execution");
}

/**
 * Main autonomous function that sends coins and reschedules itself if RUNNING
 */
export function sendCoinsAutonomously(_: StaticArray<u8>): void {
  const caller = Context.caller();
  assert(
    caller == Context.callee() || caller == Context.transactionCreator(),
    "Caller is not authorized"
  );

  // Check if we should continue
  const state = bytesToString(Storage.get(stringToBytes(STATE_KEY)));
  if (state != "RUNNING") {
    generateEvent("Autonomous execution stopped by user command");
    return;
  }

  // Get contract balance
  const balance = Coins.balance();
  
  if (balance == 0) {
    generateEvent("Contract balance is 0, stopping autonomous execution");
    // Auto-stop if out of funds
    Storage.set(stringToBytes(STATE_KEY), stringToBytes("STOPPED"));
    return;
  }

  // Get configuration
  const recipientBytes = Storage.get(stringToBytes(RECIPIENT_KEY));
  const amountBytes = Storage.get(stringToBytes(AMOUNT_KEY));
  const intervalBytes = Storage.get(stringToBytes(INTERVAL_KEY));

  if (recipientBytes.length === 0 || amountBytes.length === 0 || intervalBytes.length === 0) {
    generateEvent("Error: Contract not properly initialized");
    return;
  }

  const recipient = bytesToString(recipientBytes);
  const amountArgs = new Args(amountBytes);
  const amount = amountArgs.nextU64().unwrap();
  
  const intervalArgs = new Args(intervalBytes);
  const interval = intervalArgs.nextU64().unwrap();

  // Send coins to recipient
  const actualAmount = amount > balance ? balance : amount;
  
  // Direct transfer instead of asyncCall
  transferCoins(new Address(recipient), actualAmount);

  generateEvent(`Sent ${actualAmount} nanoMAS to ${recipient}`);

  // Reschedule this function for the next interval
  const nextExecutionSlot = Context.currentPeriod() * THREAD_COUNT + u64(Context.currentThread()) + interval;
  
  const nextPeriod = nextExecutionSlot / THREAD_COUNT;
  const nextThread = u8(nextExecutionSlot % THREAD_COUNT);

  deferredCallRegister(
    Context.callee().toString(),
    "sendCoinsAutonomously",
    new Context.Slot(nextPeriod, nextThread),
    10_000_000, // 10M gas for execution
    new Args().serialize(),
    0 // no coins to send
  );

  generateEvent(`Next execution scheduled for slot ${nextExecutionSlot}`);
}

/**
 * Receive coins function to accept transfers
 */
export function receiveCoins(args: StaticArray<u8>): void {
  const parsedArgs = new Args(args);
  const amount = parsedArgs.nextU64().unwrap();
  generateEvent(`Received ${amount} MAS`);
}
