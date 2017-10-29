var me  = org_profession,
    svc = require('@unitybase/ubs/modules/service').Service;

me.entity.addMethod('beforeinsert');

me.beforeinsert = function(ctxt) {
    svc.setCode(ctxt, '----',12);
    return true;
};

