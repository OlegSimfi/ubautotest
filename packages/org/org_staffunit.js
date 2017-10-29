var svc = require('@unitybase/ubs/modules/service').Service,
    me = org_staffunit;

me.entity.addMethod('beforeupdate');
me.entity.addMethod('afterupdate');
me.entity.addMethod('beforeinsert');
me.entity.addMethod('updatecaption');
me.entity.addMethod('addnew');
me.entity.addMethod('beforedelete');


/**
 * Checks whether the assigments on the unit staff
 * @param {ubMethodParams} ctxt
 */
me.beforedelete = function(ctxt) {
    var
        inst = UB.Repository('org_employeeonstaff').
            attrs(['ID']).
            where('[staffUnitID]', '=', ctxt.mParams.execParams.ID).
            select();
        if (inst.rowCount != 0) {
            throw new Error(UB.i18n('errAlreadyAssigned'));
        }
};

/**
 * Set default value for  staffUnitTypeID
 * @param {ubMethodParams} ctxt
 */
me.addnew = function(ctxt) {
    svc.setassociatedEntityValueByCode(ctxt, 'staffUnitTypeID','01' );
};

/**
 * Sets properly values for all multilingual captions
 * @param {ubMethodParams} ctxt
 */
me.beforeupdate = function(ctxt) {
    me.assignCaptions(ctxt);
};

/**
 * Updates all  multilingual captions for org_employeeonstaff
 * @param {ubMethodParams} ctxt
 */
me.afterupdate = function(ctxt) {
    var
        onStaff,
        params = ctxt.mParams,
        execParams = params.execParams,
        updParams = {},
        eosEntityName = 'org_employeeonstaff';
    if (params.caller != eosEntityName) {
        onStaff = UB.Repository(eosEntityName).
            attrs(['ID']).
            where('[staffUnitID]', '=', execParams.ID).
            select();
        if (onStaff.rowCount !== 0) {
            updParams['caption_'+App.defaultLang+'^'] = '';
            while(!onStaff.eof) {
                var
                    inst = new TubDataStore(eosEntityName);
                updParams.ID = onStaff.get(0);
                inst.run('update', {
                        fieldList: [],
                        caller: me.entity.name,
                        execParams: updParams,
                        __skipOptimisticLock: true
                    }
                );
                onStaff.next();
            }
        }
    }
};

/**
 * Sets properly values for all multilingual captions
 * @param {ubMethodParams} ctxt
 */

me.beforeinsert = function(ctxt) {
    svc.setCode(ctxt, '----',12);
    me.assignCaptions(ctxt);
};

/**
 * Sets properly values for all multilingual captions in execParams before update or insert
 * @param {ubMethodParams} ctxt
 */


me.assignCaptions = function (ctxt) {
    var
        params = ctxt.mParams,
        execParams = params.execParams,
        ID = execParams.ID,
        orgUnitID = execParams.parentID,
        department = null,
        employeeList = {},
        currentRow,
        defaultSuffix = '_'+App.defaultLang+'^',
        sLang = svc.getSupportLang(ctxt),
        needLoadStaffUnitRow = false,
        depFieldList = [],
        staffUnitFieldList = ['parentID'];
    if (execParams.name) {      // Here is the standard values for all "name" attributes ( "name_uk^" instead of "name", etc)
        execParams['name'+defaultSuffix] = execParams.name;
        delete execParams.name;
    }
    sLang.forEach(function(lang){
        var
            suffix = '_'+lang+'^';
        staffUnitFieldList.push('name'+suffix);
        depFieldList.push('caption'+suffix);
        if (!orgUnitID) {
            staffUnitFieldList.push('parentID.caption'+suffix);
        }
        if (!execParams['name'+suffix] ) {
            if (svc.inserting(ctxt)) {
                execParams['name'+suffix] = execParams['name'+defaultSuffix];
            } else {
                needLoadStaffUnitRow = true;
            }
        }
        employeeList[lang] = null;
    });
    if (orgUnitID) {
        department = UB.Repository('org_unit').
            attrs(depFieldList).
            where('[ID]', '=', orgUnitID).
            select();
    }
    if (needLoadStaffUnitRow || !orgUnitID) {
        currentRow = UB.Repository(me.entity.name).
            attrs(staffUnitFieldList).
            where('[ID]', '=', ID).
            select();
    }
    if (!svc.inserting(ctxt)) {
        employeeList = me.getEmployeeList(ID, sLang);
    }
    sLang.forEach(function(lang){
        var
            suffix = '_'+lang+'^',
            depName = department ? department.get('caption'+suffix) : currentRow.get('parentID.caption'+suffix),
            staffUnitName = execParams['name'+suffix] || currentRow.get('name'+suffix);

        execParams['caption'+suffix]  = (employeeList[lang]||UB.i18n('notAssigned',lang))+ ' ('+depName+' '+staffUnitName+')';
    });
    delete execParams.caption;
};

/**
 * Makes the object with list of assigned employees on this staff unit for all supported languages like this:
 * {
 *  'UK': 'Пупсіков,Феоктістов',
 *  'EN': 'Pupsikov,Feoktistov',
 *  'RU': 'Пупсиков,Феоктистов'
 * }
 * @param {Number} staffUnitID
 * @param {Array} supportLang
 * @return {Object}
 */

me.getEmployeeList = function(staffUnitID, supportLang) {
    var
        staffs,
        staffsCount = 0,
        staffsFieldList = ['employeeOnStaffType'],
        result = {};
    supportLang.forEach(function(lang){
        var
            suffix = '_'+lang+'^';
        staffsFieldList.push('employeeID.shortFIO'+suffix);
        staffsFieldList.push('employeeID.lastName'+suffix);
        result[lang] = null;
    });
    if (!staffUnitID) {
        return result;
    }
    staffs = UB.Repository('org_employeeonstaff').
        attrs(staffsFieldList).
        where('[employeeOnStaffType]', 'in', ['PERMANENT', 'TEMPORARY']).
        where('[staffUnitID]', '=', staffUnitID).
        orderBy('[employeeOnStaffType]').
        select();
    staffsCount = staffs.rowCount;
    supportLang.forEach(function(lang){
        var
            suffix = '_'+lang+'^',
            employeeList = '';
        staffs.first();
        while (!staffs.eof) {
            employeeList += ((staffsCount > 1 && staffs.get('employeeOnStaffType') === 'PERMANENT') ? '* ' : '') +
                (staffs.get('employeeID.shortFIO'+suffix));
            staffs.next();
            if (!staffs.eof) {
                employeeList += ',';
            }
        }
        result[lang] = employeeList;
    });
    return  result;
};