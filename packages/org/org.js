var ORG = UB.ns('ORG');

ORG.checkOrgUnitRequired = true;

const UBA_COMMON = require('@unitybase/uba/modules/uba_common');

/**
 * for a superuser (user with id = 10) nothing happens here
 * Session 'login' event occurred every time new user logged in
 * here we calculate logged-in user FullName from org structure,
 * and array of org_unit IDs current user participate
 * this array used in org structure-based RLS
 * result we put in Session.uData - ony one session-depended server object
 */
ORG.onUserLogin = function () {
    console.debug('Call JS method: ORG.onUserLogin');
    var
        data = Session.uData,
        eInst = null,
        orgUnitTypes, myOU,
        orgUnitIDs = [],
        tmpArr = [],
        lastError = '';
    //Initializing with empty values
    data.staffUnitID = '';
    data.employeeOnStaffID = '';
    data.parentID = '';
    data.parentUnityEntity = '';
    data.orgUnitIDs = '';
    data.tempStaffUnitIDs = '';
    data.tempEmployeeOnStaffIDs = '';
    data.assistantStaffUnitIDs = '';
    data.assistantEmployeeOnStaffIDs = '';
    data.allStaffUnitIDs = '';
    data.allEmployeeOnStaffIDs = '';
    data.tempPositions = '';
    data.allPositions = '';

    if (Session.userID === UBA_COMMON.USERS.ADMIN.ID) return;

    try {
        eInst = UB.Repository('org_employeeonstaff')
            .attrs(["ID", "employeeOnStaffType", "description", "employeeID.userID", "employeeID.shortFIO", "employeeID.fullFIO", "staffUnitID.ID.mi_treePath",
                "staffUnitID.parentID", "staffUnitID.parentID.mi_unityEntity", "staffUnitID", "staffUnitID.fullName", "staffUnitID.name", "employeeID"])
            .where('[employeeID.userID]', '=', Session.userID)
            .select();
    } catch (ex) {
        // this possible if we connect to empty database without org_* tables
        lastError = ex.toString();
        console.error('error getting org_employee', lastError);
    }

    if (!eInst || eInst.eof) {
        if (ORG.checkOrgUnitRequired && !(/\b1\b/.test(Session.userRoles))) { // allow anonymous login only for member of admin group (groupID = 1)
            throw '<<<UserWithoutOrgEmployeeNotAllowed>>>. ' + lastError;
        } else {
            data.employeeShortFIO = '';
            data['orgUnitIDs'] = '';
            data.staffUnitID = -1;
            data.employeeID = -1;
        }
    } else {
        var permStaffUnitIDsArray = [],
            tempStaffUnitIDsArray = [],
            tempEmployeeOnStaffIDsArray = [],
            tempPositionsArray = [],
            assistantStaffUnitIDsArray = [],
            assistantEmployeeOnStaffIDsArray = [],
            assistantPositionsArray = [],
            staffUnitID = null,
            employeeOnStaffID = null,
            parentID = null,
            parentUnityEntity = null,
            employeeOnStaffType = '',
            permanentOrgUnitIDs = [],
            currPositionObj, currStaffUnitID, currEmployeeOnStaffID;

        data.employeeShortFIO = eInst.get('employeeID.shortFIO');
        data.employeeFullFIO = eInst.get('employeeID.fullFIO');

        data.employeeID = eInst.get('employeeID');
        while (!eInst.eof) {
            // treePath is something like this: "/2100002161511/2100002322780/" remove empty ""
            tmpArr = _.without(eInst.get('staffUnitID.ID.mi_treePath').split('/'), '');
            // drop STAFF type org units from orgUnitIDs array (see [UB-1571] for details)
            myOU = tmpArr.pop(); // last entry in treePath is my staff, so memorise it
            // select orgUnit types
            orgUnitTypes = UB.Repository('org_unit').attrs(['ID', 'unitType']).where('ID', 'in', tmpArr).selectAsObject();
            tmpArr = [];
            orgUnitTypes.forEach(function(unit){
                if (unit.unitType !== 'STAFF') {
                    tmpArr.push(unit.ID);
                }
            });
            tmpArr.push(myOU);

            orgUnitIDs = _.union(orgUnitIDs, tmpArr);
            employeeOnStaffType = eInst.get('employeeOnStaffType');
            console.debug('employeeOnStaffType: ', employeeOnStaffType);

            switch (employeeOnStaffType) {
                case 'PERMANENT':
                    staffUnitID = eInst.get('staffUnitID'); //permanentStaffUnit
                    employeeOnStaffID = eInst.get('ID'); //permanent employeeOnStaff
                    parentID = eInst.get('staffUnitID.parentID');
                    parentUnityEntity = eInst.get('staffUnitID.parentID.mi_unityEntity');
                    permStaffUnitIDsArray.push(staffUnitID);
                    data.staffUnitFullName = eInst.get('staffUnitID.fullName');
                    data.staffUnitName = eInst.get('staffUnitID.name');
                    permanentOrgUnitIDs = tmpArr;
                    break;
                case 'TEMPORARY':
                    currPositionObj = {};
                    currStaffUnitID = eInst.get('staffUnitID');
                    currEmployeeOnStaffID = eInst.get('ID');
                    tempStaffUnitIDsArray.push(currStaffUnitID);
                    tempEmployeeOnStaffIDsArray.push(currEmployeeOnStaffID);
                    currPositionObj.staffUnitID = eInst.get('staffUnitID');
                    currPositionObj.employeeOnStaffID = eInst.get('ID');
                    currPositionObj.staffUnitFullName = eInst.get('staffUnitID.fullName');
                    currPositionObj.staffUnitName = eInst.get('staffUnitID.name');
                    currPositionObj.employeeOnStaffDescription = eInst.get('description');
                    tempPositionsArray.push(currPositionObj);
                    break;
                case 'ASSISTANT':
                    currPositionObj = {};
                    currStaffUnitID = eInst.get('staffUnitID');
                    currEmployeeOnStaffID = eInst.get('ID');
                    assistantStaffUnitIDsArray.push(currStaffUnitID);
                    assistantEmployeeOnStaffIDsArray.push(currEmployeeOnStaffID);
                    currPositionObj.staffUnitID = eInst.get('staffUnitID');
                    currPositionObj.employeeOnStaffID = eInst.get('ID');
                    currPositionObj.staffUnitFullName = eInst.get('staffUnitID.fullName');
                    currPositionObj.staffUnitName = eInst.get('staffUnitID.name');
                    currPositionObj.employeeOnStaffDescription = eInst.get('description');
                    assistantPositionsArray.push(currPositionObj);
                    break;
            }
            eInst.next();
        }

        console.debug('permStaffUnitIDsArray:', permStaffUnitIDsArray);
        console.debug('tempStaffUnitIDsArray:', tempStaffUnitIDsArray);
        console.debug('assistantStaffUnitIDsArray:', assistantStaffUnitIDsArray);
        if (permStaffUnitIDsArray.length > 1) {
            throw new Error(UB.i18n('errUserWithMultiplePermanentStaffUnitsNotAllowed'));
        }
        data.staffUnitID = staffUnitID; //permanent staffUnitID
        data.employeeOnStaffID = employeeOnStaffID; //permanent employeeOnStaffID
        data.parentID = parentID; //permanent staffUnitID parent
        data.parentUnityEntity = parentUnityEntity; //permanent staffUnitID parent entity type
        data['orgUnitIDs'] = orgUnitIDs.join(','); //all orgUnit's chain
        data['permanentOrgUnitIDs'] = permanentOrgUnitIDs.join(','); //user orgUnit's chain by permanent employeeOnStaffIDs
        data.tempStaffUnitIDs = tempStaffUnitIDsArray.join(','); //array of temporary staffUnitIDs
        data.tempEmployeeOnStaffIDs = tempEmployeeOnStaffIDsArray.join(','); //array of temporary employeeOnStaffIDs
        data.assistantStaffUnitIDs = assistantStaffUnitIDsArray.join(','); //array of assistant staffUnitIDs
        data.assistantEmployeeOnStaffIDs = assistantEmployeeOnStaffIDsArray.join(','); //array of assistant employeeOnStaffIDs
        tempStaffUnitIDsArray = _.union(tempStaffUnitIDsArray, assistantStaffUnitIDsArray);
        tempStaffUnitIDsArray.push(staffUnitID);
        tempEmployeeOnStaffIDsArray = _.union(tempEmployeeOnStaffIDsArray, assistantEmployeeOnStaffIDsArray);
        data.allStaffUnitIDs = tempStaffUnitIDsArray.join(','); //array of all (permanent + temporary + assistant) staffUnitIDs
        tempEmployeeOnStaffIDsArray.push(employeeOnStaffID);
        data.allEmployeeOnStaffIDs = tempEmployeeOnStaffIDsArray.join(','); //array of all (permanent + temporary + assistant) employeeOnStaffIds
        data.tempPositions = JSON.stringify(tempPositionsArray); //stringifying array ob temporary position objects: {staffUnitID, employeeOnStaffID}
        data.assistantPositions = JSON.stringify(assistantPositionsArray); //stringifying array ob assistant position objects: {staffUnitID, employeeOnStaffID}
        tempPositionsArray = _.union(tempPositionsArray, assistantPositionsArray);
        tempPositionsArray.push({staffUnitID: staffUnitID, employeeOnStaffID: employeeOnStaffID});
        data.allPositions = JSON.stringify(tempPositionsArray); //stringifying array of permanent + temporary + assistant position objects: {staffUnitID, employeeOnStaffID}
    }
};
Session.on('login', ORG.onUserLogin);