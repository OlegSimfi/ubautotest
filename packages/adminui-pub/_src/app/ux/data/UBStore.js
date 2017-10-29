require('../../core/UBCommand')
require('./proxy/UBProxy')
/**
 * Extend {@link Ext.data.Store} to easy use with UnityBase server:
 *
 * - add ubRequest & entity properties
 * - automatically create Model from ubRequest
 * - proxy is bounded to {@link UB.ux.data.proxy.UBProxy}
 * - refresh UBCache entry on `add` & `remove` operations
 */

Ext.define('UB.ux.data.UBStore', {
    extend: 'Ext.data.Store',
    alias: 'store.ubstore',
    totalRequired: false,

    // requires: [
    //     'UB.core.UBCommand',
    //     'UB.ux.data.proxy.UBProxy'
    // ],

    uses: [
        "UB.core.UBStoreManager",
        "UB.core.UBEnumManager"
    ],

    statics: {
        /**
         * Copy record dara
         * @param {Ext.data.Model} srcRecord
         * @param {Ext.data.Model} dstRecord
         */
        copyRecord: function(srcRecord, dstRecord){
            var fields = srcRecord.getFields();
            _.forEach(fields, function(field){
                dstRecord.set(field.name, srcRecord.get(field.name));
            });
        },

        /**
         * reset modified
         * @param {Ext.data.Model} record
         */
        resetRecord: function(record){
            record.modified = [];
            record.reject(true);
        },

        /**
         * update values in record from raw data of one entity.
         * @param {Object} response
         * @param {Ext.data.Model} record
         * @param {Number} [rowNum] (optional) default 0
         * @return {Ext.data.Model}
         */
        resultDataRow2Record: function(response, record, rowNum) {
            var
                i = -1,
                len, data, responseFieldList;

            data = response.resultData.data[ rowNum || 0];

            if (!data){
                return null;
            }
            responseFieldList = response.resultData.fields;

            len = responseFieldList.length;
            while(++i < len) {
                record.set(responseFieldList[i], data[i]);
            }

            return record;
        },


        /**
         * create empty record
         * @param {String} entityName
         * @param {String[]} fieldList
         * @returns {*}
         */
        createRecord: function(entityName, fieldList, createStore){
            var
                record,
                model,
                store,
                fCreateStore = createStore !== false;


            model = UB.ux.data.UBStore.getEntityModel(entityName, fieldList);
            record = Ext.create(model);

            if (fCreateStore){
                store = Ext.create('Ext.data.Store', {
                    model: model
                });

                store.add(record);
            }
            record.fields.eachKey(function(field){
                record.set(field, null);
            });
            UB.ux.data.UBStore.resetRecord(record);
            return record;
        },

        /**
         * Add all necessary attributes to field list:
         *
         * - check ID is inside field list. If not - add.
         * - if entity is under simpleAudit and no 'mi_modifyDate' passed - add
         *
         * @param {String,UBEntity} entityName
         * @param {Array<*|String>} fieldList
         * @returns {Array} modified fieldList
         */
        normalizeFieldList: function(entityName, fieldList){
            var mStorage, entity,
                result = [], hasID = false, hasMD = false;
            if (typeof(entityName) === 'string'){
                entity =  $App.domainInfo.get(entityName);
            } else {
                entity = entityName;
            }

            if (!entity){
                throw new Error('Invalid entity code =' + entityName);
            }
            mStorage = entity.mixins.mStorage;
            fieldList.forEach(function(field){
                result.push(field);
                hasID = hasID || field==='ID' || field.name==='ID';
                hasMD = hasMD || field==='mi_modifyDate' || field.name==='mi_modifyDate';
            });
            if (!hasID){
                result.push('ID');
            }
            if(mStorage && mStorage.simpleAudit && !hasMD){
                result.push('mi_modifyDate');
            }
            return result;
        },

        /**
         * Возвращает "нормализированное" наименование модели
         *
         * @param {String} entityName
         * @return {String}
         */
        entityModelName: function(entityName) {
            return "UB.model." + entityName;
        },


        /**
         * Возвращает имя модели. Если модель с данным именем не существует - она определяется.
         *
         * @param {String} entityName
         * @param {String[]} [fieldList] (optional)
         * @param {String} [idProperty] Default 'ID'
         * @return {String}
         */
        getEntityModel: function(entityName, fieldList, idProperty) {
            var entityModelName, modelFields;

            // adjust field list according to metadata
            modelFields = this.getEntityModelFields(entityName, fieldList);
            entityModelName = this.entityModelName(UB.core.UBUtil.getNameMd5(entityName, fieldList));

            if(!Ext.ModelManager.getModel(entityModelName)){
                Ext.define(entityModelName, {
                    extend: 'Ext.data.Model',
                    entityName: entityName,
                    idProperty: idProperty || 'ID',
                    fields: modelFields
                });
            }
            return entityModelName;
        },

        /**
         * Create model configuration ready for use with {@link Ext.data.Model}
         * The main task is to create converter function for different field types.
         * Usage sample:
         *
         *      Ext.define(entityModelName, {
     *           extend: 'Ext.data.Model',
     *           entityName: entityName,
     *           idProperty: 'ID',
     *           fields: getEntityModelFields(entityName, ['attr1', 'attr2'])
     *       });
         *
         * @param {String} entityName
         * @param {String[]} fieldList
         * @return {Array<Object>}
         */
        getEntityModelFields: function(entityName, fieldList) {
            var
                fields = [],
                attribute,
                domainEntity = $App.domainInfo.get(entityName);

            if(!Ext.isDefined(domainEntity)){
                throw new Error(UB.format('Entity "{0}" not found in Domain', entityName));
            }

            fieldList.forEach(function(fieldName, index){
                attribute = domainEntity.attr(fieldName);
                if(attribute){
                    fields.push({
                        name: fieldName,
                        convert: null, // we convert all data just after server response
                        type: UBDomain.getPhysicalDataType(attribute.dataType),
                        useNull: true,
                        mapping: index
                    });
                }
            });

            return fields;
        }
    },

    /**
     * Create store.
     *
     * **Warning - internally modify fieldList by call {normalizeFieldList}**
     * @param {Object} config Config object
     */
    constructor: function(config) {
        var
            me = this,
            newConfig = Ext.clone(config),
            ubRequest = newConfig.ubRequest,
            entity = ubRequest.entity;

        /**
         * @cfg {UB.ux.data.UBStore[]} linkedItemsLoadList
         * List of stores that start load with load this store. Method load waiting for all stores will be loaded.
         */

        //MPV - must be here. Better to remove this functionality at all and set correct fieldList by caller
        ubRequest.fieldList = UB.ux.data.UBStore.normalizeFieldList(entity, ubRequest.fieldList);
        Ext.apply(me, {
            /**
             * @cfg {Object} ubRequest
             */
            ubRequest: ubRequest,
            model: ubRequest.model || UB.ux.data.UBStore.getEntityModel(entity, ubRequest.fieldList, newConfig.idProperty),
            proxy: {
                type: 'ubproxy'
            },
            /**
             * @property {String} entity Entity name
             */
            entityName: entity,
            autoLoad: me.autoLoad !== false,
            remoteSort: true,
            remoteFilter: true,
            remoteGroup: true
        });

        /**
         * @cfg {String} [idProperty] Id property for model.
         */

        if (!config.disablePaging){
            me.pageSize = !me.pageSize? UB.appConfig.storeDefaultPageSize : me.pageSize;
        } else {
           me.pageSize = 0;
        }

        /**
         * @event beforereload
         * Fires each times before call reload method
         */
        me.addEvents('beforereload', 'entityModified' );

        me.callParent([newConfig]);

        me.on({
            beforeload: me.onBeforeLoad,
            beforeprefetch: me.onBeforePrefetch
        });

    },


    fireModifyEvent: function(request,  responce){
        this.fireEvent('entityModified', request,  responce);
    },

    /**
     * Remove actual data from store proxy. Refresh cache if need;
     * @returns {Promise}
     */
    clearCache: function(){
        this.clearProxyCache();
        var cacheType = $App.domainInfo.get(this.entityName).cacheType;
        return $App.connection.cacheOccurrenceRefresh(this.entityName, cacheType);
    },
    /**
     * 
     * @param {Object} whereList
     * @param {Boolean} withoutReload
     */
    setWhereList: function(whereList, withoutReload) {
        this.ubRequest.whereList = whereList;

        if(!withoutReload) {
            this.reload();
        }
    },


    /**
     * Perform load of store. Return promise resolved to store itself then finish
     * @param {Object|Function} [options]
     * @returns {Promise} resolved to store
     */
    load: function(options){
        var
            me = this,
            deferred = Q.defer(),
            optionsIsFunction = typeof options === 'function',
            newOptions = {}, myCallback, doneMain, rList = [], throwLoadError = me.throwLoadError;

        if (me.isDestroyed){
            return Q.resolve(me);
        }

        myCallback = function(records, operation, success){
           if (success){
               Q.all(rList).done(function(){
                   doneMain(records, operation, success);
               });
           } else {
               doneMain(records, operation, success);
           }
        };

        doneMain = function(records, operation, success){
                if (success){
                    if (operation.resultSet && operation.resultSet.resultLock){
                        me.resultLock = operation.resultSet.resultLock;
                    }
                    if (operation.resultSet && operation.resultSet.resultAls){
                        me.resultAls = operation.resultSet.resultAls;
                    }
                    deferred.resolve(me);
                } else {
                    if (throwLoadError){
                        throw operation.getError();
                    }
                    deferred.reject(operation.getError());
                }
                if (optionsIsFunction || (options && options.callback)){
                    UB.logDebug('UBStore.load(callback) is DEPRECATED. Use Promise style: UBStore.load().then(...)');
                    if (!success){
                        throw new Error(operation.getError());
                    }
                    if (optionsIsFunction){
                        Ext.callback(options, null, [records, operation, success]);
                    } else {
                        Ext.callback(options.callback, options.scope, [records, operation, success]);
                    }
                }
        };
        me.indexByID = null;
        if (me.linkedItemsLoadList){
            _.forEach(me.linkedItemsLoadList, function(item){
                if (item && (item instanceof UB.ux.data.UBStore)) {
                    rList.push(item.load());
                } else if (typeof(item) === 'function'){
                    rList.push(item());
                } else if (item && Q.isPromise(item)){
                    rList.push(item);
                }
            });
        }
        if (!optionsIsFunction && options){
          UB.apply(newOptions, options);
        }
        if (this.disablePaging && !newOptions.limit ){
           newOptions.limit = -1;
           newOptions.start = 0;
        }
        newOptions.callback = myCallback;
        delete newOptions.scope;
        this.callParent([newOptions]);
        return deferred.promise;
    },

    /**
     * Perform reload of store. Return promise resolved to store itself then finish
     * @param [options]
     * @returns {promise|*|Q.promise}
     */
    reload: function(options) {
        var
            me = this,
            deferred = Q.defer(),
            newOptions = UB.apply({}, options),
            myCallback = function(records, operation, success){
                if (success){
                    deferred.resolve(me);
                } else {
                    deferred.reject('TODO pass here rejection reason');
                }
                if (options && options.callback){
                    UB.logDebug('UBStore.reload(callback) is DEPRECATED. Use Promise style: UBStore.reload().then(...)');
                    Ext.callback(options.callback, options.scope, [records, operation, success]);
                }
            };
        me.fireEvent('beforereload');

		me.loading = true;
        me.indexByID = null;
        me.clearCache().done(function(){
            if (!me.isDestroyed){ // when cache is clear user close form and store is destroyed
                newOptions.callback = myCallback;
                delete newOptions.scope;
                me.superclass.reload.call(me, newOptions);
            }
        });
        return deferred.promise;
    },

    clearProxyCache: function (){
        var
            proxy = this.getProxy();

        if(proxy) {
            delete proxy.totalRecCount;
            delete proxy.data;
        }
    },

    filter: function(options) {
        var me = this;
        if (me.isDestroyed){
            return;
        }
        me.clearProxyCache();
        try {
            /**
             * @private
             * @type {boolean} throwLoadError
             */
            me.throwLoadError = true;
            me.callParent(arguments);
        } finally {
            me.throwLoadError = false;
        }
    },

    clearFilter: function( ){
        if (this.isDestroyed){
            return;
        }
        this.clearProxyCache();
        this.callParent(arguments);
    },

    getFromLruCacheById: function(id) {
        var
            record,
            page = this.data.first,
            filterFn = function(rec) {
                if(rec.getId() === id){
                    record = rec;
                    return false;
                }
            };

        while(page){
            Ext.Array.each(page.value, filterFn, false);
            if(record !== undefined) {
                return record;
            }
            page = page.next;
        }
    },

    /**
     * 
     * @param {Ext.data.Store} store
     * @param {Ext.data.Operation} operation
     * @return {Boolean}
     */
    onBeforeLoad: function(store, operation) {
        //<debug>
        //UB.logDebug("UBStore.onBeforeLoad(%o)", arguments);
        //</debug>

        operation.ubRequest = this.ubRequest;

        return true;
    },

    /**
     * 
     * @param {Ext.data.Store} store
     * @param {Ext.data.Operation} operation
     * @return {Boolean}
     */
    onBeforePrefetch: function(store, operation) {
        //<debug>
        //UB.logDebug("UBStore.onBeforePrefetch(%o)", arguments);
        //</debug>

        operation.ubRequest = this.ubRequest;

        return true;
    },

    /**
     * @override
     * @param {Ext.data.Model|Ext.data.Model[]|Number|Number[]} records
     */
    remove: function(records){
        var me = this;
        me.clearCache().done(function(){
            if (!me.isDestroyed){ // when cache is clear user close form and store is destroyed
                // me.callParent([records]) is not right way to call callParent from callback
                // right way is below
                me.superclass.remove.call(me, records);
            }
        });
        //this.clearCache();
        //this.callParent(arguments);
    },
    /**
     * @override
     * @param {Ext.data.Model[]} model
     * @param {Boolean} [saveCache] optional
     */
    add: function(model, saveCache){
        var me = this;
        if (saveCache){
            return this.callParent(arguments);
        }
        // todo add method must return Ext.data.Model[]
        me.clearCache().done(function(){
            if (!me.isDestroyed){ // when cache is clear user close form and store is destroyed
                me.superclass.add.call(me, model);
            }
        });
        //this.clearCache();
        //this.callParent(arguments);
    },
    /*
    getById: function(id) {
        if(id && id.getId){
            id = id.getId();

        }
        return this.buffered ? this.getFromLruCacheById(id) : (this.snapshot || this.data).findBy(function(record) {
            return record.getId() === id;
        });
    },
    */

    /**
     * @cfg {Boolean} createIndexByID
     * If true will be created index by id. This index used in function getById. It will be created when first call getById method.
     * You should use it if will be often called method getById. For example in lookUp grid column.
     */

    /**
     * Get the Record with the specified id.
     *
     * @param {Number/Ext.data.Model} id The id of the Record to find.
     * @returns {Ext.data.Model}
     */
    getById: function(id) {
        var me = this;
        if(id && id.getId){
            id = id.getId();
        }

        if (!me.indexByID && me.createIndexByID){
            me.indexByID = {};
            me.each(function(record){
                me.indexByID[record.getId()] = record;
            }, me);
        }
        if (me.indexByID){
            return me.indexByID[id];
        } else {
            return me.callParent([id]);
        }
    }

});

/* dirty hack to add implementation for method ClientRepository.prototype.selectAsStore */
UB.ClientRepository.prototype.selectAsStore = function(storeConfig){
    storeConfig = storeConfig || {};
    storeConfig.ubRequest = this.ubql();
    return Ext.create('UB.ux.data.UBStore', storeConfig).load();
};