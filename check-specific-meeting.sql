-- Check the specific meeting
SELECT 
    id,
    title,
    status,
    startTime,
    endTime,
    createdById,
    companyId,
    createdAt
FROM calls 
WHERE id = 'cmise910b00023ad4ndu1y4mg';

-- Check participants for this meeting
SELECT 
    p.id,
    p.userId,
    p.contactId,
    p.role,
    p.callId
FROM participants p
WHERE p.callId = 'cmise910b00023ad4ndu1y4mg';
