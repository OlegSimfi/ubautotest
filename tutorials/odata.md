  [OData] is a protocol for build RESTfull API. Developed by Microsoft, it give you all pros & contras of Microsoft
products. The most big contras is size of [OData specification]  - 70 pages just for protocol.

  In UnityBase EE OData implemented as a provider, so it is possible to use the UnityBase `ubql` protocol
and OData at the same time. Below is a protocols comparison


## Quick demo
  Set up a *Autotest* application, run it, point your browser to 
[DXODataClient sample](http://localhost:888/models/TST/DXODataClient/markup.html)

  All you need to add support for OData for your application is to define OData endpoint in your model server-side `js`.
By default all entities are accessible, but you can pass an `entitySetMapping` parameter during endpoint configuration
to limit UB entities available through OData or create an alias for entities.

	var OData = require('OData');

	var endpoint = OData.registerEndpoint({
	    endpointName: 'ODataV4',
	    namespace: 'autotest',
	    //requireAuth: false,
	    skipOptimisticLock: true
	    //,entitySetMapping: {
	    //    tst_ODataRef: App.domain.byName('tst_ODataRef'),
	    //    tst_ODataSimple: App.domain.byName('tst_ODataSimple')
	    //}
	});


## OData & UBQL comparison

Here we provide comparison of OData operation and how its analog in UnityBase Query Language (UBQL).

OData define term _Entity Data Model(EDM)_ - this is metadata, what describe _Entity types_ -  named structured types with a key.
They define the named properties and relationships of an entity. *Entities* are instances of _entity types_ (e.g. Customer, Employee, etc.),
_Entity sets_ is a collection of Entities accessible via external API.

UnityBase define _Domain Model_ - this is metadata, what describe _Entities_ -  named structured types with a key.
They define the named properties and relationships of an entity. Customer with ID = 10 is en _instance_ of entity Customers.

---
| OData                  | UnityBase       |  Mean                                                |
|------------------------|-----------------|------------------------------------------------------|
| Entity Data Model(EDM) | Domain Model    | The subject area to which the user applies a program |
| Entity type            | Entity          | Class in term of OOP                                 |
| Entity sets            | Entity          | In OData Entity set is an alias for EntityType, which accessible via external API, in UnityBase entities, accessible via external API defined by Entity Level Security |
| Entity                 | Entity instance | Class instance in term of OOP                        |


Each topic below contains a reference to OData specification topic number

### Service Document (10.1)

**OData**

Request a top-level resources

    GET TripPinServiceRW HTTP/1.1
    //alias
    GET TripPinServiceRW/$metadata HTTP/1.1

Response

    {
        "@odata.context": "http://services.odata.org/V4/(S(jupsobosp4eut4c0web34mlj))/TripPinServiceRW/$metadata",
        "value": [{
            "name": "Photos",
            "kind": "EntitySet",
            "url": "Photos"
        }, {
            "name": "People",
            "kind": "EntitySet",
            "url": "People"
        }, {
            "name": "Airlines",
            "kind": "EntitySet",
            "url": "Airlines"
        }, {
            "name": "Airports",
            "kind": "EntitySet",
            "url": "Airports"
        }, {
            "name": "Me",
            "kind": "Singleton",
            "url": "Me"
        }, {
            "name": "GetNearestAirport",
            "kind": "FunctionImport",
            "url": "GetNearestAirport"
        }]
    }

**UnityBase**

  The first: to request a resources metadata user must be authenticated. This allow to return only resources, accessible for
this user.
  The second: In general application need to know all metadata, so in case of OData we always request top level metadata first,
and then send many-many request for retrieve Entity metadata. In UnityBase we have one URL to retrieve all Domain metadata:

    GET getDomainInfo HTTP 1.1

Response is object, there keys in entity name, value is Entity definition, described by [UnityBase entity definition] JSON schema

    {
        "domain": {
            cdn_address: {modelName: "CDN", caption: "Addresses", description: "Addresses directory", connectionName: "main",…},
            cdn_adminunit: {modelName: "CDN", caption: "Admin unit", description: "Admin unit (country, region, city)",…}
        },
        entityMethods: ...,
        i18n: ...,
        models: ..
    }

### Collection of Entities (10.2)

**OData**

Request collection

        GET TripPinServiceRW/People HTTP 1.1

Response

    {
            "@odata.context": "http://services.odata.org/V4/(S(my2yfeng3hubag32govlkna3))/TripPinServiceRW/$metadata#People",
            "@odata.nextLink": "http://services.odata.org/V4/(S(my2yfeng3hubag32govlkna3))/TripPinServiceRW/People?%24skiptoken=8",
            "value": [{
                "@odata.id": "http://services.odata.org/V4/(S(my2yfeng3hubag32govlkna3))/TripPinServiceRW/People('ronaldmundy')",
                "@odata.etag": "W/\"08D2F981B3628397\"",
                "@odata.editLink": "http://services.odata.org/V4/(S(my2yfeng3hubag32govlkna3))/TripPinServiceRW/People('ronaldmundy')",
                "UserName": "ronaldmundy",
                "FirstName": "Ronald",
                "LastName": "Mundy",
                "Emails": ["Ronald@example.com", "Ronald@contoso.com"],
                "AddressInfo": [],
                "Gender": "Male",
                "Concurrency": 635844832868336535
            }, {
                "@odata.id": "http://services.odata.org/V4/(S(my2yfeng3hubag32govlkna3))/TripPinServiceRW/People('javieralfred')",
                "@odata.etag": "W/\"08D2F981B3628397\"",
                "@odata.editLink": "http://services.odata.org/V4/(S(my2yfeng3hubag32govlkna3))/TripPinServiceRW/People('javieralfred')",
                "UserName": "javieralfred",
                "FirstName": "Javier",
                "LastName": "Alfred",
                "Emails": ["Javier@example.com", "Javier@contoso.com"],
                "AddressInfo": [{
                    "Address": "89 Jefferson Way Suite 2",
                    "City": {
                        "CountryRegion": "United States",
                        "Name": "Portland",
                        "Region": "WA"
                    }
                }],
                "Gender": "Male",
                "Concurrency": 635844832868336535
            }]
    }

Questions we don't know answers for:

1) Do you see the strange URL part in response - `(S(my2yfeng3hubag32govlkna3))`? It is added to prevent cache of GET request.
In UnityBase we simple do POST for data retrieve.

