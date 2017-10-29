## Introduction

UnityBase is platform for building complex enterprise application. So security is one of most important part of platform. UnityBase security mechanism includes:

*   Users, Groups, And Security Roles (UBA model)
*   different types of authentication and authorization - modified DIGEST, Kerberos, via public/private key, using LDAP
*   encrypted communication - either HTTPS or more secure internal mechanism
*   audit - all operation is logged to audit tables (both old and new values are logged)
*   simple row level audit - ability to memorize creator, modifier and owner of each entity row
*   safe delete - ability to mark entity row as deleted without psychically delete it from database (or other store)
*   data history - ability to track history of entity row modification and show row content on specified date
*   entity-level security (ELS) - ability to restrict access to entity methods
*   row-level security (RLS) - ability to restrict access to entity data based on row attribute values
*   access control list (ACL) - ability to restrict access to entity data based on security principal assigned for each entity row
*   attribute-level security (ALS) - ability to restrict access to entity attribute values based on different criteria
*   record signing - ability to sign entity attributes using electronic signature
*   PDF signing - ability to sign PDF documents, including visual signatures
*   advanced logging mechanism - almost everything server do can be logged without performance lost

## Users, Groups, And Security Roles

A user is an entity that can be authenticated. A user can be a person or a software entity, such as other information systems. 
Each user is given a unique name. For efficient security management, we recommends adding users to groups. 
A group is a collection of users who usually have something in common, such as working in the same department in a company 
or perform a similar tasks, such as "document registration". 
**Groups, users, and user to role assignments are usually created by the supervisor** - person in organization, 
who monitors and regulates employees and their access rights.
   
A security role is an identity granted to users or groups based on specific conditions. 
Multiple users or groups can be granted the same security role and a user or group can be in more than one security role. 
Security roles are used by Entity-Level Security (ELS) policies to determine who can access a entity methods. 
It also defines the set of the `endpoints` to which access is allowed.
**Security roles and ELS policies are usually created by the application developer**. 

### Build-in roles
Table below lists the build-in roles UnityBase define by default. **Do not delete these roles**  - they are used in the default ELS policies.

| Role name | Default ELS rules... | Endpoints granted | Granted to groups... |
|-----------|----------------------|-------------------|----------------------|
| Admin     | All entity methods are allowed | All endpoints are granted | |
| Supervisor| All rights for Users & Groups management. Soft-lock removing| | |
| Developer | Reserved for change entity definitions | | |
| Monitor   | Application statistics | stat| | 
| User      | Read for common dictionaries (cdn* org*), UI (ubm*) and settings (ubs_settings)| logout,changePassword | | 
| Anonymous | None | | |
| Everyone  | | auth,timeStamp,statics,getAppInfo,models,getDomainInfo,ubql | |

Roles `Anonymous`, `Everyone` and `User` are runtime roles. It assigned automatically by UnityBase server:
 
  - `User`. This role contains all users who have been authenticated
  - `Anonymous`. This role is assigned to any non-authorized user
  - `Everyone`. This role for any anonymous users and all users who have been authenticated

We recommends that you add at least one user to the Admin role in addition to the `admin` user. 
Having at least two administrators at all times helps protect against a single admin user being locked out from a potential security breach. 

## Authorization & authentication

### What Is The Difference Between Authentication And Authorization?

**Authentication**

Authentication verifies **who you are**. For example, you can login into your Unix server using the ssh client,
or access your email server using the POP3 and SMTP client.

**Authorization**

Authorization verifies **what you are authorized to do**. For example, you are allowed to login into your Unix server
via ssh client, but you are not authorized to browser /data2 or any other file system. Authorization occurs after
successful authentication. Authorization can be controlled at file system level or using various application level
configuration options such as chroot(2).

Usually, the connection attempt must be both authenticated and authorized by the system. You can easily find out why
connection attempts are either accepted or denied with the help of these two factors.

### UnityBase authentication schemas

UnityBase support several authentication algorithm with different level of security.
While configuring your application you can set `security.authenticationMethods` config parameter to array or possible supported
authentication algorithm.

