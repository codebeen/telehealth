ALTER TABLE "medical_records"
ADD COLUMN "consultation_type" VARCHAR(150),
ADD COLUMN "clinical_findings" TEXT,
ADD COLUMN "recommendations" TEXT,
ADD COLUMN "medication_summary" TEXT,
ADD COLUMN "final_summary" TEXT;
