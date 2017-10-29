/*global XLSX */

if (UB.isServer){
    // var Ext = require('Ext');
  throw new Error('XLSX temporary unavailable on server side')
}

/**
 * Registred format styles
 */
Ext.define('XLSX.csStyleFormat', {
    extend: 'XLSX.csBaseStyleElement',

    constructor: function(config) {
        /*
        this.tpl = Ext.create('Ext.XTemplate',
            '<numFmt numFmtId="{id}" formatCode="{formatCode}"/>'
        );
        this.tpl.compile();
        */
        this.startId = 164;
        this.callParent([config]);
    },

    /**
     * add new border style info. Used for add new style.
     * @param {Object} info
     * @param {Number} info.id
     * @param {String} info.formatCode example  #,##0.00_ ;[Red]\-#,##0.00\
     * @return {Number} index
     */
    add: function(info) {
        var st = XLSX.csWorkbook;
        info.formatCode = st.escapeXML(info.formatCode);
        return this.callParent([info]);
    },

    compile: function(element){
        if (element.formatCode){
            this.compiled.push(['<numFmt numFmtId="', element.id, '" formatCode="', element.formatCode, '"/>'].join('') ); //this.tpl.apply(element)
        }
        else {
            this.compiled.push('');
        }
    }


});
