# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

##  [4.2.29]
### Added
 - new BasePanel.postOnlySimpleAttributes property 
   
   If `true` form will post only values of modified attributes
   which do not contain a dot.
   
   Exapmle: in case def is
   ```
   items:[
     { attributeName: "nullDict_ID"},
     { attributeName: "nullDict_ID.code", readOnly: true},
     { attributeName: "nullDict_ID.caption", readOnly: true}
   ]
   ```
   
   Values of nullDict_ID.code &  nullDict_ID.caption will not be send to update/insert execParams

### Changed
 - Not-null attributes in the form builder now displayed as bold
 - `showForm` command will use a `ubm_form.caption` as a form caption (instead of description as in prev. version) 


##  [4.2.25]
### Added
 - Allow localizing application name on `adminUI` login form by specifying `applicationName` in `ubConfig` as an object with keys=locale instead of string. Thanks to Sergey.Severyn for contribution

##  [4.2.24]
### Added
 - Simple certificate authentication support in adminui. Password is not needed. The user name is extracted from the certificate or entered by the user.

### Changed
 - The ability to use different libraries for certificate authorization.

##  [4.2.22]
### Added
 - new `uiSettings.adminUI.favoriteCategoryCount` config property allow to set up to three favotite column (star) colors

### Fixed
 - Show unhandled Promise rejection messages in dialog box (replace when->es6-promise Promise polufill)

##  [4.2.20]
### Fixed
 - UB.ux.form.field.UBDateTime. Prevent exception when picker opened and button TAB pressed. [UB-1862]


##  [4.2.18]
### Added
 - Editors for OrgChart available in UB EE is moved into standard edition (this package)
 - Add `.x-grid-row-bold` css class for mark grid rows as **bold**
 - Add property `UB.view.ColumnFavorites.allowedCategoryCount` for configure allowed values count in favorite column.

###Fixed
- fix bag in cyclical opening of modal forms.(`org_staffunit` -> `org_employeeinstaff` -> `org_staffunit`)

##  [4.2.17]
### Fixed
- allow UBComboBox.setValueById to use `valueField` instead of hardcoded 'ID'
- "Remember me" feature for Negotiate authentication now don't hung a app
- "unable to change password at first logon" issue fixed 

## [4.2.15]
### Added

### Fixed
-  prevent open the same command in separate tabs in case it's opened from left or top menu
-  set `UBStore.loading = true` in method **UBStore.reload** before call **UBStore.clearCache()**.

### Changed
- enum combobox now sort enum captions by `orderNum` attribute (instead of name)
- remove ER diagram background image (not background is white )
- ignore attributes with property `defaultView: false` for automatically generated forms

## [4.2.13]
### Added

### Fixed
- UBReportEditor now draw a dashed border around sections (both paragraph and table row)

## [4.2.12]
### Added
- AdminUI: In case of first login attempt LoginWindow will activate a tab for a first auth method from server config `security.authenticationMethods` array

### Fixed
- fix systemjs version to `0.20.10-scoped` - pathced vwrsion what allow scoped modules loading without map configuration

## [4.2.11]
### Added
- UBBoxSelect now accept ubRequest as a config parameter (for store creation)
- UBReportEditor can insert image from file (Insert -> Image -> click on button with photo)
- UBReportEditor added build-in image editor (click on image to actiate)

### Fixed
- since form definitian now evaluated only once (HMR) both `EntityGridPanel` & `ubdetailgrid` now accept `customActionas` as a Ext.Action config (not a class instance)
