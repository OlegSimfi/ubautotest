const
    _ = require('lodash'),
    assert = require('assert'),
    ok = assert.ok,
    fs = require('fs'),
    argv = require('@unitybase/base').argv;

var
    session, conn,
    i18nData = {
        "en": {
            notAssigned: 'Not assigned'
        },
        'ru': {
            notAssigned: 'Не назначено'
        },
        'uk': {
            notAssigned: 'Не призначено'
        },
        'az': {
            notAssigned: 'Təyin edilməyib'
        }
    };

session = argv.establishConnectionFromCmdLineAttributes();
conn = session.connection;

var appInfo = conn.getAppInfo();

try {
    console.debug('Start ORG model test');
    testORG();
} finally {
    conn.logout();
}



function testORG(){
    "use strict";
    var
        empID = conn.lookup('org_employee', 'ID', {expression: 'code', condition: 'equal', values: {code: '12356456'}});
    if(!empID) {
        empID = conn.insert({
            entity: 'org_employee',
            fieldList: ['ID'],
            execParams: {
                code: '12356456',
                lastName: 'Чупакабров',
                firstName: 'Чупакабр',
                middleName: 'Чупакабрович',
                shortFIO: 'Чупакабров Ч.Ч.',
                fullFIO: 'Чупакабров Чупакабр Чупакабрович',
                sexType: 'M',
                birthDate: new Date('1963-11-26')
            }
        });
    }
    ok(empID, 'can`t insert employee Чупакабров');

    var orgUnitID = conn.lookup('org_organization', 'ID', {expression: 'code', condition: 'equal', values: {code: '6789012345'}});
    if (!orgUnitID) {
        orgUnitID = conn.insert({
            entity: 'org_organization',
            fieldList: ['ID'],
            execParams: {
                code: '6789012345',
                parentID: null,
                OKPOCode: '6789012345',
                name: 'Тестова організація',
                fullName: 'Тестова організація'
            }
        });
    }
    ok(orgUnitID, 'can`t insert Тестова організація');

    var professionID = conn.lookup('org_profession', 'ID', {expression: 'code', condition: 'equal', values: {code: '7878'}});
    if (!professionID) {
        professionID = conn.insert({
            entity: 'org_profession',
            fieldList: ['ID'],
            execParams: {
                code: '7878',
                name: 'Тестова професія',
                fullName: 'Тестова професія'
            }
        });
    }
    ok(professionID, 'can`t insert profession Тестова професія');

    var staffUnitTypeID = conn.lookup('cdn_staffunittype', 'ID', {expression: 'code', condition: 'equal', values: {code: '01'}});
    if (!staffUnitTypeID) {
        staffUnitTypeID = conn.insert({
            entity: 'cdn_staffunittype',
            fieldList: ['ID'],
            execParams: {
                code: '01',
                name: 'Постійна'
            }
        });
    }
    ok(staffUnitTypeID, 'can`t insert staffUnitType Постійна');

    var staffUnitID = conn.lookup('org_staffunit', 'ID', {expression: 'code', condition: 'equal', values: {code: '797979'}});
    if (!staffUnitID) {
        staffUnitID = conn.insert({
            entity: 'org_staffunit',
            fieldList: ['ID'],
            execParams: {
                parentID: orgUnitID,
                code: '797979',
                name: 'Тестова штатна одиниця',
                fullName: 'Тестова штатна одиниця',
                professionID: professionID,
                staffUnitTypeID : staffUnitTypeID
            }
        });
    }
    ok(staffUnitTypeID, 'can`t insert staff Unit record');
    var empOnStaffID = conn.insert({
        entity: 'org_employeeonstaff',
        fieldList: ['ID'],
        execParams: {
            tabNo: '1',
            employeeID: empID,
            staffUnitID: staffUnitID,
            employeeOnStaffType: 'PERMANENT'
        }
    });

    ok(empOnStaffID, 'can`t assign  staff unit record to org_employeeonstaff');

    checkCaption('org_staffunit', staffUnitID);

    empID = conn.lookup('org_employee', 'ID', {expression: 'code', condition: 'equal', values: {code: '888888'}});
    if(!empID) {
        empID = conn.insert({
            entity: 'org_employee',
            fieldList: ['ID'],
            execParams: {
                code: '888888',
                userID: null,
                "lastName_uk^": 'Лопухов',
                "lastName_en^": 'Lopukhov',
                firstName: 'Семен',
                middleName: 'Семенович',
                shortFIO: 'Лопухов C.C.',
                fullFIO: 'Лопухов Семен Семенович',
                sexType: 'M',
                birthDate: new Date('1952-11-26')
            }
        });
    }
    ok(empID, 'can`t insert employee Лопухов');
    empOnStaffID = conn.insert({
        entity: 'org_employeeonstaff',
        fieldList: ['ID'],
        execParams: {
            tabNo: '2',
            employeeID: empID,
            staffUnitID: staffUnitID,
            employeeOnStaffType: 'PERMANENT'
        }
    });
    ok(empOnStaffID, 'can`t assign  staff unit record to org_employeeonstaff');

    //MPV - TEMPORARY return here
    //TODO - rewrite using HARDCODED expected values!!!!!!
    return;

    checkCaption('org_staffunit', staffUnitID);
    checkCaption('org_employeeonstaff', empOnStaffID);


    empID = conn.lookup('org_employee', 'ID', {expression: 'code', condition: 'equal', values: {code: '888888'}});
    var
        empl = conn.Repository('org_employee')
            .attrs(["shortFIO_uk^"])
            .selectById(empID),
        updParams = {ID: empID};
    if (empl["shortFIO_uk^"] == 'Приблудкин П.П.') {
        updParams["lastName_uk^"] = 'Чувырленко';
        updParams["firstName_uk^"] = 'Чезаре';
        updParams["middleName_uk^"] = 'Чезаревич';
        updParams["shortFIO_uk^"] = 'Чувырленко Ч.Ч.';

        updParams["lastName_en^"] = 'Chuvirlenko';
        updParams["firstName_en^"] = 'Chezare';
        updParams["middleName_en^"] = 'Chezarevich';
        updParams["shortFIO_en^"] = 'Chuvirlenko Ch.Ch.';
    } else {
        updParams["lastName_uk^"] = 'Приблудкин';
        updParams["firstName_uk^"] = 'Петро';
        updParams["middleName_uk^"] = 'Петрович';
        updParams["shortFIO_uk^"] = 'Приблудкин П.П.';

        updParams["middleName_en^"] = 'Pedrovich';
        updParams["firstName_en^"] = 'Pedro';
        updParams["lastName_en^"] = 'Pribludkin';
        updParams["shortFIO_en^"] = 'Pribludkin P.P.';
    }
    conn.run({
        entity: 'org_employee',
        method: 'update',
        fieldList: [],
        execParams: updParams,
        __skipOptimisticLock: true
    });
    checkCaption('org_staffunit', staffUnitID);
    checkCaption('org_employeeonstaff', empOnStaffID);

    console.debug('****************** End of ORG model test ************************');

}

