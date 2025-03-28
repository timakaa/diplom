CREATE TABLE "cron_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"last_run" timestamp,
	"is_running" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cron_jobs_name_unique" UNIQUE("name")
);
