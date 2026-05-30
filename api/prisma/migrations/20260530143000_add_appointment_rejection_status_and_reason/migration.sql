-- Add a distinct doctor-side rejection state for appointment booking requests.
ALTER TYPE "AppointmentStatus" ADD VALUE IF NOT EXISTS 'REJECTED';

-- Store the doctor's reason when rejecting a booking.
ALTER TABLE "appointments" ADD COLUMN IF NOT EXISTS "rejection_reason" TEXT;
