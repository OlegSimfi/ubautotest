# Подсистема отчетности

## Общая информация
Предназначена для создания отчетов в разных форматах. На данный момент поддерживаются HTML и PDF. В подсистему входят: 

 - Реестр отчетов (сущность ubs_report)
 - Визуальный построитель отчетов (форма ubs_report-fm) 
 - Генератор отчетов (UBS.UBReport) 
 - Просмотрщик отчетов (UBS.ReportViewer)

Генератор отчетов может работать как на сервере так и на клиенте. Это позволяет перенести построение отчетов на сторону сервера.
Каждый отчет состоит из файла шаблона (расширение *.template) и программного кода (*.js). 
Физически файлы хранятся на сервере в папке public\reports моделей. 

В програмном коде можно: 

 - Загрузить все необходимые данные для отчета.
 - Задать форму ввода параметров. (только для генерации на клиентской стороне)
 - Задать любые другие преобразования в отчете

Шаблон отчета задается в формате HTML. По сути он является шаблоном для [Mustache](http://mustache.github.io/mustache.5.html).
При генерации отчета в формате PDF полученный HTML преобразовывается в PDF. Пример отчета с демонстрацией базовых возможностей входит 
в поставку модели UBS (В реестре код отчета test).

## Включение подсистемы
В конфигурационном файле UB:
Подключить модель UBS.

      	"domainConfigs": {
		"AppName": {
			"models": {
				"UBS": 		{ "path": "UB\\models\\UBS" }
			 }}
        }

Если предпологается выгрузка в PDF то нужно включить модель PDF

Ярлык для реестра отчетов

	{"cmdType": "showList",
	 "cmdData":{ 
	     "params":[{ 
	         "entity": "ubs_report", 
	          "method": "select", 
	          "fieldList": ["ID", "model", "report_code", "name"]         
	     }]
	 }
      	}
	
## Возмжности и ограничения

Каринки задаются только в формате base64.

###HTML

 - Ограничен возможностями языка HTML 
 - Нельзя задать колонтитулы
 - Нельзя задать специальную разметку при разрыве страницы. Например не разрывные блоки или строки таблицы

###PDF 

 - Ограниченый перечень тегов и атрибутов HTML. Полный перечень можно посмотреть {@link PDF.csPrintToPdf#writeHtml PDF.csPrintToPdf.writeHtml}
 - Ограниченные возможности расположения элементов. (нельзя использовать блочные элементы внутри строчного элемента) 
 - Поддержка колонтитулов. Задаются в програмном коде.
 - Неразрывные ячейки таблицы. Задается при промощи атрибута стиля disable-split: true.
 - Не поддерживается использование блочных элемнтов внутри строковых (inline)
 - Рядки таблиц должны всегда иметь ширину

Сквозные строки таблицы. Будут выводится на каждой сранице где присутствует таблица. 
Задается при промощи атрибута стиля top-through-line: true.

       <tr style="disable-split: true; top-through-line: true;">

Не разрывные строки таблицы. Можно указать не разрывать n строк в начале или в конце таблицы.

      <table style="indissoluble-first-rows: 5; indissoluble-end-rows: 6;">
	
## Настройка ПДФ отчетов (колонтитулы, отступы листа, шрифты)

На данный момент колонтитулы, отступы листа и шрифты можно настроить только в коде. Для этого служит конфигурационная функция onTransformConfig.

            onTransformConfig: function(config){
                  config.margin = {top: 10, right: 8, bottom: 8, left: 20};  // page padding
                  config.topColontitle = {
                        height: 8,
                        font: { size: 10, wide: 0 }
                  };
                  config.bottomColontitle = {
                    height: 28,
                    font: { size: 10, wide: 0 }
                  };
                  config.listeners = {
                    initColontitle: function(obj, result) {
                      if(!result.colontitle.isTop) {
                        result.align = PDF.csPrintToPdf.alignType.center;
                        result.text = '<p style="text-align:right">Текст</p><p style="text-align:left"> в верхнем колонтитуле <b>created</b> ' + result.currentDate ;
                        result.isXml = true;
                      } else {
                          result.align = PDF.csPrintToPdf.alignType.center;
                          result.text = 'page ' + result.pageNumber + ' of ' + result.totalPages;
                      }
                    }
                  };
                return config;
            }

Полный перечень настроек можно посмотреть [здесь](index.html#!/api/PDF.csPrintToPdf).

## Настройка панели параметров

В коде отчета можно настроить панель для ввода параметров отчета. Эти настройки будет использовать просмотрщик отчетов.
Для этого нужно в событии onParamPanelConfig создать нужную панель.

            onParamPanelConfig: function() {
                var paramForm = Ext.create('UBS.ReportParamForm', {
                    items: [{
                        xtype: 'textfield',
                        name: 'name',
                        fieldLabel: 'Name'
                    }, {
                        xtype: 'datefield',
                        name: 'birthday',
                        fieldLabel: 'Birthday',
                        allowBlank: false,
                        value: new Date()
                    },{
                        xtype: 'numberfield',
                        name: 'limitation',
                        fieldLabel: 'Limit to'
                    }
                    ],
                    getParameters: function(owner) {
                        var frm = owner.getForm();
                        return {
                            name: frm.findField('name').getValue(),
                            birthday: frm.findField('birthday').getValue(),
                            limitation: frm.findField('limitation').getValue()
                        };
                    }
                });
                return paramForm;
            }

Либо то же самое в упрощенном варианте:

            onParamPanelConfig: function() {
                  return  [{
                        xtype: 'textfield',
                        name: 'name',
                        fieldLabel: 'Name'
                    }, {
                        xtype: 'datefield',
                        name: 'birthday',
                        fieldLabel: 'Birthday',
                        allowBlank: false,
                        value: new Date()
                    },{
                        xtype: 'numberfield',
                        name: 'limitation',
                        fieldLabel: 'Limit to'
                    }
                    ];
            }

## Запуск отчета из ярлыка

Пример:

        {"cmdType": "showReport",
           "cmdData": {
               "reportCode": "test",
               "reportType": "pdf",
               "ReportParams": {"test": 1}
           }
        }

`reportCode` - код отчета
`reportType` - формат
`ReportParams` - перечень входных параметров

## Программный запуск формирования отчета

Пример для запуска на сервере:

          var UBReport = require('models/UBS/public/UBReport.js');
          var report = UBReport.makeReport('test','pdf',{});
           report.done(function(result){
             var fs = require('fs');
             if (result.reportType === 'pdf'){
                 toLog(result.reportData.byteLength);
                 fs.writeFileSync('d:\\result.pdf', result.reportData );
             } else {
                 toLog(result.reportData.length);
                 fs.writeFileSync('d:\\result.html', result.reportData );
             }
          });

На клиенте(WEB):

        UBS.UBReport.makeReport('test','pdf',{}).done(function(report){
                       var outputBlob = new Blob(
                        [report.reportData],
                        {type: "application/pdf"}
                    );

                    window.open( window.URL.createObjectURL(outputBlob), 'blank');
        });