|Authentication schema | Description | Authorization method |
|----------------------|-------------|----------------------|
| Basic                | HTTP Basic. Not recommended for a production| Basic |
| UB                   | Modified DIGEST |  UB |
| UBLDAP               | Based on a LDAP catalog | UB |
| UBIP                 | Based on a caller IP. For a server <-> server communication | UBIP |
| Negotiate            | SSO using MS Windows domain. Enterprise edition only | UB |
| CERT                 | Based on a private/public keys. Defence edition only | UB |
| [OpenIDConnect](https://en.wikipedia.org/wiki/OpenID_Connect) | Authentication layer on top of OAuth 2.0 | UB |
| [JWT](https://jwt.io/)| JSON Web Token - coming soon  | JWT |

Some schemas have it own authorization some are only for a authentication - the last column it the table above note a
 authorization method.

### UB authorization
If future client requests are authorized using UB method, the task of authentication is to elaborate two parameters
between client and server: **clientSessionID** and **sessionPrivateKey**.
With knowledge of a `secretWord` - something only client is know, we can calculate a authentication header and add it
to every request what require authentication.

After authentication all requests to a serve must include a `Authorization: UB signature` header,
where `signature` is:

    signature = hexa8(clientSessionID) + hexaTime + hexa8(crc32(sessionPrivateKey + secretWord + hexaTime));

Adding a time to a `signature` prevent from a relplay attack (server check time is growing in each request).

For any request server MAY response with `401` - this mean session is expired and client must repeat the authorization.

Authorization signature calculation (JavaScript):

    function hexa8(value){
        var num = parseInt(value, 10),
            res = isNaN(num) ? '00000000' : num.toString(16);
        while(res.length < 8) {
            res = '0' + res;
        }
        return res;
    };

     function getSignature() {
     var
        timeStampI = Math.floor((new Date()).getTime() /  1000),
        hexaTime = hexa8(timeStampI);

        return  hexa(clientSessionID) + hexaTime + hexa8(crc32(sessionPrivateKey + secretWord + hexaTime));
     }


## UnityBase Administration (UBA) model

The basis of all security mechanism is UnityBase Administration (UBA) model. To enable build-in security developer must
include UBA model to application domain.

This model define entities:

*  uba_role - security roles list
*  uba_user - user list
*  uba_userrole - user roles
*  uba_usercertificate - user certificates (used for public/private key authentication schema)
*  uba_els - entity level security information
*  uba_als - attribute-level security information
*  uba_audit - audit of security related operations
*  uba_subject - unity for uba_user and uba_role entities. Used as security principal for RLS and ACL security

If model UBA is not included into domain, UnityBase work in "authentication not used" mode. In this mode there is no
Session context for method execution. This mode can be used in several cases:

*   for simple services what not require authentication
*   during database initialization
*   for test or developing purpose

Also developer can turn on "authentication not used" mode by comment `"authMethods"` section in application config.

### Password policy

 For authentication schemas what based on a password, stored in the `uba_user` entity (Basic, UB & CERT) administrator
can define a policies. The policies is stored in the `ubs_settings` entity, so the UBS model must be
in application domain. In other case default values are applied.

|Parameter | Description | Default value |
|----------|-------------|---------------|
| `UBA.passwordPolicy.maxDurationDays` | Password expiration. Calculated form a last password change date. After *maxDurationDays* days user can't access any endpoint except *changePassword* and *logout*. That is, to continue the work the user must change the password.| 0 (unlimited) |
| `UBA.passwordPolicy.checkPrevPwdNum` | When user change password new one must not be equal to a *checkPrevPwdNum* previous passwords. If it is equal en error *Previous password is not allowed* is rised | 4 |
| `UBA.passwordPolicy.minLength`       | Minimal password length in chars. If user password length less to **minLength** *Password is too short* exception raised | 3 |
| `UBA.passwordPolicy.checkCmplexity`  | If `true` server will check password must contains upper & lower case letters, numbers and special chars [~!@#$%^&***()_+\\=\-\/'":;<>]. If not - exception *Password is too simple* is raised | false |
| `UBA.passwordPolicy.checkDictionary` | Check the password are not a word from a dictionary. If so - *Password is dictionary word* error is raised | false |
| `UBA.passwordPolicy.allowMatchWithLogin` | Check password not match the user name. If so - *Password matches with login* error is raised | false |
| `UBA.passwordPolicy.maxInvalidAttempts` | After *maxInvalidAttempts* unsuccessful authorization user will be locked (`uba_user.disabled=1`). All attempts will logged to `uba_audit` as  *LOGIN FAILED* or *LOCKED LOGIN FAILED* events | 0 (unlimited) |

### Security audit & dashboard
All security related operations are added to the `uba_audit` entity. The interface part is available in the `adminUI` on the path
`Administrator -> Security -> Security audit`.

For user, specified in the `UBA.securityDashboard.supervisorUser` setting key (by default this is `admin` user) also available a
`Security monitor` ( `Administrator -> Security -> Security monitor` ) feature, where all security related events are logged in the real time.
For a real-time communication WebSockets must be turned on both server and client side - see {@tutorial web_sockets}.

## Additional features in Defence edition
UnityBase Defense edition provide additional security features.
In the security environment instead of usual HTML browsed UBDefenseBrowser - a chromium based Web browser must be used.

### Integrity checking of the application components

UnityBase Defense edition provide a mechanism of self-checking components integrity.

#### Application server
For the application server the subject of integrity checking are:

 - Application server `bin` folder content
 - Application configuration file
 - Files and subfolders* in models folders (models listen in the configuration file)
 - Files and subfolders* in inetPub folder (defined in serverConfig.httpServer.inetPub)
 
* Files and folders whose names begin with "_" is ignored during checksum calculation

After set up application on the production environment, the first step is to calculate an application integrity. 
Command:

	>ub -calcIntegrity  

will calculate a MD5 checksum of all application components and write it to `system32` folder in the file UB_[applicationServerURL], 
where applicationServerURL is a full URL of current application. 
This folder accessible for write only for operation system Administrator, so the command should be executed using Administrator rights.

Every time application is starting, UnityBase will calculate a current application checksum and compare it with checksum, 
calculated by `-calcIntegrity` command. If the checksums do not match the application will be terminated with exit code = 1.

#### Client side
For the UBDefenseBrowser the subject of integrity checking are:

 - UBDefenseBrowser browser itself and all it components
 - offline application part

After set up UBDefenseBrowser on the client, the first step is to calculate an application integrity. 
Command:

	>RunSecureBrowser.cmd -calcIntegrity  

will calculate a CRC32 checksum of all client components.

Every time client part is starting, it will calculate a current checksum and compare it with checksum, 
calculated by `-calcIntegrity` command. If the checksum do not match the application will be terminated with exit code = 1.

#### File downloads
UBSecureBrowsed limit a folder where user can store downloaded files to the folder, specified in `downloadFolder` parameter.
(by default `%USERPROFILE%\Downloads`). In any case all downloads will be logged to the `uba_audit`
with `action=DOWNLOAD` and `fromValue=full path to stored file`.