/**
 * Created by pavel.mash on 28.10.2014.
 */
var
    me = cdn_contacttype,
    ENTITY_NAME = me.entity.name,
    CACHE_KEY = ENTITY_NAME + '_CACHE';

/**
 * Search for contact type ID by code. Use cache for quick lookup. Return 0 in case no such contact type.
 * @param {String} contactCode
 * @returns {Number}
 */
function getContactTypeByCode(contactCode){
    var store;
    var entry = App.globalCacheGet(CACHE_KEY);
    var cachedTypes = entry ? JSON.parse(entry) : {};

    if (!cachedTypes.hasOwnProperty(contactCode)){
        store = UB.Repository(ENTITY_NAME).attrs('ID').where('code', '=', contactCode).selectAsObject();
        if (store.length){
            cachedTypes[contactCode] = store[0]['ID'];
        } else {
            cachedTypes[contactCode] = 0
        }
        App.globalCachePut(CACHE_KEY, JSON.stringify(cachedTypes));
    }
    return cachedTypes[contactCode];
}
me.getContactTypeByCode = getContactTypeByCode;

me.entity.addMethod('afterupdate');
me.entity.addMethod('afterdelete');
me.entity.addMethod('afterinsert');

/**
 * Cleat cache after insert/update/delete
 * @param {ubMethodParams} ctxt
 */
function clearCache(ctxt){
    console.debug('clear global cache');
    App.globalCachePut(CACHE_KEY, '');
}

me.afterinsert = me.afterupdate = me.afterdelete = clearCache;