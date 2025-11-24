# Massa Freelance

A decentralized freelance platform built on the [Massa](https://massa.net/) blockchain. This project leverages Massa's unique features like autonomous smart contracts to create a robust and efficient marketplace for freelancers and clients.

## Features

- **Decentralized Platform**: Built on the Massa blockchain for transparency and security.
- **Smart Contracts**: Custom AssemblyScript contracts for handling agreements and transactions.
    - **Autonomous Execution**: Utilizes Massa's autonomous smart contracts (`autonomous.ts`) for automated tasks.
- **Modern Frontend**: Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) for a responsive and performant user interface.
- **Database Integration**: Uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL for efficient data management.
- **Developer Tools**: Includes scripts for contract deployment, balance checking, and debugging.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Lucide React
- **Blockchain**: Massa Web3, AssemblyScript (for Smart Contracts)
- **Database**: PostgreSQL, Drizzle ORM
- **Tooling**: Biome (Linting/Formatting), Bun (Script Runner)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (for running scripts)
- [PostgreSQL](https://www.postgresql.org/) database

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd massa-freelance
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Environment Setup

Copy the example environment file and update it with your credentials:

```bash
cp .env.example .env
```

Make sure to configure your database connection string and Massa node details in the `.env` file.

### 4. Database Setup

Generate and migrate the database schema:

```bash
npm run db:generate
npm run db:migrate
```

### 5. Smart Contracts

Compile the AssemblyScript smart contracts:

```bash
npm run build:wasm
```

To deploy the contracts (requires a running Massa node and configured wallet):

```bash
npm run deploy:contract
# or for autonomous contracts
npm run deploy:autonomous
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the Next.js application for production.
- `npm run lint`: Runs Biome to check for linting errors.
- `npm run format`: Formats code using Biome.
- `npm run build:wasm`: Compiles smart contracts to WebAssembly.
- `npm run deploy:contract`: Deploys the main smart contract.
- `npm run check:operation`: Checks the status of a Massa operation.
- `bun scripts/fetch-akindo-submissions.ts`: Fetches submissions from Akindo.

## Project Structure

- `src/app`: Next.js application pages and components.
- `src/db`: Database schema and configuration.
- `assembly`: Smart contracts written in AssemblyScript.
- `scripts`: Utility scripts for deployment, testing, and data fetching.
- `drizzle`: Database migration files.

## License

[MIT](LICENSE)
