# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.2.21]
### Added
- `argv.establishConnectionFromCmdLineAttributes` can accept a `-timeout` command line which
 set a connection receive timeout. By default timeout increased to 120 set to
 allow a long-live script execution

## [4.2.20]
### Added
- UBDoman iterator callbacks described as @callback for better code insight

## [4.2.17]
### Fixed
- prevent ORA-00932 error - in case `Repository.where(attr, 'in', undefined)` -> replace it by (0=1) SQL statement

## [4.1]
### Added
- `argv.getConfigFileName` take a config from UB_CFG environment variable if `-cfg` cmd line switch omitted
- `FileBaseStoreLoader.load()` now return data version in TubDataCache. 
  To be used in file-based entitis select's instead of version calculation individually in each entity
- `UBConnection.setDocument` method for convinient uploading content to temp store, for example in model initialization or
  data update/migration scripts

### Fixed
- LocalDataStore sometimes not filter by ID (known bug in TubList)
