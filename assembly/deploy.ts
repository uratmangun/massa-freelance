import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { Account, SmartContract, Web3Provider, IAccount } from "@massalabs/massa-web3";
import { Args, IContractData } from "@massalabs/massa-web3";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deploy() {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("WALLET_PRIVATE_KEY is not set in .env");
    }

    const account = await Account.fromPrivateKey(privateKey);
    
    // Use Buildnet RPC
    const provider = Web3Provider.buildnet(account);

    const address = account.address.toString();
    console.log("Deploying with address:", address);
    
    // Check balance
    // balanceOf takes string[] and returns IBalance[]
    const balances = await provider.balanceOf([address]);
    
    if (!balances || balances.length === 0) {
        throw new Error("No balance data returned");
    }

    const balance = balances[0];
    
    // Log raw balance object properties (handle BigInt manually)
    console.log("Balance object keys:", Object.keys(balance));
    if ((balance as any).balance) {
         console.log("Balance property value:", (balance as any).balance.toString());
    }

    // Based on type definition found: { address: string, balance: bigint }
    const finalBalance = (balance as any).balance || (balance as any).finalBalance || (balance as any).final || 0n;
    
    console.log("Account Balance:", finalBalance.toString(), "MAS");

    if (BigInt(finalBalance) === 0n) {
        throw new Error("Account has 0 balance. Please check if the private key matches the funded address.");
    }

    const wasmPath = path.join(__dirname, "../build/main.wasm");
    const wasmBuffer = readFileSync(wasmPath);

    const contractData: IContractData = {
        contractDataBinary: wasmBuffer,
        constructorArgs: new Args(),
    }

    try {
        const smartContract = await SmartContract.deploy(
            provider,
            contractData.contractDataBinary,
            contractData.constructorArgs,
            {
                fee: 10000000n, // 0.01 MAS
                maxGas: 3_000_000_000n, // 3.0 MAS (Increased gas limit)
                coins: 100_000_000n, // 0.1 MAS to cover contract storage costs
            }
        );

        console.log("Contract deployed at:", smartContract.address);
        // console.log("Operation ID:", smartContract.deployOperationId);
    } catch (error) {
        console.error("Deployment failed:", error);
    }
}

deploy();
