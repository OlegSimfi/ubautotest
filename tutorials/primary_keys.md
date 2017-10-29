# Primary key in UB (Генерация значений первичных ключей)

## Теоретическая часть
  Для понимания понятия "первичный ключ" рекомендуем ознакомится со [статьей на WikiPedia](https://en.wikipedia.org/wiki/Unique_key).
  
  В платфотме используются [суррогатные первичные ключи](https://en.wikipedia.org/wiki/Surrogate_key), что позволяет получить такие их преимущества как: 
   
  - Неизменность
  - Гарантированная уникальность
  - Гибкость
  - Эффективность
  
  При этом все недостатки сурогатных ключей устраняются сервером приложений платформы.
  
## Неявный атрибут ID  
  Любая сущностиь платформы соджержит атрибут `ID` типа `BigInt`, если атрибут не описан явно meta сущности (рекомендуется), 
  платформа добавит его самостоятельно. Есть возможность поменять название поля в БД с `ID` на другое, 
  используя mapping уровня атрибута - в таком случае атрибут ID должет быть описан. 
  В примере ниже показано описание атрибута `ID` с mapping на поле БД `C_ID`:
     
     		"attributes: {
                "ID": {
                    "caption": "Record identifier",
                    "dataType": "BigInt",
                    "allowNull": false,
                    "mapping": {
                        "AnsiSql": { "expression": "C_ID" }
                    }
                },.....

## Правила генерации значений идентификатора
  В платформе реализован сквозной механизм генерации значений первичных ключей - для ВСЕХ таблиц базы данных заводится ОДИН сиквенс,
его значение используется как значение поля ID для всех сущностей (для всех новых записей в таблицах). 
То есть даже в разных таблицах значения идентификатора не повторяются, что открывает ряд прекрасных возможностей, например:

 - [mixin unity]{@link tutorial unity} может хранить в родительской таблице значения из разных сущностей,
 - столбец `entityinfo_id` сущности аудита `ubs_audit` может содержать идентификаторы разных сущностей, и.т.д
    
  Более того, платформа позволяет использовать **непересекающиеся идентификаторы для различных инсталяций**, что позволяет довольно просто 
организовать реплекацию данных между разными клентами. Для обеспечения уникальности идентификатора в разрезе инсталяции необходимо 
указать уникальный `CLIENT_NUM` в командном файле `createNewApp.cmd` при разворачивании приложения. 
Даже если Вы не планируете использовать репликацию, присвоение уникального иджентификатора для каждого клиента позволит 
легко идентифицировать по значениям поля `ID` чьи данные вы просматриваете.
 
  Для уменьшения нагрузки на СУБД платформа использует кеш значений идентификаторов, для этого весь диапозон идентификаторов условно разбит на две части.
Допустим, мы генерируем БД для клиента № Х=7. Система создаст 2 непересекающихся SEQUENCE - `SEQ_UBMAIN`, из которого можно получить сразу 100 идентификаторов, и 
`SEQ_UBMAIN_BY1`, для получние идентификаторов по одному (пример для Oracle):
  
    CREATE SEQUENCE SEQ_UBMAIN     START WITH   70000000000 MAXVALUE   74999999999 MINVALUE   70000000000 NOCYCLE CACHE 10 ORDER;
    CREATE SEQUENCE SEQ_UBMAIN_BY1 START WITH 7500000000000 MAXVALUE 7999999999999 MINVALUE 7500000000000 NOCYCLE ORDER'; 
  
  При вызове метода {@link TubDataStore#generateID generateID} раз в 100 вызовов будет обращение к БД val=`select SEQ_UBMAIN.nextVal from dual`, и 99 значений будут получены
по формуле `ID = val * 100 + i`, где i - номер вызова. **Важно - не используйте сиквенс SEQ_UBMAIN для генерации единичных ID**

  Сиквенс `SEQ_UBMAIN_BY1` предусмотрен для генерацци множества единичных идентификаторов при прямых вставках в БД. 
Рекомендуется использовтаь в исключительных случаях, напрмер при вставке 1000 и более записей - [вот тут пример](http://forum.ub.softline.kiev.ua/viewtopic.php?f=12&t=78&p=264#p264) 

## Использоване "чужих" правил генерации ID
  Иногда при маппинге на существующую схему БД необходимо поддержать сторонние правила формирования идентификаторов. 
Зачастую это сиквенс на каждую таблицу, но могут быть и более тяжёлые варианты. Для этого в мапинге в свойстве `pkGenerator` можно задать правила генерации ID.

### Mapping pkGenerator to sequence
Пример для маппинга на сиквенс - в этом случае в БД в той же схеме что и сущность должен быть сиквенс с именем, указанным в `pkGenerator`. 
При таком мапинге DDL генератор умеет создавать сиквенс.  

    {
        "caption": "ID mapped",
        "description": "Test for mapped ID [UB-1219]",
        "connectionName": "",
        "descriptionAttribute": "code",
        "documentation": "",
        "attributes": {
            "ID": {
                "caption": "Ідентифікатор запису",
                "dataType": "BigInt",
                "allowNull": false,
                "mapping": {
                    "AnsiSql": { "expression": "C_ID" }
                }
            },
            "code": {
                "dataType": "String",
                "size": 32,
                "caption": "Code",
                "description": "Internal code",
                "allowNull": false,
                "mapping": [
                    {"name": "AnsiSQL", "expressionType": "Field", "expression": "C_CODE" }
                ]
            }
        },
        "mapping": {
            "AnsiSql": { 
                "pkGenerator": "SEQ_UBMAIN_BY1" 
            }
        },
        "mixins": {
            "mStorage": { "simpleAudit":false, "safeDelete":false }
        }
    }
    
### Mapping pkGenerator to custom expression 
  Если в целевой БД генерация ID идёт НЕ через сиквенсы, можно замапиться на выражение. 
В таком случае последнее выражение в блоке должно быть селектом (обязательно содержать ключевое слово _SELECT_), возвращающим выборку в одну запись с одним полем. 
Пример для MSSQL когда для генерации ID используется поле типа `identity`:

    // in the SQL Server:
    CREATE TABLE MD_IDGEN(
      ID_column INT IDENTITY PRIMARY KEY,
      ...
    );
   
    // im meta file
    "mapping": {
        "MSSQL": { 
            "pkGenerator": "insert into MD_IDGEN(ID_column) values(0); select IDENT_CURRENT('MD_IDGEN')" 
        }
    },   
    
## Практическое использование идентификаторов 
Рассмотрим отдельно примері для клиента и сервера

### Работа с ID на клиенте  
  Клиент (например WEB браузер) никогда не вызывает генерацию ID напрямую. Он вызывает либо метода `addnew` для получения 
"пустой" записи с заполненными полями по умолчанию, в.т.ч. и ID:
       
       $App.connection.run({
            entity: 'tst_IDMapping', 
            method: 'addnew', 
            fieldList: ['ID', 'code']
       }).done(function(result){ 
            var objArray = UB.LocalDataStore.selectResultToArrayOfObjects(result); // transform array-of-array result representation to array-of-object 
            console.log(objArray); // [{ID: newID: int64, code: null}]   
       });
  
  и последующий вызов инсерт с полученным на стадии `addnew` идентификатором:

       $App.connection.run({
          entity: 'tst_IDMapping', 
          method: 'insert', 
          fieldList: ['ID', 'code'],
          execParams: {ID: idFromPrevRequest, code: 'codeToInsert'} 
       }).done();
  
  либо вызовом метода insert без передачи параметра ID, в таком случае сервер сам сгенерит идентификатор:
  
       $App.connection.run({
           entity: 'tst_IDMapping', 
           method: 'insert', 
           fieldList: ['ID', 'code'],
           execParams: {code: 'codeToInsert'} 
       }).done(function(result){ 
           var objArray = UB.LocalDataStore.selectResultToArrayOfObjects(result);
           console.log(objArray); // [{ID: newID: int64, code: 'codeToInsert'}]
       }); 
   
### Работа с ID на сервере
  При написании серверной логики генерация ID производится либо автоматически при вызове `addNew` либо `insert` без параметра ID:
   
    var store = new TubDataStore('tst_IDMapping');
    store.run('insert', {
        execParams: { // ID not passed, so will be generated during insert
            code: 'aaa'
        }
    });
    
  либо вызовом метода стора {@link TubDataStore#generateID}:
    
    var store = new TubDataStore('tst_IDMapping');
    var newID = store.generateID();
    store.run('insert', {
        execParams: { 
            ID: newID, // ID passed - use it during insert
            code: 'aaa'
        }
    }); 
     
