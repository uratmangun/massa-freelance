import * as dotenv from "dotenv";
import { Account, Web3Provider, OperationStatus } from "@massalabs/massa-web3";

dotenv.config();

async function main() {
    // Get operation ID from command line args
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("Please provide an operation ID as an argument.");
        console.log("Usage: bun scripts/check-operation.ts <operation_id>");
        console.log("Example: bun scripts/check-operation.ts O12QcovCQ51HCqAXvmkahFuFeQdt4iLgfBv8w568cPsxQXgJQ1s7");
        process.exit(1);
    }

    const operationId = args[0];

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("WALLET_PRIVATE_KEY is not defined in .env file");
    }

    // Initialize account from private key
    const account = await Account.fromPrivateKey(privateKey);
    
    // Use Buildnet RPC
    const provider = Web3Provider.buildnet(account);

    console.log(`Checking operation: ${operationId}`);
    console.log(`Explorer: https://buildnet.massa.net/operations/${operationId}\n`);

    try {
        // Get operation status
        const operationStatus = await provider.getOperationStatus(operationId);
        
        if (!operationStatus) {
            console.log("Operation not found or not yet processed.");
            return;
        }

        console.log("--- Operation Status ---");
        console.log("Status:", operationStatus);
        
        // Check if operation is in speculative state
        if (operationStatus === OperationStatus.SpeculativeSuccess || 
            operationStatus === OperationStatus.SpeculativeError) {
            
            console.log("\n--- Speculative Events ---");
            try {
                const events = await provider.getEvents({
                    operationId: operationId,
                    isFinal: false
                });
                
                if (events && events.length > 0) {
                    events.forEach((event, index) => {
                        console.log(`\nEvent ${index + 1}:`);
                        console.log("  Data:", event.data);
                        if (event.context) {
                            console.log("  Context:", JSON.stringify(event.context, null, 2));
                        }
                    });
                } else {
                    console.log("No events found.");
                }
            } catch (eventError) {
                console.log("Could not retrieve speculative events:", eventError);
            }
        }
        
        // Check if operation is finalized
        if (operationStatus === OperationStatus.Success || 
            operationStatus === OperationStatus.Error) {
            
            console.log("\n--- Final Events ---");
            try {
                const finalEvents = await provider.getEvents({
                    operationId: operationId,
                    isFinal: true
                });
                
                if (finalEvents && finalEvents.length > 0) {
                    finalEvents.forEach((event, index) => {
                        console.log(`\nEvent ${index + 1}:`);
                        console.log("  Data:", event.data);
                        if (event.context) {
                            console.log("  Context:", JSON.stringify(event.context, null, 2));
                        }
                    });
                } else {
                    console.log("No final events found.");
                }
            } catch (eventError) {
                console.log("Could not retrieve final events:", eventError);
            }
        }

        console.log("\n✓ Operation check complete");

    } catch (error) {
        console.error("Error checking operation:", error);
        process.exit(1);
    }
}

main();
