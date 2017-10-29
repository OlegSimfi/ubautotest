if (UB.isServer){
  throw new Error('XLSX temporary unavailable on server side')
    // var Ext = require('Ext');
}

/**
 * Registred alignment styles
 */
Ext.define('XLSX.csStyleProtect', {
    extend: 'XLSX.csBaseStyleElement',

    constructor: function(config) {
        /*
        this.tpl = Ext.create('Ext.XTemplate',
            '<protection ',
            '<tpl foreach=".">',
            '{% if (xkey == "id") continue; %}',
            '{% if (xkey == "code") continue; %}',
            '{% if (xkey == "name") continue; %}',
            ' {$}="{.}"',
            '</tpl>',
            '/>'
        );
        this.tpl.compile();
        */
        return this.callParent([config]);
    },

    compileTemplate: function(element){
        var
            out = [], xkey;
        out.push('<protection>');
        for( xkey in element ){
            if (element.color.hasOwnProperty(xkey)){
                if (xkey === 'id' || xkey === 'code' || xkey === 'code'){
                    continue;
                }
                out.push( ' ', xkey, '="', element[xkey], '" ');
            }
        }
        out.push('/>');
        return out.join('');
    },

    /**
     * add new locked style info. Used for add new style.
     *
     * @param {Object} info
     * @param {String} info.type locked, hidden
     * @param {boolean} info.value
     * @return {Number} index
     */
    add: function(info) {
        return this.callParent([info]);
    },

    compile: function(element){
            this.compiled.push(this.compileTemplate(element)); //tpl.apply(element)
    }


});

