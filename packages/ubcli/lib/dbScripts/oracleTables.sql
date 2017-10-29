/* Create tables */
create table uba_els (
	ID NUMBER(19) not null,
	code NVARCHAR2(32) null,
	description NVARCHAR2(255) not null,
	disabled NUMBER(1) default 0 not null,
	entityMask NVARCHAR2(128) not null,
	methodMask NVARCHAR2(128) not null,
	ruleType VARCHAR2(32) default 'A' not null,
	ruleRole NUMBER(19) not null
);
/
--
create table uba_role (
	ID NUMBER(19) not null,
	name NVARCHAR2(128) not null,
	description NVARCHAR2(256) not null,
	sessionTimeout INTEGER default 30 not null,
	allowedAppMethods NVARCHAR2(2000) null
);
/
--
create table uba_subject (
	ID NUMBER(19) not null,
	code NVARCHAR2(128) not null,
	name NVARCHAR2(128) not null,
	sType NVARCHAR2(1) not null,
	mi_unityEntity NVARCHAR2(64) not null
);
/
--
create table uba_user (
	ID NUMBER(19) not null,
	name NVARCHAR2(128) not null,
	description NVARCHAR2(255) null,
	uPasswordHashHexa NVARCHAR2(64) null,
	disabled NUMBER(1) default 0 not null,
	isPending NUMBER(1) default 0 not null,
	trustedIP NVARCHAR2(255) null,
	uData NVARCHAR2(2000) null,
	lastPasswordChangeDate date default CAST(sys_extract_utc(SYSTIMESTAMP) AS DATE) not null
);
/
--
create table uba_userrole (
	ID NUMBER(19) not null,
	userID NUMBER(19) not null,
	roleID NUMBER(19) not null
);
/
--
create table uba_als (
	ID NUMBER(19) not null,
	entity NVARCHAR2(64) not null,
	attribute NVARCHAR2(32) not null,
	state NVARCHAR2(32) not null,
	roleName NVARCHAR2(32) not null,
	actions INTEGER not null
);
/
--
create table uba_audit (
	ID NUMBER(19) not null,
	entity NVARCHAR2(32) not null,
	entityinfo_id NUMBER(19) not null,
	actionType NVARCHAR2(32) not null,
	actionUser NVARCHAR2(128) not null,
	actionTime date not null,
	remoteIP NVARCHAR2(40) null,
	targetUser NVARCHAR2(128) null,
	targetRole NVARCHAR2(128) null,
	fromValue NVARCHAR2(2000) null,
	toValue NVARCHAR2(2000) null
);
/
--
create table ubs_settings (
	ID NUMBER(19) not null,
	settingKey NVARCHAR2(150) not null,
	name NVARCHAR2(150) not null,
	description NVARCHAR2(1024) null,
	type NVARCHAR2(32) null,
	settingValue NVARCHAR2(2000) null,
	defaultValue NVARCHAR2(150) null
);
/
--
/* Create primary keys */
alter table uba_els add constraint PK_ELS PRIMARY KEY ( ID);
/
--
alter table uba_role add constraint PK_ROLE PRIMARY KEY ( ID);
/
--
alter table uba_subject add constraint PK_SUBJ PRIMARY KEY ( ID);
/
--
alter table uba_user add constraint PK_USR PRIMARY KEY ( ID);
/
--
alter table uba_userrole add constraint PK_USROLE PRIMARY KEY ( ID);
/
--
alter table uba_als add constraint PK_ALS PRIMARY KEY ( ID);
/
--
alter table uba_audit add constraint PK_uba_audit PRIMARY KEY ( ID );
/
--
alter table ubs_settings add constraint PK_ubs_settings PRIMARY KEY ( ID );
/
--