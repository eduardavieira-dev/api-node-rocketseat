ALTER TABLE "enrollments" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "created_at" SET DEFAULT now();