2) Do we ask for AddressInfo? No - we do not need it - we just want to display a table of our customers.
But service return all details. For efficient operation of such structures on the client side we must normalize it
using, for example [https://github.com/gaearon/normalizr].

**UnityBase**

Actually this is collection of entity instance

    POST ubql HTTP 1.1
    [{
        "entity": "cdn_person",
        "method": "select",
        "fieldList": ["*"]
    }]

And response is:

    [{
        "entity": "cdn_person",
        "method": "select",
        "fieldList": ["*"],
        "resultData": {
            "fields": ["ID", "lastName", "firstName", "birthDate"],
            "rowCount": 2,
            "data": [
                [3000000003501, "Simpson", "Homer", "1955-05-12T00:00Z"],
                [3000000003502, "Simpson", "Bart", "1975-09-02T00:00Z"]
            ]
        }
    }]

This is a compact representation of response. It is very easy to transform it to the `array of object` on the client-side
in the five line of code - see {@link LocalDataStore#selectResultToArrayOfObjects LocalDataStore.selectResultToArrayOfObjects}


### Entity (10.3)
Request for a single entity (one instance in term of UnityBase) by value of primary key attribute

**OData**

Request:

    GET TripPinServiceRW/Photos(1) HTTP 1.1

Response:

    {
        "@odata.context": "http://services.odata.org/V4/(S(33hnsbwj2xmyya0gjbaj0pdc))/TripPinServiceRW/$metadata#Photos/$entity",
        "@odata.id": "http://services.odata.org/V4/(S(33hnsbwj2xmyya0gjbaj0pdc))/TripPinServiceRW/Photos(1)",
        "@odata.editLink": "http://services.odata.org/V4/(S(33hnsbwj2xmyya0gjbaj0pdc))/TripPinServiceRW/Photos(1)",
        "@odata.mediaContentType": "image/jpeg",
        "@odata.mediaEtag": "W/\"08D2F99AE30057DE\"",
        "Id": 1,
        "Name": "My Photo 1"
    }

**UnityBase**

Request:

    POST ubql HTTP 1.1
    [{
        "entity": "cdn_person",
        "method": "select",
        "fieldList": ["*"],
        ID: 3000000003501
    }]

Response:

    [{
        "entity": "cdn_person",
        "method": "select",
        "fieldList": ["*"],
        "resultData": {
            "fields": ["ID", "lastName", "firstName", "birthDate"],
            "rowCount": 1,
            "data": [
                [3000000003501, "Simpson", "Homer", "1955-05-12T00:00Z"]
            ]
        }
    }]

UnityBase use the same data format for collection and for one row, so client data layer can be simplified.


### Singleton (10.4)

There is no direct replacement of _Singleton_ in the UnityBase. Entity data can be limited using [Row Level Security]
and queried as a collection.

### Collection of Derived Entities (10.5)

There is no direct replacement of _Derived Entities_. Entity data can be limited by adding filter condition to the main entity.

### Collection of Projected Entities (10.7)

Return only a subset of properties

**OData**

Request:

    GET TripPinServiceRW/People?$select=UserName,FirstName HTTP 1.1

Response:

    {
        "@odata.context": "http://services.odata.org/V4/(S(iibotqzqvvabf02huka34l5x))/TripPinServiceRW/$metadata#People(UserName,FirstName)",
        "@odata.nextLink": "http://services.odata.org/V4/(S(iibotqzqvvabf02huka34l5x))/TripPinServiceRW/People?%24select=UserName%2c+FirstName&%24skiptoken=8",
        "value": [{
            "@odata.id": "http://services.odata.org/V4/(S(iibotqzqvvabf02huka34l5x))/TripPinServiceRW/People('russellwhyte')",
            "@odata.etag": "W/\"08D2F9A17C9200B7\"",
            "@odata.editLink": "http://services.odata.org/V4/(S(iibotqzqvvabf02huka34l5x))/TripPinServiceRW/People('russellwhyte')",
            "UserName": "russellwhyte",
            "FirstName": "Russell"
        }, {
            "@odata.id": "http://services.odata.org/V4/(S(iibotqzqvvabf02huka34l5x))/TripPinServiceRW/People('scottketchum')",
            "@odata.etag": "W/\"08D2F9A17C9200B7\"",
            "@odata.editLink": "http://services.odata.org/V4/(S(iibotqzqvvabf02huka34l5x))/TripPinServiceRW/People('scottketchum')",
            "UserName": "scottketchum",
            "FirstName": "Scott"
        },

**UnityBase**

Request:

    POST ubql HTTP 1.1
    [{
        "entity": "cdn_person",
        "method": "select",
        "fieldList": ["firstName", "birthDate"]
    }]

Response:

    [{
        "entity": "cdn_person",
        "method": "select",
        "fieldList": ["firstName", "birthDate"],
        "resultData": {
            "fields": ["firstName", "birthDate"],
            "rowCount": 2,
            "data": [
                ["Homer", "1955-05-12T00:00Z"],
                ["Bart", "1975-09-02T00:00Z"]
            ]
        }
    }]

### Projected Entity (10.8)

**OData**

    GET TripPinServiceRW/People(1)?$select=UserName,FirstName HTTP 1.1

**UnityBase**

    POST ubql HTTP 1.1
    [{
        "entity": "cdn_person",
        "method": "select",
        "fieldList": ["firstName", "birthDate"],
        "ID": 1
    }]




[OData]: https://en.wikipedia.org/wiki/Open_Data_Protocol
[OData specification]: http://docs.oasis-open.org/odata/odata/v4.0/os/part1-protocol/odata-v4.0-os-part1-protocol.html
[UnityBase entity definition]:/docs/models/UB/docson/index.html#../schemas/entity.schema.json
[Row Level Security]: docs/Server/index.html#!/guide/rls