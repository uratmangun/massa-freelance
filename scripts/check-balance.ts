import { parseArgs } from "util";

const RPC_URL = "https://buildnet.massa.net/api/v2";

async function checkBalance(address: string) {
    console.log(`Checking balance for address: ${address}...`);

    try {
        const response = await fetch(RPC_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "get_addresses",
                params: [[address]],
                id: 1,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error("RPC Error:", data.error);
            return;
        }

        const result = data.result;
        if (Array.isArray(result) && result.length > 0) {
            const addressInfo = result[0];
            console.log("\n--- Balance Info ---");
            console.log(`Address:           ${addressInfo.address}`);
            console.log(`Final Balance:     ${addressInfo.final_balance}`);
            console.log(`Candidate Balance: ${addressInfo.candidate_balance}`);
            console.log(`Final Roll Count:  ${addressInfo.final_roll_count}`);
            console.log("--------------------\n");
        } else {
            console.log("Address not found or no data returned.");
        }

    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

// Get address from command line args
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Please provide a Massa address as an argument.");
    console.log("Usage: bun scripts/check-balance.ts <address>");
    process.exit(1);
}

const address = args[0];
checkBalance(address);
