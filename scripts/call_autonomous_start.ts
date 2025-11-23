import * as dotenv from "dotenv";
import { Account, Web3Provider, Args, OperationStatus } from "@massalabs/massa-web3";

dotenv.config();

async function main() {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("WALLET_PRIVATE_KEY is not defined in .env file");
    }

    // Initialize account from private key
    const account = await Account.fromPrivateKey(privateKey);
    
    // Use Buildnet RPC
    const provider = Web3Provider.buildnet(account);

    const contractAddress = "AS1WvUFoCsL8WwBERhywrj53pPnXk4PW1RBaXvDWYhjpUbgbwsSU";
    const functionName = "start";

    console.log(`Calling function '${functionName}' on contract ${contractAddress}...`);

    try {
        // Call the start function
        const operation = await provider.callSC({
            target: contractAddress,
            func: functionName,
            parameter: new Args().serialize(), // Empty parameter since start takes StaticArray<u8>
            maxGas: 3_000_000n,
            coins: 0n,
            fee: 10_000_000n, // 0.01 MAS
        });

        console.log("Operation sent. Waiting for execution...");
        console.log("Operation ID:", operation.id);
        console.log("Explorer: https://buildnet.massa.net/operations/" + operation.id);
        
        // Wait for execution
        const status = await operation.waitSpeculativeExecution();
        
        console.log("\nStatus:", status);
        
        // Check if operation failed
        if (status === OperationStatus.SpeculativeError) {
            console.log("\n❌ Operation failed during execution\n");
            
            // Get events to see error details
            const events = await operation.getSpeculativeEvents();
            
            if (events && events.length > 0) {
                console.log("--- Error Details ---");
                events.forEach((event, index) => {
                    console.log(`\nEvent ${index + 1}:`);
                    console.log("  Data:", event.data);
                    
                    if (event.context && event.context.is_error) {
                        try {
                            const errorData = JSON.parse(event.data);
                            console.log("  Error Message:", errorData.massa_execution_error || errorData);
                        } catch {
                            console.log("  Raw Error:", event.data);
                        }
                    }
                });
            } else {
                console.log("No error events found.");
            }
            
            process.exit(1);
        } else if (status === OperationStatus.SpeculativeSuccess) {
            console.log("\n✓ Operation executed successfully\n");
            
            // Get and display events
            const events = await operation.getSpeculativeEvents();
            if (events && events.length > 0) {
                console.log("--- Contract Events ---");
                events.forEach((event, index) => {
                    console.log(`Event ${index + 1}: ${event.data}`);
                });
            }
        }

    } catch (error) {
        console.error("Error calling smart contract:", error);
        process.exit(1);
    }
}

main();
