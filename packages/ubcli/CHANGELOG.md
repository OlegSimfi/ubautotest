# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.41]
### Changed
- ublci `createCodeInsightHelper` command now generate entities stubs using **stanrard JS** code style

## [1.0.36]
### Added
- maximum database identifier length (table/constraint names etc) now depend on dialect. 30 for oracle, 116 for SQL Server

## [1.0.34]
### Fixed
- prepareGZIP command now work propertly (adding @unitybase/compressors dependency)


## [1.0.28]
### Added
- ability to create a empty database for non-default connection using `-conn` initDB parameter: `ubcli initDB -conn connectionName -create -drop`. 

### Fixed
- show a connection name duting database drop/create operations

## [1.0.26]
### Added

### Fixed
- DDL generator will skip attributes mapped to another existed attribute
