-- CreateTable
CREATE TABLE "patient_allergies" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "patient_allergies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "patient_allergies_patient_id_idx" ON "patient_allergies"("patient_id");

-- AddForeignKey
ALTER TABLE "patient_allergies" ADD CONSTRAINT "patient_allergies_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
