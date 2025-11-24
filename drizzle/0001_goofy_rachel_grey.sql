CREATE TABLE "applicants" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"cover_letter" text NOT NULL,
	"wallet_address" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"applied_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;