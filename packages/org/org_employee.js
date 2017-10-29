var
    me = org_employee;

me.entity.addMethod('afterupdate');

/**
 *
 * @param {ubMethodParams} ctxt
 */
me.afterupdate = function(ctxt) {
	this.updatestaffunitcaption(ctxt);
};

/**
 * Raise update for caption of org_employeeonstaff and org_staffunit if needed
 * @param {ubMethodParams} ctxt
 */
me.updatestaffunitcaption = function(ctxt) {
	var
        execParams = ctxt.mParams.execParams,
        staffsForMe,
        staffUnit,
        needUpdate = false,
        updParams = {};

    staffsForMe  = UB.Repository('org_employeeonstaff').
        attrs(['staffUnitID']).
        where('[employeeID]', '=', execParams.ID).
        select();
    if(staffsForMe.rowCount === 0) {
        return;
    }
    _.forEach(execParams, function(value, attr) {
        if (attr.indexOf('shortFIO') !== -1) {
            needUpdate = true;
        }
    });
    if (!needUpdate) {
       return;
    }
    updParams['caption_'+App.defaultLang+'^'] = '';
    while (!staffsForMe.eof) {
        staffUnit = new TubDataStore('org_staffunit');
        updParams.ID = staffsForMe.get(0);
        staffUnit.run('update',{
                fieldList:[],
                caller: me.entity.name,
                execParams: updParams,
                __skipOptimisticLock: true
            }
        );
        staffsForMe.next();
    }

};

/**
 * After link user to employee - log event to uba_audit
 * @param {ubMethodParams} ctx
 */
function ubaAuditLinkUser(ctx){
    "use strict";
    if (!App.domain.byName('uba_audit')){
        return;
    }
    var store, actionUserRepo, linkUser, params = ctx.mParams.execParams;
    if (params.userID){
        store = new TubDataStore('uba_audit');
        actionUserRepo = UB.Repository('uba_user').attrs('name').where('[ID]', '=', Session.userID).select();
        linkUser = UB.Repository('uba_user').attrs('name').where('[ID]', '=', params.userID).select();

        store.run('insert', {
            execParams: {
                entity: 'org_employee',
                entityinfo_id: params.ID,
                actionType: 'INSERT',
                actionUser: actionUserRepo.eof ? Session.userID: actionUserRepo.get('name'),
                actionTime: new Date(),
                remoteIP: Session.callerIP,
                targetUser: linkUser.eof ? params.userID: linkUser.get('name'),
                toValue: JSON.stringify(params)
            }
        });
    }
}
me.on('insert:after', ubaAuditLinkUser);

/**
 * After updating user - log event to uba_audit
 * @param {ubMethodParams} ctx
 */
function ubaAuditLinkUserModify(ctx){
    "use strict";
    if (!App.domain.byName('uba_audit')){
        return;
    }
    var
        params = ctx.mParams.execParams,
        store = new TubDataStore('uba_audit'),
        actionUserRepo,
        origStore = ctx.dataStore,
        origName = origStore.currentDataName,
        oldValues, linkUser;

    try {
        origStore.currentDataName = 'selectBeforeUpdate';
        oldValues = JSON.parse(origStore.asJSONObject);
        oldValues = (typeof(oldValues) === 'object') && (oldValues instanceof Array) && oldValues.length > 0 ? oldValues[0]: oldValues;
    } finally {
        origStore.currentDataName = origName;
    }


    if (params.userID !== oldValues.userID ){
        actionUserRepo = UB.Repository('uba_user').attrs('name').where('[ID]', '=', Session.userID).select();
        if (oldValues.userID){
            linkUser = UB.Repository('uba_user').attrs('name').where('[ID]', '=', oldValues.userID).select();
            store.run('insert', {
                execParams: {
                    entity: 'org_employee',
                    entityinfo_id: params.ID,
                    actionType: 'DELETE',
                    actionUser: actionUserRepo.eof ? Session.userID: actionUserRepo.get('name'),
                    actionTime: new Date(),
                    remoteIP: Session.callerIP,
                    targetUser: linkUser.eof ? oldValues.userID: linkUser.get('name'),
                    fromValue: JSON.stringify(oldValues),
                    toValue: JSON.stringify(params)
                }
            });
        }
        if (params.userID) {
            linkUser = UB.Repository('uba_user').attrs('name').where('[ID]', '=', params.userID).select();
            store.run('insert', {
                execParams: {
                    entity: 'org_employee',
                    entityinfo_id: params.ID,
                    actionType: 'INSERT',
                    actionUser: actionUserRepo.eof ? Session.userID : actionUserRepo.get('name'),
                    actionTime: new Date(),
                    remoteIP: Session.callerIP,
                    targetUser: linkUser.eof ? params.userID: linkUser.get('name'),
                    fromValue: JSON.stringify(oldValues),
                    toValue: JSON.stringify(params)
                }
            });
        }

    }
}
me.on('update:after', ubaAuditLinkUserModify);


/**
 * After deleting user - log event to uba_audit
 * @param {ubMethodParams} ctx
 */
function ubaAuditLinkUserDelete(ctx){
    "use strict";
    if (!App.domain.byName('uba_audit')){
        return;
    }
    var
        params = ctx.mParams.execParams,
        store = new TubDataStore('uba_audit'),
        actionUserRepo,
        origStore = ctx.dataStore,
        origName = origStore.currentDataName,
        oldValues, linkUser;

    try {
        origStore.currentDataName = 'selectBeforeDelete';
        oldValues = JSON.parse(origStore.asJSONObject);
        oldValues = (typeof(oldValues) === 'object') && (oldValues instanceof Array) && oldValues.length > 0 ? oldValues[0]: oldValues;
    } finally {
        origStore.currentDataName = origName;
    }
    if (oldValues.userID) {
        actionUserRepo = UB.Repository('uba_user').attrs('name').where('[ID]', '=', Session.userID).select();
        linkUser = UB.Repository('uba_user').attrs('name').where('[ID]', '=', oldValues.userID).select();
        store.run('insert', {
            execParams: {
                entity: 'uba_user',
                entityinfo_id: params.ID,
                actionType: 'DELETE',
                actionUser: actionUserRepo.eof ? Session.userID : actionUserRepo.get('name'),
                actionTime: new Date(),
                remoteIP: Session.callerIP,
                targetUser: linkUser.eof ? oldValues.userID: linkUser.get('name'),
                fromValue: JSON.stringify(oldValues)
            }
        });
    }
}
me.on('delete:after', ubaAuditLinkUserDelete);
