DROP TABLE Payment cascade constraints;
DROP TABLE Tier cascade constraints;
DROP TABLE PremiumPlan cascade constraints;
DROP TABLE Location cascade constraints;
DROP TABLE Avatar cascade constraints;
DROP TABLE UserAccount cascade constraints;
DROP TABLE Calendar cascade constraints;
DROP TABLE Event cascade constraints;
DROP TABLE Server cascade constraints;
DROP TABLE Channel cascade constraints;
DROP TABLE GeneralMember cascade constraints;
DROP TABLE Administrator cascade constraints;
DROP TABLE Message cascade constraints;
DROP TABLE PostedTo cascade constraints;
DROP TABLE Joins cascade constraints;
CREATE TABLE Payment (
                         PaymentInterval 		integer,
                         SubscriptionPayment 	integer,
                         primary key (PaymentInterval)
);
CREATE TABLE Tier (
                      Tier 			varchar2 (10),
                      BasePrice 		integer,
                      primary key (tier)
);
CREATE TABLE PremiumPlan (
                             PlanID				INTEGER,
                             Tier				VARCHAR2 (10),
                             PaymentInterval		INTEGER,
                             MemberLimit			INTEGER,
                             Theme				CHAR (7),
                             PRIMARY KEY (PlanID),
                             FOREIGN KEY (PaymentInterval) 		REFERENCES Payment,
                             FOREIGN KEY (Tier) 					REFERENCES Tier
);
CREATE TABLE Location(
                         Country 			VARCHAR2 (30),
                         Region 				VARCHAR2 (50),
                         PRIMARY KEY (Region)
);
CREATE TABLE Avatar(
                       AvatarID			INTEGER,
                       FrameType			VARCHAR2 (30),
                       BackgroundColor		CHAR(7),
                       IconDescription		VARCHAR2 (250),
                       PRIMARY KEY (AvatarID)
);
CREATE TABLE UserAccount(
                            Username 			VARCHAR2 (30),
                            DisplayName 		VARCHAR2 (30),
                            UserPassword 		VARCHAR2 (50),
                            Bio                 VARCHAR2 (250),
                            Region           	VARCHAR2 (50),
                            AvatarID			INTEGER NOT NULL,
                            PlanID				INTEGER,
                            PRIMARY KEY (Username),
                            FOREIGN KEY (Region) 				REFERENCES Location(Region),
                            FOREIGN KEY (AvatarID) 				REFERENCES Avatar,
                            FOREIGN KEY (PlanID) 				REFERENCES PremiumPlan
);
CREATE TABLE Calendar(
                         CalendarID			INTEGER,
                         CalendarName		VARCHAR2 (30),
                         Username			VARCHAR2 (30),
                         PRIMARY KEY (CalendarID),
                         FOREIGN KEY (Username) 				REFERENCES UserAccount
);
CREATE TABLE Event(
                      EventID				INTEGER,
                      EventName			VARCHAR2 (30),
                      EventDateTime		TIMESTAMP,
                      Duration			INTEGER,
                      Details				VARCHAR2 (250),
                      Username			VARCHAR2 (30),
                      PRIMARY KEY (EventID),
                      FOREIGN KEY (UserName) 				REFERENCES UserAccount
);
CREATE TABLE Server(
                       ServerID			INTEGER,
                       ServerName			VARCHAR2 (30),
                       PlanID				INTEGER,
                       CalendarID			INTEGER UNIQUE NOT NULL,
                       AvatarID			INTEGER NOT NULL,
                       PRIMARY KEY (ServerID),
                       FOREIGN KEY (PlanID) 				REFERENCES PremiumPlan,
                       FOREIGN KEY (CalendarID) 			REFERENCES Calendar,
                       FOREIGN KEY (AvatarID) 				REFERENCES Avatar
);
CREATE TABLE Channel(
                        ChannelID			INTEGER,
                        ChannelTitle		VARCHAR2 (30),
                        ServerID			INTEGER NOT NULL,
                        PRIMARY KEY (ChannelID, ServerID),
                        FOREIGN KEY (ServerID)				REFERENCES Server
                            ON DELETE CASCADE
);
CREATE TABLE GeneralMember(
                              Username  			VARCHAR2 (30),
                              Signature  			VARCHAR2 (250),
                              PRIMARY KEY (Username),
                              FOREIGN KEY (Username)				 REFERENCES UserAccount
);
CREATE TABLE Administrator(
                              Username  			VARCHAR2 (30),
                              Tag	  				VARCHAR (30),
                              Signature			VARCHAR (250),
                              ServerID			INTEGER UNIQUE NOT NULL,
                              PRIMARY KEY (Username),
                              FOREIGN KEY (Username) 				REFERENCES UserAccount,
                              FOREIGN KEY (ServerID)
                                  REFERENCES Server
);
CREATE TABLE Message(
                        MessageID			INTEGER,
                        Contents			VARCHAR2 (250),
                        ChannelID			INTEGER NOT NULL,
                        ServerID			INTEGER NOT NULL,
                        MessageDateTime		TIMESTAMP,
                        Username			VARCHAR (30) NOT NULL,
                        PRIMARY KEY (MessageID),
                        FOREIGN KEY (Username) 				REFERENCES UserAccount,
                        FOREIGN KEY (ChannelID, ServerID) 	REFERENCES Channel
);
CREATE TABLE PostedTo(
                         CalendarID			INTEGER,
                         EventID			INTEGER,
                         PRIMARY KEY (EventID, CalendarID),
                         FOREIGN KEY (CalendarID) 			REFERENCES Calendar,
                         FOREIGN KEY (EventID) 				REFERENCES Event
);
CREATE TABLE Joins (
                       MemberUsername		VARCHAR2 (30),
                       ServerID			INTEGER NOT NULL,
                       JoinDate			DATE,
                       PRIMARY KEY (MemberUsername, ServerID),
                       FOREIGN KEY (MemberUsername) 		REFERENCES GeneralMember (Username),
                       FOREIGN KEY (ServerID) 				REFERENCES Server
);
INSERT INTO Payment(PaymentInterval, SubscriptionPayment) VALUES (1, 1);
INSERT INTO Payment(PaymentInterval, SubscriptionPayment) VALUES (6, 1);
INSERT INTO Payment(PaymentInterval, SubscriptionPayment) VALUES (12, 12);
INSERT INTO Payment(PaymentInterval, SubscriptionPayment) VALUES (24, 120);
INSERT INTO Payment(PaymentInterval, SubscriptionPayment) VALUES (18, 180);
INSERT INTO Tier(Tier, BasePrice) VALUES ('Basic', 12);
INSERT INTO Tier(Tier, BasePrice) VALUES ('Silver', 24);
INSERT INTO Tier(Tier, BasePrice) VALUES ('Gold', 60);
INSERT INTO Tier(Tier, BasePrice) VALUES ('Platinum', 120);
INSERT INTO Tier(Tier, BasePrice) VALUES ('Royal', 180);
INSERT INTO PremiumPlan(PlanID, Tier, PaymentInterval, MemberLimit, Theme) VALUES (1, 'Basic', 1, 10, '#000000');
INSERT INTO PremiumPlan(PlanID, Tier, PaymentInterval, MemberLimit, Theme) VALUES (2, 'Silver', 1, 50, '#111111');
INSERT INTO PremiumPlan(PlanID, Tier, PaymentInterval, MemberLimit, Theme) VALUES (3, 'Gold', 6, 100, '#000000');
INSERT INTO PremiumPlan(PlanID, Tier, PaymentInterval, MemberLimit, Theme) VALUES (4, 'Platinum', 12, 150, '#FFFFFF');
INSERT INTO PremiumPlan(PlanID, Tier, PaymentInterval, MemberLimit, Theme) VALUES (5, 'Royal', 12, 200, '#CCCCCC');
INSERT INTO PremiumPlan(PlanID, Tier, PaymentInterval, MemberLimit, Theme) VALUES (11, 'Basic', 6, 50, '#FFFFFF');
INSERT INTO PremiumPlan(PlanID, Tier, PaymentInterval, MemberLimit, Theme) VALUES (21, 'Gold', 6, 150, '#AAAAAA');
INSERT INTO Location(Country, Region) VALUES ('Canada', 'Vancouver');
INSERT INTO Location(Country, Region) VALUES ('Canada', 'Ottawa');
INSERT INTO Location(Country, Region) VALUES ('USA', 'Virginia');
INSERT INTO Location(Country, Region) VALUES ('India', 'Odisha');
INSERT INTO Location(Country, Region) VALUES ('Canada', 'Burnaby');
INSERT INTO Avatar(AvatarID, FrameType, BackgroundColor, IconDescription)
VALUES (1, 'Circle', '#000000', 'Black Circle');
INSERT INTO Avatar(AvatarID, FrameType, BackgroundColor, IconDescription)
VALUES (2, 'Triangle', '#123456', 'Incremental Blue Triangle');
INSERT INTO Avatar(AvatarID, FrameType, BackgroundColor, IconDescription)
VALUES (3, 'Circle', '#DDDDDD', 'Steam Square');
INSERT INTO Avatar(AvatarID, FrameType, BackgroundColor, IconDescription)
VALUES (4, 'Rectangle', '#1247A8', 'Super Silver Rectangle');
INSERT INTO Avatar(AvatarID, FrameType, BackgroundColor, IconDescription)
VALUES (5, 'Rectangle', '#FFFFFF', 'White Rectangle');
INSERT INTO Avatar(AvatarID, FrameType, BackgroundColor, IconDescription)
VALUES (10, 'Circle', '#FFFFFF', 'White Circle');
INSERT INTO UserAccount(Username, DisplayName, UserPassword, Bio, Region, AvatarID, PlanID)
VALUES ('ali123', 'Allison Ko', 'aliko123lovesdogs', 'Hi, I’m Ali and I love dogs. I’m from UBC and I’m studying Computer Science, currently enrolled in a databases course with Dr. Rachel Pottinger.', 'Vancouver', 1, 1);
INSERT INTO UserAccount(Username, DisplayName, UserPassword, Bio, Region, AvatarID, PlanID)
VALUES ('ananyam', 'Ananya Mahapatra', 'shdie38uwnjfvjvkewfjwiw03nl', 'i like lurking', 'Vancouver', 3, NULL);
INSERT INTO UserAccount(Username, DisplayName, UserPassword, Bio, Region, AvatarID, PlanID)
VALUES ('racekar', 'Karen Li', 'hotpotatoes', 'Hello! I am very excited to be here. I like goldfish, books and hiking.', 'Ottawa', 1, 5);
INSERT INTO UserAccount(Username, DisplayName, UserPassword, Bio, Region, AvatarID, PlanID)
VALUES ('dylan_x', NULL, 'hotpotatoes', NULL, 'Burnaby', 3, 21);
INSERT INTO UserAccount(Username, DisplayName, UserPassword, Bio, Region, AvatarID, PlanID)
VALUES ('goldfishlover', 'Tom Thomas', 'fishyfishyfishy', 'I LOVE GOLDFISH', 'Virginia', 5, NULL);
INSERT INTO UserAccount(Username, DisplayName, UserPassword, Bio, Region, AvatarID, PlanID)
VALUES ('abcdefg', '...', 'hijklmnop', 'lalalalala', 'Odisha', 1, 5);
INSERT INTO UserAccount(Username, DisplayName, UserPassword, Bio, Region, AvatarID, PlanID)
VALUES ('GojoSatoru', 'Gojo', 'hijklmnop', 'I am the strongest lol', 'Odisha', 1, 5);
INSERT INTO Calendar(CalendarID, CalendarName, Username)
VALUES (1, 'Dog Lovers Calendar', NULL);
INSERT INTO Calendar(CalendarID, CalendarName, Username)
VALUES (2, 'Recipes Calender', NULL);
INSERT INTO Calendar(CalendarID, CalendarName, Username)
VALUES (3, 'Socials', 'ananyam');
INSERT INTO Calendar(CalendarID, CalendarName, Username)
VALUES (7, 'Appointments', 'ananyam');
INSERT INTO Calendar(CalendarID, CalendarName, Username)
VALUES (4, 'Friends', 'ananyam');
INSERT INTO Calendar(CalendarID, CalendarName, Username)
VALUES (5, 'goldfish calendar', NULL);
INSERT INTO Calendar(CalendarID, CalendarName, Username)
VALUES (20, 'Rock Concert Calendar', NULL);
INSERT INTO Calendar(CalendarID, CalendarName, Username)
VALUES (21, 'Gothic Fantasy Meetings', NULL);
INSERT INTO Calendar(CalendarID, CalendarName, Username)
VALUES (10, 'homework', 'racekar');
INSERT INTO Event(EventID, EventName, EventDateTime, Duration, Details, Username)
VALUES (2, 'Friendsgiving', to_timestamp('2024/10/10 03:30', 'YYYY/MM/DD HH24 MI'), NULL, 'Sara’s house', 'ananyam');
INSERT INTO Event(EventID, EventName, EventDateTime, Duration, Details, Username)
VALUES (1, 'Marley and Me Viewing', to_timestamp('2025/01/03 11:00', 'YYYY/MM/DD HH24 MI'), 2, 'Grab your blankets and tissues for a viewing of Marley and Me! It will be through Zoom and the link will be shared two days before the event. Please respond to Tara’s message in the socials channel if you will be joining.', 'ali123');
INSERT INTO Event(EventID, EventName, EventDateTime, Duration, Details, Username)
VALUES (3, 'Christmas', to_timestamp('2024/12/24 00:00', 'YYYY/MM/DD HH24 MI'), 24, 'Christmas Holiday', NULL);
INSERT INTO Event(EventID, EventName, EventDateTime, Duration, Details, Username)
VALUES (4, 'Book Review 1',to_timestamp('2024/12/03 10:30', 'YYYY/MM/DD HH24 MI'), 3, 'Details will be posted shortly', 'abcdefg');
INSERT INTO Event(EventID, EventName, EventDateTime, Duration, Details, Username)
VALUES (5, 'Book Review 2', to_timestamp('2024/12/27 10:30', 'YYYY/MM/DD HH24 MI'), 3, 'Details will be posted shortly', 'racekar');
INSERT INTO Event(EventID, EventName, EventDateTime, Duration, Details, Username)
VALUES (6, 'Book Review 3',to_timestamp('2024/12/03 9:30', 'YYYY/MM/DD HH24 MI'), 6, 'Best book ever', 'abcdefg');
INSERT INTO Event(EventID, EventName, EventDateTime, Duration, Details, Username)
VALUES (7, 'Pet Conference',to_timestamp('2024/10/03 15:30', 'YYYY/MM/DD HH24 MI'), 12, 'We gather to talk about our pets', 'ananyam');
INSERT INTO Event(EventID, EventName, EventDateTime, Duration, Details, Username)
VALUES (8, 'Meeting of the Cute things',to_timestamp('2024/08/03 18:30', 'YYYY/MM/DD HH24 MI'), 16, 'Live Laugh Love', 'racekar');
INSERT INTO Server(ServerID, ServerName, PlanID, CalendarID, AvatarID) VALUES (1, 'Dog Lovers Unite', 1, 1, 2);
INSERT INTO Server(ServerID, ServerName, PlanID, CalendarID, AvatarID) VALUES (2, 'recipes', NULL, 2, 2);
INSERT INTO Server(ServerID, ServerName, PlanID, CalendarID, AvatarID) VALUES (3, 'golfishies', 5, 5, 5);
INSERT INTO Server(ServerID, ServerName, PlanID, CalendarID, AvatarID) VALUES (4, 'rock bands', 21, 20, 3);
INSERT INTO Server(ServerID, ServerName, PlanID, CalendarID, AvatarID) VALUES (5, 'gothic fantasy', 5, 21, 4);
INSERT INTO Channel(ChannelID, ChannelTitle, ServerID) VALUES (1, 'Labradors', 1);
INSERT INTO Channel(ChannelID, ChannelTitle, ServerID) VALUES (2, 'Bulldogs', 1);
INSERT INTO Channel(ChannelID, ChannelTitle, ServerID) VALUES (1, 'Vegetarian', 2);
INSERT INTO Channel(ChannelID, ChannelTitle, ServerID) VALUES (1, 'Breeding', 3);
INSERT INTO Channel(ChannelID, ChannelTitle, ServerID) VALUES (2, 'Feeding', 3);
INSERT INTO Channel(ChannelID, ChannelTitle, ServerID) VALUES (3, 'Subspecies', 3);
INSERT INTO Channel(ChannelID, ChannelTitle, ServerID) VALUES (1, '80s', 4);
INSERT INTO Channel(ChannelID, ChannelTitle, ServerID) VALUES (1, 'Book of the month', 5);
INSERT INTO Channel(ChannelID, ChannelTitle, ServerID) VALUES (2, 'Goodreads account sharing', 5);
INSERT INTO GeneralMember(Username, Signature) VALUES ('ali123', 'all things dogs!');
INSERT INTO GeneralMember(Username, Signature) VALUES ('ananyam', 'happy');
INSERT INTO GeneralMember(Username, Signature) VALUES ('racekar', 'Love from Ottawa');
INSERT INTO GeneralMember(Username, Signature) VALUES ('dylan_x', NULL);
INSERT INTO GeneralMember(Username, Signature) VALUES ('goldfishlover', 'there’s plenty of fish in the sea…');
INSERT INTO GeneralMember(Username, Signature) VALUES ('abcdefg', 'yo!');
INSERT INTO Administrator(Username, Tag, Signature, ServerID) VALUES ('ali123', 'admin', 'all things dogs!', 1);
INSERT INTO Administrator(Username, Tag, Signature, ServerID) VALUES ('ananyam', 'Big Brother', 'happy', 2);
INSERT INTO Administrator(Username, Tag, Signature, ServerID) VALUES ('racekar', 'admin', 'be nice', 3);
INSERT INTO Administrator(Username, Tag, Signature, ServerID) VALUES ('dylan_x', 'moderator', NULL, 4);
INSERT INTO Administrator(Username, Tag, Signature, ServerID) VALUES ('abcdefg', 'Big Brother', 'so glad you are here :)', 5);
INSERT INTO Message(MessageID, Contents, ChannelID, ServerID, MessageDateTime, Username)
VALUES (1, 'hello', 1, 1, to_timestamp('2020/07/01 03:03', 'YYYY/MM/DD HH24 MI'), 'ali123');
INSERT INTO Message(MessageID, Contents, ChannelID, ServerID, MessageDateTime, Username)
VALUES (2, 'welcome to the labrador channel', 1, 1, to_timestamp('2020/07/01 03:03', 'YYYY/MM/DD HH24 MI'), 'ali123');
INSERT INTO Message(MessageID, Contents, ChannelID, ServerID, MessageDateTime, Username)
VALUES (33, 'welcome to the bulldog channel', 2, 1, to_timestamp('2020/07/01 03:05', 'YYYY/MM/DD HH24 MI'), 'ali123');
INSERT INTO Message(MessageID, Contents, ChannelID, ServerID, MessageDateTime, Username)
VALUES (1166, 'been looking for vegetarian lasagna recipes everywhere!', 1, 2, to_timestamp('2024/10/10 05:06', 'YYYY/MM/DD HH24 MI'), 'ali123');
INSERT INTO Message(MessageID, Contents, ChannelID, ServerID, MessageDateTime, Username)
VALUES (1169, 'the ones people post here are LEGIT!', 1, 2, to_timestamp('2024/10/10 05:07', 'YYYY/MM/DD HH24 MI'), 'ananyam');
INSERT INTO Message(MessageID, Contents, ChannelID, ServerID, MessageDateTime, Username)
VALUES (139, 'are we ready to vote on book of the month?', 1, 5, to_timestamp('2024/08/10 12:39', 'YYYY/MM/DD HH24 MI'), 'racekar');
INSERT INTO PostedTo(CalendarID, EventID) VALUES (1, 1);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (3, 2);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (4, 2);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (7, 2);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (3, 3);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (4, 3);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (7, 3);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (21, 4);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (21, 5);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (21, 6);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (1, 7);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (5, 7);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (1, 8);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (2, 8);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (5, 8);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (20, 8);
INSERT INTO PostedTo(CalendarID, EventID) VALUES (21, 8);
INSERT INTO Joins(MemberUsername, ServerID, JoinDate) VALUES ('ali123', 2, TO_DATE ('2023-05-10', 'YYYY-MM-DD'));
INSERT INTO Joins(MemberUsername, ServerID, JoinDate) VALUES ('ali123', 3, TO_DATE ('2024-01-09', 'YYYY-MM-DD'));
INSERT INTO Joins(MemberUsername, ServerID, JoinDate) VALUES ('ananyam', 1, TO_DATE ('2023-09-10', 'YYYY-MM-DD'));
INSERT INTO Joins(MemberUsername, ServerID, JoinDate) VALUES ('racekar', 1, TO_DATE ('2024-08-08', 'YYYY-MM-DD'));
INSERT INTO Joins(MemberUsername, ServerID, JoinDate) VALUES ('racekar', 2, TO_DATE ('2024-08-08', 'YYYY-MM-DD'));
INSERT INTO Joins(MemberUsername, ServerID, JoinDate) VALUES ('racekar', 5, TO_DATE ('2024-08-09', 'YYYY-MM-DD'));
INSERT INTO Joins(MemberUsername, ServerID, JoinDate) VALUES ('dylan_x', 2, TO_DATE ('2023-12-12', 'YYYY-MM-DD'));
INSERT INTO Joins(MemberUsername, ServerID, JoinDate) VALUES ('abcdefg', 1, TO_DATE ('2022-07-03', 'YYYY-MM-DD'));
INSERT INTO Joins(MemberUsername, ServerID, JoinDate) VALUES ('abcdefg', 4, TO_DATE ('2023-01-06', 'YYYY-MM-DD'));