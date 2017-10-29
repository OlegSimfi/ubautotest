// This file is generated automatically and contain definition for code insight.
// Ignored by UnityBase server because name start from "_".
// Do not modify this file directly. Run ub cmd/createCodeInsightHelper -help for details

/**
* Граничные узлы
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_borderunit = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Граничные узлы"
* @class
*/
function org_borderunit_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Предок (ref -> org_unit)
    * Предок
    * @type {Number}
    */
    this.orgUnitID = 0;
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
* Внутренние подразделения
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_department = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Внутренние подразделения"
* @class
*/
function org_department_object()  {
    /**
    *  (ref -> org_unit)
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Предок (ref -> org_unit)
    * Предок
    * @type {Number}
    */
    this.parentID = 0;
    /**
    * Внутренний код 
    * Внутренний код подразделения
    * @type {String}
    */
    this.code = '';
    /**
    * Название подразделения 
    * Название без кавычек и абревиатур
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
    * Описание
    * @type {String}
    */
    this.description = '';
    /**
    * Название в родит. падеже 
    * Название без кавычек и аббревиатур в родительном падеже
    * @type {String}
    */
    this.nameGen = '';
    /**
    * Название в дат. падеже 
    * Название без кавычек и аббревиатур в дательном падеже
    * @type {String}
    */
    this.nameDat = '';
    /**
    * Полное название в родит. падеже 
    * Полное название подразделения в родительном падеже
    * @type {String}
    */
    this.fullNameGen = '';
    /**
    * Полное название в дат. падеже 
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
    * Деловодное? 
    * Является ли это подразделение деловодным
    * @type {Boolean}
    */
    this.isClerical = undefined;
    /**
    * Заголовок 
    * Заголовок
    * @type {String}
    */
    this.caption = '';
    /**
    *  (ref -> org_department)
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
* Диаграммы
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_diagram = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Диаграммы"
* @class
*/
function org_diagram_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * root (ref -> org_unit)
    * @type {Number}
    */
    this.orgunitID = 0;
    /**
    * Name 
    * Name
    * @type {String}
    */
    this.caption = '';
    /**
    * Default 
    * Default
    * @type {Boolean}
    */
    this.isdefault = undefined;
    /**
    * Organizational chart 
    * Organizational chart
    * @type {String}
    */
    this.document = '';
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
* Сотрудники внутренней организации
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_employee = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Сотрудники внутренней организации"
* @class
*/
function org_employee_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Код 
    * Внутренний код сотрудника
    * @type {String}
    */
    this.code = '';
    /**
    * Пользователь (ref -> uba_user)
    * Пользовательский логин
    * @type {Number}
    */
    this.userID = 0;
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
    * Дата рождения 
    * Дата рождения
    * @type {Date}
    */
    this.birthDate = new Date();
    /**
    * Коментар 
    * Коментар
    * @type {String}
    */
    this.description = '';
    /**
    * Пол 
    * Пол сотрудника внутренней организации
    * @type {String}
    */
    this.sexType = '';
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
    * Факсимиле 
    * Изображение подписи сотрудника
    * @type {String}
    */
    this.facsimile = '';
    /**
    *  (ref -> org_employee)
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
* Назначения внутренней организации
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_employeeonstaff = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Назначения внутренней организации"
* @class
*/
function org_employeeonstaff_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Таб. № 
    * Табельный номер
    * @type {String}
    */
    this.tabNo = '';
    /**
    * Сотрудник (ref -> org_employee)
    * Сотрудник
    * @type {Number}
    */
    this.employeeID = 0;
    /**
    * Штатная единица (ref -> org_staffunit)
    * Штатная единица внутренней организации
    * @type {Number}
    */
    this.staffUnitID = 0;
    /**
    * Тип назначения 
    * Тип назначения
    * @type {String}
    */
    this.employeeOnStaffType = '';
    /**
    * Описание 
    * Описание назначения
    * @type {String}
    */
    this.description = '';
    /**
    * Заголовок 
    * Заголовок
    * @type {String}
    */
    this.caption = '';
    /**
    *  (ref -> org_employeeonstaff)
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
* Назначения с отложенной датой
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_employeeonstaff_pending = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Назначения с отложенной датой"
* @class
*/
function org_employeeonstaff_pending_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Назначение (ref -> org_employeeonstaff)
    * Назначение
    * @type {Number}
    */
    this.emponstaffID = 0;
    /**
    * Начало 
    * Начало действия назначения
    * @type {Date}
    */
    this.startDate = new Date();
    /**
    * Окончание 
    * Окончание действия назначения
    * @type {Date}
    */
    this.endDate = new Date();
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
}

