/* global PDF, UB, Ext, window */
/*
 { "cmdType": "showForm",
 "formCode": function(){
 debugger;
 var rep = Ext.create("PDF.cstestReport");
 rep.doTest();
 //alert('ddd');
 },
 "cmdData":{
 "params":[{
 "entity": "doc_incdoc",
 }]
 }
 }
*/

Ext.define('PDF.cstestReport', {
//  alias: 'widget.settingsform',
  requires: (!UB.isServer) ? [
    'UB.view.BaseWindow',
    'UB.ux.UBObject',
    'PDF.csPrintToPdf',
    'PDF.csPdfDataGrid'
  ] : [
    'PDF.csPrintToPdf',
    'PDF.csPdfDataGrid'
  ],
  pdfObject: null,  // UB.ux.UBObject

  doTest: function () {
    this.pdfForm()
    this.pdfDoc()
  },

  doTest2: function () {
    this.pdfForm()
    this.pdfDoc2()
  },

  pdfForm: function () {
    var adobePdfPanel, form, pObj

    adobePdfPanel = Ext.widget('panel', {
      border: true,
      flex: 1
    })

    form = Ext.create('UB.view.BaseWindow', {
      title: 'PDF',
      width: 800,
      height: 600,
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [
        adobePdfPanel
      ]
    })

    pObj = Ext.create('UB.ux.UBObject')
    pObj.setXSize({
      width: '100%',
      height: '100%'
    })
    adobePdfPanel.add(pObj)
    this.pdfObject = pObj
    form.show()
  },

  pdfDoc2: function () {
    var me = this
    if (!this.requireChecked) {
      this.requireChecked = true
      PDF.init().done(function () {
        PDF.csPrintToPdf.requireFonts(
          {fonts: [
                        { fontName: 'CalibriImp', fontStyle: 'Normal'},
                        { fontName: 'CalibriImp', fontStyle: 'Bold'},
                        { fontName: 'CalibriImp', fontStyle: 'Italic'},
                        { fontName: 'CourierImp', fontStyle: 'Normal'},
                        { fontName: 'FixSys', fontStyle: 'Normal'},
                        { fontName: 'TimesNewRoman', fontStyle: 'Normal'},
                        { fontName: 'TimesNewRoman', fontStyle: 'Bold'},
                        { fontName: 'TimesNewRoman', fontStyle: 'Italic'}
          ],
            onLoad: this.pdfDoc2,
            scope: this
          })
      }.bind(this))
      return
    }

    var
      doc = new PDF.csPrintToPdf({
        font: {
          name: 'TimesNewRoman',
          type: 'Normal',
          size: 12
        },
        margin: {
          top: 10,
          right: 8,
          bottom: 8,
          left: 20
        }, /*
                bottomColontitle: {
                    font: {
                        name: "TimesNewRoman",
                        type: "Normal",
                        size: 12
                    },
                    height: 8
                }, */
        listeners: {
          initColontitle: function (doc, res) {
            res.align = 'center'
                        // res.text = "стор. "+ doc.getPageNumber() +" з "+ res.totalPages;
          }
        }
      }), grid,
      text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ullamcorper varius quam quis dapibus. Donec congue velit in mi auctor sagittis. Maecenas auctor sapien sapien, et pulvinar dolor hendrerit sit amet. Ut vestibulum feugiat nibh ut lobortis. Vestibulum vel rutrum nibh. Sed at velit varius, elementum lacus vel, rutrum nibh. Nulla in imperdiet urna, at dignissim nunc. Nulla auctor nibh vitae elit facilisis, non malesuada nibh ultricies. Praesent tincidunt, lectus sed porta rutrum, risus felis suscipit turpis, eu luctus elit nisl ut purus. Donec sit amet sapien ac nulla vestibulum commodo. In hac habitasse platea dictumst.',
      configs = [{ width: 50 }, { width: 130, border: {left: 1, top: 1, bottom: 1, right: 1} }],
      rows = [],
      i

    doc.writeSimpleText({text: 'Тест'})

    doc.setPosition(170)
    doc.setlineHeight(1.5)

    doc.writeSimpleText({text: 'İqtisadi İnkişaf Nazirliyinin Xarici investisiyalar və yardımların əlaqələndirilməsi şöbəsinin müdir müavini Tural İsaq oğlu Bağırzadə, Xarici investisiya siyasəti sektorunun müdiri Orxan Akif oğlu Qayıbov, məsləhətçisi Xəqani Yaşar oğlu İsayev, Xarici investisiya layihələri sektorunun baş məsləhətçisi Könül İsmət qızı Alıyeva, Yardımların əlaqələndirilməsi sektorunun aparıcı məsləhətçisi Aytən Rəfail qızı Əfəndiyeva, Xarici iqtisadi əlaqələr şöbəsinin Dövlətlərarası iqtisadi əməkdaşlıq sektorunun baş məsləhətçisi Sevinc Tərlan qızı Əliyeva, Beynəlxalq maliyyə institutları ilə əməkdaşlıq sektorunun baş məsləhətçisi Hüseyn Qənbər oğlu Quliyev, Regionların inkişafı və dövlət proqramları şöbəsinin Regionlarla iş sektorunun məsləhətçisi Elvin Elman oğlu Bağırov, Korporativ idarəetmə sektorunun məsləhətçisi Nicat İmran oğlu Eyvazzadə və Hüquq şöbəsinin Hüquqi təhlil və ekspertiza sektorunun məsləhətçisi İlqar İlham oğlu Poladov 2010-cu il 27 avqust tarixindən 14 sentyabr tarixinədək 18 təqvim günü müddətinə Koreya Respublikasının paytaxtı Seul şəhərinə ezam edilsinlər.\r\n            İqtisadi İnkişaf Nazirliyinin Xarici investisiyalar və yardımların əlaqələndirilməsi şöbəsinin müdir müavini Tural İsaq oğlu Bağırzadə, Xarici investisiya siyasəti sektorunun müdiri Orxan Akif oğlu Qayıbov, məsləhətçisi Xəqani Yaşar oğlu İsayev, Xarici investisiya layihələri sektorunun baş məsləhətçisi Könül İsmət qızı Alıyeva GH ghgj nbm.\r\n            Diacritical markss cath be used in combination with alphnumeric characters is, produce a charavcters that is nots present in the character set (encoding) used in the page. Diacritical markss catn is be used in combination with alphanimeric characters, produce a charavcters.\r\n            Diacritical markss cath be used in combination with alphnumeric characters, produce a charavcters that is nots been present in the character set (encoding) used in the page. Diacritical markss catn be used in combination with alphanimeric characters, produce SDdsadaa.'}
        )

        /*
        doc.writeSimpleText({
            //text: 'İqtisadi İnkişaf Nazirliyinin Xarici investisiyalar və yardımların əlaqələndirilməsi şöbəsinin müdir müavini Tural İsaq oğlu Bağırzadə, Xarici investisiya siyasəti sektorunun müdiri Orxan Akif oğlu Qayıbov, məsləhətçisi Xəqani Yaşar oğlu İsayev, Xarici investisiya layihələri sektorunun baş məsləhətçisi Könül İsmət qızı Alıyeva, Yardımların əlaqələndirilməsi sektorunun aparıcı məsləhətçisi Aytən Rəfail qızı Əfəndiyeva, Xarici iqtisadi əlaqələr şöbəsinin Dövlətlərarası iqtisadi əməkdaşlıq sektorunun baş məsləhətçisi Sevinc Tərlan qızı Əliyeva, Beynəlxalq maliyyə institutları ilə əməkdaşlıq sektorunun baş məsləhətçisi Hüseyn Qənbər oğlu Quliyev, Regionların inkişafı və dövlət proqramları şöbəsinin Regionlarla iş sektorunun məsləhətçisi Elvin Elman oğlu Bağırov, Korporativ idarəetmə sektorunun məsləhətçisi Nicat İmran oğlu Eyvazzadə və Hüquq şöbəsinin Hüquqi təhlil və ekspertiza sektorunun məsləhətçisi İlqar İlham oğlu Poladov 2010-cu il 27 avqust tarixindən 14 sentyabr tarixinədək 18 təqvim günü müddətinə Koreya Respublikasının paytaxtı Seul şəhərinə ezam edilsinlər.\r\nİqtisadi İnkişaf Nazirliyinin Xarici investisiyalar və yardımların əlaqələndirilməsi şöbəsinin müdir müavini Tural İsaq oğlu Bağırzadə, Xarici investisiya siyasəti sektorunun müdiri Orxan Akif oğlu Qayıbov, məsləhətçisi Xəqani Yaşar oğlu İsayev, Xarici investisiya layihələri sektorunun baş məsləhətçisi Könül İsmət qızı Alıyeva GH ghgj nbm.\r\n            Diacritical markss cath be used in combination with alphnumeric characters is, produce a charavcters that is nots present in the character set (encoding) used in the page. Diacritical markss catn is be used in combination with alphanimeric characters, produce a charavcters.\r\n            Diacritical markss cath be used in combination with alphnumeric characters, produce a charavcters that is nots been present in the character set (encoding) used in the page. Diacritical markss catn be used in combination with alphanimeric characters, produce SDdsadaa.',
            text: 'Some diacritical marks, like grave (  ̀) and acute (  ́) are called accents.\
            Diacritical mn arks can appear aboth above and below a letter, inside a letter, and between twcco lettersn.\
                Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a  charavcters that is nots  present  in the character set (encoding) used in the page.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a .                        \
            Diacritical markss  catn  be used in combination with alphanumeric.Some diacritical marks, like grave (  ̀) and acute (  ́) are called accents.\
            Diacritical mn arks can appear aboth above and below a letter, inside a letter, and between twcco lettersn.         \
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a  charavcters that is nots  present  in the character set (encoding) used in the page.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a .  \
            Diacritical markss  catn  be used in combination with alphanumeric.Some diacritical marks, like grave (  ̀) and acute (  ́) are called accents.\
            Diacritical mn arks can appear aboth above and below a letter, inside a letter, and between twcco lettersn.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a  charavcters that is nots  present  in the character set (encoding) used in the page. Diacritical markss  catn  be used in combination with alphanumeric characters, to produce SDdsadaa .\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce SDASDSADa .\
            Diacritical markss  catn  be used in combination with alphanumeric.Some diacritical marks, like grave (  ̀) and acute (  ́) are called accents.\
            Diacritical mn arks can appear aboth above and below a letter, inside a letter, and between twcco lettersn.                          \
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a  charavcters that is nots  present  in the character set (encoding) used in the page.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce aNMIMGNFFF .\
            Diacritical markss  catn  be used in combination with alphanumeric.Some diacritical marks, like grave (  ̀) and acute (  ́) are called accents.\
            Diacritical mn arks can appear aboth above and below a letter, inside a letter, and between twcco lettersn.         \
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a  charavcters that is nots  present  in the character set (encoding) used in the page.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a .                                                 \
            Diacritical markss  catn  be used in combination with alphanumeric.Some diacritical marks, like grave (  ̀) and acute (  ́) are called accents.\
            Diacritical mn arks can appear aboth above and below a letter, inside a letter, and between twcco lettersn.                                    \
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a  charavcters that is nots  present  in the character set (encoding) used in the page.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce adsadsadsadasdasMIRAGA .\
            Diacritical markss  catn  be used in combination with alphanumeric.Some diacritical marks, like grave (  ̀) and acute (  ́) are called accents.\
            Diacritical mn arks can appear aboth above and below a letter, inside a letter, and between twcco lettersn.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a  charavcters that is nots  present  in the character set (encoding) used in the page.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a .\
            Diacritical markss  catn  be used in combination with alphanumeric.Some diacritical marks, like grave (  ̀) and acute (  ́) are called accents.\
            Diacritical mn arks can appear aboth above and below a letter, inside a letter, and between twcco lettersn.            \
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a  charavcters that is nots  present  in the character set (encoding) used in the page.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a .\
            Diacritical markss  catn  be used in combination with alphanumeric.Some diacritical marks, like grave (  ̀) and acute (  ́) are called accents.\
            Diacritical mn arks can appear aboth above and below a letter, inside a letter, and between twcco lettersXn .  \
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a  charavcters that is nots  present  in the character set (encoding) used in the page.\
            Diacritical markss  catn  be used in combination with alphanumeric characters, to produce a sdasdsadasdsadasdsadsa.\
            Diacritical markss  catn  be used in combination with alphanumeric. ',
            splitOnPage: true,
            align: 'justify'
        });

        grid = doc.createGrid({ splitOnPage: true,
            rowMargin: {top: 3, bottom: 300}
        });

            //, splitOnPage: false

        for (i = 1; i < 17; i++) {
            rows.push(grid.addRow(
                ["["+i+"]", text],
                configs, {splitOnPage: false}
            ));
        }

        for (i = 1; i < 17; i++) {
            rows.push(grid.addRow(
                ["["+i+"L]", text],
                [{ width: 10, border: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 }, margin: { bottom: 20 } }, { width: 40, border: { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 }, margin: { bottom: 20 } }]
            ));
        }
        rows.push(grid.addRow(
            ["Дата прийняття рішення про державну реєстрацію:", "29.01.2003"],
            [{ width: 50, splitOnPage: false, margin: { top: 24 } }, { width: 130, margin: { top: 24 } }]
        ));

        for (i = 1; i < 90; i++) {
            rows.push(grid.addRow(
                [i + " прийняття рішення про державну реєстрацію:", i + " 29.01.2003 - "],
                [{ width: 50, splitOnPage: false }, { width: 130 }],
                (i > 1 ? { rowMargin: {top: 3, bottom: 30}} : {})
            ));
        }
        */

    this.pdfObject.setSrc({
      url: doc.getOutputAsBlobUrl(),
      contentType: 'application/pdf'
    })
  },

  pdfDoc: function () {
    var
      me = this, i,
      creationDate = Ext.Date.format(new Date(), 'd.m.Y H:i(worry)'),
      stat = PDF.csPdfDataGrid,
      center = { align: 'center' },
      right = { align: 'right' },
      letters = 'Тест документа Тест апостроф ‘ и ‘\'',
      pdf, grid, text, testText, testText2, largeText, testText3, testText4, tesrText5

    testText3 = 'Житомирська обл., м. Новоград-Волинський, вул. Гайдара Аркадія, буд. 10\r\n11111111111111111111111111111111111111111111111111111111 11111111111111111111111111111111122222222222222222222222222222222222222222222222222222222222222222222222222222222222333333333333333333333333333333333333333333333333333333333333333333333333333333333333344444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444445555555555555555555555555555555555555555555555555555555555555555555555555555 55555556666666666666666666666666666666666666666666666666666666666666666666666666666666666666666777777777777777777777777777777777777777777777777777777777777777777777777777777777777771010101010101010111111111111111111111111111111111111111111111111111111111111111111111111111111111112121212121212121212121212121212121212121212121 212121212121212121212121212121212131313131313131313131313131313131313131313131313131313131313131313131313131313131313131414141414141414141414141414141414141414141414141414141414141414141414141414141414141414151515151515151515151515151515151515151515151515151515151515151515151515151516161616161616161616161616161616161616161616161616161616161616161616161616161616161617171717171717171717171717171717171717171717171717171717171717171717171717171717171717181818181818181818181818181818181818181818181818181818181818181818181818181818191919191919191919191919191919191919191919191919191919191919191919191919191919191919202020202020202020202020202020202020202020202020202020202020202020202020202020202020\r\n21\r\n22\r\n23\r\n24\r\n25\r\n26\r\n27\r\n28\r\n29\r\n30\r\n31\r\n32\r\n33\r\n34\r\n35\r\n36\r\n37\r\n38\r\n39\r\n40\r\n41\r\n42\r\n43\r\n44\r\n45\r\n46\r\n47\r\n48\r\n49\r\n50\r\n51\r\n52\r\n53\r\n54\r\n55\r\n56\r\n57\r\n58\r\n59\r\n60\r\n61\r\n62\r\n63\r\n64\r\n65\r\n66\r\n67\r\n68\r\n69\r\n70\r\n71\r\n72\r\n73\r\n74\r\n75\r\n76\r\n77\r\n78\r\n79\r\n80\r\n81\r\n82\r\n83\r\n84\r\n85\r\n86\r\n87\r\n88\r\n89\r\n90\r\n91\r\n92\r\n93\r\n94\r\n95\r\n96\r\n97\r\n98\r\n99\r\n100\r\n\r\n'
    testText = 'Законопроект уже доступен по адресу http://sips.gov.ua/ua/pr121313. Викимедиа Украина уже официально заявила о своей глубокой взволнованности, однако протестного настроения более пока не заметно.' +
          'Самое интересное из этого законопроекта \r\n' +
          '1. Вносятся изменения сразу в ряд законов (о защите авторских прав, телекоммуникациях, милиции, нотариате и кодексе об админ.нарушениях).\r\n' +
          '2. Нотариальная распечатка страницы веб-сайта становится легальным инструментом (даже боюсь представить перспективы злоупотреблений).\r\n' +
          '3. Любой сайт можно заблокировать без решения суда, только на основании заявления о нарушении авторских прав.\r\n' +
          '4. Ответственность за недостоверное предоставление информации о нарушении авторских прав нигде не прописано.\r\n' +
          '5. Удачный политический момент для появления такого инструмента (на фоне появления большого количества неконтролируемых властью прямых трансляций политических событий).\r\n' +
      'Добро пожаловать в 1984.'

    testText2 = 'Длиннота: "невизначене майно, майнове право на нерухомість, право власності на яке виникне в майбутньому, а саме на: квартиру, проектний номер - 5 (п’ять), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 4 (чотири), загальна проектна площа – 167,25 кв. м.квартиру, проектний номер - 5 (п’ять), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 4 (чотири), загальна проектна площа – 167,25 кв. м.квартиру, проектний номер - 5 (п’ять), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 4 (чотири), загальна проектна площа – 167,25 кв. м.квартиру, проектний номер - 5 (п’ять), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 4 (чотири), загальна проектна площа – 167,25 кв. м.квартиру, проектний номер - 5 (п’ять), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 4 (чотири), загальна проектна площа – 167,25 кв. м.квартиру, проектний номер - 5 (п’ять), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 4 (чотири), загальна проектна площа – 167,25 кв. м., квартиру, проектний номер - 5 (п’ять), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 4 (чотири), загальна проектна площа – 167,25 кв. м., квартиру, проектний номер - 5 (п’ять), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 4 (чотири), загальна проектна площа – 167,25 кв. м., квартиру, проектний номер - 5 (п’ять), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 4 (чотири), загальна проектна площа – 167,25 кв. м., квартиру, проектний номер - 6 (шість), номер секції - 1 (один), поверх, відмітка - 4, +10.2, кількість кімнат – 3 (три), загальна проектна площа – 153,65 кв. м. в житловому будинку з вбудованими офісними приміщеннями, приміщеннями соціальної сфери та під’їзним паркінгом, що будується в місті Києві по вулиці Пирогова/Богдана Хмельницького, 2/37 (два дріб тридцять сім), літера «Б», будівництво якого не завершено."'
    testText4 = 'Усім освіченим людям відомо і аж надто відомо, що понеділок — день критичний або просто тяжкий і що з понеділка ні одна хоч трохи освічена людина не розпочне нічого поважного; краще вже пролежить цілий день і, хоч яка б там була пильна справа, вона й пальцем не ворухне. Та й справді, — як добре розважити — коли ми задля нікчемного срібника зневажатимемо святі заповіти старовини, що ж тоді з нас буде? Вийде якийсь француз або, не приведи Боже, куций німець; а від типу, чи пак од фізіономії національної й сліду не зостанеться. А я думаю, що нація без своєї власної риси, що тілько їй належить і тілько її характеризує, просто на кисіль, та ще й на несмачний кисіль скидається.\r\n\r\n' +
          '— Та ба! не так думають інші. От хоч би й наші військові, — куди їм до сучасників: на шляху освіти геть задніх попасають; вони, наприклад, зовсім не вірять у понеділок і цей святий заповіт батьків і дідів наших легкодумно називають бабськими вигадками. А попрохав би я цих прудивусів зазирнути, наприклад, хоч би до “Письмовника” славнозвісного Курґанова: саме там сказано, що ще стародавні халдейські маґи й звіздарі, а за ними й визнавці науки Зороастрової непохитно вірили, що понеділок — день критичний. Та куди там, — хіба втокмачиш що тому безпардонному вояцтву! Військова, справді військова людина, краще ще раз у карти програє або ще раз возьме в жида пляшку рому-самогону, — так званого “клоповика”, аніж запренумерує яку мудру книжку. От хоч би наприклад – “Ключъ къ таинствамъ природы” Еккартсгавзена з прегарними малюнками нашого слазнозвісного Єґорова; та куди там, — і слухати не хочуть!\r\n\r\n' +
          'Я все це до того веду, терпеливий читальнику, що, зневаживши освячені премногими літами вірування предків наших, саме в понеділок, вранці рано, з повітового міста П[ереяслава] п[олтавської] ґубернії виступив у похід чи то гусарський, чи то уланський полк, — уже добре не памятаю; памятаю тілько, що до збору сурми сурмили; тому й треба думати, що полк був кінний, бо коли б то була піхота, то до збору б у барабани били.\r\n\r\n' +
          'Коли входить або виходить із села чи містечка полк, то це дві великі події, особливо ж, якщо полк, чого не приведи Боже, пробув на постої хоч кілька день: тоді вихід його викликає сльози й дуже часто сльози найщиріші. Я це говорю тілько про прекрасну стать, а про чоловіків і наречених не кажу ні слова. Нічого не скажу й про вихід згаданого кавалєрійського полку із згаданого міста П[ереяслава], хіба тілько те, що полк провожало багато мирних міщанок, хоч погода й не зовсім тому сприяла, бо все падав дощ — затяжний, чи то “єхидний”, як його назвав небіжчик Гребінка, сиріч дрібний і обложний. Та не зважаючи на той єхидний дощ, багато міщанок провожало прудивусів своїх до села N., інші — до містечка Боришполя, а деякі, і то найбезкорисливіші, аж до рубежів київських, себто до перевозу на Дніпрі. А коли полк щасливо перевізся на той бік, то вони й собі, трохи поплакавши, теж подалися за Дніпро й розпорошилися в великому місті Києві та й заховали свої вчинки й сором по глухих притулках усякої розпусти.\r\n\r\n' +
          'Отакі то наслідки дає довгий постій найліпше вихованого полку.\r\n\r\n' +
          'Того ж понеділка, пізно ввечері, київським шляхом поверталася до міста П[ереяслава] молодиця і, не доходячи до міста верстов із чотири, саме напроти “Трибратніх” могил, звернула з шляху й сховалася в зеленому житі. Аж удосвіта вийшла вона з жита на шлях, несучи в руках щось загорнуте в сіру свитку. Пройшовши трохи шляхом, спинилася вона на поворітці та, подумавши недовго, кивнула виразисто головою, ніби на щось велике зважувалася, і швидко пішла вузенькою, порослою шпоришем доріжкою. Доріжка та вела до хутора старого сотника Сокири.\r\n\r\n' +
          'Другого дня вранці, себто у вівторок, вийшла пані Парасковія Тарасівна Сокириха погодувати з власних рук усяку дробину — цісарки, гуси, кури тощо (про голуби мав дбати сам пан сотник Ничипір федорович Сокира).\r\n\r\n' +
          'Уявіть же собі її жах, коли, виходячи на ґанок, побачила вона сіру свитку, що ворушилася, неначе жива. З переляку їй здавалося, що свитка ніби плаче, мов немовля. Довго вона дивилася на ту сіру свитку, слухала, як вона плаче, і сама не знала, що робити. Нарешті зважилася покликати Ничипора Федоровича.\r\n\r\n' +
          'Ничипір Федорович вийшов, як то кажуть, “неґліже”, але все таки в широченних китайчатих червоних штанях.'
    tesrText5 = 'Усім освіченим людям відомо і аж надто відомо, що понеділок — день критичний'

    if (!this.requireChecked) {
      this.requireChecked = true
      PDF.init().done(function () {
        PDF.csPrintToPdf.requireFonts(
          {fonts: [
                      { fontName: 'CalibriImp', fontStyle: 'Normal'},
                      { fontName: 'CalibriImp', fontStyle: 'Bold'},
                      { fontName: 'CalibriImp', fontStyle: 'Italic'},
                      { fontName: 'CourierImp', fontStyle: 'Normal'},
                      { fontName: 'FixSys', fontStyle: 'Normal'},
                      { fontName: 'TimesNewRoman', fontStyle: 'Normal'},
                      { fontName: 'TimesNewRoman', fontStyle: 'Bold'},
                      { fontName: 'TimesNewRoman', fontStyle: 'Italic'}
          ],
            onLoad: this.pdfDoc,
            scope: this
          })
      }.bind(this))
      return
    }

    // debugger;
    var stTime = (new Date()).getTime()

    pdf = Ext.create('PDF.csPrintToPdf', {
      font: {name: 'TimesNewRoman', size: 14, type: 'Normal'},
      margin: {top: 10, right: 8, bottom: 8, left: 20},
        // font: { name: 'CalibriImp',  type: 'Normal',   size: 13 },
      // margin: {left: 50, right: 80},
      topColontitle: {
        height: 8,
        font: { size: 10, wide: 0 }
      },
      bottomColontitle: {
        height: 8,
        font: { size: 10, wide: 0 }
      },
      listeners: {
        initColontitle: function (obj, result) {
          if (!result.colontitle.isTop) {
            result.align = PDF.csPrintToPdf.alignType.center
            result.text = 'created ' + creationDate + ' page ' + result.pageNumber + ' of ' + result.totalPages
          } else {
            result.align = PDF.csPrintToPdf.alignType.center
            result.text = 'test report - page ' + result.pageNumber + ' of ' + result.totalPages
          }
        },
        initPage: function (doc) {
                /*
                doc.pdf.setTextColorExt(180,180,180);
                for (var c = doc.page.innerSize.topColon; c < doc.page.innerSize.bottomColon; c += 30){
                    doc.createTextBox({
                        text: 'water mark',
                        pageNumber: doc.totalPageNumber,
                        font: {size: 32},
                        top: c
                    }) ;
                }
                doc.pdf.setTextColorExt(0,0,0);
                */
        }
      }
    })

    pdf.setFontColor('green')
    pdf.writeSimpleText({text: 'Test wordWrap ssssssssssssssssss 11111111111111111111111111111 5555555555555555555555 777777' +
          testText4,
      wordWrap: false,
      splitOnPage: false,
      align: 'left',
      width: 150})

    pdf.setFontColor('pink')

    grid = pdf.createGrid({
      splitOnPage: true,
      columns: [
              { width: 30, border: {top: '1pt', bottom: '1pt', left: '1pt', right: '1pt', color: 'red' }, align: 'center', hAlign: 'center'},
              { width: 30, border: '1pt', borderColor: 'red', align: 'center', hAlign: 'center'},
              { width: 20, border: '1pt', borderColor: 'red', align: 'right', hAlign: 'bottom'},
              { width: 10, border: '1pt', borderColor: 'red', hAlign: 'bottom'}
      ]
    })

    grid.addRow(['cellNum 1  rowSpan: 2, colSpan: 2 ', 'cellNum 2 colSpan: 2 '], [{rowSpan: 2, colSpan: 2}, { colSpan: 2}])
    grid.addRow(['cellNum 3', 'cellNum 4'])
    grid.addRow(['cellNum 5', 'cellNum 6 colSpan: 2 ', 'cellNum 7'], [{}, {colSpan: 2}, {rowSpan: 2}])
    grid.addRow(['cellNum 8', 'cellNum 9', 'cellNum 10'])

      // var textw =  pdf.getTextWidth(testText3);
      // textw =  pdf.getTextWidth('test');

    pdf.writeSimpleText({text: 'Test wordWrap ssssssssssssssssss 11111111111111111111111111111 5555555555555555555555 777777' +
          testText4,
      wordWrap: false,
      splitOnPage: false,
      align: 'left',
      width: 150})

    pdf.writeSimpleText({text: 'This is <b>bold text</b>and this is <i>italic</i><br/>on new line. Colors: ' +
          '<font color="red">R</font><font color="orange">A</font><font color="yellow">I</font>' +
          '<font color="green">N</font><font color="#6495ed">B</font><font color="blue">O</font>' +
          '<font color="#9370db">W</font>',
      isXml: true})

    for (var x = 7; x < 42; x++) {
      pdf.writeSimpleText({text: tesrText5, align: 'left', font: {size: x } })
    }

    pdf.writeSimpleText({text: testText4, splitOnPage: false, align: 'justify', width: 150})
    pdf.writeSimpleText({text: testText3, splitOnPage: true, align: 'justify', width: 150})
    pdf.movePosition(10)
    pdf.writeSimpleText({text: testText4 + '\r\n\r\n' + testText, splitOnPage: true, align: 'justify'})
    pdf.movePosition(10)

      // pdf.pdf.setLineLeading(2);
     // console.log(JSON.stringify(pdf.page));

     /*
     for(i = 0; i < 50000; i++){
         var top = 0;
         pdf.pdf.textExt(
              0, top, "1Загальна площа (кв.м): 75, Матеріали стін: дерево, Площа земельної ділянки (кв.м): 175,",
              {wordWrap: false}
         );
         top += 9;
         if (top > 180){
             pdf.addPage();
             top = 0;
         }
         //pdf.writeSimpleText({text:"1Загальна площа (кв.м): 75, Матеріали стін: дерево, Площа земельної ділянки (кв.м): 175, Відсоток зносу aaaaaaaaa"});
     }
      alert((new Date()).getTime() - stTime );
     */

      // pdf.writeSimpleText({text:"1Загальна площа (кв.м): 75, Матеріали стін: дерево, Площа земельної ділянки (кв.м): 175, Відсоток зносу aaaaaaaaa", splitOnPage:true});
      // pdf.movePosition(10);

    grid = pdf.createGrid({
      splitOnPage: true,
      columns: [
              { width: 50, border: {top: 1, bottom: 1, left: 1, right: 1, color: [200, 200, 160]}},
              { width: 130, border: {top: 1, bottom: 1, left: 1, right: 1, color: [255, 90, 0]}}
      ]
    })
    grid.addRow(['Тип майна', 'домоволодіння, Сарай літ Б\r\nПогріб  літ В\r\nОгорожа 1-2 \r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n \r\nліт В'])
    grid.addRow(['Тип майна', 'домоволодіння, Сарай літ Б\r\nПогріб  літ В\r\nОгорожа 1-2 \r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n \r\nліт В'])
    pdf.movePosition(10)

      /*
      grid = pdf.createGrid({
          columns:[
              {width: 50,  border: 1},
              {width: 128,  border: 1}
          ],
          splitOnPage: true
      });
      grid.setColumnProps([{ align: 'left' }, { align: 'left' }]);
      for (i = 0; i<8; i++){
          res = grid.addRow(["\r\nSexsiyyet haqqinda sahadetname\r\n\r\n\r\nIs yeri\r\n\r\n\r\nUnvan (yasayis yeri)\r\n\r\n\r\n","\r\nidentCard\r\n\r\n\r\n\r\nworkPlace\r\n\r\n\r\npersAdd\r\n\r\n\r\n"]);
          res = grid.addRow(["\r\nDiger kontaktlar\r\n\r\n\r\nEvvelki muracietler\r\n\r\n\r\nQebulun esasi\r\n\r\n\r\nKimin qebuluna gelib(devet olunub)\r\n\r\n\r\nMuracietin mahiyyeti\r\n\r\n\r\n","\r\ncontacts\r\n\r\n\r\npreviousAppeals\r\n\r\n\r\ncitizenReceptionReason\r\n\r\n\r\nwhom\r\n\r\n\r\n\r\nshortTxt\r\n\r\n\r\n"]);
          res = grid.addRow(["\r\nGorulmus isl?r\r\n\r\n\r\nQebuluna yazildigi resmi sexs\r\n\r\n\r\nRazilasdirilmis qebul vaxti\r\n\r\n\r\nVezifeli sexs terefinden gorulen is\r\n\r\n\r\n",          "\r\nstatic!!\r\n\r\n\r\nexecName\r\n\r\n\r\n\r\nexpDateReception\r\n\r\n\r\n\r\nexpertsReport\r\n\r\n\r\n"]);
      }
      res = grid.addRow(['','']);
      res = grid.addRow(["\r\nGorulmus isl?r\r\n\r\n\r\nQebuluna yazildigi resmi sexs\r\n\r\n\r\nRazilasdirilmis qebul vaxti\r\n\r\n\r\nVezifeli sexs terefinden gorulen is\r\n\r\n\r\n",          '']);
      res = grid.addRow(['',          "\r\nstatic!!\r\n\r\n\r\nexecName\r\n\r\n\r\n\r\nexpDateReception\r\n\r\n\r\n\r\nexpertsReport\r\n\r\n\r\n"]);
      res = grid.addRow(['',          "\r\nstatic!!\r\n\r\n\r\nexecName\r\n\r\n\r\n\r\nexpDateReception\r\n\r\n\r\n\r\nexpertsReport\r\n\r\n\r\n"]);
      res = grid.addRow(['',          "\r\nstatic!!\r\n\r\n\r\nexecName\r\n\r\n\r\n\r\nexpDateReception\r\n\r\n\r\n\r\nexpertsReport\r\n\r\n\r\n"]);
      res = grid.addRow(["\r\nGorulmus isl?r\r\n\r\n\r\nQebuluna yazildigi resmi sexs\r\n\r\n\r\nRazilasdirilmis qebul vaxti\r\n\r\n\r\nVezifeli sexs terefinden gorulen is\r\n\r\n\r\n",          '']);
      res = grid.addRow(["\r\nGorulmus isl?r\r\n\r\n\r\nQebuluna yazildigi resmi sexs\r\n\r\n\r\nRazilasdirilmis qebul vaxti\r\n\r\n\r\nVezifeli sexs terefinden gorulen is\r\n\r\n\r\n",          '']);
      res = grid.addRow(["\r\nGorulmus isl?r\r\n\r\n\r\nQebuluna yazildigi resmi sexs\r\n\r\n\r\nRazilasdirilmis qebul vaxti\r\n\r\n\r\nVezifeli sexs terefinden gorulen is\r\n\r\n\r\n",          '']);
      res = grid.addRow(['','']);
      res = grid.addRow(['','']);
      res = grid.addRow(['','']);
      pdf.movePosition(10);
      */

      /*
      pdf.writeSimpleText({text:"Загальна площа (кв.м): 75, Матеріали стін: дерево, Площа земельної ділянки (кв.м): 175, Відсоток зносу aaaaaaaaa"});

      var testText0 = "";
      for (i = 0; i < 800; i++){
          testText0 += 'test12345678';
      }
      //debugger;
      pdf.writeSimpleText({text: testText0, splitOnPage: true});
      pdf.movePosition(10);
      pdf.writeSimpleText({text: testText0, splitOnPage: true});
      pdf.movePosition(10);
      pdf.writeSimpleText({text: testText0, splitOnPage: true, font: { type: "Bold" }});
      pdf.movePosition(10);
      pdf.writeSimpleText({text: testText0, splitOnPage: true, font: { type: "Italic" }});

      largeText =  testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText + testText;
      //debugger;
      var tbN = pdf.createTextBox({text: largeText, splitOnPage: true, width: pdf.page.innerSize.width, border: "TB"});
      if (tbN.lastPageNumber){
          pdf.setPage(tbN.lastPageNumber);
          pdf.addPage();
          //pdf.setPosition(tbN.splitItems[tbN.splitItems.length-1].bottom + 10 );
      }

      for (i = 0 ; i < 12; i++){
          pdf.writeSimpleText({text: testText + testText + testText + testText + testText + testText + testText, lineHeight: 2, splitOnPage: true, align: "center" });
      }

      pdf.writeSimpleText({text: "Заголовок для теста!!!!!!!!!!!!!!!!!! ", align: "center" });
      pdf.movePosition(10);
      grid = pdf.createGrid({
          columns:[
              {width: 50, border: stat.brdNone}, // stat.brdFull
              {width: 145, border: stat.brdNone, lineHeight: 2}
          ],
          splitOnPage: true
      });
      grid.setColumnProps([{ align: 'left' }, { align: 'left' }]);

     var middleText =  testText + testText ;
     for ( i = 0; i < 10 ; i++){
         var res = grid.addRow(["middleText", middleText]);
         res = grid.addRow(["middleText", "middleText"]);
         //res.items[0]
     }

      for ( i = 0; i < 600 ; i++){
          grid.addRow(["Одна строка " + i,"Первая строка\r\n вторая строка\r\nТретья строка"]); //testText3
      }

      for ( i = 0; i < 600 ; i++){
          grid.addRow(["Первая строка\r\n вторая строка" + i,"Первая строка\r\n вторая строка\r\nТретья строка"]); //testText3
      }

      for ( i = 0; i < 600 ; i++){
          grid.addRow(["Первая\r\n вторая строка" + i,"Одна строка"]); //testText3
      }

    for (i= 0; i < 200; i++){
      pdf.writeSimpleText({text: "Заголовок для теста!!!!!!!!!!!!!!!!!! ", align: "center" });
    }

    grid = pdf.createGrid({
      columns:[
        {width: 50, border: stat.brdFull},
        {width: 35, border: stat.brdFull},
        {width: 35, border: stat.brdFull},
        {width: 35, border: stat.brdFull}
      ]
    });
    //grid.addRow(["Поле 1", "Поле 2", "Поле 3", "Поле 4"], [center, center, {}, center]);
    grid.setColumnProps([right, { align: 'center' }, { align: 'left' }, right]);

    //  pdf.setFont({
//      name: 'CourierImp',
//      type: 'Normal',
//      size: 13
//    });
//    grid.addRow([letters, 'CourierImp']);
//    pdf.setFont({
//      name: 'UniversImp',
//      type: 'Normal',
//      size: 13
//    });
//    grid.addRow([letters, 'UniversImp']);
//    pdf.setFont({
//      name: 'FixSys',
//      type: 'Normal',
//      size: 13
//    });
//    grid.addRow([letters, 'FixSys']);
//    pdf.setFont({
//      name: 'CalibriImp',
//      type: 'Normal',
//      size: 13
//    });
//    grid.addRow([letters, 'CalibriImp']);
    // #####################

      for( var x = 0; x < 30; x++){
      grid.addRow(['постанова, сер\r\nія та номер: 581/9, 27.06.2003, Деpжавна виконавча служба, Голосіївська',
          'постанова, серія та номер: 581/9, 27.06.2003, Деpжавна виконавча служба, Голосіївська\n',
          'постанова,\n серія та номер: \n581/9, 27.06.2003, \nДеpжавна виконавча служба, Голосіївська',
          'постанова, серія та номер: 581/9, 27.06.2003, Деpжавна виконавча служба, Голосіївська']);
      }

      pdf.movePosition(10);

      pdf.setFont({type:'Bold'});
      for( x = 0; x < 30; x++){
          grid.addRow(['постанова, сер\r\nія та номер: 581/9, 27.06.2003, Деpжавна виконавча служба, Голосіївська',
              'постанова, серія та номер: 581/9, 27.06.2003, Деpжавна виконавча служба, Голосіївська\n',
              'постанова,\n серія та номер: \n581/9, 27.06.2003, \nДеpжавна виконавча служба, Голосіївська',
              'постанова, серія та номер: 581/9, 27.06.2003, Деpжавна виконавча служба, Голосіївська']);
      }

      pdf.movePosition(10);

      pdf.setFont({type:'Italic'});
      for( x = 0; x < 30; x++){
          grid.addRow(['постанова, сер\r\nія та номер: 581/9, 27.06.2003, Деpжавна виконавча служба, Голосіївська',
              'постанова, серія та номер: 581/9, 27.06.2003, Деpжавна виконавча служба, Голосіївська\n',
              'постанова,\n серія та номер: \n581/9, 27.06.2003, \nДеpжавна виконавча служба, Голосіївська',
              'постанова, серія та номер: 581/9, 27.06.2003, Деpжавна виконавча служба, Голосіївська']);
      }

      pdf.movePosition(10);

      pdf.setFont({type:'Normal'});

      grid = pdf.createGrid({
          columns:[
              {width: 50, border: stat.brdNone}, // stat.brdFull
              {width: 105, border: stat.brdNone}
          ]
      });
      //grid.addRow(["Поле 1", "Поле 2", "Поле 3", "Поле 4"], [center, center, {}, center]);
      grid.setColumnProps([{ align: 'left' }, { align: 'left' }]);
      grid.addRow(["0", "состав: ціле , состояние: добудоване , статус: жиле , комментарий: б\\о \"беpюса\"\r\nДонецька обл.\r\n Пеpшотpавневий р-н \r\nс. Юp*ївка \r\nвул. Гагаpіна\r\n\r\n"]);
      for( x = 0; x < 10; x++){
          grid.addRow([x, testText ]);
      }
    for ( i = 0; i < 6; i++){
      pdf.addPage();
      pdf.createTextBox({
          text: letters,
          align: 'center'
      });
    }

    for(var i = 1; i < 100; i++) {
      grid.addRow([i, i * 9999999, i * 99999999999999999, i * 1000000000]);
      grid.addRow([i, i * 9999999, i * 99999999999999999 + ' 1', i * 1000000000]);
    }

    pdf.movePosition(10);
    pdf.createTextBox({
      text: letters,
      align: 'center'
    });
    pdf.writeSimpleText({
      text: letters,
      align: 'center'
    });
    */

    this.pdfObject.setSrc({
      url: pdf.getOutputAsBlobUrl(),
      contentType: 'application/pdf'
    })
  }
})
