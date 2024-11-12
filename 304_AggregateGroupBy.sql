-- aggregate count of events grouped by calendar year

SELECT EXTRACT(YEAR FROM EventDateTime), count(distinct EventID)
FROM Event
GROUP BY EXTRACT(YEAR FROM EventDateTime);

-- aggregate count of messages grouped by calendar day

SELECT to_char(MessageDateTime, 'DD-MM-YYYY'), count(distinct MessageID)
FROM Message
GROUP BY to_char(MessageDateTime, 'DD-MM-YYYY');