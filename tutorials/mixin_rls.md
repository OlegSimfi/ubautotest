# Mixin **rls** - Row Level Security (Безопастность уровня записей)

## Общая информация
  RLS is a security feature which allows developers to give access to a sub-set of data in their entity to others.
Entity Level Security permission system don't distinguish between individual rows in a entity, so access is all-or-nothing. 
Grant to `select` method on a entity will allow a user to access all rows of that entity. 

  RLS _supplements_ these with an additional layer of access controls on a per-row basis, so requirements such as 
"a manager can only view sensitive employee information for those employees who report to them" can be specified and enforced by the ORM.

 
## Детали реализации
  Миксин перекрывает метод `select` и при каждом вызове добавляет в перечень условий результат выполнения(eval) JavaScript кода, указанного в конфиге `rls.expression`.
   
  Безопастность обновлений (update) обеспечивается автоматически, так как перед update mStorage всегда делает select чтобы получить значение полей записи ДО обновления, 
и если этот select вернет пустую выборку будет сгенерированно исключение.     
   
### TIPS   
   
- Поскольку выражение из `rls.expression` вызывается при каждом формированни `select`, желательно в этом выражении не делать длительных операций. 
Используете кеш {@link TubApp#globalCachePut App.globalCachePut/get} либо переменные в global (не забываем что глобал общий - используйте префиксы переменных!)

- Чтобы сослаться на атрибуты сущности, в результирующем выражении заключайте название атрибута в квадратные скобки:
  - **`"[code] = '1234'"`** правильно - в результирующий SQL будет подставлен атрибут с алиасом таблицы `tab1.code = '1234'`  
  - _**`"code = '1234'"`**_ **НЕправильно** - в результирующий SQL будет подставлено `code = '1234'` и получим _Ambiguous columns_
        
- Используйте параметры. Поскольку результат выражения - строка, используйте механизм задания inline параметров, поддерживаемый парсером, 
а именно - заключайте параметры в `:(  ):`, например
  - **`'([mi_owner] = :(' + Session.userID + '): )'`** будет преобразованно в параметризированный запрос `tabAlias.mi_owner = ?` и в качестве параметра
  передан ID пользователя (например, 100)
  - _**`'([mi_owner] = ' + Session.userID + ' )'`**_ будет преобразованно в **НЕпараметризированный** запрос `tabAlias.mi_owner = 100` 
  и как результат - новый prepare, build execution plan и забивание кеша стейтвемнов на уровне сервера БД
  - для передачи строки в качестве инлайн параметра обрамляем строку в кавычки (одинарные или двойные): `"'([groupCode]=:(\"govRankKind\"):)'"`

- чтобы вернуть истину - возвращайте выражение `'(1=1)'`, ложь - `'(0=1)'`. Это позволит другим разработчикам комбинировать ваши RLS например так: 
"expression": "entity1.getRLS() + ' AND ' + entity2.getRls()", если ваше выражение будет возвращатьпустую строку, а не `(0=1)`, то оператор AND сломается.


## Конфигурирование
  В файле описания сущности в секции `mixins` добавляем `rls` и описывем параметр `expression` - произвольное JS выражение, 
  возвращающее строку - кусочек where, подставляемый в select.
    
###Пример - фильтрация только по "своим" записям
Сущность **tst_maindata.meta**:
   
    {
    	"caption": "ub test main data",
    	"sqlAlias": "tmd",
    	"descriptionAttribute": "caption",
    	"attributes": {
    		"code":
    		{
    			"dataType": "String",
    			"size": 32,
    			"caption": "Code",
    			"allowNull": false
    		},
    		"caption":
    		{
    			"dataType": "String",
    			"size": 255,
    			"caption": "Caption",
    			"allowNull": true,
    			"isMultiLang": true
    		}
    	},
    	"mixins": {
    		"mStorage": {
    			"simpleAudit": true,
    			"safeDelete": true
    		},
    		"rls": {
    			"expression": "'([mi_owner] = :(' + Session.userID + '):)'"
    		}	
    	}
    }

  При каждом выполнении метода `select` отработает вычисление JavaScript выражения `"'([mi_owner] = :(' + Session.userID + '):)'"`, 
  допустим Session.userID = 10, результат будет `([mi_owner] = :(10):)`, это выражение добавиться к условиям `where` выборки, сервер:
   
   - заменит атрибут в квадратных скобках на его SQL alias: [mi_owner] -> tmd.mi_owner
   - inline parameter :(10): заменит на параметр SQL: :(10): -> ?
   - добавит получившееся выражение к `where`  через **AND** 
  
  В результате в условие `where` на сервер БД уйдёт `(tmd.mi_owner = 10)`.
  
### Пример - использование this
  В примере выше мы указали в `rls.expression` непосредственно выражение. но в более сложных случаях предпочтительнее использовать вызов ф-ии:

**tst_maindata.meta**:
    
    ....
    "rls": {
        "expression": "this.getMainDataRLS()"
    }
 
**tst_maindata.js**:

    var me = tst_maindata;
    me.getMainDataRLS = function(){
        console.log('!!!!!!!!!!!!!', this.entity.name); // -> tst_maindata
        return '([mi_owner] = :(' + Session.userID + '):)';
    }
 
В этом случае сервер вызовет ф-ю getMainDataRLS, установив this в скоуп текущего объекта (назване meta файла).
Важно! this равен текущему объекту только на верхнем уровне, внутри ф-й он (стандартно для JS) равен контексту вызова, то есть:

**tst_maindata.meta**:

     ....
     "rls": {
         "expression": "my_entity.calculateRLS()"
     }

**my_entity.js**:

    var me = my_entity;
    me.calculateRLS = function(sender){
        console.log('!!!!!!!!!!!!!', sender.entity.name); // -> tst_maindata
        console.log('!!!!!!!!!!!!!', me.entity.name); // -> my_entity
        if (sender.entity.name === me.entity.name){
           return '(1=1)';
        } else {
          return '(1=0)';
        }  
    }

Обратите внимание на то, как корректно вернуть что выражение всегда истино - '(1=1)' или ложно '(1=0)'. Такие выражения корректно отработают оптимизаторы любого сервера БД.    
 
## Обратная совместимость с UB 1.9
В версиях платформы < 1.10 выражение RLS необходимо было задавать в псевдокоде. Можно было вызвать только ф-ии из скоупа global.$. Пример до 1.10:
    
    "expression": "([$.currentOwner()] OR [$.currentUserInGroup(ubm_desktop,'admins')] OR [$.currentUserOrUserGroupInAdmSubtable(ubm_desktop)])"

Такой синтаксис **deprecated** и для обратной совместимости будет поддерживаеться до версии 1.12. Рекомендуем изменить:
 
    "expression": "'(' + $.currentOwner() + ' OR  ' + $.currentUserInGroup(ubm_desktop,'admins') + ' OR '+  $.currentUserOrUserGroupInAdmSubtable(ubm_desktop) + ')'"
                           
А ещё лучше избегать скоупа $ и использовать скоуп той сущности, в которой реально определена ф-я (чтобы легко было искать реализацию).    
