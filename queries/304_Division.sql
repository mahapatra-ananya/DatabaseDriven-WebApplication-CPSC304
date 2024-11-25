--ViewActiveServer: view only servers where a specific user has commented in every single channel


SELECT distinct MessageID
FROM Message m
WHERE NOT EXISTS((SELECT distinct ServerID
                  FROM Server)
                 EXCEPT
                 (SELECT distinct ServerID
                  FROM Message m1
                  WHERE m.MessageID = m1.MessageID));

--ViewEventsinAllCalendars: view events that belong to all of a user’s calendars

SELECT distinct EventName
FROM Event e
WHERE NOT EXISTS((SELECT distinct CalendarID
                  FROM Calendar)
                 EXCEPT
                 (SELECT distinct CalendarID
                  FROM Event e1, PostedTo p
                  WHERE e.EventID = e1.EventID AND e1.EventID = p.EventID));



