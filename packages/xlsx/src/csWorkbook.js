/*global XLSX,JSLibs,saveAs,require,writeFile */
//@require ../../../modules/jsZip/jszip.min.js

if (UB.isServer){
  throw new Error('XLSX temporary unavailable on server side')
    // var Ext = require('Ext');
    // var JSZip = require('jsZip\\jszip');
}

Ext.define('XLSX.csWorkbook', {

		statics:{
			numFmts:['General', '0', '0.00', '#,##0', '#,##0.00', , , , , '0%', '0.00%', '0.00E+00', '# ?/?', '# ??/??', 'mm-dd-yy', 'd-mmm-yy', 'd-mmm', 'mmm-yy', 'h:mm AM/PM', 'h:mm:ss AM/PM',
				'h:mm', 'h:mm:ss', 'm/d/yy h:mm', , , , , , , , , , , , , , , '#,##0 ;(#,##0)', '#,##0 ;[Red](#,##0)', '#,##0.00;(#,##0.00)', '#,##0.00;[Red](#,##0.00)', , , , , 'mm:ss', '[h]:mm:ss', 'mmss.0', '##0.0E+0', '@'], alphabet:'ABCDEFGHIJKLMNOPQRSTUVWXYZ', numAlpha:function (i) {
				var t = Math.floor(i / 26) - 1;
				return (t > -1 ? this.numAlpha(t) : '') + this.alphabet.charAt(i % 26);
			}, alphaNum:function (s) {
				var t = 0;
				if (s.length === 2) {
					t = this.alphaNum(s.charAt(0)) + 1;
				}
				return t * 26 + this.alphabet.indexOf(s.substr(-1));
			}, convertDate:function (input) {
				return typeof input === 'object' ?
					((input - (Date.UTC(1900,0,0) + input.getTimezoneOffset() * 60000)) / 86400000) + 1 :
					new Date(+(Date.UTC(1900,0,0) + input.getTimezoneOffset() * 60000) + (input - 1) * 86400000);

			}, typeOf:function (obj) {
				return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
			}, getAttr:function (s, n) {
				s = s.substr(s.indexOf(n + '="') + n.length + 2);
				return s.substring(0, s.indexOf('"'));
			},
			escapeXML: function(s) {
				return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
			}, // see http://www.w3.org/TR/xml/#syntax
			unescapeXML: function(s) {
				return (s || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, '\'');
			}

        },

		constructor: function(config) {
			config = config || {};

			Ext.apply(this, config, {
				title: "Workbook",
				fileCreator : "UB",
				lastModifiedBy: "UB",
				fileCreated : new Date(),
				fileModified : new Date(),
				useSharedString : false,
				windowHeight    : 9000,
				windowWidth     : 50000,
				protectStructure: false,
				protectWindows  : false
			});

			this.worksheets = [];
			this.compiledWorksheets = [];
			this.sharedStrings  = {};
			this.sharedStringsArr  = [];
			this.sharedStringIndex = 0;
			this.sharedStringTotal = 0;
			//toLog('create XLSX.csStyle');
			this.style = new XLSX.csStyle();
			//toLog('created XLSX.csStyle');
		},

		addWorkSheet: function(config){
			config.id = this.worksheets.length + 1;
			var ws = new XLSX.csWorksheet(config, this);
			this.worksheets.push(ws);
			return ws;
		},

		addString: function(value){
			var st = XLSX.csWorkbook,
				val = st.escapeXML(value),
				index = this.sharedStrings[val];
			this.sharedStringTotal++;
			if (!index) {
				index = this.sharedStrings[val] = this.sharedStringIndex;
				this.sharedStringIndex++;
				this.sharedStringsArr.push(val);
			}
			return index;
		},

		render: function() {
			var zip = this.zip = new JSZip(),
				xl, xlWorksheets, context;

			//{ Fully static
			zip.folder('_rels').file('.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
			this.docProps = zip.folder('docProps');

			xl = zip.folder('xl');
			xl.folder('theme').file('theme1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="宋体"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS P????"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:shade val="93000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>');
			xlWorksheets = xl.folder('worksheets');
			//}
			//{ Not content dependent
			this.docProps.file('core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>' +
					(this.fileCreator) + '</dc:creator><cp:lastModifiedBy>' + (this.lastModifiedBy || 'UB') + '</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">' +
					(this.fileCreated).toISOString() + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + (this.fileModified ).toISOString() + '</dcterms:modified></cp:coreProperties>'
			);
			//}

			context = { xlWorksheets: xlWorksheets, xl: xl  };
			this.compileWorksheets(context);

			xl.file('styles.xml', this.style.render(context) );

			//{ [Content_Types].xml
			zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
				context.contentTypes.join('') + '<Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>' +
				context.contentTypesTab.join('') + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>');
			//}
			//{ docProps/app.xml
			this.docProps.file('app.xml',
					'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>UB</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>' +
					this.worksheets.length + '</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="' +
					context.props.length + '" baseType="lpstr"><vt:lpstr>' +
					context.props.join('</vt:lpstr><vt:lpstr>') +
					'</vt:lpstr></vt:vector></TitlesOfParts><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>');
			//}
			//{ xl/_rels/workbook.xml.rels
			xl.folder('_rels').file('workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
				context.xlRels.join('') + '<Relationship Id="rId' + (context.xlRels.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>' +
				'<Relationship Id="rId' + (context.xlRels.length + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
				'<Relationship Id="rId' + (context.xlRels.length + 3) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/></Relationships>');
			//}
			//{ xl/sharedStrings.xml
			xl.file('sharedStrings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' +
				this.sharedStringTotal + '" uniqueCount="' + this.sharedStringsArr.length + '"><si><t>' +
				this.sharedStringsArr.join('</t></si><si><t>') + '</t></si></sst>');
			//}
			//{ xl/workbook.xml
			xl.file('workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
				'<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="9303"/><workbookPr defaultThemeVersion="124226"/><bookViews><workbookView ' +
				(this.activeWorksheet ? 'activeTab="' + this.activeWorksheet + '" ' : '') +
				'xWindow="480" yWindow="60" windowWidth="18195" windowHeight="8505"/></bookViews><sheets>' +
				context.worksheets.join('') + '</sheets><calcPr calcId="145621"/></workbook>');
			//}

      return zip.generateAsync({type:"string",  compression : this.compression})
		},

		/**
		 * Compression for workbook
		 */
		compression: 'STORE',
		/**
		 * Setting up custom compression for workbook
		 * @param {String} compression ("DEFLATE" || "STORE")
		 */
		setCompression: function(compression) {
			this.compression = compression;
		},

		compileWorksheets: function(context) {
			context.contentTypes = [];
			context.contentTypesTab = [];
			context.props = [];
			context.xlRels = [];
			context.worksheets = [];


			Ext.each(this.worksheets, function(worksheet) {
				worksheet.render(context);
			}, this);
		},

		test: function(){
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
			var wb = this;
			wb.useSharedString = false;
			var defFont = this.style.fonts.add({code: 'def',  name: 'Calibri', fontSize: 11, scheme: "minor" });
			var borderFull =  wb.style.borders.add({left: {style: 'thin'}, right: {style: 'thin'}, top: {style: 'thin'}, bottom: {style: 'thin'} });

			var fstyle  = this.style.getStyle({font: defFont});
			var fstyleborderFull  = this.style.getStyle({font: defFont, border: borderFull});
			// this.style.fonts.named.def
			var ws = wb.addWorkSheet({});
			var columnTemplate = [
				{column: 1, style: fstyle },
				{column: 3, style: fstyle },
				{column: 4, style: fstyleborderFull }
			];
			ws.addRow([{value: "test"},{value: "2"}, {value: 256}], columnTemplate);
			ws.addRow([{value: "test"},{value: "2"}, {value: 256}], columnTemplate);
			ws.addRow([{value: "test"},{value: "2"}, {value: 256}], columnTemplate);
			if (!UB.isServer){
				var rData = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + wb.render();
				window.open(rData);
			} else {
				var res = wb.render(); // btoa(wb.render());
				toLog('write file D:\\m3\\Work\\xlsx\\test000.xlsx');
				writeFile('D:\\m3\\Work\\xlsx\\test000.xlsx', res, false);

			}
		}


});
