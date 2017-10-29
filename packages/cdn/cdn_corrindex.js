var me = cdn_corrindex;

me.entity.addMethod('afterupdate');

/**
 * @param {ubMethodParams} ctxt
 * @return {Boolean}
 */
me.afterupdate = function (ctxt) {
    var
        organizatonData,
        params = ctxt.mParams,
        execParams = params.execParams,
        updParams = {},
        eosEntityName = 'cdn_organization';
    if (params.caller != eosEntityName) {
        organizatonData = UB.Repository(eosEntityName).
            attrs(['ID']).
            where('[corrIndexID]', '=', execParams.ID).
            select();
        if (organizatonData.rowCount !== 0) {
            updParams['caption_'+ App.defaultLang + '^'] = '';
            while(!organizatonData.eof) {
                var
                    inst = new TubDataStore(eosEntityName);
                updParams.ID = organizatonData.get(0);
                inst.run('update', {
                        fieldList: [],
                        caller: me.entity.name,
                        execParams: updParams,
                        __skipOptimisticLock: true
                    }
                );
                organizatonData.next();
            }
        }
    }
    return true;
};