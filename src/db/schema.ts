import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  pay: text('pay').notNull(),
  amountMas: text('amount_mas').notNull(),
  intervalValue: integer('interval_value').notNull(),
  intervalUnit: text('interval_unit').notNull(),
  description: text('description').notNull(),
  walletAddress: text('wallet_address').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type InsertJob = typeof jobs.$inferInsert;
export type SelectJob = typeof jobs.$inferSelect;
