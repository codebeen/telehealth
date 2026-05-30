-- Drop the one-appointment-per-schedule-slot constraint so historical cancelled
-- appointments can remain attached while the slot becomes bookable again.
DROP INDEX IF EXISTS "appointments_schedule_id_key";

-- Keep schedule lookups efficient now that schedule_id is no longer unique.
CREATE INDEX IF NOT EXISTS "appointments_schedule_id_idx" ON "appointments"("schedule_id");
