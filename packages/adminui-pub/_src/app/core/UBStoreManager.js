require('./UBAppConfig')
require('./UBUtil')
/**
 * Файл: UB.core.UBStoreManager.js
 * Автор: Игорь Ноженко
 *
 * Менеджер store'ов уровня приложения
 */
Ext.define('UB.core.UBStoreManager', {
    singleton: true,

    /**
     *
     * @param {String} entityName
     * @param {String[]} fieldList (optional)
     * @param {Object} [whereList] (optional)
     * @return {Ext.data.Store}
     */
    getStore: function(entityName, fieldList, whereList) {
        return Ext.data.StoreManager.lookup(UB.core.UBUtil.getNameMd5(entityName, fieldList, whereList));
    },

    /**
     * 
     * @param {String} systemEntity
     * @return {String}
     */
    getSystemEntityStoreGetterName: function(systemEntity) {
        return 'get' + Ext.String.capitalize(systemEntity) + 'Store';
    },

    /**
     * 
     * @param {String} systemEntity
     * @return {Ext.data.Store}
     */
    getSystemEntityStore: function(systemEntity) {
        return this[this.getSystemEntityStoreGetterName(systemEntity)]();
    },

    /**
     * 
     * @return {Ext.data.Store}
     */
    getDesktopStore: function() {
        var desktopName = 'ubm_desktop';
        return this.getStore(desktopName, $App.domainInfo.get(desktopName).getAttributeNames());
    },

    /**
     * 
     * @return {Ext.data.Store}
     */
    getNavigationShortcutStore: function() {
        return this.getStore('ubm_navshortcut', $App.domainInfo.get('ubm_navshortcut').getAttributeNames());
    },

    /**
     * 
     * @return {Ext.data.Store}
     */
    getFormStore: function() {
        return this.getStore('ubm_form', $App.domainInfo.get('ubm_form').getAttributeNames());
    },

    /**
     * 
     * @return {Ext.data.Store}
     */
    getEnumStore: function() {
        return this.getStore('ubm_enum', $App.domainInfo.get('ubm_enum').getAttributeNames());
    },
    /**
     *
     * @return {Ext.data.Store}
     */
    get_enum_Store: function() {
        return this.getEnumStore();
    }
});