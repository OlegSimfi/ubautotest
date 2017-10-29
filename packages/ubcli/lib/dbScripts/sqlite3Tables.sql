create table uba_user (
	ID BIGINT not null PRIMARY KEY,
	name VARCHAR(128) not null,
	description VARCHAR(255) null,
	uPasswordHashHexa VARCHAR(64) null,
	disabled SMALLINT default 0 not null,
	isPending SMALLINT default 0 not null,
	trustedIP VARCHAR(255) null,
	uData VARCHAR(2000) null,
	lastPasswordChangeDate DATETIME default (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')) not null,
	mi_owner bigint NOT NULL, -- Row owner
    mi_createdate DATETIME NOT NULL, -- Creation date
    mi_createuser bigint NOT NULL, -- User who create row
    mi_modifydate DATETIME NOT NULL, -- Modification date
    mi_modifyuser bigint NOT NULL, -- User who modify row
    FOREIGN KEY(mi_owner) REFERENCES uba_user,
    FOREIGN KEY(mi_createuser) REFERENCES uba_user,
    FOREIGN KEY(mi_modifyuser) REFERENCES uba_user
);
--next
create table uba_role (
	ID BIGINT not null PRIMARY KEY,
	name VARCHAR(128) not null, -- Role
	description VARCHAR(256) not null, -- Description
	sessionTimeout INTEGER default 30 not null, -- Time after which the session is deleted by timeout (in minutes)
	allowedAppMethods VARCHAR(2000) null,  -- Which application level methods are allowed (comma separated list)
    mi_owner bigint NOT NULL, -- Row owner
    mi_createdate DATETIME NOT NULL, -- Creation date
    mi_createuser bigint NOT NULL, -- User who create row
    mi_modifydate DATETIME NOT NULL, -- Modification date
    mi_modifyuser bigint NOT NULL, -- User who modify row
    FOREIGN KEY(mi_owner) REFERENCES uba_user,
    FOREIGN KEY(mi_createuser) REFERENCES uba_user,
    FOREIGN KEY(mi_modifyuser) REFERENCES uba_user
);
--next
create table uba_els (
	ID BIGINT not null PRIMARY KEY,
	code VARCHAR(32) null, -- Code for ELS rule
	description VARCHAR(255) not null, -- Rule description
	disabled SMALLINT default 0 not null, -- Rule is disabled
	entityMask VARCHAR(128) not null, -- Entity mask
	methodMask VARCHAR(128) not null, -- Method mask
	ruleType VARCHAR(32) default 'A' not null, -- Is this ALLOW rule(A) or DENY rule(D) or Complements(C) rule
	ruleRole BIGINT not null, -- Role for which the rule applies
    mi_owner bigint NOT NULL, -- Row owner
    mi_createdate DATETIME NOT NULL, -- Creation date
    mi_createuser bigint NOT NULL, -- User who create row
    mi_modifydate DATETIME NOT NULL, -- Modification date
    mi_modifyuser bigint NOT NULL, -- User who modify row
    CONSTRAINT FK_ELS_MI_OWNER_REF_USR FOREIGN KEY(mi_owner) REFERENCES uba_user,
    CONSTRAINT FK_ELS_MI_CREATEUSER_REF_USR FOREIGN KEY(mi_createuser) REFERENCES uba_user,
    CONSTRAINT FK_ELS_MI_MODIFYUSER_REF_USR FOREIGN KEY(mi_modifyuser) REFERENCES uba_user
);
--next
create table uba_subject (
	ID BIGINT not null PRIMARY KEY,
	code VARCHAR(128) not null, -- Code
	name VARCHAR(128) not null, -- Login
	sType VARCHAR(1) not null, -- Subject type
	mi_unityEntity VARCHAR(64) not null
);
--next
create table uba_userrole (
	ID BIGINT not null PRIMARY KEY,
	userID BIGINT not null, -- User
	roleID BIGINT not null, -- Role
    mi_owner bigint NOT NULL, -- Row owner
    mi_createdate DATETIME NOT NULL, -- Creation date
    mi_createuser bigint NOT NULL, -- User who create row
    mi_modifydate DATETIME NOT NULL, -- Modification date
    mi_modifyuser bigint NOT NULL, -- User who modify row
    FOREIGN KEY(userID) REFERENCES uba_user,
    FOREIGN KEY(roleID) REFERENCES uba_role,
    FOREIGN KEY(mi_owner) REFERENCES uba_user,
    FOREIGN KEY(mi_createuser) REFERENCES uba_user,
    FOREIGN KEY(mi_modifyuser) REFERENCES uba_user
);
--next
create table uba_als (
	ID BIGINT not null PRIMARY KEY,
	entity VARCHAR(64) not null, -- Entity
	attribute VARCHAR(32) not null, -- Attribute
	state VARCHAR(32) not null, -- State code
	roleName VARCHAR(32) not null, -- Role name
	actions INTEGER not null -- Allow actions
);
--next
create table uba_audit (
	ID BIGINT not null PRIMARY KEY,
	entity VARCHAR(32) not null, -- Entity code
	entityinfo_id BIGINT not null, -- Instance ID
	actionType VARCHAR(32) not null, -- Action
	actionUser VARCHAR(128) not null, -- User, who perform the action
	actionTime DATETIME not null, -- Action time
	remoteIP VARCHAR(40) null, -- Caller remote IP address. NULL in case of localhost
	targetUser VARCHAR(128) null, -- The user name for which the data has changed
	targetRole VARCHAR(128) null, -- The role name for which the data has changed
	fromValue TEXT null, -- Old values
	toValue TEXT null -- New values
);
--next
create table ubs_settings (
	ID BIGINT not null PRIMARY KEY,
	settingKey VARCHAR(150) not null, -- Setting key. To prevent key conflicts key name must start with a model code where key is used. `ubs.numcounter.autoRegWithDeletedNumber`
	name VARCHAR(150) not null, -- Setting name
	description VARCHAR(1024) null, -- Description
	type VARCHAR(32) null, -- Value type
	settingValue VARCHAR(2000) null, -- Value
	defaultValue VARCHAR(150) null, -- Default value (setted by developer)
    mi_owner bigint NOT NULL, -- Row owner
    mi_createdate DATETIME NOT NULL, -- Creation date
    mi_createuser bigint NOT NULL, -- User who create row
    mi_modifydate DATETIME NOT NULL, -- Modification date
    mi_modifyuser bigint NOT NULL, -- User who modify row
    FOREIGN KEY(mi_owner) REFERENCES uba_user,
    FOREIGN KEY(mi_createuser) REFERENCES uba_user,
    FOREIGN KEY(mi_modifyuser) REFERENCES uba_user
);