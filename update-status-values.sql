-- Update existing meetings with lowercase status values to uppercase
UPDATE calls SET status = 'SCHEDULED' WHERE status = 'scheduled';
UPDATE calls SET status = 'IN_PROGRESS' WHERE status = 'active' OR status = 'in_progress';
UPDATE calls SET status = 'COMPLETED' WHERE status = 'ended' OR status = 'completed';
UPDATE calls SET status = 'CANCELLED' WHERE status = 'cancelled';

-- Verify the changes
SELECT status, COUNT(*) as count FROM calls GROUP BY status;
