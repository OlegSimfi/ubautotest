-- WARNING - do not save this file with BOM - psql not understand BOM (tested under Windows)

-- Create tables
create table uba_els (
	ID BIGINT not null,
	code VARCHAR(32) null,
	description VARCHAR(255) not null,
	disabled SMALLINT default 0 not null,
	entityMask VARCHAR(128) not null,
	methodMask VARCHAR(128) not null,
	ruleType VARCHAR(32) default 'A' not null,
	ruleRole BIGINT not null
);
-- drop table uba_role
create table uba_role (
	ID BIGINT not null,
	name VARCHAR(128) not null,
	description VARCHAR(256) not null,
	sessionTimeout INTEGER default 30 not null,
	allowedAppMethods VARCHAR(2000) null
);
-- drop table uba_subject
create table uba_subject (
	ID BIGINT not null,
	code VARCHAR(128) not null,
	name VARCHAR(128) not null,
	sType VARCHAR(1) not null,
	mi_unityEntity VARCHAR(64) not null
);
-- drop table uba_user
create table uba_user (
	ID BIGINT not null,
	name VARCHAR(128) not null,
	description VARCHAR(255) null,
	uPasswordHashHexa VARCHAR(64) null,
	disabled SMALLINT default 0 not null,
	isPending SMALLINT default 0 not null,
	trustedIP VARCHAR(255) null,
	uData VARCHAR(2000) null,
	lastPasswordChangeDate TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null
);

-- drop table uba_userrole
create table uba_userrole (
	ID BIGINT not null,
	userID BIGINT not null,
	roleID BIGINT not null
);

create table uba_als (
	ID BIGINT not null,
	entity VARCHAR(64) not null,
	attribute VARCHAR(32) not null,
	state VARCHAR(32) not null,
	roleName VARCHAR(32) not null,
	actions INTEGER not null
);

create table uba_audit (
	ID BIGINT not null,
	entity VARCHAR(32) not null,
	entityinfo_id BIGINT not null,
	actionType VARCHAR(32) not null,
	actionUser VARCHAR(128) not null,
	actionTime TIMESTAMP WITH TIME ZONE not null,
	remoteIP VARCHAR(40) null,
	targetUser VARCHAR(128) null,
	targetRole VARCHAR(128) null,
	fromValue VARCHAR(2000) null,
	toValue VARCHAR(2000) null
);

create table ubs_settings (
	ID BIGINT not null,
	settingKey VARCHAR(150) not null,
	name VARCHAR(150) not null,
	description VARCHAR(1024) null,
	type VARCHAR(32) null,
	settingValue VARCHAR(2000) null,
	defaultValue VARCHAR(150) null
);

-- Create primary keys
--#############################################################
alter table uba_els add constraint PK_uba_els PRIMARY KEY ( ID);
alter table uba_role add constraint PK_uba_role PRIMARY KEY ( ID);
alter table uba_subject add constraint PK_uba_subject PRIMARY KEY ( ID);
alter table uba_user add constraint PK_uba_user PRIMARY KEY ( ID);
alter table uba_userrole add constraint PK_uba_userrole PRIMARY KEY ( ID);
alter table uba_als add constraint PK_uba_als PRIMARY KEY ( ID );
alter table uba_audit add constraint PK_uba_audit PRIMARY KEY ( ID );
alter table ubs_settings add constraint PK_ubs_settings PRIMARY KEY ( ID );