/**
* Внутренние организации
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_organization = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Внутренние организации"
* @class
*/
function org_organization_object()  {
    /**
    *  (ref -> org_unit)
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Родительский элемент (ref -> org_unit)
    * Родительский элемент
    * @type {Number}
    */
    this.parentID = 0;
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
    * Полное название, как оно указанно в свидетельстве о регистрации
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
    *  (ref -> org_organization)
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
* Посади
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_profession = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Посади"
* @class
*/
function org_profession_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Код 
    * Код посади
    * @type {String}
    */
    this.code = '';
    /**
    * Назва 
    * Назва посади
    * @type {String}
    */
    this.name = '';
    /**
    * Повна назва 
    * Повна назва посади
    * @type {String}
    */
    this.fullName = '';
    /**
    * Название должности в родительном падеже 
    * Полное название должности в родительном падеже
    * @type {String}
    */
    this.nameGen = '';
    /**
    * Название должности в дательном падеже 
    * Полное название должности в дательном падеже
    * @type {String}
    */
    this.nameDat = '';
    /**
    * Полное название должности в родительном падеже 
    * Полное название должности в родительном падеже
    * @type {String}
    */
    this.fullNameGen = '';
    /**
    * Полное название должности в дательном падеже 
    * Полное название должности в дательном падеже
    * @type {String}
    */
    this.fullNameDat = '';
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
* Штатные единицы
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_staffunit = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Штатные единицы"
* @class
*/
function org_staffunit_object()  {
    /**
    *  (ref -> org_unit)
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Предок (ref -> org_unit)
    * Предок
    * @type {Number}
    */
    this.parentID = 0;
    /**
    * Внутренний код 
    * Внутренний код штатной единицы
    * @type {String}
    */
    this.code = '';
    /**
    * Название штатной единицы 
    * Название без кавычек и абревиатур
    * @type {String}
    */
    this.name = '';
    /**
    * Полное название штатной единицы 
    * Полное название
    * @type {String}
    */
    this.fullName = '';
    /**
    * Описание штатной единицы 
    * Описание штатной единицы
    * @type {String}
    */
    this.description = '';
    /**
    * Название штатной единицы в родительном падеже 
    * Полное название штатной единицы в родительном падеже
    * @type {String}
    */
    this.nameGen = '';
    /**
    * Название штатной единицы в дательном падеже 
    * Полное название штатной единицы в дательном падеже
    * @type {String}
    */
    this.nameDat = '';
    /**
    * Полное название штатной единицы в родительном падеже 
    * Полное название штатной единицы в родительном падеже
    * @type {String}
    */
    this.fullNameGen = '';
    /**
    * Полное название штатной единицы в дательном падеже 
    * Полное название штатной единицы в дательном падеже
    * @type {String}
    */
    this.fullNameDat = '';
    /**
    * Заголовок 
    * Заголовок
    * @type {String}
    */
    this.caption = '';
    /**
    * Професія (ref -> cdn_profession)
    * Професія
    * @type {Number}
    */
    this.professionExtID = 0;
    /**
    * Посада (ref -> org_profession)
    * Посада
    * @type {Number}
    */
    this.professionID = 0;
    /**
    * Тип штатной единицы (ref -> cdn_staffunittype)
    * Тип штатной единицы
    * @type {Number}
    */
    this.staffUnitTypeID = 0;
    /**
    * Уровень субординации 
    * Уровень субординации - чем ниже, тем штатная единица считается более важной по орг.структуре
    * @type {Number}
    */
    this.subordinationLevel = 0;
    /**
    * Boss 
    * Boss
    * @type {Boolean}
    */
    this.isBoss = undefined;
    /**
    *  (ref -> org_staffunit)
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
* Организационные единицы
* @mixes EventEmitter
* @mixes RequiredModule
*/
var org_unit = {
  /** 
   * Reference to entity metadata
   * @type {TubEntity} 
   */
  entity: null
};

/**
* Attributes of "Организационные единицы"
* @class
*/
function org_unit_object()  {
    /**
    *  
    * 
    * @type {Number}
    */
    this.ID = 0;
    /**
    * Предок (ref -> org_unit)
    * Предок
    * 
    * @type {Number}
    */
    this.parentID = 0;
    /**
    * Внутренний код 
    * Внутренний код организационной единицы
    * @type {String}
    */
    this.code = '';
    /**
    * Заголовок 
    * Заголовок
    * @type {String}
    */
    this.caption = '';
    /**
    * Тип орг. единицы 
    * Тип организационной единицы
    * @type {String}
    */
    this.unitType = '';
    /**
    *  
    * 
    * @type {String}
    */
    this.mi_treePath = '';
    /**
    *  (ref -> org_unit)
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
    /**
    *  
    * 
    * @type {String}
    */
    this.mi_unityEntity = '';
}

