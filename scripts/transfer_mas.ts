import * as dotenv from "dotenv";
import { Account, Web3Provider } from "@massalabs/massa-web3";

dotenv.config();

async function main() {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("WALLET_PRIVATE_KEY is not defined in .env file");
    }

    // Get recipient address from command line args
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("Please provide a recipient address as an argument.");
        console.log("Usage: bun scripts/transfer_mas.ts <recipient_address>");
        process.exit(1);
    }

    const recipientAddress = args[0];

    // Initialize account from private key
    const account = await Account.fromPrivateKey(privateKey);
    
    // Use Buildnet RPC
    const provider = Web3Provider.buildnet(account);

    // Amount to transfer: 1 MAS = 1_000_000_000 nanoMAS
    const amountToTransfer = 1_000_000_000n;

    console.log(`Transferring 1 MAS to ${recipientAddress}...`);
    console.log(`From address: ${account.address.toString()}`);

    try {
        // Transfer MAS coins
        const operation = await provider.transfer(
            recipientAddress,
            amountToTransfer,
            {
                fee: 10_000_000n, // 0.01 MAS
            }
        );

        console.log("Transfer operation sent. Waiting for execution...");
        
        // Wait for operation to be included in a speculative block
        await operation.waitSpeculativeExecution();
        
        console.log("✓ Transfer successful!");
        console.log("Operation ID:", operation.id);
        console.log(`Transferred 1 MAS to ${recipientAddress}`);

    } catch (error) {
        console.error("Transfer failed:", error);
        process.exit(1);
    }
}

main();
