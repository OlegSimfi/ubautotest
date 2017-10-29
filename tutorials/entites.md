# Entities (Сущности)

## Общая информация
**Сущность (Entity)** - базовая единица доступа к данным платформы UnityBase. Сущность определяет как способ хранения данных, так и поведение(методы). 
 Метаданные сущности могут быть использованы клиентскими приложениями для построения пользовательского интерфейса.  

 В клиент-серверной архитектуре ближайшая анология сущности - view в базе данных с тригерами на вставку/обновление/удаление записей. В OOP - класс, реализующий ORM.
 
С точки зрения разработчика сущность - это:
 
 - файл в формате [JSON] с расширением `.meta` (метафайл), описывающий сущность и её атрибутых 
 - опционально, файл с таким же именем, но расширением `.js`, описывающий дополнительно поведение (методы) сущности на языке JavaScript  

Используя метафайл UnityBase может: 
  
  - сгенерировать скритп на создание таблицы в целевой БД для хранениея данных сущности (если таблица уже есть - скрипт на модификацию)
  - сгеренировать инструкции SQL для выборки/вставки/удаления/добавления данных
  - сгенерировать базовый пользовательский интерфейс справочника (грида) и формы редактирования записи
  - сгенерировать документацию в формате HTML
  - отобразить сущность в графическом виде на [ER diagram]
   
Пример метафайла __film_film.meta__: 

        {
        	"caption" : "Кинофильм",
        	"description" : "Конифильмы",
            "documentation": "Хранит все зарегистрированные кинофильмы",
        	"descriptionAttribute" : "title",	
        	"attributes" : {
        	    "IMDB": {
        	        "dataType": "String",
                    "size": 12,
                    "caption": "IMDB",
                    "description" : "Идентификатор IMDB",
                    "documentation": "Internet Movie Database (IMDb) идентификатор может быть использован для получения дополнительной информации о фильме через API www.omdbapi.com"
                    "allowNull" : false,
                    "isUnique": true    
        	    },
        		"title":
        		{
        			"dataType" : "String",
        			"size" : 100,
        			"caption" : "Название",
        			"description" : "Название кинофильма",
        			"allowNull" : false
        		}
        	},
        	"mixins" : {
        		"mStorage" : {
        			"simpleAudit": true,
        			"safeDelete": true 
        		}
        	}
        }

В данном метафайле мы описали сущность `кинофильм` с кодом `film_film`, у которой есть два атрибута: "Идентификатор IMDB" и "Название".   

Полная спецификация метафайла описывается следующей [JSON schema]:

 - [JSON схема (просмотр)](/models/UB/docson/index.html#../schemas/entity.schema.json) 
 - [JSON схема (исходник)](/models/UB/schemas/entity.schema.json)    

## Mixins (Миксины)
Сами по себе сущности не обладают поведением, оно описывается **методами** сущности. 
UnityBase содержит ряд готовых методов, решающих наиболее часто встречающиеся задачи. Реализация методов находится в **Миксинах**.
Разработчик может добавить свои методы к сущности либо перекрыть методы, добавленные миксинами.
     
В примере выше для сущности `film_film` мы подключили миксин `mStorage`. Собственно он добавил для нашей сущности методы для [CRUID операций](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete).

### mStorage - Обеспечивает базовые операции с БД (ORM)
Добавляет методы:

    - addNew
    - select 
    - insert
    - update 
    - delete
    
### audit - Аудит уровня записи
Обеспечивает запись всех низкоуровневых операций `insert`/`update`/`delete` в сущность аудита **ubs_audit**. 
Для операций `update` записываются как значения ДО обновления, так и новые. По умолчанию включен для всех сущностей системы.
  

### rls - Row Level Security (Безопастность уровня записей)
RLS is a security feature which allows developers to give access to a sub-set of data in their entity to others.
Traditional permission systems don't distinguish between individual rows in a table, so access is all-or-nothing. 
Grant to `select` method on a entity will allow a user to access all rows of that entity. 

RLS _supplements_ these with an additional layer of access controls on a per-row basis, so requirements such as 
"a manager can only view sensitive employee information for those employees who report to them" can be specified and enforced by the ORM.

Check out [Row Level Security Guide](#!/guide/rls) for additional reading.

### aclRls - Access Control List Row Level Security (Безопастность уровня записей на базе списков контроля доступа)
[Access Control List](https://en.wikipedia.org/wiki/Access_control_list) Row Level Security is a commonly used implementation of Row Level Security conception, 
so we implement it as a mixin and add a client-side features for edit ACL. 

 Позволяет задать перечень субъектов, которые имеют доступ к конкретной записи из сущности. Субъектом может выступать произвольная сущность из предметной области. 
  
 Реализует требования вида:
  
  - дать возможность задать для каждого ярлыка перечень пользователей либо ролей, которым он доступен
  - дать возможность задать для каждого докумнета перечень огранизационных единиц либо пользователей, которым он доступен
  
 Под доступом имеется в виду - право на просмотр. Если доступа на простомр нет - сообтветственно обновление/удаление тоже невозможно. 

### als - безопастность уровня атрибутов (Attribute Level Security)
  
### dataHistory -  Историчность записей
  
### unity
   
### tree - древовидные с труктуры с построением хранимого пути   

### fts - полнотекстовое индексирование данных сущности

### softLock - Оптимистические блокировки (Optimistic Lock)

### clobTruncate - Обрезает большие текстовые поля 
   
[JSON]:http://www.json.org/
[ER diagram]:https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model
[JSON schema]:http://json-schema.org/ 