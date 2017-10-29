if (UB.isServer){
    // var Ext = require('Ext');
  throw new Error('XLSX temporary unavailable on server side')
}
/**
 * Файл: XLSX.csStyleElement.js
 */
Ext.define('XLSX.csBaseStyleElement', {
    constructor: function(config) {
        this.elements = [];
        /**
         * Associative array of element. (String code - Integer index) pair
         * @type {Object}
         */
        this.named = {};
        this.compiled = [];
        this.startId = this.startId || 0;
        if (config){
            this.add(config);
        }
    },

    render: function(){
       return this.compiled.join('');
    },

    count: function(){
        return  this.compiled.length;
    },

    /**
     *
     * @param info
     * @return {Number} Style element index
     */
    add: function(info) {
        this.elements.push(info);
        info.id = this.startId ;
        this.startId++;
        if (info.code){
            this.named[info.code] = info.id;
        }
        this.compile(info);
        return info.id;
    },

    compileTemplate: function(){
        throw new Error('You must override function compileTemplate.');
    },

    compile: function(element){
        this.compiled.push(this.compileTemplate(element) ); //tpl.apply(element)
    }

});

