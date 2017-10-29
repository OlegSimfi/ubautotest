var me = org_organization,
    svc = require('@unitybase/ubs/modules/service').Service;

me.entity.addMethod('beforeupdate');
me.entity.addMethod('beforeinsert');
me.entity.addMethod('addnew');

me.checkCode = function(ctxt) {
    var
        mParams = ctxt.mParams,
        execParams = mParams.execParams;

    if (!execParams.OKPOCode) {
        throw new Error('<<<Не вказаний код ЄДРПОУ >>>');
    }
    /*
    //TODO: а нужно ли это сдесь? (внутренний код может отличатся от OKPOCode)
    execParams.code = execParams.OKPOCode;
    */
    if (ctxt.mParams.execParams._noValid) {
        //Позволяем добавлять запись без валидации OKPOCode, используется для импорта
        delete ctxt.mParams.execParams._noValid;
        return true;
    }
    if (!/^[0-9]+$/.test(execParams.OKPOCode) || (execParams.OKPOCode.length !== 8 && execParams.OKPOCode.length !== 10)) {
        throw new Error('<<<Код ЄДРПОУ повинен містити тільки 8 або 10 цифр>>>');
    }
};

me.beforeinsert = function(ctxt) {

    me.checkCode(ctxt);
    return true;
};

me.beforeupdate = function(ctxt) {
    if (ctxt.mParams.execParams.OKPOCode) {
        me.checkCode(ctxt);
    }
    return true;
};


me.addnew = function(ctxt) {
    svc.setassociatedEntityValueByCode(ctxt, 'orgBusinessTypeID','03' );
    svc.setassociatedEntityValueByCode(ctxt, 'orgOwnershipTypeID','01' );
};