/*global XLSX*/
if (UB.isServer){
    // var Ext = require('Ext');
  throw new Error('XLSX temporary unavailable on server side')
}
/**
 * Файл: XLSX.csStyle.js
 */
Ext.define('XLSX.csStyle', {
   /*
	requires: UB.isServer ? null:[
		'XLSX.csStyleBorder',
		'XLSX.csStyleFill',
		'XLSX.csStyleFormat',
		'XLSX.csStyleFont',
		'XLSX.csStyleAlign',
		'XLSX.csStyleProtect',
		'XLSX.csBaseStyleElement'
	],
    */
	statics: {
		indexDefFormateDate: 14
	},
	constructor: function(config) {
		config = config || {};

		this.borders =  new XLSX.csStyleBorder( {left:{}, right:{}, top: {}, bottom:{} });
		this.fills = new XLSX.csStyleFill( {patternType : 'none'});
		this.formats = new XLSX.csStyleFormat();
		this.fonts = new XLSX.csStyleFont();
		this.alignments = new XLSX.csStyleAlign();
		this.protects = new XLSX.csStyleProtect();

		this.elements = [];
		this.named = {};
		this.compiled = [];
		this.styleHashList = {};
		this.styleHashListIndex = 0;

		this.defaultStyle = this.getStyle({ code: "defaultStyle" });
	},

	compileSTemplate: function(cfg){

		var
			out = [];
		out.push('<xf numFmtId="', cfg.format, '" fontId="', cfg.font, '" fillId="', cfg.fill, '" borderId="', cfg.border, '" xfId="0"');
		if (cfg.setformat === true){
			out.push(' applyNumberFormat="1"');
		}
		//if (cfg.setfont === true){
			out.push(' applyFont="1"');
		//}
		if (cfg.setfill === true){
			out.push(' applyFill="1"');
		}
		if (cfg.setborder === true){
			out.push(' applyBorder="1"');
		}
		if (cfg.setalignment === true || cfg.setWrapText === 1){
			out.push(' applyAlignment="1"');
		}
		if (cfg.setprotect === true){
			out.push(' applyProtection="1"');
		}
		out.push('>');
		if (cfg.setalignment === true){
			out.push(' ', cfg.alignmentval);
		}
		if (cfg.setprotect === true){
			out.push(' ', cfg.protectionval);
		}

		var setAdditionalAlignment =
			cfg.setWrapText ||
			cfg.setVerticalAlign ||
			cfg.setHorizontalAlign;

		if (setAdditionalAlignment !== 0) {
			out.push("<alignment ");
		}
		if (cfg.setWrapText === 1) {
			out.push(' wrapText="1" ');
		}
		//top, center, bottom (by default)
		if (cfg.setVerticalAlign !== 0) {
			out.push(' vertical="' + cfg.setVerticalAlign + '" ');
		}
		//left (by default), center, right
		if (cfg.setHorizontalAlign !== 0) {
			out.push(' horizontal="' + cfg.setHorizontalAlign + '" ');
		}
		if (setAdditionalAlignment !== 0) {
			out.push("/>");
		}

		out.push('</xf>');
		return out.join('');
	},

	compileTemplate: function(obj){
		var
			out = [];

		out.push(
			'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n',
			'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
		);
		if (obj.formatsCnt > 0){
			out.push('<numFmts count="', obj.formats.elements.length, '">', obj.formats.render(), '</numFmts>');
		}
		if (obj.fontsCnt > 0){
			out.push('<fonts count="', obj.fonts.elements.length, '">', obj.fonts.render(), '</fonts>');
		}
		if (obj.fillsCnt > 0){
			out.push('<fills count="', obj.fills.elements.length, '">', obj.fills.render(), '</fills>');
		}
		if (obj.bordersCnt > 0){
			out.push('<borders count="', obj.borders.elements.length, '">', obj.borders.render(), '</borders>');
		}
		out.push(
			'<cellStyleXfs count="1">',
				'<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>',
			'</cellStyleXfs>',
			'<cellXfs count="', obj.compiled.length, '">', obj.elementsJoined, '</cellXfs>',
			'<cellStyles count="1">',
				'<cellStyle name="Обычный" xfId="0" builtinId="0"/>',
			'</cellStyles>',
			'<dxfs count="0"/>',
			'<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16"/>',
			'</styleSheet>'
		);

		return out.join('');

		//'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
        /*
         this.tpl = Ext.create('Ext.XTemplate',
         '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
         '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
         '<tpl if="formatsCnt &gt; 0">',
         '<numFmts count="{[values.formats.elements.length]}">{[values.formats.render()]}</numFmts>',
         '</tpl>',
         '<tpl if="fontsCnt &gt; 0">',
         '<fonts count="{[values.fonts.elements.length]}">{[values.fonts.render()]}</fonts>',
         '</tpl>',
         '<tpl if="fillsCnt &gt; 0">',
         '<fills count="{[values.fills.elements.length]}">{[values.fills.render()]}</fills>',
         '</tpl>',
         '<tpl if="bordersCnt &gt; 0">',
         '<borders count="{[values.borders.elements.length]}">{[values.borders.render()]}</borders>',
         '</tpl>',
         '<cellStyleXfs count="1">',
         '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>',
         '</cellStyleXfs>',
         '<cellXfs count="{[values.compiled.length]}">{elementsJoined}</cellXfs>',
         '<cellStyles count="1">',
         '<cellStyle name="Обычный" xfId="0" builtinId="0"/>',
         '</cellStyles>',
         '<dxfs count="0"/>',
         '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16"/>',
         '</styleSheet>'
         );
         this.tpl.compile();
		 */
		//'<extLst><ext uri="" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">',
		//    '<x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext></extLst>',
	},

	/**
	 * If style not exists add new.  Return style index
	 * @param config
	 *  @param {Number} [config.border] (optional) {@link XLSX.csStyle#borders.add} {@link XLSX.csStyleBorder#add}
	 *  @param {Number} [config.fill] (optional) {@link XLSX.csStyle#fills.add} {@link XLSX.csStyleFill#add}
	 *  @param {Number} [config.format] (optional) {@link XLSX.csStyle#formats.add} {@link XLSX.csStyleFormat#add}
	 *  @param {Number} [config.font] (optional) {@link XLSX.csStyle#fonts.add} {@link XLSX.csStyleFont#add}
	 *  @param {Number} [config.alignment] (optional) {@link XLSX.csStyle#alignments.add} {@link XLSX.csStyleAlign#add}
	 *  @param {Number} [config.protect] (optional) {@link XLSX.csStyle#protects.add} {@link XLSX.csStyleProtect#add}
	 *  @return {Number}
	 */
	getStyle: function(config) {

		var cfg = config; //Ext.clone(config);
		cfg.setborder = Ext.isDefined(cfg.border);
		cfg.border = cfg.border || 0;
		cfg.setfill = Ext.isDefined(cfg.fill);
		cfg.fill = cfg.fill || 0;
		cfg.setformat = Ext.isDefined(cfg.format);
		cfg.format = cfg.format || 0;
		cfg.setfont = Ext.isDefined(cfg.font);
		cfg.font = cfg.font || 0;
		cfg.setalignment = Ext.isDefined(cfg.alignment);
		cfg.setWrapText = cfg.setWrapText || 0;
		cfg.setVerticalAlign = cfg.setVerticalAlign || 0;
		cfg.setHorizontalAlign = cfg.setHorizontalAlign || 0;
		cfg.alignment = cfg.alignment || 0;
		if (Ext.isDefined(cfg.alignment)){
			cfg.alignmentval = this.alignments.compiled[cfg.alignment];
		}
		cfg.setprotect = Ext.isDefined(cfg.protect);
		if (Ext.isDefined(cfg.protect)){
			cfg.protectval = this.protects.compiled[cfg.protect];
		}
		cfg.protect = cfg.protect || 0;
		var styleHash = this.getStyleHash(cfg);
		var styleId = this.styleHashList[styleHash];
		if (styleId){
			return styleId;
		}

		cfg.id = this.styleHashList[styleHash] = this.styleHashListIndex;  // this.elements
		this.styleHashListIndex++;
		this.compiled.push( this.compileSTemplate(cfg) ); //this.tplXfs.apply(cfg)
		if(cfg.code){
			this.named[cfg.code] = cfg.id;
		}
		return cfg.id;
	},

	getDefDateStyle: function(){
		if (!this.named.DefDateStyle){
			this.getStyle({format: XLSX.csStyle.indexDefFormateDate, code: "DefDateStyle"});
		}
		return this.named.DefDateStyle;
	},

	/**
	 * @private
	 * @param config
	 * @return {String}
	 */
	getStyleHash: function(config){
		return [
			!config.setborder ? "#" : config.border.toString(),
			!config.border ? "#" : config.border.toString(),
			!config.setfill ? "#" : config.fill.toString(),
			!config.setformat ? "#" : config.format.toString(),
			!config.setfont ? "#" : config.font.toString(),
			!config.setalignment ? "#" : config.alignment.toString(),
			!config.setprotect ? "#" : config.protect.toString(),
			!config.setWrapText ? "#" : config.setWrapText.toString(),
			!config.setVerticalAlign ? "#" : config.setVerticalAlign.toString(),
			!config.setHorizontalAlign ? "#" : config.setHorizontalAlign.toString()
		].join('_');
	},

	/**
	 * @private
	 * @param context
	 * @return {String}
	 */
	render: function(context) {
		this.elementsJoined =  this.compiled.join('') ;
		this.bordersCnt = this.borders.elements.length;
		this.fillsCnt = this.fills.elements.length;
		this.formatsCnt = this.formats.elements.length;
		this.fontsCnt = this.fonts.elements.length;
		this.alignmentsCnt = this.alignments.elements.length;
		this.protectsCnt = this.protects;


		return this.compileTemplate(this); // this.tpl.apply(this);
	}

});