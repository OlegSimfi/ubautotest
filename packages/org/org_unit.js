var
    me = org_unit;
me.entity.addMethod('afterupdate');

function checkTree(ID, parentID){
    if (!parentID) { return true};
    var store;
    store = UB.Repository('org_unit').
        attrs(['ID', 'parentID', 'mi_treePath']).
        where('[parentID]', '=', parentID).
        select();
    if (store.rowCount > 0 || ((store.get('mi_treePath') || '').indexOf(ID) > 0) ){
       var pList = (store.get('mi_treePath') || '').split('/');
       if (pList.indexOf(ID.toString()) >= 0 ){
           throw new Error('<<<orgTreeCanNotBeCyclical>>>');
       }
    }
}

me.on('update:before', function(ctxt){
    if (ctxt.mParams.execParams.parentID){
        checkTree(ctxt.mParams.execParams.ID, ctxt.mParams.execParams.parentID);
    }
});

me.on('insert:before', function(ctxt){
        checkTree(ctxt.mParams.execParams.ID, ctxt.mParams.execParams.parentID);
});

/**
 * @param {ubMethodParams} ctxt
*/
me.afterupdate = function(ctxt) {
    me.updatestaffunitcaption(ctxt);
};

/**
 * @param {ubMethodParams} ctxt
 */
me.updatestaffunitcaption = function(ctxt) {
	var
        execParams = ctxt.mParams.execParams,
        needUpdateStaffUnit = false,
        updParams = {},
        staffUnits,
        staffUnit,
        staffUnitEntityName = 'org_staffunit';
    _.forEach(execParams, function(value, attr){
        if (attr.indexOf('caption') === 0) {
            needUpdateStaffUnit = true;
        }
    });
    if (!needUpdateStaffUnit) {
        return;
    }
    updParams['caption_'+App.defaultLang+'^'] = '';
    staffUnits = UB.Repository(staffUnitEntityName).
        attrs('[ID]').
        where('parentID', '=', execParams.ID).
        select();
    while (!staffUnits.eof) {
        updParams.ID = staffUnits.get(0);
        staffUnit = new TubDataStore(staffUnitEntityName);
        staffUnit.run('update',{
            fieldList: [],
            caller: me.entity.name,
            execParams: updParams,
            __skipOptimisticLock: true
        });
        staffUnits.next();
    }
};