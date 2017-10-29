-- Create tables
--#############################################################
-- drop table uba_als
create table dbo.uba_als (
	ID BIGINT not null,
	entity NVARCHAR(64) not null,
	attribute NVARCHAR(32) not null,
	state NVARCHAR(32) not null,
	roleName NVARCHAR(32) not null,
	actions INT not null
);
-- drop table uba_els
create table dbo.uba_els (
	ID BIGINT not null,
	code NVARCHAR(32) null,
	description NVARCHAR(255) not null,
	disabled NUMERIC(1) not null default 0,
	entityMask NVARCHAR(128) not null,
	methodMask NVARCHAR(128) not null,
	ruleType VARCHAR(32) not null default 'A',
	ruleRole BIGINT not null
);
-- drop table uba_role
create table dbo.uba_role (
	ID BIGINT not null,
	name NVARCHAR(128) not null,
	description NVARCHAR(256) not null,
	sessionTimeout INT not null default 30,
	allowedAppMethods NVARCHAR(2000) null
);
-- drop table uba_subject
create table dbo.uba_subject (
	ID BIGINT not null,
	code NVARCHAR(128) not null,
	name NVARCHAR(128) not null,
	sType NVARCHAR(1) not null,
	mi_unityEntity NVARCHAR(64) not null
);
-- drop table uba_user
create table dbo.uba_user (
	ID BIGINT not null,
	name NVARCHAR(128) not null,
	description NVARCHAR(255) null,
	uPasswordHashHexa NVARCHAR(64) null,
	disabled NUMERIC(1) not null default 0,
	isPending NUMERIC(1) not null default 0,
	trustedIP NVARCHAR(255) null,
	uData NVARCHAR(2000) null,
	lastPasswordChangeDate DATETIME not null default GETUTCDATE()
);

-- drop table uba_userrole
create table dbo.uba_userrole (
	ID BIGINT not null,
	userID BIGINT not null,
	roleID BIGINT not null
);

create table dbo.uba_audit (
	ID BIGINT not null,
	entity NVARCHAR(32) not null,
	entityinfo_id BIGINT not null,
	actionType NVARCHAR(32) not null,
	actionUser NVARCHAR(128) not null,
	actionTime DATETIME not null,
	remoteIP NVARCHAR(40) null,
	targetUser NVARCHAR(128) null,
	targetRole NVARCHAR(128) null,
	fromValue NVARCHAR(MAX) null,
	toValue NVARCHAR(MAX) null
);

create table dbo.ubs_settings (
	ID BIGINT not null,
	settingKey NVARCHAR(150) not null,
	name NVARCHAR(150) not null,
	description NVARCHAR(1024) null,
	type NVARCHAR(32) null,
	settingValue NVARCHAR(2000) null,
	defaultValue NVARCHAR(150) null
);
-- Create primary keys
--#############################################################
alter table dbo.uba_als add constraint PK_uba_als PRIMARY KEY CLUSTERED(ID);
alter table dbo.uba_els add constraint PK_uba_els PRIMARY KEY CLUSTERED(ID);
alter table dbo.uba_role add constraint PK_uba_role PRIMARY KEY CLUSTERED(ID);
alter table dbo.uba_subject add constraint PK_uba_subject PRIMARY KEY CLUSTERED(ID);
alter table dbo.uba_user add constraint PK_uba_user PRIMARY KEY CLUSTERED(ID);
alter table dbo.uba_userrole add constraint PK_uba_userrole PRIMARY KEY CLUSTERED(ID);
alter table dbo.uba_audit add constraint PK_uba_audit PRIMARY KEY CLUSTERED(ID);
alter table dbo.ubs_settings add constraint PK_ubs_settings PRIMARY KEY CLUSTERED(ID);
