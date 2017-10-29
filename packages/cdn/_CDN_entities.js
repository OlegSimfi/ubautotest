// This file is generated automatically and contain definition for code insight.
// Ignored by UnityBase server because name start from "_".
// Do not modify this file directly. Run ub cmd/createCodeInsightHelper -help for details

/**
* Addresses
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_address = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Addresses"
* @class
*/
function cdn_address_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Address type 
    * @type {String}
    */
    this.addressType = '';
    /**
    * Address 
    * @type {String}
    */
    this.value = '';
    /**
    * Subject 
    * @type {Number}
    */
    this.subjectID = 0;
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Admin unit
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_adminunit = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Admin unit"
* @class
*/
function cdn_adminunit_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Parent (ref -> cdn_adminunit)
    * Parent
    * @type {Number}
    */
    this.parentAdminUnitID = 0;
    /**
    * Code 
    * Internal code
    * @type {String}
    */
    this.code = '';
    /**
    * Name 
    * @type {String}
    */
    this.name = '';
    /**
    * Full name 
    * @type {String}
    */
    this.fullName = '';
    /**
    * Admin unit type 
    * @type {String}
    */
    this.adminUnitType = '';
    /**
    * Caption 
    * @type {String}
    */
    this.caption = '';
    /**
    *  
    * 
    * @type {String}
    */
    this.mi_unityEntity = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Bank branches
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_bank = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Bank branches"
* @class
*/
function cdn_bank_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Bank code 
    * Bank branch code
    * @type {String}
    */
    this.MFO = '';
    /**
    * Organization code 
    * Bank organization code
    * @type {String}
    */
    this.code = '';
    /**
    * Name 
    * Name without quotes and ownership. For searching data.
    * @type {String}
    */
    this.name = '';
    /**
    * Full name 
    * Full official bank name . For displaying in reports.
    * @type {String}
    */
    this.fullName = '';
    /**
    * Phones 
    * @type {String}
    */
    this.phones = '';
    /**
    * Address 
    * @type {String}
    */
    this.address = '';
    /**
    * Country (ref -> cdn_country)
    * Registration country
    * @type {Number}
    */
    this.countryID = 0;
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Список будинків
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_building = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Список будинків"
* @class
*/
function cdn_building_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Вулиця (ref -> cdn_street)
    * @type {Number}
    */
    this.streetID = 0;
    /**
    * Індекс (ref -> cdn_postindex)
    * @type {Number}
    */
    this.postIndexID = 0;
    /**
    * № 
    * Код
    * @type {String}
    */
    this.code = '';
    /**
    * Опис 
    * Опис
    * @type {String}
    */
    this.description = '';
    /**
    * Тип 
    * Тип
    * @type {String}
    */
    this.buildingType = '';
    /**
    *  (ref -> cdn_building)
    * 
    * @type {Number}
    */
    this.mi_data_id = 0;
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateFrom = new Date();
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateTo = new Date();
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Cities
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_city = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Cities"
* @class
*/
function cdn_city_object()  {
    /**
    *  (ref -> cdn_adminunit)
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Parent (ref -> cdn_adminunit)
    * @type {Number}
    */
    this.parentAdminUnitID = 0;
    /**
    * Code 
    * City code
    * @type {String}
    */
    this.code = '';
    /**
    * Name 
    * City name
    * @type {String}
    */
    this.name = '';
    /**
    * Caption 
    * @type {String}
    */
    this.caption = '';
    /**
    * Description 
    * City description
    * @type {String}
    */
    this.description = '';
    /**
    * Postal code 
    * City postal code
    * @type {String}
    */
    this.postalCode = '';
    /**
    * Phone code 
    * City phone code
    * @type {String}
    */
    this.phoneCode = '';
    /**
    * Type (ref -> cdn_citytype)
    * City type
    * @type {Number}
    */
    this.cityTypeID = 0;
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* City types
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_citytype = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "City types"
* @class
*/
function cdn_citytype_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Code 
    * Internal code of city type
    * @type {String}
    */
    this.code = '';
    /**
    * Name 
    * City type name
    * @type {String}
    */
    this.name = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Contacts
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_contact = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Contacts"
* @class
*/
function cdn_contact_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Contact type (ref -> cdn_contacttype)
    * @type {Number}
    */
    this.contactTypeID = 0;
    /**
    * Contact 
    * @type {String}
    */
    this.value = '';
    /**
    * Subject 
    * @type {Number}
    */
    this.subjectID = 0;
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Contact types
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_contacttype = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Contact types"
* @class
*/
function cdn_contacttype_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Code 
    * @type {String}
    */
    this.code = '';
    /**
    * Name 
    * Contact type name
    * @type {String}
    */
    this.name = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Correspondent indexes
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_corrindex = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Correspondent indexes"
* @class
*/
function cdn_corrindex_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Code 
    * Code of correspondent index
    * @type {String}
    */
    this.code = '';
    /**
    * Name 
    * Name of correspondent index
    * @type {String}
    */
    this.name = '';
    /**
    * Full name 
    * Full name of correspondent index
    * @type {String}
    */
    this.fullName = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Countries
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_country = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Countries"
* @class
*/
function cdn_country_object()  {
    /**
    *  (ref -> cdn_adminunit)
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Code 
    * Internal code
    * @type {String}
    */
    this.code = '';
    /**
    * Name 
    * Name of the country
    * @type {String}
    */
    this.name = '';
    /**
    * Full name 
    * Full official name of the country
    * @type {String}
    */
    this.fullName = '';
    /**
    * Digital code 
    * Digital code of the country
    * @type {Number}
    */
    this.intCode = 0;
    /**
    * ISO code 
    * 2-character code of the country by ISO classification
    * @type {String}
    */
    this.symbol2 = '';
    /**
    * IOC code 
    * 3-character code of the country by IOC classification
    * @type {String}
    */
    this.symbol3 = '';
    /**
    * Description 
    * Country description
    * @type {String}
    */
    this.description = '';
    /**
    * Phone code 
    * Country phone code
    * @type {String}
    */
    this.phoneCode = '';
    /**
    * Currency (ref -> cdn_currency)
    * Main currency of the country
    * @type {Number}
    */
    this.currencyID = 0;
    /**
    * Capital (ref -> cdn_city)
    * Capital of the country
    * @type {Number}
    */
    this.capitalID = 0;
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Currencies
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_currency = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Currencies"
* @class
*/
function cdn_currency_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Digital code 
    * Digital code of currency
    * @type {Number}
    */
    this.intCode = 0;
    /**
    * 3-character code 
    * 3-character code of currency
    * @type {String}
    */
    this.code3 = '';
    /**
    * Name 
    * Name of currency
    * @type {String}
    */
    this.name = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Внешние подразделения
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_department = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Внешние подразделения"
* @class
*/
function cdn_department_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Внутренний код 
    * Внутренний код подразделения
    * @type {String}
    */
    this.code = '';
    /**
    * Название подразделения 
    * Название без кавычек и аббревиатур
    * @type {String}
    */
    this.name = '';
    /**
    * Полное название подразделения 
    * Полное название подразделения
    * @type {String}
    */
    this.fullName = '';
    /**
    * Описание подразделения 
    * Описание подразделения
    * @type {String}
    */
    this.description = '';
    /**
    * Название подразделения в родительном падеже 
    * Название без кавычек и аббревиатур в родительном падеже
    * @type {String}
    */
    this.nameGen = '';
    /**
    * Название подразделения в дательном падеже 
    * Название без кавычек и аббревиатур в дательном падеже
    * @type {String}
    */
    this.nameDat = '';
    /**
    * Полное название подразделения в родительном падеже 
    * Полное название подразделения в родительном падеже
    * @type {String}
    */
    this.fullNameGen = '';
    /**
    * Полное название подразделения в дательном падеже 
    * Полное название подразделения в дательном падеже
    * @type {String}
    */
    this.fullNameDat = '';
    /**
    * Тип подразделения (ref -> cdn_deptype)
    * Тип подразделения
    * @type {Number}
    */
    this.depTypeID = 0;
    /**
    * Организация (ref -> cdn_organization)
    * Организация, которой принадлежит подразделение
    * @type {Number}
    */
    this.organizationID = 0;
    /**
    *  (ref -> cdn_department)
    * 
    * @type {Number}
    */
    this.mi_data_id = 0;
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateFrom = new Date();
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateTo = new Date();
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Типы департаментов
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_deptype = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Типы департаментов"
* @class
*/
function cdn_deptype_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Код 
    * Внутренний код типа департамента
    * @type {String}
    */
    this.code = '';
    /**
    * Название 
    * Название типа департамента
    * @type {String}
    */
    this.name = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Сотрудники внешних организаций
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_employee = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Сотрудники внешних организаций"
* @class
*/
function cdn_employee_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Фамилия 
    * Фамилия сотрудника
    * @type {String}
    */
    this.lastName = '';
    /**
    * Имя 
    * Имя сотрудника
    * @type {String}
    */
    this.firstName = '';
    /**
    * Отчество 
    * Отчество сотрудника
    * @type {String}
    */
    this.middleName = '';
    /**
    * Описание сотрудника внешней организации 
    * Описание
    * @type {String}
    */
    this.description = '';
    /**
    * Пол 
    * Пол сотрудника внешней организации
    * @type {String}
    */
    this.sexType = '';
    /**
    * Табельный номер 
    * Табельный номер сотрудника внешней организации
    * @type {String}
    */
    this.uniqNum = '';
    /**
    * Суффикс 
    * Суффикс
    * @type {String}
    */
    this.suffix = '';
    /**
    * Краткое ФИО 
    * Пример: Фамилия И.О.
    * @type {String}
    */
    this.shortFIO = '';
    /**
    * Полное ФИО 
    * Пример: Фамилия Имя Отчество
    * @type {String}
    */
    this.fullFIO = '';
    /**
    * Обращение 
    * Как обращаться к этому человеку
    * @type {String}
    */
    this.apply = '';
    /**
    * Фамилия в род. падеже 
    * Фамилия сотрудника в родительном падеже
    * @type {String}
    */
    this.lastNameGen = '';
    /**
    * Фамилия в дат. падеже 
    * Фамилия сотрудника в дательном падеже
    * @type {String}
    */
    this.lastNameDat = '';
    /**
    * Имя в род. падеже 
    * Имя сотрудника в родительном падеже
    * @type {String}
    */
    this.firstNameGen = '';
    /**
    * Имя в дат. падеже 
    * Имя сотрудника в дательном падеже
    * @type {String}
    */
    this.firstNameDat = '';
    /**
    * Отчество в род. падеже 
    * Отчество сотрудника в родительном падеже
    * @type {String}
    */
    this.middleNameGen = '';
    /**
    * Отчество в дат. падеже 
    * Отчество сотрудника в дательном падеже
    * @type {String}
    */
    this.middleNameDat = '';
    /**
    * Краткое ФИО в род. падеже 
    * Краткое ФИО в родительном падеже
    * @type {String}
    */
    this.shortFIOGen = '';
    /**
    * Краткое ФИО в дат. падеже 
    * Краткое ФИО в дательном падеже
    * @type {String}
    */
    this.shortFIODat = '';
    /**
    * Полное ФИО в род. падеже 
    * Полное ФИО в родительном падеже
    * @type {String}
    */
    this.fullFIOGen = '';
    /**
    * Полное ФИО в дат. падеже 
    * Полное ФИО в дательном падеже
    * @type {String}
    */
    this.fullFIODat = '';
    /**
    * Обращение в род. падеже 
    * Как обращаться к этому человеку в родительном падеже
    * @type {String}
    */
    this.applyGen = '';
    /**
    * Обращение в дат. падеже 
    * Как обращаться к этому человеку в дательном падеже
    * @type {String}
    */
    this.applyDat = '';
    /**
    * Департамент (ref -> cdn_department)
    * Департамент внешней организации, к которой принадлежит этот сотрудник
    * @type {Number}
    */
    this.departmentID = 0;
    /**
    * Организация (ref -> cdn_organization)
    * Внешняя организация, к которой принадлежит этот сотрудник
    * @type {Number}
    */
    this.organizationID = 0;
    /**
    * Формулировка адресата 
    * Формулировка адресата, которая будет отображаться при формировании PDF образа исходящего документа
    * @type {String}
    */
    this.addrText = '';
    /**
    *  (ref -> cdn_employee)
    * 
    * @type {Number}
    */
    this.mi_data_id = 0;
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateFrom = new Date();
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateTo = new Date();
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Расчётные счета
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_orgaccount = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Расчётные счета"
* @class
*/
function cdn_orgaccount_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Организация (ref -> cdn_organization)
    * Организация
    * @type {Number}
    */
    this.organizationID = 0;
    /**
    * Валюта (ref -> cdn_currency)
    * Валюта счета
    * @type {Number}
    */
    this.currencyID = 0;
    /**
    * Банк (ref -> cdn_bank)
    * Банк, в котором открыт счет
    * @type {Number}
    */
    this.bankID = 0;
    /**
    * КодСчета 
    * Код счета (Номер счета)
    * @type {String}
    */
    this.code = '';
    /**
    * Тип счета 
    * Тип счета
    * @type {String}
    */
    this.acctype = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Внешние организации
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_organization = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Внешние организации"
* @class
*/
function cdn_organization_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Внутренний код 
    * Внутренний код организации
    * @type {String}
    */
    this.code = '';
    /**
    * ОКПО 
    * Общий классификатор предприятий и организаций (ОКПО)
    * @type {String}
    */
    this.OKPOCode = '';
    /**
    * Налоговый № 
    * Налоговый номер
    * @type {String}
    */
    this.taxCode = '';
    /**
    * № св. НДС 
    * № свидетельства плательщика НДС
    * @type {String}
    */
    this.vatCode = '';
    /**
    * Название организации 
    * Название без кавычек и аббревиатур
    * @type {String}
    */
    this.name = '';
    /**
    * Полное название организации 
    * Полное название, как оно указано в свидетельстве о регистрации
    * @type {String}
    */
    this.fullName = '';
    /**
    * Название организации в родительном падеже 
    * Название без кавычек и аббревиатур в родительном падеже
    * @type {String}
    */
    this.nameGen = '';
    /**
    * Название организации в дательном падеже 
    * Название без кавычек и аббревиатур в дательном падеже
    * @type {String}
    */
    this.nameDat = '';
    /**
    * Полное название организации в родительном падеже 
    * Полное название, как оно указано в свидетельстве о регистрации, в родительном падеже
    * @type {String}
    */
    this.fullNameGen = '';
    /**
    * Полное название организации в дательном падеже 
    * Полное название, как оно указано в свидетельстве о регистрации, в дательном падеже
    * @type {String}
    */
    this.fullNameDat = '';
    /**
    * Описание организации 
    * Описание
    * @type {String}
    */
    this.description = '';
    /**
    * Тип организации (ref -> cdn_orgbusinesstype)
    * Тип организации
    * @type {Number}
    */
    this.orgBusinessTypeID = 0;
    /**
    * Тип собственности (ref -> cdn_orgownershiptype)
    * Тип собственности
    * @type {Number}
    */
    this.orgOwnershipTypeID = 0;
    /**
    * Индекс корреспондента (ref -> cdn_corrindex)
    * Индекс корреспондента
    * @type {Number}
    */
    this.corrIndexID = 0;
    /**
    * Формулировка адресата 
    * Формулировка адресата, которая будет отображаться при формировании PDF образа исходящего документа
    * @type {String}
    */
    this.addrText = '';
    /**
    * Заголовок 
    * Заголовок
    * @type {String}
    */
    this.caption = '';
    /**
    *  (ref -> cdn_organization)
    * 
    * @type {Number}
    */
    this.mi_data_id = 0;
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateFrom = new Date();
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateTo = new Date();
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Типы организаций
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_orgbusinesstype = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Типы организаций"
* @class
*/
function cdn_orgbusinesstype_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Код 
    * Внутренний код типа организации
    * @type {String}
    */
    this.code = '';
    /**
    * Абревиатура 
    * Абревиатура типа организации
    * @type {String}
    */
    this.shortName = '';
    /**
    * Название 
    * Название типа организации
    * @type {String}
    */
    this.name = '';
    /**
    * Описание 
    * Описание типа организации
    * @type {String}
    */
    this.fullName = '';
    /**
    * Гос. орган 
    * Признак, что организация указанного типа является государственным органом
    * @type {Boolean}
    */
    this.isGovAuthority = undefined;
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Форма собственности
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_orgownershiptype = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Форма собственности"
* @class
*/
function cdn_orgownershiptype_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Код 
    * Внутренний код формы собственности
    * @type {String}
    */
    this.code = '';
    /**
    * Абревиатура 
    * Абревиатура формы собственности
    * @type {String}
    */
    this.shortName = '';
    /**
    * Название 
    * Название формы собственности
    * @type {String}
    */
    this.name = '';
    /**
    * Полное название 
    * Полное название формы собственности
    * @type {String}
    */
    this.fullName = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Physical persons
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_person = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Physical persons"
* @class
*/
function cdn_person_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Last name 
    * Last name of the person
    * @type {String}
    */
    this.lastName = '';
    /**
    * First name 
    * First name of the person
    * @type {String}
    */
    this.firstName = '';
    /**
    * Middle name 
    * Middle name of the person
    * @type {String}
    */
    this.middleName = '';
    /**
    * Identity card 
    * Person&#39;s identity card
    * @type {String}
    */
    this.identCard = '';
    /**
    * Place of work, position 
    * Place of work, position
    * @type {String}
    */
    this.workPlacePos = '';
    /**
    * Birthday 
    * Birthday of the person
    * @type {Date}
    */
    this.birthDate = new Date();
    /**
    * Description 
    * Description of the person
    * @type {String}
    */
    this.description = '';
    /**
    * Sex 
    * Sex of the person
    * @type {String}
    */
    this.sexType = '';
    /**
    * Sufix 
    * Sufix of the person
    * @type {String}
    */
    this.suffix = '';
    /**
    * Short name 
    * Example: Antonov I.P.
    * @type {String}
    */
    this.shortFIO = '';
    /**
    * Full name 
    * Example: Antonov Ivan Petrovich
    * @type {String}
    */
    this.fullFIO = '';
    /**
    * Apply 
    * Apply to the person
    * @type {String}
    */
    this.apply = '';
    /**
    * Photo 
    * Person&#39;s photo
    * @type {String}
    */
    this.photo = '';
    /**
    * Last name in genitive 
    * Person&#39;s last name in genitive case
    * @type {String}
    */
    this.lastNameGen = '';
    /**
    * Last name in dative 
    * Person&#39;s last name in dative case
    * @type {String}
    */
    this.lastNameDat = '';
    /**
    * First name in genitive 
    * Person&#39;s first name in genitive case
    * @type {String}
    */
    this.firstNameGen = '';
    /**
    * First name in dative 
    * Person&#39;s first name in dative case
    * @type {String}
    */
    this.firstNameDat = '';
    /**
    * Middle name in genitive 
    * Person&#39;s middle name in genitive case
    * @type {String}
    */
    this.middleNameGen = '';
    /**
    * Middle name in dative 
    * Person&#39;s middle name in dative case
    * @type {String}
    */
    this.middleNameDat = '';
    /**
    * Short name in genitive 
    * Person&#39;s short name in genitive case
    * @type {String}
    */
    this.shortFIOGen = '';
    /**
    * Short name in dative 
    * Person&#39;s short name in dative case
    * @type {String}
    */
    this.shortFIODat = '';
    /**
    * Full name in genitive 
    * Person&#39;s full name in genitive case
    * @type {String}
    */
    this.fullFIOGen = '';
    /**
    * Full name in dative 
    * Person&#39;s full name in dative case
    * @type {String}
    */
    this.fullFIODat = '';
    /**
    * Apply in genitive 
    * Apply to the person in genitive case
    * @type {String}
    */
    this.applyGen = '';
    /**
    * Apply in dative 
    * Apply to the person in dative case
    * @type {String}
    */
    this.applyDat = '';
    /**
    * Region (ref -> cdn_region)
    * Person&#39;s region
    * @type {Number}
    */
    this.regionID = 0;
    /**
    * Social status (ref -> cdn_personsocialstatus)
    * Social status position
    * @type {Number}
    */
    this.socialstatusID = 0;
    /**
    * Category (ref -> cdn_personcategory)
    * Category position
    * @type {Number}
    */
    this.categoryID = 0;
    /**
    *  (ref -> cdn_person)
    * 
    * @type {Number}
    */
    this.mi_data_id = 0;
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateFrom = new Date();
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateTo = new Date();
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* The category
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_personcategory = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "The category"
* @class
*/
function cdn_personcategory_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Code 
    * Code
    * @type {String}
    */
    this.code = '';
    /**
    * Name 
    * Name
    * @type {String}
    */
    this.name = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Social status
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_personsocialstatus = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Social status"
* @class
*/
function cdn_personsocialstatus_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Code 
    * Code
    * @type {String}
    */
    this.code = '';
    /**
    * Name 
    * Name
    * @type {String}
    */
    this.name = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Поштові індекси
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_postindex = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Поштові індекси"
* @class
*/
function cdn_postindex_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Індекс 
    * Індекс
    * @type {String}
    */
    this.code = '';
    /**
    * Вулиця (ref -> cdn_street)
    * @type {Number}
    */
    this.streetID = 0;
    /**
    * Опис 
    * Опис
    * @type {String}
    */
    this.description = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Професії
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_profession = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Професії"
* @class
*/
function cdn_profession_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Код 
    * Код професії
    * @type {String}
    */
    this.code = '';
    /**
    * Назва 
    * Назва професії
    * @type {String}
    */
    this.name = '';
    /**
    * Назва + код 
    * @type {String}
    */
    this.description = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Регионы
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_region = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Регионы"
* @class
*/
function cdn_region_object()  {
    /**
    *  (ref -> cdn_adminunit)
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Предок (ref -> cdn_adminunit)
    * Предок
    * @type {Number}
    */
    this.parentAdminUnitID = 0;
    /**
    * Код 
    * Внутрішній код
    * @type {String}
    */
    this.code = '';
    /**
    * Тип региона (ref -> cdn_regiontype)
    * Тип региона
    * @type {Number}
    */
    this.regionTypeID = 0;
    /**
    * Название 
    * Название региона
    * @type {String}
    */
    this.name = '';
    /**
    * Заголовок 
    * Заголовок региона
    * @type {String}
    */
    this.caption = '';
    /**
    * Полное название 
    * Полное официальное название региона
    * @type {String}
    */
    this.fullName = '';
    /**
    * Описание 
    * Описание региона
    * @type {String}
    */
    this.description = '';
    /**
    * Телефонный код 
    * Телефонный код региона
    * @type {String}
    */
    this.phoneCode = '';
    /**
    * Центр (ref -> cdn_city)
    * Центр региона
    * @type {Number}
    */
    this.centerID = 0;
    /**
    *  (ref -> cdn_region)
    * 
    * @type {Number}
    */
    this.mi_data_id = 0;
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateFrom = new Date();
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateTo = new Date();
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Типы регионов
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_regiontype = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Типы регионов"
* @class
*/
function cdn_regiontype_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Код 
    * Код
    * @type {String}
    */
    this.code = '';
    /**
    * Название 
    * Название типа региона
    * @type {String}
    */
    this.name = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Типы штатных единиц
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_staffunittype = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Типы штатных единиц"
* @class
*/
function cdn_staffunittype_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Код 
    * Код
    * @type {String}
    */
    this.code = '';
    /**
    * Название 
    * Название типа штатной единицы
    * @type {String}
    */
    this.name = '';
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

/**
* Список вулиць
* @mixes EventEmitter
* @mixes RequiredModule
*/
var cdn_street = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Список вулиць"
* @class
*/
function cdn_street_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Назва 
    * Назва вулиці
    * @type {String}
    */
    this.name = '';
    /**
    * Повна назва 
    * Повна назва
    * @type {String}
    */
    this.fullName = '';
    /**
    * Код 
    * Код
    * @type {String}
    */
    this.code = '';
    /**
    * Тип 
    * Тип
    * @type {String}
    */
    this.streetType = '';
    /**
    * Нас. пункт (ref -> cdn_city)
    * Населений пункт
    * @type {Number}
    */
    this.cityID = 0;
    /**
    *  (ref -> cdn_street)
    * 
    * @type {Number}
    */
    this.mi_data_id = 0;
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateFrom = new Date();
    /**
    *  
    * 
    * @type {Date}
    */
    this.mi_dateTo = new Date();
    /**
    *  (ref -> uba_user)
    * Row owner
    * 
    * @type {Number}
    */
    this.mi_owner = 0;
    /**
    *  
    * Creation date
    * 
    * @type {Date}
    */
    this.mi_createDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who create row
    * 
    * @type {Number}
    */
    this.mi_createUser = 0;
    /**
    *  
    * Modification date
    * 
    * @type {Date}
    */
    this.mi_modifyDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who modify row
    * 
    * @type {Number}
    */
    this.mi_modifyUser = 0;
    /**
    *  
    * Deletion date
    * 
    * @type {Date}
    */
    this.mi_deleteDate = new Date();
    /**
    *  (ref -> uba_user)
    * User who delete row
    * 
    * @type {Number}
    */
    this.mi_deleteUser = 0;
}

