--When searching for servers to join:

SELECT distinct ServerName
FROM Server
WHERE ServerName like '%gothic%';

SELECT distinct ServerName
FROM Server
WHERE ServerName = 'Dog Lovers Unite';


SELECT distinct ServerName
FROM Server s, PremiumPlan p
WHERE s.PlanID = p.PlanID AND p.Tier = 'Royal';


SELECT distinct ServerName
FROM Server s, PremiumPlan p
WHERE s.PlanID = p.PlanID AND p.MemberLimit >= 50;


SELECT distinct ServerName
FROM Server s, Joins j
WHERE s.ServerID = j.ServerID AND j.MemberUsername <> 'ali123';

--User home page should only show joined servers, owned server, own avatar, own calendar, own premiumplan
--Same for server all but first 2

SELECT distinct ServerName
FROM Server s, Joins j
WHERE s.ServerID = j.ServerID AND j.MemberUsername = 'racekar';

SELECT distinct ServerName
FROM Administrator a, Server s
WHERE s.ServerID = a.ServerID AND a.Username = 'ali123';

SELECT distinct FrameType, BackgroundColor
FROM UserAccount u, Avatar a
WHERE u.AvatarID = a.AvatarID AND u.Username = 'ali123';

SELECT distinct FrameType, BackgroundColor
FROM Server s, Avatar a
WHERE s.AvatarID = a.AvatarID AND s.ServerName = 'gothic fantasy';

SELECT distinct pp.Tier, MemberLimit, Theme, BasePrice, SubscriptionPayment, pp.PaymentInterval
FROM UserAccount u, Tier t, PremiumPlan pp, Payment p
WHERE u.Username = 'racekar' AND u.PlanID = pp.PlanID AND pp.Tier = t.Tier AND pp.PaymentInterval = pp.PaymentInterval;

SELECT distinct pp.Tier, MemberLimit, Theme, BasePrice, SubscriptionPayment, pp.PaymentInterval
FROM Server s, Tier t, PremiumPlan pp, Payment p
WHERE s.ServerName = 'gothic fantasy' AND s.PlanID = pp.PlanID AND pp.Tier = t.Tier AND pp.PaymentInterval = pp.PaymentInterval;

SELECT distinct CalendarName
FROM Server s, Calendar c
WHERE s.CalendarID = c.CalendarID AND s.ServerName = 'gothic fantasy';

SELECT distinct CalendarName
FROM Calendar c
WHERE Username = 'racekar';

--Plan only displays own details

SELECT distinct *
FROM PremiumPlan natural join Tier natural join Payment
WHERE PremiumPlan.PlanID = 4;

--Calendar only displays own events

SELECT distinct EventName
FROM Calendar, Event, PostedTo
WHERE Calendar.CalendarID = 1 AND Calendar.CalendarID = PostedTo.CalendarID AND Event.EventID = PostedTo.EventID;


--Event only displays own details

SELECT distinct *
FROM Event
WHERE EventID = 2;

--Events where time = x etc.

SELECT distinct EventName
FROM Event
WHERE EventDateTime < to_timestamp('2024/12/12 23:59', 'YYYY/MM/DD HH24 MI');

--Only display events in calendars you can see

SELECT distinct EventName
FROM Event natural join Calendar natural join PostedTo
WHERE Username = 'ananyam';

--selection of all messages ‘like’ a search word or sent by a user

SELECT distinct *
FROM Message
WHERE Contents like '%welcome%';

SELECT distinct *
FROM Message
WHERE Username = 'ali123';
