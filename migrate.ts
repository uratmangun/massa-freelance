import 'dotenv/config';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './src/db';

async function main() {
  try {
    await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });
    console.log('Migrations applied successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
}

void main();
