if (UB.isServer){
    // var Ext = require('Ext');
  throw new Error('XLSX temporary unavailable on server side')
}
/**
 * Registred font styles
 */
Ext.define('XLSX.csStyleFont', {
    extend: 'XLSX.csBaseStyleElement',


    constructor: function(config) {
      /*
       <font>
       <b/>
       <sz val="11"/>
       <color theme="1"/>
       <name val="Calibri"/>
       <family val="2"/>
       <scheme val="minor"/>
       </font>
         */
        /*
        this.tpl = Ext.create('Ext.XTemplate',
            '<font>',
            '<tpl if="bold == true">',
                '<b/>',
            '</tpl>',
            '<tpl if="shadow == true">',
                '<shadow/>',
            '</tpl>',
            '<tpl if="fontSize.length !== 0">',
                '<sz val="{fontSize}"/>',
            '</tpl>',
            '<tpl if="color.length !== 0">',
                '<color ',
                '<tpl foreach=".">',
                    '{$}="{.}"',
                '</tpl>',
                '/>',
            '</tpl>',
            '<tpl if="name.length !== 0">',
               '<name val="{name}"/>',
            '</tpl>',
            '<tpl if="family.length !== 0">',
                '<family val="{family}"/>',
            '</tpl>',
            '<tpl if="scheme.length !== 0">',
                '<scheme val="{scheme}"/>',
            '</tpl>',
            '<tpl if="underline.length !== 0">',
                '<u val="{underline}"/>',
            '</tpl>',
            '</font>'
        );
        this.tpl.compile();
        */
        return this.callParent([config]);
    },

    compileTemplate: function(element){
        var out = [], xkey;
        out.push('<font>');
        if (element.bold === true){
            out.push('<b/>');
        }
        if (element.shadow === true){
            out.push('<shadow/>');
        }
        if (element.fontSize){
            out.push('<sz val="', element.fontSize + '', '"/>');
        }
        if (element.color){
            out.push('<color ');
            for( xkey in element.color ){
                if (element.color.hasOwnProperty(xkey)){
                    out.push( xkey, '="', element.color[xkey] ,'" ');
                }
            }
            out.push('/>');
        }
        if (element.name){
            out.push('<name val="', element.name, '"/>');
        }
        if (element.family){
            out.push('<family val="', element.family, '"/>');
        }
        if (element.scheme){
            out.push('<scheme val="', element.scheme, '"/>');
        }
        if (element.underline){
            out.push('<underline val="', element.underline, '"/>');
        }
        out.push('</font>');
        return out.join('');
    },

    /**
     * add new fill style info. Used for add new style.
     * @param {Object} info
     * @param {String} [info.name] (optional) Calibri
     * @param {String} [info.charset] (optional)
     * @param {Number} [info.fontSize] (optional)
     * @param {Boolean} [info.bold] (optional)
     * @param {Boolean} [info.shadow] (optional)
     * @param {Number} [info.family] (optional) 0 - 14
     * @param {String} [info.scheme] (optional)  none, major, minor
     * @param {String} [info.underline] (optional) single, double, singleAccounting, doubleAccounting, none,
     * @param {Object} [info.color] (optional)
     * @param {String} [info.color.theme] (optional)
     * @param {Number} [info.color.tint] (optional)
     * @param {Number} [info.color.indexed] (optional)
     * @return {Number} index
     */
    add: function(info) {
        return this.callParent([info]);
    }


});

