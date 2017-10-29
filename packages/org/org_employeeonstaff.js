var me = org_employeeonstaff,
    svc = require('@unitybase/ubs/modules/service').Service;

me.entity.addMethod('afterupdate');
me.entity.addMethod('afterinsert');
me.entity.addMethod('afterdelete');
me.entity.addMethod('beforeinsert');
me.entity.addMethod('beforeupdate');
me.entity.addMethod('addnew');
me.entity.addMethod('updatePendingStaffUnitCaptions');

/**
 * Updates all  multilingual captions for org_staffunit
 * @param {Number} staffUnitID
 */

me.updatestaffunitcaption = function (staffUnitID) {
    var
        staffUnit = new TubDataStore('org_staffunit'),
        updParams = {
            ID: staffUnitID
        };
    updParams['caption_' + App.defaultLang + '^'] = '';
    staffUnit.run('update', {
            fieldList: [],
            caller: me.entity.name,
            execParams: updParams,
            __skipOptimisticLock: true
        }
    );

};

/**
 * Sets properly values for org_staffunit.captions. Can be call from scheduler
 *
 */
me.updatePendingStaffUnitCaptions = function () {
    var
        sDate,
        eDate,
        staffUnitID,
        now = new Date(),
        pendingStoreName = me.entity.name + '_pending',
        pendingStore,
        updatedStaffUnitIDs = [];
    console.log('********************************** updatePendingStaffUnitCaptions startted');
    pendingStore = UB.Repository(pendingStoreName).
        attrs(['ID', 'startDate', 'endDate', 'emponstaffID', 'emponstaffID.staffUnitID']).
        orderBy('endDate').
        select();

    App.dbCommit();
    while (!pendingStore.eof) {
        sDate = new Date(pendingStore.get('startDate'));
        eDate = new Date(pendingStore.get('endDate'));
        staffUnitID = pendingStore.get('emponstaffID.staffUnitID');
        try {
            if ((sDate <= now || eDate <= now) && 
                updatedStaffUnitIDs.indexOf(staffUnitID) === -1) {
                updatedStaffUnitIDs.push(staffUnitID);
                me.updatestaffunitcaption(staffUnitID);
            }
        } catch (err) {
            App.dbRollback();
            console.error(err);
        }
        if (sDate <= now && (eDate < now || eDate.getFullYear() > 5000)) {
            (new TubDataStore(pendingStoreName)).run('delete', {
                    fieldList: [],
                    execParams: {ID: pendingStore.get('ID')},
                    __skipOptimisticLock: true
                }
            );
        }
        App.dbCommit();
        pendingStore.next();
    }
    console.log('********************************** updatePendingStaffUnitCaptions ended');
};


me.checkActual = function (ctxt) {
    var
        params = ctxt.mParams,
        execParams = params.execParams,
        sDate = execParams.mi_dateFrom,
        eDate = execParams.mi_dateTo,
        currentRow,
        pendingRow,
        pendingStore = new TubDataStore(me.entity.name + '_pending'),
        now = new Date();
    if (!sDate && !eDate) {
        return false;
    }
    if (!sDate || !eDate) {
        currentRow = UB.Repository(me.entity.name).
            attrs(['mi_dateFrom', 'mi_dateTo']).
            where('ID', '=', execParams.ID).
            misc({__mip_recordhistory_all: true}).
            select();
        sDate = sDate || currentRow.get('mi_dateFrom');
        eDate = eDate || currentRow.get('mi_dateTo');
    }
    if (sDate > now || (eDate && (new Date(eDate).getFullYear() < 3000))) {
        pendingRow = UB.Repository(me.entity.name + '_pending').
            attrs(['ID', 'startDate', 'endDate']).
            where('emponstaffID', '=', execParams.ID).
            select();
        if (!pendingRow.rowCount) {
            pendingStore.run('insert', {
                    fieldList: [],
                    execParams: {
                        ID: pendingStore.generateID(),
                        emponstaffID: execParams.ID,
                        startDate: sDate,
                        endDate: eDate
                    },
                    __skipOptimisticLock: true
                }
            );
        } else if (sDate != pendingRow.get('startDate') || eDate != pendingRow.get('endDate')) {
            pendingStore.run('update', {
                    fieldList: [],
                    execParams: {
                        ID: pendingRow.get('ID'),
                        emponstaffID: execParams.ID,
                        startDate: sDate,
                        endDate: eDate
                    },
                    __skipOptimisticLock: true
                }
            );
        }
    }

};

