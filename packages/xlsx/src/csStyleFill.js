if (UB.isServer){
    // var Ext = require('Ext');
  throw new Error('XLSX temporary unavailable on server side')
}
/**
 * Registred fill styles
 */
Ext.define('XLSX.csStyleFill', {
    extend: 'XLSX.csBaseStyleElement',

    constructor: function(config) {
        return this.callParent([config]);
    },

    compileTemplate: function(element){
        var out = [];
        out.push(
            '<fill>',
            '<patternFill patternType="', element.patternType, '">'
        );
        if (element.fgColor){
            out.push('<fgColor ');
            if (element.fgColor.theme){
               out.push('theme="', element.fgColor.theme + '', '" ');
            }
            if (element.fgColor.tint){
                out.push('tint="', element.fgColor.tint + '', '" ');
            }
            if (element.fgColor.indexed){
                out.push('indexed="', element.fgColor.indexed + '', '" ');
            }
            out.push('/>');
        }
        if (element.bgColor){
            out.push('<bgColor ');
            if (element.bgColor.theme){
                out.push('theme="', element.bgColor.theme + '', '" ');
            }
            if (element.bgColor.tint){
                out.push('tint="', element.bgColor.tint + '', '" ');
            }
            if (element.bgColor.indexed){
                out.push('indexed="', element.bgColor.indexed + '', '" ');
            }
            out.push('/>');
        }
        out.push(
          '</patternFill>',
          '</fill>'
        );
        return out.join('');
        /*
         this.tpl = Ext.create('Ext.XTemplate',
         '<fill>',
         '<patternFill patternType="{patternType}">',
         '<tpl if="fgColor.length !== 0">',
         '<fgColor ',
         '<tpl if="fgColor.theme.length !== 0">',
         'theme="{fgColor.theme}" ',
         '</tpl>',
         '<tpl if="fgColor.tint.length !== 0">',
         'tint="{fgColor.tint}" ',
         '</tpl>',
         '<tpl if="fgColor.indexed.length !== 0">',
         'indexed="{fgColor.indexed}" ',
         '</tpl>',
         '/>',
         '</tpl>',
         '<tpl if="bgColor.length !== 0">',
         '<bgColor ',
         '<tpl if="bgColor.theme.length !== 0">',
         'theme="{bgColor.theme}" ',
         '</tpl>',
         '<tpl if="bgColor.tint.length !== 0">',
         'tint="{bgColor.tint}" ',
         '</tpl>',
         '<tpl if="bgColor.indexed.length !== 0">',
         'indexed="{bgColor.indexed}" ',
         '</tpl>',
         '/>',
         '</tpl>',
         '</patternFill>',
         '</fill>'
         );
         this.tpl.compile();

        */
    },

    /**
     * add new fill style info. Used for add new style.
     * @param {Object} info
     * @param {Object} [info.fgColor] (optional)
     * @param {String} [info.fgColor.theme] (optional)
     * @param {Number} [info.fgColor.tint] (optional)
     * @param {Number} [info.fgColor.indexed] (optional)
     * @param {Object} [info.bgColor] (optional)
     * @param {String} [info.bgColor.theme] (optional)
     * @param {Number} [info.bgColor.tint] (optional)
     * @param {Number} [info.bgColor.indexed] (optional)
     * @return {Number} index
     */
    add: function(info) {
        return this.callParent([info]);
    }


});