function i18n(str, lang) {
    return i18nData[lang][str];
}

function checkCaption(entity, ID) {
    var captionExpected = getCaptionExpected(entity, ID),
        captionActual  = getCaptionActual(entity, ID);
    _.forEach(captionActual, function(caption, attr){
        assert.equal(caption.trim(), captionExpected[attr].trim(),
                'Invalid caption for '+entity+'.'+attr+'(ID='+ID+
                ') Expected: "' + captionExpected[attr].trim() + '", actual: "' + caption.trim() + '"'
        );
    });
}

function getCaptionExpected(entity, ID) {
    if (entity === 'org_staffunit') {
        return  getCaptionForStaffUnitExpected(ID);
    }
    if (entity === 'org_employeeonstaff') {
        return getCaptionForEmpOnStaffExpected(ID)
    }
    throw new Error('getCaptionExpected :  unknown entity - '+entity);
}


function getEmployeeList(staffUnitID, supportLang) {
    var
        staffs,
        staffsFieldList = [],
        result = {},
        lastOnStaff;
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
    staffs = conn.Repository('org_employeeonstaff').
        attrs(staffsFieldList).
        where('[employeeOnStaffType]', '<>', 'ASSISTANT').
        where('[staffUnitID]', '=', staffUnitID).
        select();
    if (!staffs || !staffs.length) {
        return result;
    }
    lastOnStaff = staffs[staffs.length-1];
    supportLang.forEach(function(lang){
        var
            suffix = '_'+lang+'^',
            employeeList = '';
        staffs.forEach(function(item){
            employeeList += (item['employeeID.shortFIO'+suffix]);
            if (item != lastOnStaff) {
                employeeList += ',';
            }
        });
        result[lang] = employeeList;
    });
    return  result;
}


function getCaptionForStaffUnitExpected(ID) {
    var
        sLang = appInfo.supportedLanguages,
        staffUnitFieldList = [],
        rec = null,
        result = {},
        employeeList = {};
    sLang.forEach(function(lang) {
        var
            suffix = '_'+lang+'^';
        staffUnitFieldList.push('name'+suffix);
        staffUnitFieldList.push('parentID.caption'+suffix);
    });

    rec = conn.Repository('org_staffunit').attrs(staffUnitFieldList).selectById(ID);
    employeeList = getEmployeeList(ID, sLang);
    sLang.forEach(function(lang){
        var
            suffix = '_'+lang+'^',
            depName = rec['parentID.caption'+suffix],
            staffUnitName = rec['name'+suffix];

        result['caption'+suffix]  = (employeeList[lang]||i18n('notAssigned', lang))+ ' ('+depName+' '+staffUnitName+')';
    });
    return result;
}


function getCaptionForEmpOnStaffExpected(ID) {
    var
        sLang = appInfo.supportedLanguages,
        depFieldList = [],
        empFieldList = [],
        employeeInfo,
        depInfo,
        currentRow = conn.Repository('org_employeeonstaff')
            .attrs(['tabNo','staffUnitID','employeeID'])
            .selectById(ID),
        result = {},
        {employeeID, tabNo, staffUnitID} = currentRow;

    sLang.forEach(function(lang){
        var
            suffix = '_' + lang + '^';
        depFieldList.push('parentID.caption'+suffix);
        empFieldList.push('shortFIO'+suffix);
        empFieldList.push('lastName'+suffix);
    });
    depInfo = conn.Repository('org_staffunit').attrs(depFieldList).selectById(staffUnitID);
    employeeInfo = conn.Repository('org_employee').attrs(empFieldList).selectById(employeeID);
    sLang.forEach(function(lang) {
        var
            suffix = '_' + lang + '^',
            empName = employeeInfo['shortFIO'+suffix],
            depName = depInfo['parentID.caption'+suffix];
        result['caption'+suffix] = empName +' ('+tabNo +','+depName+')';
    });
    return result;
}


function getCaptionActual(entityName, ID) {
    var
        data = conn.Repository(entityName).where('[ID]', '=', ID),
        sLang = appInfo.supportedLanguages,
        fList = [],
        store;
    sLang.forEach(function(lang){
        fList.push('caption_'+lang+'^');
    });
    store = data.attrs(fList).selectAsObject();
    return (store && store.length) ? store[0] : {};
}

//==========================================================================================