me.beforeupdate = function (ctxt) {
    me.assignCaptions(ctxt);
};

/**
 * Updates all  multilingual captions for org_staffunit
 * @param {ubMethodParams} ctxt
 */

me.afterupdate = function (ctxt) {
    var
        oldValues,
        params = ctxt.mParams,
        execParams = params.execParams,
        staffUnitID = execParams.staffUnitID;
    me.checkActual(ctxt);
    if (params.caller != 'org_staffunit') {
        oldValues = svc.getOldValues(ctxt);
        if (staffUnitID) {
            me.updatestaffunitcaption(staffUnitID);
        }
        if (staffUnitID != oldValues.staffUnitID) {
            me.updatestaffunitcaption(oldValues.staffUnitID);
        }
    }
};


/**
 * Updates all  multilingual captions for org_staffunit
 * @param {ubMethodParams} ctxt
 */

me.afterdelete = function (ctxt) {
    var
        oldValues = svc.getOldValues(ctxt);
    me.updatestaffunitcaption(oldValues.staffUnitID);
};


/**
 * Updates all  multilingual captions for org_staffunit
 * @param {ubMethodParams} ctxt
 */

me.afterinsert = function (ctxt) {
    me.checkActual(ctxt);
    me.updatestaffunitcaption(ctxt.mParams.execParams.staffUnitID);
};

/**
 * @param {ubMethodParams} ctxt
 */

me.addnew = function (ctxt) {
    var
        params = ctxt.mParams;
    if (!params.execParams) {
        params.execParams = {};
    }
    params.execParams.employeeOnStaffType = 'PERMANENT';
};

//PERMANENT

/**
 * @param {ubMethodParams} ctxt
 */

me.beforeinsert = function (ctxt) {
    me.assignCaptions(ctxt);
};

/**
 * @param {ubMethodParams} ctxt
 * Assigns properly values for all multilingual captions to execParams before insert or update
 */
me.assignCaptions = function (ctxt) {
    var
        params = ctxt.mParams,
        execParams = params.execParams,
        staffUnitID = execParams.staffUnitID,
        tabNo = execParams.tabNo,
        employeeID = execParams.employeeID,
        employeeOnStaffType = execParams.employeeOnStaffType,
        sLang = svc.getSupportLang(ctxt),
        depFieldList = [],
        empFieldList = [],
        eosTypeFieldList = [],
        employeeInfo,
        depInfo,
        eosTypeInfo,
        currentRow;
    if (!tabNo || !staffUnitID || !employeeID || !employeeOnStaffType) {
        currentRow = UB.Repository(me.entity.name).
            attrs(['tabNo', 'staffUnitID', 'employeeID', 'employeeOnStaffType']).
            where('[ID]', '=', execParams.ID).
            select();
        if (!currentRow.rowCount) {
            return;
        }
        employeeID = employeeID || currentRow.get('employeeID');
        tabNo = tabNo || currentRow.get('tabNo');
        staffUnitID = staffUnitID || currentRow.get('staffUnitID');
        employeeOnStaffType = employeeOnStaffType || currentRow.get('employeeOnStaffType');
    }
    sLang.forEach(function (lang) {
        var suffix = '_' + lang + '^';
        eosTypeFieldList.push('name' + suffix);
        depFieldList.push('parentID.caption' + suffix);
        empFieldList.push('shortFIO' + suffix);
        empFieldList.push('lastName' + suffix);
    });
    if (employeeOnStaffType !== 'PERMANENT') {
        eosTypeInfo = UB.Repository('ubm_enum').
            attrs(eosTypeFieldList).
            where('eGroup', '=', 'CDN_EMPLOYEEONSTAFFTYPE').
            where('code', '=', employeeOnStaffType).
            limit(1).
            select();
    }
    ;
    depInfo = UB.Repository('org_staffunit').
        attrs(depFieldList).
        where('[ID]', '=', staffUnitID).
        select();
    employeeInfo = UB.Repository('org_employee').
        attrs(empFieldList).
        where('[ID]', '=', employeeID).
        select();
    sLang.forEach(function (lang) {
        var
            suffix = '_' + lang + '^',
            empName = employeeInfo.get('shortFIO' + suffix),
            depName = depInfo.get('parentID.caption' + suffix),
            eosType = '';
        if (eosTypeInfo && eosTypeInfo.rowCount) {
            eosType = ' - (' + eosTypeInfo.get('name' + suffix) + ')'
        }
        execParams['caption' + suffix] = empName + ' (' + tabNo + ',' + depName + ')' + eosType;
    });
};