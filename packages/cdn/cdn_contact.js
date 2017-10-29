/**
 * Created by pavel.mash on 28.10.2014.
 */
"use strict";
var
    cachedTypes = {},
    me = cdn_contact;

/**
 * Search for subjects contact values.
 * @param {Number|Array.<number>} subjects Either subject ID or array of subject IDs to search
 * @param {String} contactCode Contact type code ('phone', 'email', e.t.c - one of cdn_contacttype.code value
 * @returns {Array.<string>}
 */
function getSubjectsContacts(subjects, contactCode){
    var
        store, repo,
        result = [],
        typeID = cdn_contacttype.getContactTypeByCode(contactCode);
    if (!typeID || (Array.isArray(subjects) && !subjects.length) || !subjects) return result;
    repo = UB.Repository(me.entity.name).attrs('value').where('contactTypeID', '=', typeID);
    if (Array.isArray(subjects)){
        repo.where('subjectID', 'in', subjects)
    } else {
        repo.where('subjectID', '=', subjects)
    }
    store = repo.selectAsArray();
    return _.flatten(store.resultData.data);
}
me.getSubjectsContacts = getSubjectsContacts;
