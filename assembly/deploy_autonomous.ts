import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { Account, SmartContract, Web3Provider, IContractData, Args } from "@massalabs/massa-web3";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("WALLET_PRIVATE_KEY is not defined in .env file");
    }

    // Initialize account from private key
    const account = await Account.fromPrivateKey(privateKey);
    
    // Use Buildnet RPC
    const provider = Web3Provider.buildnet(account);

    const address = account.address.toString();
    console.log("Deploying with address:", address);
    
    // Check balance
    const balances = await provider.balanceOf([address]);
    
    if (!balances || balances.length === 0) {
        throw new Error("No balance data returned");
    }

    const balance = balances[0];
    
    // Handle balance property access safely
    const finalBalance = (balance as any).balance || (balance as any).finalBalance || (balance as any).final || 0n;
    
    console.log("Account Balance:", finalBalance.toString(), "MAS");

    if (BigInt(finalBalance) === 0n) {
        throw new Error("Account has 0 balance. Please check if the private key matches the funded address.");
    }

    // Load the autonomous contract wasm
    const wasmPath = path.join(__dirname, "../build/autonomous.wasm");
    
    try {
        const wasmBuffer = readFileSync(wasmPath);

        // Configuration for the autonomous contract
        const args = new Args();
        // Recipient address (using the deployer address for testing, or replace with another valid address)
        args.addString("AU1aFB5krGuiUmcRQHPBRXHuXS2Y2pw8nRjHAVQd157XikZNj4UT"); 
        // Amount per transfer (1 MAS = 10^9 nanoMAS)
        // 0.1 MAS per transfer = 100_000_000 nanoMAS
        args.addU64(100_000_000n); 
        // Interval in slots (128 slots = 4 periods = ~1 minute)
        // 1 period = 32 slots, so 4 periods = 128 slots
        args.addU64(128n);

        const contractData = {
            contractDataBinary: wasmBuffer,
            constructorArgs: args,
        };

        console.log("Deploying autonomous smart contract...");

        const smartContract = await SmartContract.deploy(
            provider,
            contractData.contractDataBinary,
            contractData.constructorArgs,
            {
                fee: 10_000_000n, // 0.01 MAS
                maxGas: 3_000_000_000n, // 3.0 MAS
                coins: 100_000_000n, // 0.1 MAS to cover contract storage costs
            }
        );

        console.log("Contract deployed at:", smartContract.address);
        console.log("Operation ID:", smartContract.deployOperationId);
        
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.error("Error: build/autonomous.wasm not found. Please run 'npm run build:autonomous' first.");
        } else {
            console.error("Deployment failed:", error);
        }
        process.exit(1);
    }
}

deploy();
