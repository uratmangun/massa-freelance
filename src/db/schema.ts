import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  pay: text('pay').notNull(),
  amountMas: text('amount_mas').notNull(),
  intervalValue: integer('interval_value').notNull(),
  intervalUnit: text('interval_unit').notNull(),
  description: text('description').notNull(),
  walletAddress: text('wallet_address').notNull(),
  contractAddress: text('contract_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const applicants = pgTable('applicants', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').notNull().references(() => jobs.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  coverLetter: text('cover_letter').notNull(),
  walletAddress: text('wallet_address').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'hired' | 'rejected'
  appliedAt: timestamp('applied_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const jobsRelations = relations(jobs, ({ many }) => ({
  applicants: many(applicants),
}));

export const applicantsRelations = relations(applicants, ({ one }) => ({
  job: one(jobs, {
    fields: [applicants.jobId],
    references: [jobs.id],
  }),
}));

export type InsertJob = typeof jobs.$inferInsert;
export type SelectJob = typeof jobs.$inferSelect;
export type InsertApplicant = typeof applicants.$inferInsert;
export type SelectApplicant = typeof applicants.$inferSelect;
