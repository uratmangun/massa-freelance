CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"pay" text NOT NULL,
	"amount_mas" text NOT NULL,
	"interval_value" integer NOT NULL,
	"interval_unit" text NOT NULL,
	"description" text NOT NULL,
	"wallet_address" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
