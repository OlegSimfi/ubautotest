var svc = require('@unitybase/ubs/modules/service').Service,
    me = cdn_organization;

me.entity.addMethod('beforeupdate');
me.entity.addMethod('beforeinsert');

/**
 * Split string using separator and trim each result word
 * @param {String} string2Split
 * @param {String} separator
 * @returns {Array}
 */
function splitStringWithTrim(string2Split, separator) {
    var array = string2Split.split(separator);
    for (var i = 0, l = array.length; i < l; ++i) {
        array[i] = array[i].trim();
    }
    return array;
}

/**
 *
 * @param {ubMethodParams} ctxt
 * @returns {boolean}
 */
function checkCode(ctxt) {
    var
        mParams = ctxt.mParams,
        execParams = mParams.execParams;

    if (!execParams.OKPOCode) {
        var allowAutoGenerateOKPO = ubs_settings.getSettingValue('cdn.organization.allowAutoGenerateOKPO');
        if (allowAutoGenerateOKPO === null || allowAutoGenerateOKPO === '') { //if setting is not present or it is empty
            throw new Error(UB.i18n('errNotExsistsOKPO'));
        } else {
            if (allowAutoGenerateOKPO) {
                execParams.OKPOCode = 'A' + ubs_numcounter.getRegnum(mParams.entity, 1000000);
            } else {
                throw new Error(UB.i18n('errNotExsistsOKPO'));
            }
        }
    }

    if (execParams.OKPOCode.length !== 8 && execParams.OKPOCode.length !== 10) {
        throw new Error(UB.i18n('errMustContainsOnly8Or10Symbols'));
    }
    execParams.code = execParams.OKPOCode;
}

/**
 *
 * @param {ubMethodParams} ctxt
 * @returns {boolean}
 */
function checkAccessAddGovByRoles(ctxt) {
    var ID = ctxt.mParams.execParams.orgBusinessTypeID;
    var dataStore = UB.Repository('cdn_orgbusinesstype')
        .attrs(['isGovAuthority'])
        .where('[ID]', '=', ID)
        .select();
    var isGovAuthority = dataStore.get('isGovAuthority');
    if (isGovAuthority) {
        var accessAddGovByRoles = ubs_settings.getSettingValue('cdn.organization.accessAddGovByRoles');
        if (accessAddGovByRoles === null || accessAddGovByRoles === '') { //if setting is not present or it is empty
            return true;
        } else {
            try {
                var accessRoles = splitStringWithTrim(accessAddGovByRoles, ',');
                var currentUserRoles = splitStringWithTrim(Session.uData.roles, ',');
                var rolesIntersection = _.intersection(accessRoles, currentUserRoles);
            } catch (o) {
                throw new Error(UB.i18n('errUnableToPerformThisOperation'));
            }

            if (rolesIntersection.length > 0) {
                return true;
            } else {
                throw new Error(UB.i18n('errNoRightsForInsUpdateGovOrg'));
            }
        }
    } else {
        return true;
    }
}

/**
 *
 * @param {ubMethodParams} ctxt
 * @returns {boolean}
 */
me.beforeinsert = function (ctxt) {
    if (ctxt.mParams.execParams.orgBusinessTypeID) {
        checkAccessAddGovByRoles(ctxt);
    }
    checkCode(ctxt);
    me.updateOrganizationCaption(ctxt);
    return true;
};

/**
 *
 * @param {ubMethodParams} ctxt
 * @returns {boolean}
 */
me.beforeupdate = function (ctxt) {
    var mParams = ctxt.mParams;
    if (typeof mParams.execParams.OKPOCode !== 'undefined') {
        checkCode(ctxt);
    }
    if (mParams.execParams.orgBusinessTypeID) {
        checkAccessAddGovByRoles(ctxt);
    }
    me.updateOrganizationCaption(ctxt);
    return true;
};


/**
 * Updates all multilingual captions for cdn_organization
 * @param {ubMethodParams} ctxt
 */

me.updateOrganizationCaption = function (ctxt) {

    var execParams = ctxt.mParams.execParams,
        organizationID = execParams.ID,
        orgName = '',
        corrIndexID,
        corrIndexCode = '',
        dataStore,
        defaultSuffix = '_' + App.defaultLang + '^',
        sLang = svc.getSupportLang(ctxt),
        suffix,
        needLoadStaffUnitRow = false,
        orgFields = ['corrIndexID'];

    if (execParams.name) {      // Here is the standard values for all "name" attributes ( "name_uk^" instead of "name", etc)
        execParams['name' + defaultSuffix] = execParams.name;
        delete execParams.name;
    }
    sLang.forEach(function(lang){
        suffix = '_' + lang + '^';
        orgFields.push('name' + suffix);
        if (!execParams['name' + suffix]) {
            if (svc.inserting(ctxt)) {
                execParams['name' + suffix] = execParams['name' + defaultSuffix];
            } else {
                needLoadStaffUnitRow = true;
            }
        }
    });

    dataStore = UB.Repository(me.entity.name).
        attrs(orgFields).
        where('[ID]', '=', organizationID).
        select();
    corrIndexID = execParams.corrIndexID ? execParams.corrIndexID : dataStore.get('corrIndexID');

    if (corrIndexID) {
        corrIndexCode = UB.Repository('cdn_corrindex')
            .attrs(['ID', 'code'])
            .where('[ID]', '=', corrIndexID)
            .select()
            .get('code');
    }

    corrIndexCode = corrIndexCode ? corrIndexCode + ' ' : '';

    sLang.forEach(function(lang){
        suffix = '_' + lang + '^';
        orgName = execParams['name' + suffix] || dataStore.get('name' + suffix);

        execParams['caption' + suffix] = corrIndexCode + orgName;
    });
    delete execParams.caption;

};