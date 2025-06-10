ALTER TABLE "users" ADD COLUMN "provider" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_url" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "otp_expires_at" date DEFAULT null;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "otp" varchar DEFAULT '';