var a =
{
    clientRequest: {
        options: {
            server: 'localhost:888',
            root: 'autotest',
            useHTTPS: false,
            useCompression: false,
            host: 'localhost',
            port: '888',
            path: 'autotest/runList',
            headers: [Object],
            keepAlive: false,
            sendTimeout: 30000,
            receiveTimeout: 30000,
            method: 'POST' },
        connection: {
            method: 'POST',
            keepAlive: 0,
            headers: '',
            responseText: '[{"entity":"org_employeeonstaff","fieldList":["ID"],"execParams":{"tabNo":"1","employeeID":3000000015853,"staffUnitID":3000000015855,"employeeOnStaffType":"PERMANENT","caption_uk^":"Чупакабров (1,Тестова організація)","caption_en^":"Чупакабров (1,Тестова організація)","ID":3000000015857,"mi_data_id":3000000015857,"mi_dateFrom":"2015-02-12T10:04:43Z","mi_dateTo":"#f_maxdate()","mi_owner":10,"mi_createDate":"#current_timestamp AT TIME ZONE \'UTC\'","mi_createUser":10,"mi_modifyDate":"#current_timestamp AT TIME ZONE \'UTC\'","mi_modifyUser":10},"method":"insert","caller":"","resultData":{"fields":["ID"],"rowCount": 1, "data":[[3000000015857]]}}]',
            responseHeaders: 'HTTP/1.1 200 OK\r\nDate: Thu, 12 Feb 2015 10:04:43 GMT\r\nContent-Length: 702\r\nContent-Type: application/json; charset=UTF-8\r\nServer: UnityBase Microsoft-HTTPAPI/2.0\r\nAccept-Encoding: gzip\r\n\r\n', responseStatus: 200 }
    },
    appName: 'autotest',
    onRequestAuthParams: [Function],
    lastResponse: { _http: { method: 'POST', keepAlive: 0, headers: '', responseText: '[{"entity":"org_employeeonstaff","fieldList":["ID"],"execParams":{"tabNo":"1","employeeID":3000000015853,"staffUnitID":3000000015855,"employeeOnStaffType":"PERMANENT","caption_uk^":"Чупакабров (1,Тестова організація)","caption_en^":"Чупакабров (1,Тестова організація)","ID":3000000015857,"mi_data_id":3000000015857,"mi_dateFrom":"2015-02-12T10:04:43Z","mi_dateTo":"#f_maxdate()","mi_owner":10,"mi_createDate":"#current_timestamp AT TIME ZONE \'UTC\'","mi_createUser":10,"mi_modifyDate":"#current_timestamp AT TIME ZONE \'UTC\'","mi_modifyUser":10},"method":"insert","caller":"","resultData":{"fields":["ID"],"rowCount": 1, "data":[[3000000015857]]}}]', responseHeaders: 'HTTP/1.1 200 OK\r\nDate: Thu, 12 Feb 2015 10:04:43 GMT\r\nContent-Length: 702\r\nContent-Type: application/json; charset=UTF-8\r\nServer: UnityBase Microsoft-HTTPAPI/2.0\r\nAccept-Encoding: gzip\r\n\r\n', responseStatus: 200 }, encoding: 'utf-8', _parsedHeaders: { 'http/1.1 200 ok': undefined, date: 'Thu, 12 Feb 2015 10:04:43 GMT', 'content-length': '702', 'content-type': 'application/json; charset=UTF-8', server: 'UnityBase Microsoft-HTTPAPI/2.0', 'accept-encoding': 'gzip' }, statusCode: 200 },
    getAppInfo: [Function],
    encryptContent: false, serverCertificate: '', sessionKeyLifeTime: 0, authMethods: [ 'UB' ], authNeed: true, appConfig: { applicationName: 'Postgre autotest', defaultPasswordForDebugOnly: 'admin' }, authorize: [Function], isAuthorized: [Function], userLogin: [Function], userLang: [Function], userData: [Function], lookup: [Function] };






// get all org_unit for current user
var res = conn.run({
    //"fieldList": ["ID", "employeeID", "employeeID.userID", "employeeID.shortFIO", "staffUnitID.ID", "staffUnitID.ID.mi_treePath"],
    "fieldList": ["employeeID.userID", "employeeID.shortFIO", "staffUnitID.ID.mi_treePath"],
    "entity": "org_employeeonstaff",
    "method": "select",
    "whereList": {
      "byCurUser": {
        "expression": "[employeeID.userID]",
        "condition": "equal",
        "values": {
            "ID": 10
        }
      }
    }
});

var a1="/2100002161511/2100002322780/2100002323431/2100002323432/2100002323433/2100002323434/2100002323441/".split('/')
var a2="/2100002161511/2100002322782/2100002323431/2100002323432/2100002323433/2100002323434/2100002323441/".split('/')
_.without(a1, "").sort();
_.without(_.union(a1, a2), "");

res = conn.run({
    "fieldList": ["*"],
    "entity": "uba_user",
    "method": "select"
});

conn.run({
    "fieldList": ["ID.mi_treePath"],
    "entity": "org_staffunit",
    "method": "select",
    "whereList": {
      "byCurUser": {
        "expression": "[ID]",
        "condition": "equal",
        "values": {
            "ID": 2100062034200
        }
      }
    }
});

