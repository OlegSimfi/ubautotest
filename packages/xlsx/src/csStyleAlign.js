if (UB.isServer){
    // var Ext = require('Ext');
  throw new Error('XLSX temporary unavailable on server side')
}
/**
 * Registred alignment styles
 */
Ext.define('XLSX.csStyleAlign', {
    extend: 'XLSX.csBaseStyleElement',

    constructor: function(config) {
        return this.callParent([config]);
    },


    templateCompile: function(element){
         var
            prop, out = [];
            out.push('<alignment ');
            for( prop in element ){
               if (element.hasOwnProperty(prop)){
                   if (prop === 'id' || prop === 'code' || prop === 'code'){
                       continue;
                   }
                   out.push( prop, '="', element[prop], '" ');
               }
            }
            out.push('/>');
            return out.join('');
    },

    /**
     * add new alignment style info. Used for add new style.
     *
     * info.type =  info.value
     *
     * horizontal = (general | left | center | right | fill | justify | centerContinuous | distributed)
     * vertical = (top | center | bottom | justify distributed)
     * textRotation  {Integer}
     * wrapText {Boolean}
     * indent {Integer}
     * relativeIndent {Integer}
     * justifyLastLine {Boolean}
     * shrinkToFit {Boolean}
     * readingOrder  {Integer}
     *
     * @param {Object} info
     * @param {String} info.type
     * @param {String} info.value
     * @return {Number} index
     */
    add: function(info) {
        return this.callParent([info]);
    },

    compile: function(element){
            this.compiled.push(this.templateCompile(element));  //tpl.apply(element)
    }


});
