if (UB.isServer){
    // var Ext = require('Ext');
  throw new Error('XLSX temporary unavailable on server side')
}
/**
 * Registred border styles
 */
Ext.define('XLSX.csStyleBorder', {
    extend: 'XLSX.csBaseStyleElement',

    constructor: function(config) {
        return this.callParent([config]);
    },

    compileTemplate: function(element){
        var
            out = [], xkey, prop, colorN;
        out.push('<border>');
        for( xkey in element ){
            if (element.hasOwnProperty(xkey)){
                prop = element[xkey];
                if (xkey === 'id' ){
                    continue;
                }
                out.push('<', xkey, ' ' );
                if (prop.style) {
                    out.push('style="', prop.style, '" ');
                } else {
                    out.push('/');
                }
                out.push('>');
                if (prop.style) {
                    out.push('<color ');
                    if (prop.color){
                        for( colorN in prop.color ){
                            if (prop.color.hasOwnProperty(colorN)){
                                out.push(colorN, '="', prop.color[colorN], '" ');
                            }
                        }
                    } else {
                        out.push('auto="1" ');
                    }
                    out.push('/>');
                    out.push('</', xkey, '>');
                }
            }
        }
        out.push('</border>');
        return out.join('');
        /*

         this.tpl = Ext.create('Ext.XTemplate',
         '<border>',
         '<tpl foreach=".">',
         '{% if (xkey == "id") continue; %}',
         '<{$} ',
         '<tpl if="style.length != 0">',
         'style="{style}"',
         '<tpl else>',
         '/',
         '</tpl>',
         '>',
         '<tpl if="style.length != 0">',
         '<color ',
         '<tpl if="color.length != 0">',
         '<tpl for="color">',
         '{$}="{.}"',
         '</tpl>',
         '<tpl else>',
         'auto="1"',
         '</tpl>',
         '/>',
         '</{$}>',
         '</tpl>',
         '</tpl>',
         '</border>'
         );
         this.tpl.compile();
         */
    },

    /**
     * add new border style info. Used for add new style.
     * @param {Object} info
     * @param {Object} [info.left] (optional)
     * @param {String} [info.left.style] (optional) "none","thin","medium","dashed","dotted","thick","double","hair","mediumDashed","dashDot","mediumDashDot","dashDotDot","mediumDashDotDot","slantDashDot"
     * @param {String} [info.left.color] (optional) default=auto {rgb: 'FFFF0000}
     * @param {Object} [info.right] (optional) like left
     * @param {Object} [info.top] (optional) like left
     * @param {Object} [info.bottom] (optional) like left
     * @param {Object} [info.diagonal] (optional) like left
     * @param {String} [info.code] (optional) for link code to index in associative array
     * @return {Number} index
     */
    add: function(info) {
        info = info || {};
        info.left = info.left || {};
        info.right = info.right || {};
        info.top = info.top || {};
        info.bottom = info.bottom || {};
        info.diagonal = info.diagonal || {};
        return this.callParent([info]);
    }
    //,


    /**
     * @private
     * compile borders
     * -----------------
     * <border>
     * <left style="medium">
     *    <color rgb="FFFF0000"/>
     * </left>
     * <top/>
     * <right style="thin">
     *   <color auto="1"/>
     * </right>
     * </border>
     */
     /*
    compile: function(){
        this.compiled =  new Array(this.elements.length);

        Ext.each(this.elements, function(fill, index) {
            this.compiled[index] = this.compileTemplate(fill);    //tpl.apply(fill)
        }, this);
    }
    */
});
