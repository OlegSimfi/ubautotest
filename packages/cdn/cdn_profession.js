/*
 * User: banyai
 * Date: 20.09.13
 * Time: 9:43
 * To change this template use File | Settings | File Templates.
 */
var me = cdn_profession,
    svc = require('@unitybase/ubs/modules/service').Service;
me.entity.addMethod('beforeinsert');

me.beforeinsert = function(ctxt) {
    svc.setCode(ctxt, '----', 12);
};

