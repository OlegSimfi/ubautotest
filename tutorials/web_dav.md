## Использование WebDav
Для работы с WebDav необходимо добавить модель `WD` в приложение. После этого нужно подключить модуль `webDav.js` из указанной модели  

    var dav = require('models/WD/modules/WebDav.js');
У полученного обьекта есть метод `registerProvider(rootName, provider)`, который регистрирует нового провайдера(обработчика) WebDav.

##Структура провайдера
Каждый провайдер должен иметь уникальное(регистронезависимое) имя и иметь следующие свойства-обработчики

        provider = {
            /*
            Установить текущий путь. Вызывается каждый раз при обращении клиента к серверу. 
            Параметр - масив, содержащий путь к запрашиваемому узлу. 
            Например, при обращении
            'https:\\sever:port\rootName\folder1\folder2\file.ext', 
            данный параметр будет иметь значение
            ['folder1','folder2','file.ext']
            */
            setPath: function(path) {...},
            /*
            Существует ли обьект, имеющий текущий путь
            */
            exists: function() {...},
            /*
            Вернуть в качестве массива имена всех подузлов(папок и файлов) для текущего пути 
            */
            getItems: function() {...},
            /*
            Обьект, отвечающий за свойства
            */
            properties: {
                /*
                Свойства данного обьекта, кроме "getPropValue", "getAllPropsList", "setPropValue", "delProp" используются для получения значения свойств узлов. 
				Например, надо получить значение свойства "name" из неймспейса "ns" для подузла "item" текущего пути(или для текущего пути если ("item"===null). 
				Тогда мы ищем у свойства  "properties" свойство с именем, равным значению "ns", а у того свойство с именем, равным значению "name". 
				Если такое свойстро найдено, то мы считаем его функцией с сигнатурой function(item){...}, которая возвращает значение. 
				Если свойство не найдено - вызываем функцию  "getPropValue". 
				Если функция вернула пустую строку или значение, которое при переводе в Boolean равно true, 
				то свойство и его значение будут указаны в ответе со статусом 200.
				Если функция вернула undefined свойство будет указано в ответе со статусом 404.
				Иначе - свойство указанно в ответе не будет.
				Для примера приводиться неймспейс "DAV:", который определяет свойствачаще всего запрашиваемые клиентом. 
				"DAV:resourcetype"- обязательный, отстальные - желательны.
                */
                'DAV:': {
                    resourcetype: function(item){
                    //Если искомый узел является папкой нужно вернуть '<D:collection />', иначе - null
                    },
                    getlastmodified: function(item) {
                    //Дата модификации узла в формате UTC (Date.toUTCString())
                    },
                    creationdate: function(item) {
                    //Дата создания узла в формате UTC (Date.toUTCString())
                    },
                    getcontentlength: function(item) {
                    //Размер узла
                    },
                    getetag: function(item) {
                    //etag узла
                    }
                },                
                /*
                Получить значение свойства с именем 'name' из неймспейса 'ns' для подузла 'item' текущего пути(или для текущего пути если ('item'===null)) если такое свойство не найдено в обьектах выше
                */
                getPropValue: function(item, ns, name) {...},
                /*
                Получить список свойств для подузла 'item' текущего пути(или для текущего пути если ('item'===null))
                props - запрашиваемые свойства
				{
					namespace1: {
						property11 : {},
						property12 : {},
						...
					},
					namespace2: {
						property21 : {},
						property22 : {},
						...
					},
					...
					
				}
				возвращаемое значение - список свойств в том же формате.
                */
                getAllPropsList: function(item, props) {...},
                /*
                Установить значение свойству с именем 'name' из неймспейса 'ns' значение 'value' для текущего пути 
                */
                setPropValue: function(ns, name, value){...},
                /*
                Удалить свойство 'name' из неймспейса 'ns' для текущего пути
                */
                delProp: function(ns, name) {...}
            },
            /*
            Записать контент, содержащийся по текущему пути в THTTPResponse
            */
            doGet = function(resp) {...},
            /*
            Размер контента, содержащегося по текущему пути
            */
            getContentLength = function() {...},
            /*
            Записать контент из THTTPRequest в текущий путь
            Возвращаемые значания:
                 true - created            
                 false - owerrided
            */
            doPut = function(req) {...},
            /*
            Переместить/переименовать текущий узел в узел по пути destination(масив елементов пути, аналогичный параметру из setPath). overwrite - можно ли перезаписать.
            Возвращаемые значания:
                 undefined - bad destanation
                 false - cannot overwrite (overwrite === false)
                 true - created
                 null - owerrided            
            */
            doMove = function(destination, overwrite) {...},
            /*
            Копировать текущий узел в узел по пути destination(масив елементов пути, аналогичный параметру из setPath). overwrite - можно ли перезаписать.
			
            Возвращаемые значания:
                 undefined - bad destanation
                 false - cannot overwrite (overwrite === false)
                 true - created
                 null - owerrided            
            */
            doCopy = function(destination, overwrite) {...},
            /*
            Удалить текущий узел.
            Возвращаемое значение - успешно ли?
            */
            doDelete = function() {...},
            /*
            Создать папку по указанному пути
            Возвращаемое значение - успешно ли?
            */
            doCreateDir = function() {...},
            /*
            Получить обьект блокировки указанного узла(или текущего, если не указан)
            Возвращаемое значение:
            есть блокировка: обьект блокировки
                {
                    scope: 'exclusive',
                    type: 'write',
                    owner: <lockUser>,
                    depth: Infinity,
                    timeout: 60,
                    token: <token>
                }
            нету блокировки: {}
            */
            getLock = function(destination) {...},
            /*
            Заблокировать текущий узел
            lockObj: обьект блокировки (см getLock)
            результат: обьект блокировки (с указанными depth, timeout и token)
            */
            doLock = function(lockObj) {...},
            /*
            Разблокировать текущий узел
            результат: успешно ли и верный ли токен?
            */
            doUnLock = function(token) {...},
        }
        
##Прочие особенности
После использования метода `registerProvider(rootName, provider)` мы можем использовать протокол WebDav для адресов 'http[s]:\\sever:port\rootName\...'. 
Для работы с MS Office желательно использовать https в приложении. Авторизация должна быть Basic или Negotiate. Если есть обе - будет использоваться Basic.

##Примеры провайдеров
'webDavFileSystemProvider' - провайдер, эмулирующий реальную папку на сервере. Создан исключительно как пример. Корректно работает только в однопотоковом режиме.
'webDavDocAttrProvider' - провайдер только для чтения/записи файлов в формате 'http[s]:\\sever:port\rootName\entity\attribute\id\main.ext'
