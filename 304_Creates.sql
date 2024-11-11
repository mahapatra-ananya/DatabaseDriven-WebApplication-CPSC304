--
-- 	Database Table Creation
--
--	This file will create the tables for use with the book
--  Database Management Systems by Raghu Ramakrishnan and Johannes Gehrke.
--  It is run automatically by the installation script.
--
--	Version 0.1.0.0 2002/04/05 by: David Warden.
--	Copyright (C) 2002 McGraw-Hill Companies Inc. All Rights Reserved.
--
--  First drop any existing tables. Any errors are ignored.
--
--drop table student cascade constraints;
--drop table faculty cascade constraints;
--drop table class cascade constraints;
--drop table enrolled cascade constraints;
--drop table emp cascade constraints;
--drop table works cascade constraints;
--drop table dept cascade constraints;
--drop table flights cascade constraints;
--drop table aircraft cascade constraints;
--drop table certified cascade constraints;
--drop table employees cascade constraints;
--drop table suppliers cascade constraints;
--drop table parts cascade constraints;
--drop table catalog cascade constraints;
--drop table sailors cascade constraints;
--drop table boats cascade constraints;
--drop table reserves cascade constraints;

--
-- Add each table to the Message App
--

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

