UnityBase comes with build-in scheduler - the mechanism for scheduling repetitive tasks.
This tutorial is a step-by-step instruction of setting up the schedulers in your application.

## Pre-requirements

Schedulers are implemented by UBQ (UnityBase Queue) model. To enable the schedulers in your application the UBQ model
must be included into the models section of [application config]:

        	"application": {
                    ......
                    "domain": {
                        "models": [
                            ...,
                            {
                                "name": "UBQ",
                                "path": "%UB_HOME%\\models\\UBQ"
                            },
                            ...
                        ]
                    },
       		}

Schedulers are enabled by default, you can explicitly disable schedulers (for example for a test purpose), by adding a

    "schedulers": {"enabled": false}

section to the [application config].

`UB` authorization schema must be enabled in the `security.authenticationMethods` [application config].

## Adding tasks
Scheduler tasks definition can be stored in the root of the model folders in the file with name `_schedulers.json`.
This [scheduler definition JSON schema] describes the file format.

### Define an execution time
The `cron` field is a UNIX-style [crontab] entry. The syntax in the file is:

      ┌───────────── sec (0 - 59)
      │ ┌───────────── min (0 - 59)
      │ │ ┌────────────── hour (0 - 23)
      │ │ │ ┌─────────────── day of month (1 - 31)
      │ │ │ │ ┌──────────────── month (1 - 12)
      │ │ │ │ │ ┌───────────────── day of week (0 - 6) (0 to 6 are Sunday to Saturday)
      │ │ │ │ │ │
      │ │ │ │ │ │
      │ │ │ │ │ │
      * * * * * *

Some samples:

    "cron": "0 0 */1 * * *" // execute a job every hour in 0 min 0 sec

    "cron": "0 0 */3 * * *" // execute a job every three hour in 0 min 0 sec

    "cron": "0 15 1 * * 1" // execute a job every monday in 1:15.00 after midnight

    "cron": "0 1 0 5 4 *" // execute a job every year on 5 april at 0:1.00

    "cron": "0 10 6 1 * *" // execute a job every 1 day of month at 6:10.00

### Define a task to be executed
The `command` attribute defines a path to a function to be executed in the HTTP worker context.
For example:

    "command": "UB.UBQ.FTSReindexFromQueue"

will execute a function `FTSReindexFromQueue` from a namespace `UB.UBQ`.

The tasks are executed from a user name passe to a "runAs" parameter. Users are logged into the system using `UB` authorization.

Alternative way is to pass a `module` parameter, what resolved to module accessible via require and exports a function.
For example:

    "module": '@unitybase/myModule/schedTask'

and in unitybase/myModule/schedTask.js 

	module exports = function() {...}

### Overriding the existing schedulers
Each model can define his own schedulers. It is possible to define the job with the same name in the different models.
In this case job definition will be overridden in the same order how models defined in the [application config].
Instead of modifying job definition from a model you do not own, it is better to define the job with the same name
in your model and override the original job.

For example, to disable the `FTSReindexFromQueue` job (defined in the UBQ model), place the following job definition
inside your model `_schedulers.json`:

    {
     	"name": "FTSReindexFromQueue",
        "schedulingCondition": "false"
    }

## Tracking the schedulers
To see the current scheduler definitions from the `AdminUI` you can select a data from a `ubq_scheduler` virtual entity

    UB.Repository('ubq_scheduler').attrs('*').select()

The shortcut for a ubq_scheduler is placed in the `AdminUI` `Administration` desktop -> Queue->Schedulers.

Every time scheduler is executed it will place the execution result into the `ubq_runstat` entity.
If function from `command` throw an error, record with `ubq_runstat.resultError === 1` will be added and exception
message is placed into the `ubq_runstat.resultErrorMsg`.
In case of successful job execution the record with `ubq_runstat.resultError === 0` will be added and if function from `command` returns
string message it will be placed into the `ubq_runstat.logText`.

To disable logging of the successful job execution (for example to save a database tablespace) you can
set a `"logSuccessful": false` in the job definition.

## Example
The task below will:

  - execute an update of a Full Text Search index every minute  - `"cron": "0 */1 * * * *"`).
  - not log a successful task execution to minimize a `ubq_runstat` table row count - `"logSuccessful": false`
  - only one `FTSReindexFromQueue` task can be performed at the same time - `"singleton": true`
  - not scheduled in case asynchronous FTS operations are disabled in the application configuration  `schedulingCondition`.

Content of a `models/UBQ/_schedulers.json` file:

    [{
        "name": "FTSReindexFromQueue",
        "schedulingCondition": "App.serverConfig.application.fts && App.serverConfig.application.fts.enabled && App.serverConfig.application.fts.async",
        "cron": "0 */1 * * * *",
        "description": "In case async FTS is enabled in server config will call a fts reindex for a queued items (ubq_messages.code = 'ASYNCFTS') every minute",
        "command": "UB.UBQ.FTSReindexFromQueue",
        "singleton": true,
        "runAs": "admin",
        "logSuccessful": false
    }, {
        /*other tasks can be here */
    }]

## Implementation details

Schedulers implementation is a good example of using some advanced techniques, such as:

 - async endpoint - see {@tutorial delayed_operations}
 - application global cache {@link App.globalCacheGet}
 - asynchronous process - {@link worker}
 - manually database transaction commit {@link App.dbCommit} / rollback  {@link App.dbRollback}
 - virtual entities

Implementation consists of two logical blocks.

### Scheduler controller
Scheduler controller is a {@link worker} created during server startup. The task of worker is to read a cron jobs from
a `ubq_scheduler` entity, create an in-memory crontab using [node-cron](https://github.com/ncb000gt/node-cron) module
and send a async HTTP request to `rest/ubq_messages/executeSchedulerTask` endpoint in accordance with the schedule.

Requests are sent using {@link UBConnection} with a credential of a user, defined in the "runAs" scheduler parameter and
with `UB` authentication schema.

For emulation of a `setTimeout` function {@link WindowTimer} module is used.

All initialization is performed in the `models/UBQ/ubq_schedulerInitialization.js`

### Scheduler executor
Requests from the scheduler controller come to a random HTTP worker. Since requests are async, HTTP worker immediately
answers "202 Accepted" to the scheduler controller and then execute a `ubq_messages.executeSchedulerTask` method.

To avoid a remote code execution `ubq_messages.executeSchedulerTask` checks the request which came from the one of the local
server IP's. If not - throw the error.

In case `"singleton": true` (default) is defined for a job (only one job of the same name can be performed at the same time),
endpoint check a App.globalCacheGet(taskName) is not set and if not - set it to `1`. If job with the same name is already running,
then {@link App.globalCacheGet} return a '1' and `executeSchedulerTask` is terminated.

`executeSchedulerTask` method checks if the string passed to a `command` can be resolved into a function, and if so - executes a function
without any parameters.
In case `command` parameter is empty and `module` is passed - will require a module and execute it's default export as a function without parameters.
Then commits (if no errors) or rollbacks ( if errors) all active databases transactions.
Almost every time developer does not need to handle the transaction manually, but in this case we need to put a log
entry to a `ubq_runstat` even in case job is failed and the main database transactions are rollbacked. So we commit/rollback
the possible transactions manually, then insert a row to a `ubq_runstat`, and after this server will commit a `ubq_runstat`
transaction as usual.



[application config]: /models/UB/docson/index.html#../schemas/ubConfig.schema.json
[scheduler definition JSON schema]: /models/UB/docson/index.html#../schemas/scheduler.config.schema.json
[crontab]: https://en.wikipedia.org/wiki/Cron

