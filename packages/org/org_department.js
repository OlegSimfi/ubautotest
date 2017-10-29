var me = org_department,
    svc = require('@unitybase/ubs/modules/service').Service;
me.entity.addMethod('afterbeforeupdate');
me.entity.addMethod('beforeinsert');
me.entity.addMethod('addnew');

me.setCaption = function (ctxt, mode) {
    var execParams = ctxt.mParams.execParams,
        defaultSuffix = '_'+App.defaultLang+'^',
        sLang = svc.getSupportLang(ctxt);
    if (mode === 'INS') {
        sLang.forEach(function (lang) {
            var suffix = '_' + lang + '^';
            if (execParams['name' + suffix]) {
	      execParams['caption' + suffix] = execParams.code + ' - ' + execParams['name' + suffix];
	    } else {
	      execParams['caption' + suffix] = execParams.code + ' - ' + execParams['name'];
   	    }
        });
    } else if (mode === 'UPD') {
        var fieldList = ['code'];
        sLang.forEach(function (lang) {
            fieldList.push('name'+'_' + lang + '^');
        });
        if (execParams.name) {      // Here is the standard values for all "name" attributes ( "name_uk^" instead of "name", etc)
            execParams['name'+defaultSuffix] = execParams.name;
            delete execParams.name;
        }
        var inst = UB.Repository('org_department')
            .attrs(fieldList)
            .where('ID', '=', execParams.ID)
            .misc({__allowSelectSafeDeleted: true})
            .misc({__mip_recordhistory_all: true})
            .selectAsObject();
        sLang.forEach(function (lang) {
            var suffix = '_' + lang + '^';
            var name = execParams['name'+ suffix] || inst[0]['name'+suffix];
            var code = execParams.code || inst[0].code;
            execParams['caption'+suffix] = code + ' - ' + name;
        });
    }
    delete execParams.caption;
    return true;
};

me.afterbeforeupdate = function (ctxt) {
    return  me.setCaption(ctxt, 'UPD');
};

me.beforeinsert = function (ctxt) {
    svc.setCode(ctxt, '----', 12);
    return me.setCaption(ctxt, 'INS');
};

me.addnew = function (ctxt) {
    svc.setassociatedEntityValueByCode(ctxt, 'depTypeID', '02');
};