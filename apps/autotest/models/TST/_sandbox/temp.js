/* This file is located in models\GS\_sandbox folder, so UnityBase server ignore 
it during startup (all folders started from '_' is ignored);

Here we can test something:       
 - for client context execution select text and press F9
 - for server context - Ctrl + F9

  For debugging switch Debug mode (button on right pannel toolbar) 
to mode you want to debug (Server/Client). 
  You can see already evaluated scripts in "Sources" tab.
  You can use debugger keyword to stop execution and enter debugger mode
  @example
  //switch debug mode to "Client", select next 3 line and press F9
  var i = 10;
  debugger;
  console.log(i);
*/    
console.log('Hello, JS!');

/**
 * - `conn` is UB.Connection instance created by server in GIU mode for *DEBUG* purpose
 * it already connected to server and logged in using App/Server/User/Pwd values from edit box in left top coner of GUI server.
 * In case connection logged in successfully label `App' is green.   
 *
 *  - During execution you can got auth error - this is because `conn` dose not handle reconnect,
 * but server logour session after certein period of inactivity (set for each role in uba_role.sessionTimeout).
 * To relogon select menu item "Service" -> "Do autologon".  
 */  
conn.runCustom('runList', [
  {entity: 'uba_user', method: 'select', fieldList: ['*']},
  {entity: 'uba_us  errole', method: 'select', fieldList: ['*']},
  {entity: 'ubs_audit', method: 'select', fieldList: ['*']}
]);
/**
 * `console` is another global variable. Actually this is code like this:
 *
 *       global.console = require('console');
 *
 * We do this operation in both client and all server threads to be compartible with node.js
 */ 
console.log(JSON.stringify(conn.lastResponse));

/*
 * App is server-thread global {Object} store current application configuration
 * You can explore all server-thread globals in file D:\projects\UnityBase\models\_UBServerThreadGlobals.js
 *
 * To execute code below select it and press **Ctrl+F9** to run code in server thread context
 */   
console.log(App.domain.byName('uba_user').attributes.count);

/*
 * low level server side data retrieve (select lines below and press Ctrl+F9 for exec in server thread)
 */
 var store = new TubDataStore('uba_user');
 store.run('select', {
    fieldList: ['ID', 'name'], 
    whereList: {
        byName: {expression: 'ID', condition: 'equal', values: {id: 10}}
    }, 
    options: {limit: 1}
 });
 console.log(store.asJSONObject);
 console.log(store.asJSONArray);
 console.log(store.asXMLPersistant);
 while (!store.eof){
    console.log('first attribute value = ', store.get(0));
    console.log('the same, but by name "ID" = ', store.get('ID'));
    store.next();
 }
 /*
  * Structure, we pass to store.run is ubRequest. 
  * This is a  fairly complex structure, so to help developer to build it we 
  * create helper class ServerRepository
  */
var ServerRepository = require('Repository');
var repo = new ServerRepository(null, 'uba_user');
var store = repo.attrs(['ID', 'name']).where('ID', '=', 10).limit(1).selectAsStore(); 
console.log(store.asJSONObject);
  
 /**
 * UB.Repository is a fabric function produce *Repository instance depend on execution context
 * for server thread execution it produce ServerRepository (select lines below and press Ctrl+F9 for exec in server thread)
 */
var repository = UB.Repository('uba_user').attrs(['ID', 'name']).where('ID', '=', 10);


// array of object representation
var data = repository.selectAsObject();
console.log('data type is: "', typeof data, '" and result is:', data); 

// array of array representation + possible additional parameters
data = repository.selectAsArray(true);
console.log('data type is: "', typeof data, '" and result is:', data);

// Result type of selectAsStore() method depend on execution context. 
// For server context this is TubDataStore, for remote connection this is the same as selectAsObject()
// For browser side code this is either  the same result as in selectAsObject() in case we are not use ExtJS (only ub-core.js )
//  or UB.ux.data.UBStore if we are in ExtJS application (ub-all.js) 
data = repository.selectAsStore();
if (process.isServer){
  console.log('data type is "TubDataStore" and result can be represented in different format:'); // TubDataStore store can
  console.log('As XML:', data.asXMLPersistant);  
  console.log('As Array of object:', data.asJSONObject);
  console.log('As Array of array:', data.asJSONArray);
} else {
  console.log('data type is: "', typeof data, '" and result is:', JSON.stringify(data));  
}

// There is also `select` method - alias for selectAsStore() method for backward compatibility
data = repository.select();
  
/**
 * Thanks to UB.Repository fabric we can execure the code above in client context also. 
 * In this case actual class is ServerRepository, but interface is similiar.
 * Select code above and press F9 (client context execution). 
 * In this case we use `conn` object as a remote connection class. 
 *
 * While in UB server we are in synchronious mode, in the browser Repository work 
 * in the same way, but select* methods returm {Promise}.
 * So, in browser console analogue of the code above is:
 
    var repository = UB.Repository('uba_user').attrs(['ID', 'name']).where('ID', '=', 10);
    repository.selectAsObject().done(function(data){
        console.log('data type is: "', typeof data, '" and result is:', data);
    });
    //or
    repository.selectAsArray().done(function(data){
        console.log('data type is: "', typeof data, '" and result is:', data);
    });
    //or
    repository.selectAsStore().done(function(data){
        console.log('data type is: "UB.ux.data.UBStore " and row count is:', store.getTotalCount());
    });
    //or
    repository.select().done(function(data){
        console.log('data type is: "', typeof data, '" and result is:', data);
    });
 
 */  
 
/* 
 * let's connect to remote UnityBase server and run something using low level HTTP method  
 */
var remoteConnection = new UB.Connection({
	//server: '10.1.17.33:888',
    server: 'localhost:888',
	root: 'orm/',
	useHTTPS: false,
	useCompression: false
});
remoteConnection.login('admin', 'admin');
remoteConnection.runCustom('runList', [{
    entity: 'uba_user',
    method: 'select',
    fieldList: ['ID', 'name'], 
    whereList: {
        byName: {expression: 'ID', condition: 'equal', values: {id: 10}}
    }, 
    options: {limit: 1}
}]);
var data = remoteConnection.lastResponse[0]; // result is array of response in the same order we send requests
console.log(data);

/*
 * The same, but using ServerRepository
 */
var ServerRepository = require('Repository');
var repo = new ServerRepository(remoteConnection, 'uba_user');
var data = repo.attrs(['ID', 'name']).where('ID', '=', 10).limit(1).selectAsArray(); 
console.log(data);

/*
 * and finally UB.Repository
 */
var data = UB.Repository('uba_user', null, remoteConnection).attrs(['ID', 'name']).where('ID', '=', 10).limit(1).selectAsArray();
console.log(data);


function toArrayBuffer (data) {
 var s = "1";
    for (var i = 0; i < 50000; i++) {
        s += String.fromCharCode(0);
    }

    return s;
}
toArrayBuffer().length

debugger
var r;
console.time('r');
for(var i=0; i<100; i++){
  r = require('models/UB/i18n');
}  
console.timeEnd('r');

var r = require('models/GS/public/modules/aa');



console.log(JSON.parse(App.domain.config.models.asJSON))
console.log(global.hasOwnProperty('App'))


relToAbs(process.binPath, '.\\lib/fs.js'),

process
debugger

typeof global.exports
global.exports === exports

atob('MTA=')


var repository = UB.Repository('uba_user').attrs(['ID', 'name']).where('name', '=', 'admin');

debugger
var repository = UB.Repository('gs_issue').attrs(['ID', 'executionDate']).where('executionDate', '=', new Date());
repository.ubRequest()


// array of object representation
var data = repository.selectAsObject();

var a = require('models/UB/_autotest/fixtures/a');
console.log(a.A()) a.A


debugger;
var cn = new THTTPClient('localhost', '888', false, false);
cn.url = '/autoTest/echoToFile';
cn.writeEnd('привет!');
cn.lastError


var fs = require('fs');
console.time('rBin');
var data = fs.readFileSync('D:\\temp\\11\\req', {encoding: 'bin'});
console.timeEnd('rBin');

var assert = require('assert');
assert.deepEqual(data, data, 'ArrayBuffer equal');
var data1 = fs.readFileSync('D:\\temp\\11\\req', {encoding: 'bin'});
new Uint8Array(data1)[1] = 10;
assert.notDeepEqual(data, data1, 'ArrayBuffer not equal');
 
console.time('wrBin');
var res = fs.writeFileSync('D:\\temp\\11\\req1', data);
console.timeEnd('wrBin');

var http = require('http');
var request = http.request({
        host: 'localhost', port: '888', path: '/autotest/', method: 'POST',
        sendTimeout: 30000, receiveTimeout: 30000,
        keepAlive: true,
        compressionEnable: true
    });
var resp = request.end();
assert.equal(resp.statusCode, 400, 'POST request to root must be bad');
request.setMethod('GET');
request.setPath('/autotest/index-dev.html');
resp = request.end();
assert.equal(resp.statusCode, 200, 'index-dev retrieved error'); 
assert.equal(resp.headers("content-type"), 'text/html', 'response must be text/html');
var index = resp.read();

var DOMParser = require('xmldom').DOMParser;
var doc = new DOMParser().parseFromString(index);
assert.equal(doc.documentElement.getAttribute('class'), 'loading', 'html must have class "loading"');

var http = require('http');
var assert = require('assert');
var DOMParser = require('xmldom').DOMParser;
http.setGlobalProxyConfiguration('proxy3.softline.main:3249', 'localhost');
assert.ok(resp.headers('via').startsWith('1.1 proxy3.softline.main'), 'proxy3 used');
index = resp.read();
doc = new DOMParser().parseFromString(index);
assert.ok(doc.documentElement.textContent.startsWith('Google'), 'got Google from google');
resp = http.get('http://localhost:888/autoTest/index-dev.html');
assert.ok(resp.headers('server').startsWith('UnityBase'), 'localhost is UnityBase server');
http.setGlobalProxyConfiguration('proxy3.softline.main:3249', '*google*');
assert.throws(function(){ http.get('http://www.google.com/')}, /winhttp/);


debugger
App.domain.models

var http = require('http');
http.setGlobalProxyConfiguration('proxy3.softline.main:3249', '10.1.19.34');

var UBConnection = require('UBConnection');
var remoteConnection = new UBConnection('http://10.1.19.34:888/orm');

remoteConnection.onRequestAuthParams = function(){ return {login: 'testElsUser', password: 'testElsPwd'}; }

var data = remoteConnection.run({
    entity: 'uba_user',
    method: 'select',
    fieldList: ['ID', 'name'], 
    whereList: {
        byName: {expression: 'ID', condition: 'equal', values: {id: 10}}
    }, 
    options: {limit: 1}
});
console.log(data);

var UBConnection = require('UBConnection');
var remoteConnection = new UBConnection('http://localhost:888/autoTest');
remoteConnection.onRequestAuthParams = function(){ return {login: 'testElsUser', password: 'testElsPwd'}; }
var assert = require('assert');

assert.throws( function(){UB.Repository('ubs_audit', null, remoteConnection).attrs('ID').select();}, /Access deny/, 'must deny select permission for testElsUser ubs_audit');  

try {
  throw new Error('aaa');
} catch(e) {
  console.log(e.toString());
  console.log(/aaa/.test(e));
}    

var http = require('http');

var req = http.request({
  host: 'localhost',
  port: '888',
  method: 'GET',
  path: '/orm/echoToFile'
}); 
req.end('asass');

var s = new TubDataStore('uba_user');
debugger
Math. 
' start with ' + (Math.round(Math.random() * 10000)+ 1) + ' maxvalue '

console.debug('a', 11)

var resp = conn.post('runScriptOnServerThread', 'this.result = {a: 10}');

var simpsonID = 3000000002000;
    
var resp = conn.post('runScriptOnServerThread', 'return cdn_contact.getSubjectsContacts(' + simpsonID + ', "phone1", "ClientTestScript");');
    ok(resp.length===0, 'no contacts for unknown type');
    // test contacttype cache
    var testTypeID = conn.insert({
        entity: 'cdn_contacttype',
        fieldList: ['ID'],
        execParams: {
            code: 'phone1',
            name: 'test phone1'
        }
    });
    resp = conn.post('runScriptOnServerThread', 'return cdn_contacttype.getContactTypeByCode("phone1");', "ClientTestScript");
    ok(resp, 'contact type cache cleared');
    conn.run({
        entity: 'cdn_contacttype',
        method: 'delete',
        execParams: { ID: testTypeID }
    });
    
    
var fs = require('fs');   
var s = removeCommentsFromJSON(fs.readFileSync('D:\\SVN\\M3\\trunk\\06-Source\\models\\UBS\\ubs_audit.meta'))
var ss = s.replace('\r', ' ', 'gm')
var ss = ss.replace('\n', ' ', 'gm')
var ss = ss.replace('\t', ' ', 'gm')
fs.writeFileSync('d:\\a.json', ss)
JSON.parse(ss)
JSON.parse(ss.trim())    


var a = require('assert');
a.deepEqual(['a', 'b'], ['b', 'a'])

conn.run({
  entity: 'cdn_contacttype',
  method: 'delete',
  execParams:{
   ID: 3000000001104
}
})

UB.Repository('cdn_contacttype').attrs('ID').where('code', '=', 'phone1').selectAsObject();

var simpsonID = 3000000002000;
var ok = require('assert').ok;
// test contact type cache
    resp = conn.post('runScriptOnServerThread', 'return cdn_contact.getSubjectsContacts(' + simpsonID + ', "phone1", "ClientTestScript");');
    ok(resp.length===0, 'no contacts for unknown type');

    var testTypeID = conn.insert({
        entity: 'cdn_contacttype',
        fieldList: ['ID'],
        execParams: {
            code: 'phone1',
            name: 'test phone1'
        }
    });
    resp = conn.post('runScriptOnServerThread', 'return cdn_contacttype.getContactTypeByCode("phone1");');
    ok(resp, 'contact type cache cleared');
    
    conn.run({
        entity: 'cdn_contacttype',
        method: 'delete',
        execParams: { ID: testTypeID }
    });
    resp = conn.post('runScriptOnServerThread', 'return cdn_contacttype.getContactTypeByCode("phone1");');
    
JSON.parse(' ')


conn.insert({
            entity: 'uba_role',
            fieldList: ['ID'],
            execParams: {
                ID: 0,
                name: 'Everyone',
                description: 'Preudo role only for ELS',
                sessionTimeout: 10000,
                allowedAppMethods: ''
            }
        });
        
conn.getDomainInfo()            


var fs = require('fs'), csv = require('csv1');

fContent = fs.readFileSync('D:\\projects\\UnityBase\\models\\UBM\\_initialData\\ubm_els.csv');
fContent = Ext.String.trim(fContent);
csvData = csv.parse(fContent, ';');
var val = 0;
typeof undefined
_.defined(undefined)

var c = require('CryptoJS\\build\\rollups\\sha256.js') 
debugger

var SHA256 = require('CryptoJS/sha256');

var s = 'salt'; 
console.time('sha');
for(var i = 0; i < 100; i++) {
  s = s + i;
  SHA256(s).toString()
}
console.timeEnd('sha');

var s = 'salt';
console.time('Nsha');
for(var i = 0; i < 100; i++){
  s = s + i;
  nsha256(s);
}  
console.timeEnd('Nsha');


UB.Repository('uba_user').attrs('ID').select();

var session = require('UBSession');
var crc32 = session.prototype.crc32;

crc32('aaaa', 0x04C11DB7);
var init = crc32('bbbb', 0x04C11DB7);

ncrc32(ncrc32(0, 'aaaa'), 'bbbb');
ncrc32(0, 'aaaabbbb')
crc32('aaaabbbb') 
console.time('a');
for(var i=0; i< 100; i++) {crc32('asdaslkjdf sdjgjksdf gdjkfhg dhaaaabbbb')}
console.timeEnd('a');

console.time('a');
for(var i=0; i< 1000; i++) {ncrc32(0, 'asdaslkjdf sdjgjksdf gdjkfhg dhaaaabbbb')}
console.timeEnd('a');



var init = session.prototype.crc32('aaaa', 0x04C11DB7);
session.prototype.crc32('bbbb', 0x04C11DB7, init);


conn.runCustom('runList', [
    {
        "fieldList": ['ID'],
        "entity": "ubs_settings",
        "method": "addnew"
    }
]);

var newID = conn.lastResponse[0].resultData.data[0][0];

var everyoneID = conn.lookup('uba_role', 'ID', {expression: 'ID', condition: 'equal', values: {ID: 0}});

var v;
var v1;
typeof v1
v1 == null
v=0
_.isEmpty(v)



var SHA256=nsha256; 
var users = UB.Repository('uba_user').attrs(['ID', 'name', 'uPassword', 'mi_modifyDate']).where('ID', '>', 1).where('uPassword', 'notNull').selectAsObject();
    _.forEach(users, function(user){
        conn.run({
            entity: 'uba_user',
            method: 'update',
            execParams: {
                ID: user.ID,
                uPasswordHashHexa: SHA256('salt' + user.uPassword),
                mi_modifyDate: user.mi_modifyDate
            }
        });
    });
    
var u = conn.post('runSQL', 'select ID, name, uPassword, mi_modifydate from uba_user where id > 1 and uPassword is not null')    


var users = conn.post('runSQL', 'select id, upassword from uba_user where id > 1 and uPassword is not null');

    _.forEach(users, function(user){
        conn.run({
            entity: 'uba_user',
            method: 'update',
            __skipOptimisticLock: true,
            execParams: {
                ID: user.ID || user.id,
                uPasswordHashHexa: SHA256('salt' + user.upassword || user.UPASSWORD)
            }
        });
    });
    
var r = conn.run({entity: 'uba_user', method: 'changePassword', newPwd: 'aaa', forUser: 'asa'}); //must be Error: User not found
var r = conn.run({entity: 'uba_user', method: 'changePassword', newPwd: 'aaa', forUser: 'admin1'}); //OK
// login using admin1
var r = conn.run({entity: 'uba_user', method: 'changePassword', newPwd: 'admin', forUser: 'admin'}); //Error: Change password for other users allowed only for `admins` group members


console.log(Session.userID)

conn.run({
            entity: 'uba_role',
            method: 'update',
            fieldList: ['ID'],
            __skipOptomistikLock: true,
            execParams: {
                ID: 0,
                name: 'Everyone',
                description: 'Preudo role only for ELS',
                sessionTimeout: 10000,
                allowedAppMethods: 'runList,getDomainInfo'
            }
        });



      

console.log(App.domain.byName('uba_user').methods.byName('update'))

console.log(Session.userRoles)

var http = require('http');
http.get(/servindexnp/servindexnp.asmx/GetRegionList?codeclient=string HTTP/1.1




var assert = require('assert');
var s200 = '1234567890'.repeat(20);

var values2insert = [{
        code: '1truncate', text100: s200, text2: s200
    }, {
        code: '2strip', text100: '<i>' + s200 + '<i>', text2: '<b><i>' + s200 + '</b></i>'
    },  {
        code: '3empty', text100: null, text2: '<b><i></b></i>'
    }],
    mustBe = [{
        code: '1truncate', mi_tr_text100: s200.substr(0, 100), mi_tr_text2: s200.substr(0, 2)
    }, {
        code: '2strip', mi_tr_text100: s200.substr(0, 100), mi_tr_text2: s200.substr(0, 2)
    },  {
        code: '3empty', mi_tr_text100: null, mi_tr_text2: ''
    }];

values2insert.forEach(function(item){
    conn.insert({
        entity: 'tst_clob',
        fieldList: ['ID'],
        execParams: item
    });    
});

var inserted = UB.Repository('tst_clob', {}, conn).attrs(['code', 'mi_tr_text100', 'mi_tr_text2']).orderBy('code').selectAsObject();
assert.deepEqual(inserted, mustBe);


var l = new TubList()
l.a = 1;
l.b = 2;
console.log(l.int64Val)
 
debugger
_.forEach(l, function(item, name){
  console.log(item, typeof item, name);
});

Object.keys(l)


var entityRe = /"entity".*:.*"(\w*)"/;

entityRe.exec('{"entity grid", \r\n "entity":  \t "uba_user", \r\n')

var f = function(){throw new Error('A');}
f.functionName = 'myFunc';
f()



var updated = conn.run({
        entity: 'tst_clob',
        method: 'update',
        fieldList: ['mi_tr_text2000'],
        execParams: {
            ID: 3000000001100,
            text2000: '<td style="width: 772px;">1</td><td style="width: 772px;">3</td>' 
        }
    });
updated.resultData.data[0][0]    

require('D:\\projects\\Autotest\\models\\TST\\_autotest\\aa.js'); 

var Crypto=require('CryptoJS')
var CryptoJS = require('CryptoJS/core')
var md5 = require('CryptoJS/md5.js')

var md5Arr = md5('PAVEL.MASH:softline.main:1bZ38KS2');
var tail = ':' + '+Upgraded+v1170e38ebdba6ba196ba3d32bd772ee79b00dbd95f003d00129d6ab67dab5e41ef23b6f504aff58d6cffcfab8d2b3e20c83ec1357f646f546' + ':' + '1EEB5549';

md5Arr.concat(CryptoJS.enc.Utf8.parse(tail));

throw new TypeError('sadd')

md5(md5Arr).toString()  
var a1 = md5('PAVEL.MASH:softline.main:1bZ38KS2') + ':' + '+Upgraded+v1170e38ebdba6ba196ba3d32bd772ee79b00dbd95f003d00129d6ab67dab5e41ef23b6f504aff58d6cffcfab8d2b3e20c83ec1357f646f546' + ':' + '1EEB5549'

md5(a1).toString()

debugger
console.log(r.toString())
console.log(r.toString(CryptoCore.enc.Base64))
console.log(r.toString(CryptoCore.enc.Hex))
console.log(r.toString(CryptoCore.enc.Latin1))
console.log(r.toString(CryptoCore.enc.Utf16))
console.log(r.toString(CryptoCore.enc.Utf16BE))
console.log(r.toString(CryptoCore.enc.Utf16LE))
console.log(r.toString(CryptoCore.enc.Utf8))

r.toString(Latin1


CryptoJS = require('CryptoJS/core')
debugger

UB.Repository('ubm_navshortcut').attrs(['caption_uk^', 'caption_en^']).selectAsObject();


var fs = require('fs'); 
var s = fs.readFileSync('D:\\Сервера.txt', {encoding: 'ascii'}); 
s.length
debugger

require('D:\\projects\\Autotest\\models\\TST\\_autotest\\0020_test_mixins.js');
var fs = require('fs');
console.log('fs is', fs); 

debugger

require('aa')


csvLoader = require('@unitybase/base').dataLoader;
csvLoader.loadSimpleCSVData(conn, 'D:\\SVN\\M3\\trunk\\06-Source\\models\\CDN\\_initialData\\cdn_currency.csv', 'cdn_currency', 'name;intCode;code3'.split(';'), [0, 1, 2], 1);

console.log('apple', 'fruit', 100)


 var url = require('url'),
 parsed = url.parse("http://user:pass@host.com:8080/p/a/t/h?query=string#hash");
 console.log(url.format(parsed));
 debugger
parsed instanceof url 

var util = require('util');
util.debug('sd')
util.print('aasa', 2)
util.puts('aasa', 2)


var querystring = require('querystring'); 
querystring.stringify({param1: 'value1', param2: ['arr1', 'arr2'], paramEmpty: '' })


var a = [10, 20, 30];
_.some(a, item => item===20)

_.some(a, function(item){ return item===20; })

debugger;
require('cmd/prepareGZIP');

// transaction isolation!!!
UB.Repository('uba_user').attrs(['ID', 'description']).selectAsObject();
// in the SQL: begin transaction; update uba_user set description = 'admin1' where id = 10;
UB.Repository('uba_user').attrs(['ID', 'description']).selectAsObject(); //must be admin in Oracle & Postgre. MS must wait on admin if snapshot!
//  in the SQL: commit;
UB.Repository('uba_user').attrs(['ID', 'description']).selectAsObject(); //must be admin1
//  in SQL: begin transaction isolation level SERIALIZABLE; select * from uba_user; 
conn.runList([{
  entity: 'uba_user', 
  method: 'update', 
  execParams: {description: 'new1', ID: 10},
  __skipOptimisticLock: true
},{
  entity: 'uba_user', 
  method: 'update', 
  execParams: {description: 'new2', ID: 10},
  __skipOptimisticLock: true
}]);
//  in SQL: select * from uba_user; commit; // must be admin1 !!!!
// select * from uba_user; // must be new1


debugger;
var fs, i;

console.time('req');
for(i=0; i<1000; i++){ fs = require('fs'); }
console.timeEnd('req');

debugger
require('models/UBS/public/UBReport')

console.time('a');
for(i=0; i<100; i++) UB.Repository('uba_user').attrs('ID').selectAsArray();
console.timeEnd('a');

uba_user.removeAllListeners('select:before')
//uba_user.on('select:before', function(ctxt){ console.log('GOT: ', ctxt.mParams.fieldList = ['ID', 'name'])})
uba_user.on('select:before', function(ctxt){ })


var c = require('CryptoJS');
c.MD5('zk@00i07').toString()
c.crc32('zk@00i07')

c.SHA1('zk@00i07').toString()
atob('YOqrVOMCaJ/tBjsprLMcVm1nXCav9R+rW0Y/P62vfi0=')
'124881697377514706134368425552'.length

res.add(1)
res.add(1)
// test123test => 498623902316890834654961370729
 
function ERC_encodePassword(pwd){
    var maxLen = 30, buff, i, c;
    var res = require('bigint').one;
    var resN = 1;
    buff = pwd;
    while(buff.length<maxLen){
     buff = buff + pwd.length + pwd;
    }
    buff = buff.substr(0, maxLen);
    //debugger;
    for(i=1; i<=30; i++){
      c = buff.charCodeAt(i-1) - 15; 
      res = res.multiply(Math.ceil(c / 3)).add(c*i + i);
    }
    return res.toString().substr(0, maxLen);
}
ERC_encodePassword('test123test') == '498623902316890834654961370729'


(function(){
    var old_emit = tst_document.emit;
    tst_document.emit = function(type){
      console.warn('Emmit', type);
      old_emit.call(arguments)
    } 
})()

var i = 0;
while(true){
console.log(i++); sleep(100);
}


var emitterLog = conn.post('runScriptOnServerThread', 'return global.eventEmitterLog.join("#")');

var r, r1;
console.time('nat');
for(var i = 0; i < 100; i++){ 
  r = UB.Repository('uba_user').attrs(['ID', 'description']).selectAsObject();
  r1 = UB.Repository('uba_user').attrs(['ID', 'description']).withTotal().selectAsArray();
}
console.timeEnd('nat');  

console.log();

var result = UB.Repository('uba_user').attrs(['ID', 'description']).withTotal().selectAsArray();
console.log('Total count is:', result.__totalRecCount)

var store = UB.Repository('uba_user').attrs(['ID', 'description']).withTotal().selectAsStore();
var origDataName = store.currentDataName; 
store.currentDataName = '__totalRecCount';
console.log('Total count is:', store.get(0));
store.currentDataName = origDataName;

UB.Repository('cdn_currency').attrs(['ID']).misc({__allowSelectSafeDeleted: true}).selectAsArray();
UB.Repository('cdn_currency').attrs(['ID']).selectAsArray();
__allowSelectSafeDeleted 


UB.Repository('uba_user').attrs(['ID', 'description']).withTotal().ubRequest()


var assert = require('assert')
var a = ['insert:before', 'insert:after', 'insert:before'];
assert.deepEqual(a, ['insert:before', 'insert:after', 'insert:before1'])


tst_service.removeAllListeners('multiply:before')
tst_service.on('multiply:before', function(ctxt){console.warn('before')}); 
conn.run({entity: 'tst_service', method: 'multiply', a: 2, b: 3});


var s2m = '1234567890<br>'.repeat(320000); 
conn.insert({
    entity: 'tst_clob',
    fieldList: ['ID'],
    execParams: {
        code: 'veryLong3', text2000: s2m
    }
    })
    
    
var v = new TubList();
v.add
v.blobVal.blobVal = 1;
v.blobVal.isNull

App.on('e', function(){console.log('got app e');});
debugger;
App.emit('e');



var
       dayDate = new Date(),
       row2Insert, inserted;

       dayDate.setMilliseconds(0);
       row2Insert = {
           code: '2014-01-01',
           docDate: dayDate,
           docDateTime: dayDate
       };
       
       inserted = conn.insert({
           entity: 'tst_document',
           fieldList: ['code', 'docDate', 'docDateTime'],
           execParams: row2Insert
       });
       row2Insert.code == inserted[0]
       row2Insert.docDate.getTime() === Date.parse(inserted[1])
       row2Insert.docDateTime.getTime() === Date.parse(inserted[2])
       
    console.log(row2Insert);
    console.log(JSON.stringify(row2Insert))
    console.log(inserted);
    
    new Date(row2Insert.docDate.toString())
    
    var theBigDay = new Date();
theBigDay.setMilliseconds(0);


var r = new TubDataStore('uba_user');

r.execSQL('begin test(?); end;', {a: 'aa'})


UB.Repository('uba_user').attrs('ID').where('ID', 'in', [10, 20]).where('name', 'startWith', 'asdjkashd'.repeat(500)).select()

var jsonlint = require('jsonlint');
var v = jsonlint.parse('{"a": 1}')
v


var fs = require('fs');
fs.writeFileSync('D:\\aa.js', 'asass');

var s = '{"a": "D:\\"}';
JSON.parse(s);
var jsonlint = require('jsonlint');
var v = jsonlint.parse(s)
debugger
JSON.stringify(v)
 
var v = JSON.parse();
JSON.parse()


var f = function(ctxt){
  console.log('Call type is external?', ctxt.externalCall);
}
uba_user.on('changePassword:before', f); 
uba_user.on('select:before', f);


var users = new TubDataStore('uba_user');
users.run('changePassword', {newPwd: 'admin'}); // Call type is external? false
users.run('select', {fieldList: ['ID']});
 

conn.run({
  entity: 'uba_user',
  method: 'changePassword',
  newPwd: 'admin'
});  // Call type is external? true

conn.run({
  entity: 'uba_user',
  method: 'select',
  fieldList: ['ID']
});  // Call type is external? true

var qrcode = require(App.domain.config.models.byName('COD').path + '/modules/qrcode-generator')

console.time('qr');
var qr = qrcode(4, 'M');
qr.addData('https://d.minjust.gov.ua/cod?i=r93llfqba&a=doc&e=ts');
qr.make();
console.log(qr.createBase64Gif())
console.timeEnd('qr');


conn.run({
  entity: 'uba_user',
  method: 'select',
  fieldList: ['count([ID])']
});  // Call type is external? true



console.log( JSON.stringify(UB.Repository('uba_user').attrs('[id] / 100 + 1').selectAsArray()))


var store = UB.Repository('uba_user').attrs('MAX([ID])').where('ID', '>', 1).select();
debugger
  if (!store.eof) {
    params.operationOrder = store.get(0) ? store.get(0 )+ 1 : 1;
  }

var store = UB.Repository('uba_user').attrs('ID').where('[ID]', 'in', [1, 2, 3]).select();

var assert = require('assert');
assert.deepEqual([1], [2])


var v = App.globalCacheGet('aa');  
console.log(typeof v);
console.log(v ==='')




var UBMail = require('UBMail');
function receiveMail(receiver) {
    var i, result = [];
    receiver.reconnect();
    toLog('getMessagesCount: '+receiver.getMessagesCount());
    var msg, msgParced, mc = receiver.getMessagesCount();
    debugger;
    // Indexes starts from 1
    for (i = 1; i <= mc; i++) {  // i = 568
        toLog('i='+i);
        msg = receiver.receive(i);
        msg.freeNative();
    }
    toLog('ready');
    return result;
};

var receiverConfig = { 
"host": "mail.softline.main",
"port": "110",
"backAddr": "lavrikov@softline.kiev.ua",
"tls": false,
"auth": true,
"user": "lavrikov",
"password": "4JLx2xEs"
};

var receiver = new UBMail.TubMailReceiver(receiverConfig);
for (var c = 0; c< 5; c++){
receiveMail(receiver);
}


console.log(App.domain.byName('tst_document').attributes.byName('caregory').customSettings)


conn.post('runScriptOnServerThread', 'if (global.ORG){ Session.removeListener("login", ORG.onUserLogin);}; return 1;');

if (global.ORG){ Session.removeListener("login", ORG.onUserLogin);}

// Запускается для всех!!!!!!
conn.run({entity: 'tst_document', method: 'ftsreindex'});

UB.Repository('ubs_fts').attrs(["*"]).select()

var Repo;
console.time('newRepo');
for (var i = 0; i < 1000; i++){
    Repo = require('http');
} 
console.timeEnd('newRepo');


var WindowTimer = require('WindowTimer');
var timerLoop = WindowTimer.makeWindowTimer(this, function (ms) { sleep(ms); });
setTimeout(function(){console.log('second function end');}, 2000);
setTimeout(function(){console.log('first function end');}, 1000);
console.log('before loop');
timerLoop();
console.log('after loop');

console.time('s');
sleep(100)
console.timeEnd('s');


JSON.parse('{"path": "\\\\fs\\Share\\Dev\\Registries\\Production\\Reports"}')

var argv = require('@unitybase/base').argv, fs = require('fs');
var assert = require('assert');
var obj = argv.safeParseJSONfile('d:\\temp\\per.json');
assert.equal(obj.path, "\\\\fs\\Share\\");
console.log(obj);


var ddl = require('cmd/generateDDL'):
require('D:/projects/UnityBase/models/ORG/_autotest/020_testORG.js');


console.log(App.domain.byName('ubs_fts').dsType)
console.log(TubEntityDataSourceType)


require('D:/projects12/Autotest/models/TST/_autotest/0030_testFTS.js');

var 
  allStaffUnitIDs, uData = {allStaffUnitIDs: ''};

allStaffUnitIDs = uData.allStaffUnitIDs && uData.allStaffUnitIDs.split(',');
repo = UB.Repository('uba_user')
            .attrs(['ID', 'name'])
            .where('ID', 'in', [])
            .select();
            
            
uData.allStaffUnitIDs ? 1: 2


var UBConnection = require('UBConnection');

var conn1 = new UBConnection('http://localhost:888/autotest/');
//var conn1 = new UBConnection({host: 'localhost', port: '888', path: 'autotest'});
conn1.onRequestAuthParams = function(){ return {authSchema: 'UB', login: 'admin', password: 'admin'} }
//debugger;
conn1.get('getDomainInfo');

var s = '';
console.log('"', s.charAt(0), '"');

var http = require('http');
     var assert = require('assert');
     var DOMParser = require('xmldom').DOMParser;
     // set global proxy settings
     //http.setGlobalProxyConfiguration('proxy.main:3249', 'localhost');
     http.setGlobalProxyConfiguration('', '172.21.21.201');
     debugger;
     var resp = http.get('http://censor.net.ua/')
     
var resp;
console.time('xray');
for (var i=0; i<1000; i++){
  resp = http.get('http://172.21.21.201/cgi-bin/consumer_proxy');    
} 
console.timeEnd('xray');
 
var fs, data, request, resp, http;
fs = require('fs');
http = require('http');
data = fs.readFileSync('D:\\Distr\\developer\\wrk-master.zip'); 

//var userID = fs.readFileSync('D:\\projects\\Autotest\\models\\TST\\_autotest\\fixtures\\СonstitutionUkr.txt');
var userID = 'UA1111';


var data1 = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:emtav5="http://emtav5.x-road.ee/producer/" xmlns:xrd="http://x-road.ee/xsd/x-road.xsd" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><SOAP-ENV:Header><xrd:id>emtav5-test-992064622931502</xrd:id><xrd:service>emtav5.uploadMime.v1</xrd:service><xrd:userId>';
var data2 = '</xrd:userId><xrd:consumer>11333578</xrd:consumer><xrd:producer>emtav5</xrd:producer><xrd:unit/></SOAP-ENV:Header><SOAP-ENV:Body><emtav5:uploadMime><request><target>KMD2</target><operation>vatdeclaration</operation><file href="cid:bb6acaf074bb49cc93892ea0d8881289"/><props><prop key="end">2013-05-30</prop><prop key="company">11333578</prop><prop key="person">38410155213</prop><prop key="start">2012-05-30</prop></props></request></emtav5:uploadMime></SOAP-ENV:Body></SOAP-ENV:Envelope>';

var numCnt = 1;
console.time('bin');
for (var i=0; i < numCnt; i++){
    request = http.request({
        //host: '172.21.21.201', port: '80', path: '/cgi-bin/consumer_proxy?a='+i, 
        host: '172.21.21.201', port: '80', path: '/cgi-bin/uriproxy?producer=ua-demo-db-003',
        method: 'POST',
        sendTimeout: 30000, receiveTimeout: 30000,
        keepAlive: true,
        compressionEnable: true
    });
    //request.write(data);    
    request.write(data1); request.write(userID); request.write(data2);
    resp = request.end();
}
console.timeEnd('bin');    


 
 var http = require('http');
 
 var resp;
 
 console.time('wsdl');
 for(var i=0; i < 100; i++){
   resp = http.get('http://172.21.21.201/cgi-bin/uriproxy?producer=ua-demo-db-003');
 }
 console.timeEnd('wsdl');
 
    var request = http.request({
        host: 'censor.net.ua', port: '80', path: '/', method: 'GET',
        sendTimeout: 30000, receiveTimeout: 30000,
        keepAlive: true,
        compressionEnable: true
    });
    var response = request.end();
    console.log(response);
    
var assert = require('assert');    
var res = conn.run({
                entity: "ubs_fts",
                method: "fts",
                fieldList: ["ID"],
                whereList: {match: {condition: "match", values: {"any": "Україна"}}},
                options: {limit: 100, start: 0}
            });   
if (!res.resultData || !res.resultData.data || !res.resultData.data.length) {
                throw new Error('invalidReadSearch');
            }  
var dataFTS = res.resultData.data; 

var res2 = UB.Repository('tst_document').attrs("ID")
    .where('', 'match', 'Україна')
    .where('docDate', '<', new Date(2015, 02, 13))
    .limit(2)
    .selectAsArray();

var dataEntity = res2.resultData.data;

assert.deepEqual(_.chain(dataFTS).flatten().sort().value(), _.chain(dataEntity).flatten().sort().value());


console.log({a: 1, b: "sss"})

try{
  throw new Error('assas');
} catch(e){  
  console.error('loadContent error ', e);
}  





    conn.run({
        alsNeed: false,
            entity: "tst_document",
        method: "update",
        fieldList: ["ID"],
        execParams: {
            ID: row[0].ID,
            mi_modifyDate: row[0].mi_modifyDate,
            description: modification.description
        }
    });
    
UB.Repository('cdn_city').attrs('sum([ID])').where('cityTypeID.code', 'isNull').where('cityTypeID.name', '>', '1').select();


require('UBMail/_autoTest/testMail.js')



conn.run({
    entity: "fts_ftsDefault",
    method: "ftsreindex",
    _ftsReindexOnlyInfo: false
});



  var soap = require('D:\\projects\\Autotest\\node_modules\\soap');
  var url = 'http://example.com/wsdl?wsdl';
  var args = {name: 'value'};
  soap.createClient(url, function(err, client) {
      client.MyFunction(args, function(err, result) {
          console.log(result);
      });
  });
  
  ett = 'cdn_currency';
  var res = conn.run({
       entity: ett,
       method: "select",
       fieldList: ["ID","name"],
       whereList: {"c01":{"expression":"0","condition":"in","values": {"a":['', '']}}}
  });

  
  var ubaeRoleStore = UB.Repository(ett)
				.attrs(["ID", "name"])
				.where("ID", "in", [3000000001273, 2])
				.select();
                
                
var res = conn.run({
  "entity":"tst_document","method":"select",
  "fieldList":["favorites.code","docDate","code","description","fileStoreSimple","ID","mi_modifyDate"],
  "whereList":{"x100":{"condition":"match","values":{"any":"123*"}}},
  "options":{"totalRequired":true,"limit":100,"start":0}
});


UB.Repository('tst_document').attrs("ID").where('', 'match', 'Україна').selectAsArray();
                
var l = new TubList()
l.aa = 11
l.clear()
l

var fs = require('fs');
fs.appendFileSync('d:\\a.txt', 'Привет!');

var argv = require('@unitybase/base').argv;
// connect to server 
var session = argv.establishConnectionFromCmdLineAttributes();
var localiz = require('D:\\SVN\\M3\\trunk\\06-Source\\models\\UBS\\_initialData\\locale\\uk^020_cdn_enum.js');
debugger
localiz(session); 

var http = require('http');
http.setGlobalConnectionDefaults({receiveTimeout: 300000});
var 
  store = new TubDataStore('tst_blob'),
  l = new TubList(),
  fs = require('fs'),
  arr; 
arr = fs.readFileSync(process.binPath + 'UB.exe', {encoding: 'bin'}); // get content of binary file as array buffer
l.ID = store.generateID();
l.description = 'test1';
debugger;
l.setBLOBValue('blb', arr);
store.execSQL('insert into tst_blob(id, description, blb) values(:ID:, :description:, :blb:)', l);

store.execSQL('insert into tst_blob(id, description, blb) values(:ID:, :description:, :blb:)', {
  ID: store.generateID(),
  description: 'testAsSetter',
  blb: arr
});


debugger
var csv = require('csv1'),
    fs = require('fs'),
    content, data, cnt, params;

console.time('parse ' + cnt + ' rows');

content = fs.readFileSync('D:\\projects\\Autotest\\models\\TST\\_initialData\\uba_als.csv'),
data = csv.parse(content, ';'),
cnt = data.length;
params = {
  entity_arr: data.map( row => row[1] ),
  attribute_arr: data.map( row => row[2] ),
  state_arr: data.map( row => row[3] ),
  roleName_arr: data.map( row => row[4] ),
  actions_arr: data.map( row => row[5] )  
};
console.timeEnd('parse ' + cnt + ' rows');

var store = new TubDataStore('uba_als');
store.execSQL('delete from uba_als', {});
console.time('insert ' + cnt);
store.execSQL('insert into uba_als (ID, entity, attribute, state, roleName, actions) values (SEQ_UBMAIN_BY1.NEXTVAL, :entity_arr:, :attribute_arr:, :state_arr:, :roleName_arr:, :actions_arr:)', params);
console.timeEnd('insert ' + cnt);


var r = UB.Repository('cdn_organization').attrs(['*']).selectAsArray()

var QWhen = require('when');
var r = UB.Repository('cdn_organization').attrs(['ID', 'mi_owner.name']).where('[ID]', '=', 3000000002801).select();
console.log(r.fieldIndexByName('mi_owner.name'));
console.log(r.fieldIndexByName('unexistedAttr'));

console.log(r.asJSONArray)

r = QWhen.resolve(r.selectAsArray()).then(function (response) {
      console.log(response.resultData.data);
  debugger;
  return LocalDataStore.selectResultToArrayOfObjects(response, {});
})

debugger
var s = new TubDataStore('uba_user');



console.log(r.resultData.data);

var l = new TubList();

l.a = 1;

JSON.stringify(l)



d = new Date().getTime();
sleep(1000);
console.log(new Date().getTime() - d)


var signer = new TubSigner();
signer.loadDocumentFromFile('D:\\temp\\KSUBDF-288-01.pdf', 2);

var store = new TubDataStore('uba_user');
store.initFromJSON([{a: "1", b: "asa", boo: true}]);
var obj = JSON.parse(store.asJSONObject);
console.log('Must be string but got', (typeof obj[0].a));
console.log('Must be boolean but got', (typeof obj[0].boo), 'value:', obj[0].boo);

 
 
UB.Repository('tst_maindata').attrs(["ID", "code", "nonNullDict_ID.calculated"]).orderBy("nonNullDict_ID.calculated").orderBy("caption").select()
console.log('sasafa')


var a = UB.Repository('uba_role').attrs(["ID", "name"]).select();
a.sort((a, b) => a.ID - b.ID)
_.find(a, {ID: 5000034858880})

var SHA256 = nsha256;
var i, n, uID;
n=70000;
console.time('InsertUsers' + n);
for(i=5; i<=n; i++){ 
  uID = conn.insert({entity: 'uba_user', fieldList: ['ID'], execParams: {name: 'user' + i, uPasswordHashHexa: SHA256('saltuser' + i)}});
  conn.run({entity: 'uba_userrole', method: 'insert', execParams: {userID: uID, roleID: 1}});
}
console.timeEnd('InsertUsers' + n);

console.time('arr');
var parr = new Array(700000);
for(i=0; i<700000; i++){
  parr[i] = 'pwd' + i;
}
console.timeEnd('arr');


// insert manu users
var store = new TubDataStore('uba_user');
var 
  SHA256 = nsha256,
  params,
  t, i, n, cnt, startFrom = 1, transLength = 10/*10000*/, transCnt; 

transCnt = 1;//7;
console.time('insert' + transCnt * transLength);
for (t = 0; t < transCnt; t++){
    console.time('trans' + t);
    params = {
      userid: new Array(transLength), 
      uname: new Array(transLength),
      upwd: new Array(transLength)
    };
    n = t * transLength;
    for(i=0; i < transLength; i++, n++){
        params.userid[i] = store.generateID();
        params.uname[i] = 'user' + (startFrom + n);
        params.upwd[i] = SHA256('saltuser' + (startFrom + n));
    }
    store.execSQL("insert into uba_subject(ID, name, sType, mi_unityentity) values(:userid:, :uname:, 'U', 'UBA_USER')", params);
    store.execSQL('insert into uba_user(ID, name, uPasswordHashHexa, mi_owner, mi_createDate, mi_createUser, mi_modifyDate, mi_modifyUser)'+
      '    values (:userid:, :uname:, :upwd:, 10, CAST(SYS_EXTRACT_UTC(SYSTIMESTAMP) as date), 10, CAST(SYS_EXTRACT_UTC(SYSTIMESTAMP) as date), 10)', 
      params);  
    store.execSQL('insert into uba_userrole(ID, userID, roleID, mi_owner, mi_createDate, mi_createUser, mi_modifyDate, mi_modifyUser)'+
      '    values (:userid:, :userid:, 1, 10, CAST(SYS_EXTRACT_UTC(SYSTIMESTAMP) as date), 10, CAST(SYS_EXTRACT_UTC(SYSTIMESTAMP) as date), 10)', 
      params);
    params = {};
    gc();    
    console.timeEnd('trans' + t);
} 
console.timeEnd('insert' + transCnt * transLength);


//login many users
var 
  UBConnection = require('UBConnection'),
  conn1, i, cnt=10000;
for(i = 1; i < cnt; i++){
   conn1 = new UBConnection({host: 'localhost', port: '888', path: 'autotest', keepAlive: true});
    // alternative way is:
    // var conn = new UBConnection('http://localhost:888/orm');
    // but in this case keepAlive is false
    conn1.onRequestAuthParams = function(){ return {authSchema: 'UB', login: 'user' + i , password: 'user' + i} }
    conn1.run({entity:"cdn_currency",method:"select",fieldList:["intCode","code3","name","ID","mi_modifyDate"], whereList: {w1: {expression: 'code3', condition: 'equal', values: {code3: 'USD'}}}});
}   

//store.execSQL('delete from uba_als', {});
console.time('insert ' + cnt);
store.execSQL('insert into uba_als (ID, entity, attribute, state, roleName, actions) values (SEQ_UBMAIN_BY1.NEXTVAL, :entity_arr:, :attribute_arr:, :state_arr:, :roleName_arr:, :actions_arr:)', params);
console.timeEnd('insert ' + cnt);

    var csvLoader = require('@unitybase/base').dataLoader;

    console.info('\tFill ELS for UBA model');
debugger;
    csvLoader.loadSimpleCSVData(conn, 'D:/projects/UnityBase/models/UBA/_initialData/uba_els.csv', 'uba_els', 'code;entityMask;methodMask;ruleType;ruleRole;description'.split(';'), [
	0, 1, 2, 3, 
	function(row){
		var v = parseInt(row[4], 10);
		if( isNaN(v) ) {
			return conn.lookup('uba_role', 'ID', {expression: 'name', condition: 'equal', values: {name: row[4]}});
		} else {
			v
		}
	}, 
	5], 1);
    
    
    
var 
  UBConnection = require('UBConnection'),
  conn1;
      
conn1 = new UBConnection({host: 'banyai-w8', port: '888', path: 'billing', keepAlive: true});
// alternative way is:
// var conn = new UBConnection('http://localhost:888/orm');
// but in this case keepAlive is false
conn1.onRequestAuthParams = function(){ return {authSchema: 'UBIP', login: 'monitor'} }
var s = "([$.currentOwner()] OR [$.currentUserInGroup(ubm_desktop,'admins')] OR [$.currentUserOrUserGroupInAdmSubtable(ubm_desktop)])";
console.time('n');
for(var i=0; i< 1000; i++){
//  conn1.run({entity:"cdn_currency",method:"select",fieldList:["intCode","code3","name","ID","mi_modifyDate"], whereList: {w1: {expression: 'code3', condition: 'equal', values: {code3: 'USD'}}}});
s.replace(/\[(\$\..*?)\]/g, '" + $1 + "')
}
    
console.timeEnd('n');

console.log("(") + $.currentOwner() + " OR " + $.currentUserInGroup(ubm_desktop,'admins') + " OR " + $.currentUserOrUserGroupInAdmSubtable(ubm_desktop) + ")")

var 
  UBConnection = require('UBConnection'),
  conn1;
conn1 = new UBConnection({host: '10.1.17.33', port: '888', path: 'autotest', keepAlive: true});
conn1.onRequestAuthParams = function(){ return {authSchema: 'UBIP', login: 'admin_ip'} }
conn1.run({entity: 'tst_maindata', method: 'select', fieldList: ['ID', 'code']})


console.time('rls');
for(var i = 0; i < 1000; i++){
  conn1.run({entity: 'ubm_navshortcut', method: 'select', fieldList: ['ID', 'code']})
}
console.timeEnd('rls');

conn.run({entity: 'tst_maindata', method: 'select', fieldList: ['ID', 'code']})  

console.time('st');
var store; 
for(var i = 0; i < 10000; i++){ 
  store = new TubDataStore('uba_user');
}
console.timeEnd('st');

store.runSQL('delete from uba_user where id = 1', {});




var fs = require('fs');
var data = fs.readFileSync('D:/temp/a.vbs');
var arr = data.split('\r\n');
console.log(arr)


 var store = new TubDataStore('uba_user');
 store.runSQL('insert into fake(id) values(2); select * from uba_subject where id = 1', {});
 console.log(store.asJSONObject)
 
 var store = new TubDataStore('tst_IDMapping');
 var res = store.run('insert', {execParams: {code: 'aaa'}});
 console.log(res);
 
console.time('genID');
for(var i=0; i<1000; i++){ 
  store.generateID()
 }   
 console.timeEnd('genID');
 
debugger;
var res = conn.runCustom('runList', [{
  entity: 'uba_user',
  method: 'select',
  fieldList: ['ID', 'name']
}]);
console.log(typeof conn.lastResponse)
console.log(res);
 




for(var i=0; i<100; i++){
    var jsonPackageRequest = new TubDocumentRequest();
    var packageId = 3000000003634; // 68 Mb documet here
    
    jsonPackageRequest.entity = 'tst_document';
    jsonPackageRequest.attribute = 'fileStoreSimple';
    jsonPackageRequest.id = packageId;
    
    var docHandler = jsonPackageRequest.createHandlerObject(false);
    docHandler.loadContent(TubLoadContentBody.Yes);
    var docBody = docHandler.request.getBodyAsUnicodeString();
    console.log(docBody.length); 
    docHandler.freeNative(); //!!!
    jsonPackageRequest.freeNative(); //!!!
}
gc();// !!!

var data;
for(var i=0; i<1000; i++){
  data = UB.Repository('tst_document').attrs('*').selectAsObject();  
}



var dataStore = new TubDataStore('uba_user');
console.log(dataStore);


conn.runCustom('getAppInfo')
var appInfo = conn.lastResponse;
console.log('Connected to application %s', appInfo.UBAppConfig.applicationName);

var res = conn.run({entity: 'ubs_monitor', method: 'getStatInfo', params: {host: '10.1.17.33:888', app: 'autotest'}});
console.log(res)


function doSome (ctxt) {
  try {
    var objArr = [{ID: 1, b: "aaa"}, {ID: 2}];
    var store = new TubDataStore('uba_user');
    store.initFromJSON(objArr);
  } catch(e){
    console.error(e); 
  }  
  console.log(store.asJSONObject)
}


try{
    conn.run({
        entity: 'tst_service',
        method: 'testDataStoreInitialization'
    });
} catch(e){
  console.log('eer:', e);
}    

conn.runList([{"entity": "notary_medirent", "method": "select","fieldList": ["*"],"options": {"limit": 1}}])

console.log(App.domain.config.models.byName('UB'))
gc()

var r = require('D:/projects/Autotest/models/TST/modules/CalibriImpBold.js');
var fs = require('fs');
fs.writeFileSync('D:/projects/Autotest/models/TST/modules/CalibriImpBold_json.json', r);
var r = require('D:/projects/Autotest/models/TST/modules/CalibriImpBold_json.json');

debugger
var http = require('http');
http.setGlobalProxyConfiguration('proxy3:3249', 'localhost');
//console.log(http.get('https://www.google.com.ua'));
console.log(http.get('https://geocode-maps.yandex.ru/1.x/', {format: 'json', geocode: 'Украина, г.Киев, ул.Санаторная, 11'}));


var L = new TubList()
L.c = undefined

var msg = new TubDataStore('ubq_messages');
msg.run('success', {ID: 3000000001803})



var params = {code_arr: ['1', '2']};
var store = new TubDataStore('tst_IDMapping');
store.execSQL('delete from tst_IDMapping', {});
console.time('insert');
store.execSQL('insert into tst_IDMapping (C_ID, C_CODE) values (SEQ_UBMAIN_BY1.NEXTVAL, :code_arr:)', params);
console.timeEnd('insert');

console.log(UB.Repository('tst_IDMapping').attrs('*').selectAsObject())

var res = conn.run({
  entity: 'uba_user', method: 'select', fieldList: ['ID', 'name'],
  orderList: {}
})



function underscoreCaseToCamelCase (sourceObject) {

	if (_.isArray(sourceObject)) {
		return sourceObject.map(function (objectItem) {
			return underscoreCaseToCamelCase(objectItem);
		})
	}

	if (_.isObject(sourceObject)) {

		var resultObject = {};

		_.keys(sourceObject).forEach(function (key) {

			var newKey = (key.indexOf("_") > -1 || key[0].toLowerCase() !== key[0]) ?  key.toLowerCase().replace(/(\_)(.{1})/g, function () {return arguments[2].toUpperCase()}).replace(/id$/i, "ID"): key;

			if (_.isObject(sourceObject[key])) {
				resultObject[newKey] = underscoreCaseToCamelCase(sourceObject[key]);
			}
			else {
				resultObject[newKey] = sourceObject[key];
			}
		});
		return resultObject;
	}

	return sourceObject;
}

var key = 'SE_SE_ID';
var newKey = (key.indexOf("_") > -1 || key[0].toLowerCase() !== key[0]) ?  key.toLowerCase().replace(/(\_)(.{1})/g, function () {return arguments[2].toUpperCase()}).replace(/id$/i, "ID"): key;


var 
  store = new TubDataStore('uba_audit'),
  i=1, j=1;
//store.runSQL('select a.entity as EN_TITY' + j + ', a.entityinfo_id, a.actionType as ACTION_TYPE from uba_audit a where rownum < :rn:', {rn: i});
store.runSQL("select 'sample' from dual", {});
store.freeNative()

for(i=1; i< 10000; i++){
  for(j=0; j<20; j++){
    //store.runSQL('select a.entity as EN_TI_TY, a.entityinfo_id, a.actionType as ACTIONTYPE from uba_audit a, uba_audit where rownum < 3000', {});
    store.runSQL('select a.entity as EN_TITY' + j + ', a.entityinfo_id, a.actionType as ACTION_TYPE from uba_audit a where rownum < :rn:', {rn: i});
  }
  //store.runSQL('select a.entity as EN_TITY, a.entityinfo_id, a.actionType as ACTION_TYPE from uba_audit a', {});
}
store.freeNative();


console.time('camelizeOld');
var data = JSON.parse(store.asJSONObject);
var res = underscoreCaseToCamelCase(data); 
console.log(res.length, res[0]);
console.timeEnd('camelizeOld');


/**
 * Convert string from underscore notation to camelCase except ID (RE_OP_ID -> reOpID)
 */
function camelCase(string){
  var 
    arr = string.toLowerCase().split('_'),
    i, l, s;
  for(i=1, l=arr.length; i<l; i++){
    s = arr[i];
    arr[i] = s === 'id' ? 'ID' : s.charAt(0).toUpperCase() + s.slice(1); 
  }
  return arr.join('');
}
/**
 * Convert store data to array of object where each attribute name is converted to camelCase (RE_OP_ID -> reOpID)
 * x3 faster & x5 less memory compared to underscoreCaseToCamelCase 
 * Sample:
 *      var store = new TubDataStore('uba_audit');
        store.runSQL('select a.entity as EN_TI_TY, a.entityinfo_id, a.actionType as ACTION_TYPE from uba_audit a where rownum < 3000', {});
        var objArray = underscoreCaseToCamelCaseForStore(srore); // [{ enTiTy: 'uba_els', entityinfoID: 3000000000113, actionType: 'INSERT' }, ....]
 *    
 * @param {TubDataStore} store
 * @returns {Array<Object>}
 */ 
function underscoreCaseToCamelCaseForStore(store){
  var 
    LocalDataStore = require('LocalDataStore'),
    fieldAliases = {},
    i, l, dataArray, result = [];
  if (!store.eof){
    dataArray = JSON.parse(store.asJSONArray);
    for(i=0, l = dataArray.fields.length; i<l; i++){
        fieldAliases[dataArray.fields[i]] = camelCase(dataArray.fields[i]);         
    }
    result = LocalDataStore.selectResultToArrayOfObjects(
        {resultData: dataArray}, 
        fieldAliases
    );
  }
  return result;     
}

console.time('camelizeNew');
var res = underscoreCaseToCamelCaseForStore(store); 
console.log(res.length, res[0]);
console.timeEnd('camelizeNew');
  
console.log(LocalDataStore.selectResultToArrayOfObjects({resultData: {
    data: [['row1_attr1Val', 1], ['row2_attr2Val', 22]],
    fields: ['attrID.name', 'attr2']}
}));


var a =1;
debugger;
console.log(a);
1a
a1


UB.UBError = function UBError(message, detail, code) {
        this.name = 'UBError';
        this.detail = detail;
        this.code = code;
        this.message = message || 'UBError';
        this.stack = null;
    };
    UB.UBError.prototype = new Error();
    UB.UBError.prototype.constructor = UB.UBError;
    
function aa(){
  //throw new UB.UBAbortError('<<<wah-wah>>>');
  throw new Error('wah-wah');
}

function bb(){
  console.log('befor call aa');
  aa();
  console.log('after call aa');  
}

bb();

console.log(UB.UBAbortError)


//AV
var s = new TubDataStore('uba_user');
s.initFromJSON({"fieldCount":9,"values":["ID","Int","Test",0,0,"abcde+¬ef+б+¬","abcde+¬ef+б+¬","abcde+¬ef+б+¬",
    3.14159265300000E+0000,1203,"2009-03-10T21:19:36"],"rowCount":2});
console.log(s.asJSONArray);    


// invalid count
var s = new TubDataStore('uba_user');
s.initFromJSON({
  fieldCount:3,
  rowCount:2,
  values:["ID","Int","Test",
    0,0,"abcde+¬ef+б+¬","abcde+¬ef+б+¬",
    3.14159265300000E+0000,"1203","2009-03-10T21:19:36"]
});
console.log(s.asJSONArray);

var s = new TubDataStore('uba_user');
console.time('initfromJSON');
for(var i=0; i<10000; i++){
//s.initFromJSON([{
s.initialize([{
		"num" : 2,
		"fullName" : "03.05.02 Зупинення ВП п.2 ч.1 ст.37 (визнання сторони недієздатною)",
		"mi_wfState" : "ACTUAL",
		"decDate" : "2015-10-19T13:10:19Z",
		"acceptDate" : "2015-10-19T13:11:05Z",
		"acceptEmpStr" : "Паламарчук Лілія Олексіївна",
		"approveDate" : "2015-10-19T13:11:15Z",
		"dateCanceled" : null,
		"lastDepStr" : "Учбовий Відділ ДВС",
		"typeID.code" : "03.05.02",
		"typeID.formCode" : "vp_vpDecisionVpPause-edit",
		"mi_unityEntity" : "vp_vpDecisionVpPause",
        "lastATUStr": undefined,
//        "lastATUStr": null,
		"acceptEmpID" : 50129,
		"acceptDepID" : 51664,
		"acceptDepStr" : "Учбовий Відділ ДВС",
		"approveEmpID" : 50129,
		"approveEmpStr" : "Паламарчук Лілія Олексіївна",
		"approveDepID" : 51664,
		"approveDepStr" : "Учбовий Відділ ДВС",
		"cancelingDecID.approveAtuID" : null,
		"cancelingDecID.approveAtuStr" : null,
		"cancelingDecID.approveDepID" : null,
		"cancelingDecID.approveDepStr" : null,
		"ID" : 500000663273901
	}, {
		"num" : 1,
		"fullName" : "01.01 Відкриття виконавчого провадження",
		"mi_wfState" : "ACTUAL",
		"decDate" : "2015-10-19T09:27:37Z",
		"acceptDate" : "2015-10-19T09:28:18Z",
		"acceptEmpStr" : "Паламарчук Лілія Олексіївна",
		"approveDate" : null,
		"dateCanceled" : null,
		"lastDepStr" : "Учбовий Відділ ДВС",
		"typeID.formCode" : "vp_vpDecisionVpOpen-edit",
		"typeID.code" : "01.01",
		"mi_unityEntity" : "vp_vpDecisionVpOpen",
        "lastATUStr": undefined,
        //"lastATUStr": null,
		"acceptEmpID" : 50129,
		"acceptDepID" : 51664,
		"acceptDepStr" : "Учбовий Відділ ДВС",
		"approveEmpID" : null,
		"approveEmpStr" : null,
		"approveDepID" : null,
		"approveDepStr" : null,
		"cancelingDecID.approveAtuID" : null,
		"cancelingDecID.approveAtuStr" : null,
		"cancelingDecID.approveDepID" : null,
        "cancelingDecID.approveDepStr" : null,
   		"ID" : 500000663252456
	}
]);
}
console.timeEnd('initfromJSON');
console.log(s.asJSONArray);

JSON.stringify({a: 10, b: undefined, c: new Date()}, function(key, value) {
  if (typeof value === 'undefined') {
    return null;
  }
  return value;
});

var v = undefined;
typeof v


JSON.stringify({a: 10, b: undefined, k: null, c: new Date()});
JSON.stringify([1, 2, null, undefined, 4])


var s = new TubDataStore('uba_user');
s.initFromJSON();
s.initFromObjArray();        

new Date().toString()

new Date().getTimezoneOffset()

var repository = UB.Repository('uba_user').attrs(['ID', 'name']).where('ID', 'in', [1, 2]).select();

var repository = UB.Repository('uba_user').attrs(['ID', 'name']).where('name', 'in', ['one', 't"wo']).select();

var s = new TubDataStore('uba_user');
s.execSQL('insert into tst_dictionary (id, code) values (:ID:, :code:)', {ID: [1,2,3], code: ['as','bs','cs']})

var s = new TubDataStore('uba_user');
s.runSQL('select ID, code from dbo.test_table_func(:code:)', {code: '12'}); 


var fs = require('fs');
var str = fs.readFileSync('D:/projects/Autotest/models/TST/_autotest/fixtures/synJSON.json');
var obj 
console.time('parse');
for (var i=0; i<50000; i++){
  obj = JSON.parse(str);
  if(obj.glossary.title!=='example glossary') throw new Error('glossary');
}
console.timeEnd('parse');

{"entity":"rrpUb_infoNotary","method":"generate","searchParams":{"searchIn":{"realEstateRegister":"address","disposalObjectByObjectRegister":"address","mortgageRegister":"address","disposalObjectBySubjectRegister":"both"},"reportReason":{"reason":"посвідчення правочину"},"notaryInfo":{"employeeId":19314,"employeeIdDetails":{"caption":"Дерун Каріна Анатоліївна"},"companyName":"Приватний нотаріус Дерун К.А.","notaryRegion":"Київська обл."},"addressInfo":{"localityAtuId":12436,"localityAtuIdDetails":{"caption":"с. Насташка","PARENT2NAME":"Київська обл.","PARENT1NAME":"Рокитнянський р-н","ATUCODE":"3223783501"}},"codes":{"cadastreNumber":"3223783501:01:037:0051"},"subjectInfo":{"innOrEdrpou":"2341423641","nameUa":"Шабельна Катерина Олексіївна"}}}

var 
  docID = 3000000005601,
  docEntity = 'tst_document';

//dataStore = UB.Repository(docEntity)
//        .attrs(['ID'])
//        .where('[ID]', '=', docID)
//        .select();
//dataStore.run('lock', {
//  lockType: "ltPersist", 
//  ID: docID
//});          
var Signer = require('PDFSign');
var signing = Signer.newSigningFromStore({
  entity: docEntity,
  attribute: 'fileStoreSimple',
  id: docID
});
signing.signer.signDocument(JSON.stringify({
  signatureName: 'testSignature',
  location: 'Kiev',
  reason: 'testOfNewPlugin',
  invisible: true
}));
signing.signer.saveDocumentToFile('d:\\testSign.pdf');
//debugger;
var newDocContent = Signer.saveToStore(signing);
console.log(newDocContent);
docDataStore = new TubDataStore(docEntity);
docDataStore.run('update', {
    fieldList: ['ID', 'fileStoreSimple'],
    execParams: {
        ID: docID,
        document: newDocContent
    },
    __skipOptimisticLock: true
});

var path = require('path');
console.log(path.join('d:\\test1', '\\test2', 'test3.pdf'))



var
  Signer = require('PDFSign'), 
  canvas = new Signer.TubCanvas(),
  signer = new Signer.TubSigner(),
  color, color1, i;
  
console.time('colorSyn');
for(i=0; i<100; i++){
  color = canvas.createColor(10, 10, i % 100);
}
console.timeEnd('colorSyn');  

console.time('colorN');
for(i=0; i<1000000; i++){
  color1 = canvas.createColor1(10, 10, i % 100);
}
console.timeEnd('colorN');
console.log(color, color1)

canvas.createNew(100, 100, color);

console.log(canvas.createColor(10, 10, 0));

require('D:/projects/UnityBase/bin/modules/PDFSign/_autotest/test_TubSigner.js'); 
var v = require('D:/projects/UnityBase/bin/modules/PDFSign/_autotest/fixtures/testSignParams.json'); 


console.debug(canvas.__proto__)

var ThreadTest = require('ThreadTest');
console.debug(ThreadTest)
ThreadTest.verifyData


var a = {'pageSize' : {
				get width() {
					return this.pageWidth
				},
				get height() {
					return pageHeight
				}, pageWidth: 100
			}}
            
console.log(a.pageSize.width)


require('D:/projects/UnityBase/bin/modules/UBCanvas/_autotest/test_UBCanvas.js');

var UBCanvas = require('UBCanvas');
UBCanvas.createColor(0,0,0)
UBCanvas.TextFormats
console.log(UBCanvas.prototype.TextFormats).Center)



var jsonPackageRequest = new TubDocumentRequest();
var packageId = 3000000003634; // 68 Mb documet here

jsonPackageRequest.entity = 'tst_document';
jsonPackageRequest.attribute = 'fileStoreSimple';
jsonPackageRequest.id = packageId;
jsonPackageRequest.setBodyFromArrayBuffer(null);

require('cmd/autotest');

Session.setUser(10);
console.time('els');
for(var i=0; i< 10000; i++){
  App.els('uba_user', 'select');
}
console.timeEnd('els');
console.log('Right for uba_user.select:', App.els('uba_user', 'select'))


require('ffi')
require('winApi')

debugger;
require('cmd/createStore')

relToAbs(process.cwd(), '.\\documents/..\\fts')

var argv = require('@unitybase/base').argv;
argv.getServerConfiguration()


for (e in App.domain.items) { console.log(e.name) }


var UBConnection = require('UBConnection'), conn;
debugger
conn = new UBConnection({
                    URL: 'http://127.0.0.1:888/autotest'
});
conn.onRequestAuthParams = function createRequestAuthParams (){
                    return function() { return {login: 'admin', password: 'admin'} };
                }
                
require('D:/SVN/M3/trunk/06-Source/models/ORG/_autotest/020_testORG.js');                 


var repo = new TubDataStore('org_organization');
UB.Repository('uba_user').attrs(['ID', 'name']).where('ID', '=', 10).select(repo);
debugger
console.log(repo.length)
console.log(repo.asJSONArray)


var fs = require('fs');
var content = fs.readFileSync('D:\\SVN\\M3\\trunk\\06-Source\\release\\modules\\PDFSign\\PDFSign.js', {encoding: 'bin'});
var view = new Uint8Array(content);
for(var i=0, l = view.length; i<l; i++){
  if (view[i]>=126 || view[i]< 10) {
    console.log(i);
  }
}  


var fs = require('fs');
var content = fs.readFileSync('D:\\SVN\\M3\\trunk\\06-Source\\release\\modules\\PDFSign\\PDFSign.js');

UB.Repository('ubs_audit').attrs(['ID', 'actionType', 'actionType.code', 'actionType.shortName']).selectAsObject()

var e = ubs_audit.entity.attributes
//var e = App.domain
debugger


var Buffer = require('buffer');

console.log(App.domain.items[0].attributes.asJSON)

var enums = UB.Repository('ubm_enum').attrs(['eGroup','code', 'name']).selectAsObject();
console.log(_.groupBy(enums, 'eGroup'))


require('D:/SVN/M3/trunk/06-Source/models/UBA/_autotest/010_testELS.js') 

var a = App.domain.byName('uba_user').attributes.byName('asd')
console.debug(a)


var q = {
  '$top': 10,
  '$skip': 5,
  '$select': [ 'foo' ]
}

q['$top']

UB.Repository('uba_user').attrs('*').where('length([name])', '>', 10).select()

console.log(TubAttrDataType)

var entity = App.domain.byName('uba_user');
var attrs = entity.attributes;
var attr = attrs.newFromJSON(JSON.stringify({name: 'custom1', dataType: 'String', size: 10}), -1);

var attr = attrs.addTyped('custom1', TubAttrDataType.String, false, 10);

console.debug(attr);
attr.associatedEntity = 'teteet' 
debugger


var stor = new TubDataStore('uba_user');
stor.execSQL('update uba_user set aa = 11', {})


debugger
var m = require('cmd/upgradeConfig');


var argv = require('@unitybase/base').argv;
var cfgFile=  argv.findCmdLineSwitchValue('cfg');

old = require(relToAbs(process.cwd(), cfgFile));


var xml2js = require('models/CI/node_modules/xml2js');
var parseString = xml2js.parseString;
var 
  pathToXML = 'D:/SVN/M3/trunk/06-Source/models/CI/_sandbox/last.xml',
  pathToSource = 'D:/SVN/M3/trunk/06-Source'
  cmdToExecute = 'cmd /C svn log -v -r 11500:11559 --limit 20 ' + pathToSource + ' --xml 1> ' + pathToXML;
   
if (shellExecute(cmdToExecute, '') === 0) {
  var fs = require('fs');
  var xml = fs.readFileSync(pathToXML);
  parseString(xml, {explicitArray: false}, function (err, result) {
      console.debug(JSON.stringify(result));
  });
}

var pathToXML = 'D:\\SVN\\M3\\trunk\\06-Source\\models\\CI\\public\\Night\\1.11.0.11592\\Changes.xml';
var xml2js = require('models/CI/node_modules/xml2js');
var parseString = xml2js.parseString;
var fs = require('fs');
var xml = fs.readFileSync(pathToXML);
var parsed = {log: {logentry: []}};
parseString(xml, {explicitArray: false}, function (err, result) {
  parsed = result; 
  console.debug(JSON.stringify(result));
});
// {author: 'xmax', msg: '', files: [], subsystems: [] 
var preparedRes = [];
var subsystemRules = [
    {name: 'Tutorial ',        re: /\/guides\/(.*?)\//},
    {name: 'JSON Schema ',        re: /\/schemas\/(.*)\.json/},
    {name: 'Server plugin ',   re: /\/trunk\/06-Source\/Subsystems\/Servers\/Plugins\/(.*?)\//},
    {name: 'AdminUI ',         re: /\/trunk\/06-Source\/Subsystems\/Clients\/Web\/(.*?)\//},
    {name: 'Connectivity for ',re: /\/trunk\/06-Source\/Subsystems\/Clients\/(.*?)\//},
    {name: 'Tool ',            re: /\/trunk\/06-Source\/Subsystems\/Tools\/(.*?)\//},
    {name: 'Model ',           re: /\/trunk\/06-Source\/models\/(.*?)\//},
    {name: 'Library ',         re: /\/trunk\/06-Source\/Integration\/Libs\/(.*?)\//},
    {name: 'Module ',          re: /\/trunk\/06-Source\/modules\/(.*?)\//},
    {name: 'Autotest app ',    re: /\/trunk\/06-Source\/Autotest\/(.*?)/},
    {name:  'Server ',   re: /\/trunk\/06-Source\/Subsystems\/(.*?)\//}
];
//debugger
if (parsed && parsed.log && parsed.log.logentry){
  _.forEach(parsed.log.logentry, function(logEntry){
    var 
      res = {author: logEntry.author, msgs: [], files: [], subsystems: []}, 
      infos;
    if (logEntry.msg){
      infos = logEntry.msg.split('\r\n');
      if (infos.length){
        infos = _.chain(infos).filter(function(oneInfo){
            return /^\s*-/.test(oneInfo); // test comment started from "-"
        }).map(function(oneInfo){
            return /^\s*-(.*)/.exec(oneInfo)[1]; // remove "-" 
        }).value();   
      } 
      res.msgs = infos;
      var tmpSubsystems = [];   
      //debugger
      if (res.msgs.length && logEntry.paths){
        // XML parser create object in case only one entry, not array
        var paths = Array.isArray(logEntry.paths.path) ? logEntry.paths.path : [logEntry.paths.path]; 
        _.forEach(paths, function(path){
          var file = path['_'];
          _.forEach(subsystemRules, function(subsystemRule){
            var reResult = subsystemRule.re.exec(file);
            if (reResult){
                added = true;
                tmpSubsystems.push(subsystemRule.name + reResult[1]);
                res.files.push(file);
                return false; //breake iteration
            }
          });
        });
      }
      res.subsystems = _.uniq(tmpSubsystems);    
    }
    if (res.msgs.length){
        preparedRes.push(res);
    }     
  });
}
   
console.log(JSON.stringify(preparedRes));   

UB.Repository(undefined).attrs("ID").select()


var l = new TubList();
l.asJSON = JSON.stringify({ ID: 4000000176404,   Delivered: true,   mi_modifyDate: '2016-03-01T13:58:54Z' })
l.mi_modifyDate = new Date('2016-03-01T13:58:54Z')
l.count
typeof l.mi_modifyDate

sleep(10000)
console.log('Sellp is end')
var l = new TubList()
l = null;
gc()

function a(){
  b()
}
function b(){ 
 console.trace();
}
a()

console.error('add %s sds %d', 'asa', 12.3)



Math.pow(99,999)==1

var wsNotifier = UB.getWSNotifier();
wsNotifier.broadcast('ubs_message', {action: 'insert', ID: 1});


var s = new TubDataStore('uba_user');
s.runSQL('SELECT msg_rc.userID   FROM ubs_message_recipient msg_rc    INNER JOIN ubs_message msg ON msg.ID = msg_rc.messageID   WHERE msg_rc.acceptDate IS NULL   AND msg.complete = 1  AND msg.startDate >= :a:   AND msg.expireDate <= :b:   GROUP BY msg_rc.userID', {a: new Date(), b: new Date()});


UB.Repository('uba_user1').attrs(['ID', 'name'])
 // who are not disabled
 .where('[disabled]', '=', 0)
 .select()




UB.Repository('uba_user').attrs(['ID', 'name'])
   // who are not disabled
   .where('disabled', '=', 0)
   // which allowed access from Kiev
   .where('trustedIP', 'in',
     UB.Repository('geo_ip').attrs('IPAddr')
       .where('city', '=', 'Kiev')
   ).select()
   
   
   
for(var i=0; i< 20000; i++){
    var docReq = new TubDocumentRequest(); // starting from UB 1.11 handler is a singleton inside request
    docReq.entity = 'tst_document';
    docReq.attribute = 'fileStoreSimple';
    docReq.id = 3000000003736;
    docHandler = docReq.createHandlerObject(true);
    docHandler.loadContent(TubLoadContentBody.Yes);
//    var content = docReq.getBodyAsBase64String();
//    console.log(content.length);
    docHandler.freeNative();
    docReq.freeNative();
}
gc();    
               
conn.get('testDocHandler')                   


console.log(App.getUISettings())


require('cmd/prepareGZIP');


' asdasd '.trim() 

parseFloat('123123sd')

var argv = require('@unitybase/base').argv;
console.log(argv.findCmdLineSwitch('deleteOriginals'))

//============== PostgreSQL
conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'dba'}, data: 'DROP SCHEMA IF EXISTS ub_autotest CASCADE; DROP USER IF EXISTS ub_autotest;'});
conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'dba'}, data: "CREATE ROLE ub_autotest LOGIN PASSWORD 'ub_autotest' VALID UNTIL 'infinity'; CREATE SCHEMA ub_autotest AUTHORIZATION ub_autotest;"});
//"CREATE SEQUENCE SEQ_UBMAIN     INCREMENT 1 MAXVALUE   %CLIENT_NUM%4999999999 START   %CLIENT_NUM%0000000000 CYCLE; CREATE SEQUENCE SEQ_UBMAIN_BY1 INCREMENT 1 MAXVALUE %CLIENT_NUM%999999999999 START %CLIENT_NUM%500000000000 CYCLE;"
conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'main'}, data: "CREATE SEQUENCE SEQ_UBMAIN     INCREMENT 1 MAXVALUE   34999999999 START   30000000000 CYCLE; CREATE SEQUENCE SEQ_UBMAIN_BY1 INCREMENT 1 MAXVALUE 3999999999999 START 3500000000000 CYCLE;"});

var fs = require('fs');
var argv = require('@unitybase/base').argv;
var config = argv.getServerConfiguration();
var UBModel = _.find(config.application.domain.models, {name: 'UB'});
var path = require('path');
var createObjectSQL = fs.readFileSync(path.join(UBModel.path, '_initialData', 'PostgreSQL', 'create_objects.sql'));
conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'main'}, data: createObjectSQL});   
var initialData = fs.readFileSync(path.join(UBModel.path, '_initialData', 'PostgreSQL', 'initial_data.sql'));
conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'main'}, data: initialData}); 

//============== Oracle
var oraConns = conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'dba'}, data: "SELECT sid, serial# AS sn FROM v$session WHERE username = UPPER('ub_autotest');"});
var i, l;
for (i=0, l = oraConns.length; i < l; i++){
  conn.xhr({
    endpoint: 'runSQL', 
    URLParams: {CONNECTION: 'dba'}, 
    data: "alter system kill session '" + oraConns[i].SID + ", " + oraConns[i].SN + "'"
  });
}
conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'dba'}, data: "DROP USER ub_autotest CASCADE;"});
conn.xhr({
  endpoint: 'runSQL', 
  URLParams: {CONNECTION: 'dba'}, 
  data: UB.format("CREATE USER {0} IDENTIFIED BY {1} DEFAULT TABLESPACE USERS TEMPORARY TABLESPACE TEMP PROFILE DEFAULT ACCOUNT UNLOCK;",
            'ub_autotest', 'ub_autotest')     
});
var grants = [
    "GRANT CONNECT TO {0}",
    "GRANT RESOURCE TO {0}",
    "ALTER USER {0} DEFAULT ROLE ALL",
    "GRANT ALTER ANY INDEX TO {0}",
    "GRANT ALTER ANY PROCEDURE TO {0}",
    "GRANT ALTER ANY SEQUENCE TO {0}",
    "GRANT ALTER ANY TABLE TO {0}",
    "GRANT ALTER ANY TRIGGER TO {0}",
    "GRANT CREATE ANY INDEX TO {0}",
    "GRANT CREATE ANY PROCEDURE TO {0}",
    "GRANT CREATE ANY SEQUENCE TO {0}",
    "GRANT CREATE ANY SYNONYM TO {0}",
    "GRANT CREATE ANY TABLE TO {0}",
    "GRANT CREATE ANY TRIGGER TO {0}",
    "GRANT CREATE DATABASE LINK TO {0}",
    "GRANT CREATE PROCEDURE TO {0}",
    "GRANT CREATE PUBLIC SYNONYM TO {0}",
    "GRANT CREATE SESSION TO {0}",
    "GRANT CREATE SYNONYM TO {0}",
    "GRANT CREATE TABLE TO {0}",
    "GRANT CREATE TRIGGER TO {0}",
    "GRANT CREATE VIEW TO {0}",
    "GRANT DEBUG ANY PROCEDURE TO {0}",
    "GRANT DEBUG CONNECT SESSION TO {0}",
    "GRANT QUERY REWRITE TO {0}",
    "GRANT SELECT ANY SEQUENCE TO {0}",
    "GRANT UNLIMITED TABLESPACE TO {0}"
]
for (i=0, l=grants.length; i<l; i++){
  conn.xhr({
    endpoint: 'runSQL', 
    URLParams: {CONNECTION: 'dba'}, 
    data: UB.format(grants[i], 'ub_autotest')
  });
}

conn.xhr({
    endpoint: 'runSQL', 
    URLParams: {CONNECTION: 'main'}, 
    data: UB.format("CREATE SEQUENCE SEQ_UBMAIN     START WITH {0}0000000000 MAXVALUE {0}4999999999 MINVALUE {0}0000000000 NOCYCLE CACHE 10 ORDER", 3)
});

conn.xhr({
    endpoint: 'runSQL', 
    URLParams: {CONNECTION: 'main'}, 
    data: UB.format("CREATE SEQUENCE SEQ_UBMAIN_BY1 START WITH {0}500000000000 MAXVALUE {0}999999999999 MINVALUE {0}500000000000 NOCYCLE ORDER", 3)
});


var userExist = conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: '__dba'}, data: "SELECT COUNT (1) as CNT FROM dba_users WHERE username = 'UB_AUTOTEST'"});

var fs = require('fs');
var argv = require('@unitybase/base').argv;
var config = argv.getServerConfiguration();
var UBModel = _.find(config.application.domain.models, {name: 'UB'});
var path = require('path');
var createObjectSQL = fs.readFileSync(path.join(UBModel.path, '_initialData', 'Oracle', 'create_objects.sql'));
var statements = createObjectSQL.split('/\r\n--'); 
statements.forEach(function(statement){
  if (statement) 
    conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'main'}, data: statement})
});
   
var initialData = fs.readFileSync(path.join(UBModel.path, '_initialData', 'Oracle', 'initial_data.sql'));
var statements = initialData.split('/\r\n--'); 
statements.forEach(function(statement){
  if (statement) 
    conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'main'}, data: statement})
}); 


var initSecurity = [
  "insert into uba_subject (ID,name,sType,mi_unityentity) values(0,	'Everyone',		'R', 'UBA_SUBJECT')",
  "insert into uba_role (ID,name,description,sessionTimeout,allowedAppMethods) values(0,'Everyone','Pseudo role. To use only in ELS rules',10000,'ubql,getDomainInfo,logout,getDocument,setDocument')",
  /* admins role */
  "insert into uba_subject (ID,name,sType,mi_unityentity) values(1,	'admins',		'R', 'UBA_SUBJECT')",
  "insert into uba_role (ID,name,description,sessionTimeout,allowedAppMethods) values(1,'admins','UB application administrator',10,'*')",
  /* user admin */
  "insert into uba_subject (ID,name,sType,mi_unityentity) values(10	,'admin',		'U', 'UBA_USER')",
  "insert into uba_user (id, name, description, upasswordhashhexa, disabled, udata) values (10, 'admin', 'admin', '2bb7998496899acdd8137fad3a44faf96a84a03d7f230ce42e97cd17c7ae429e', 0, '')",
  /* allow all for admins role (with ID = 1) */
  "INSERT INTO uba_els (ID,	code,	description,	disabled,	entityMask,	methodMask,	ruleType,	ruleRole) VALUES (200, 'UBA_ADMIN_ALL', 'Admins - enable all',	0,	'*',	'*',	'A',	1)",
  /* assign user admin to role admins */
  "insert into uba_userrole (ID,userID, roleID) values(800,10,1);"
];

initSecurity.forEach(stmt => conn.xhr({
    endpoint: 'runSQL', 
    URLParams: {CONNECTION: 'main'}, 
    data: stmt
  })
);


var initDB = require('cmd/initDB');
var options = {
    "host": "http://localhost:888",
    "user": "admin",
    "pwd": "admin",
    "cfg": "ubConfigMSSQL.json",
    "clientIdentifier": 3,
    "dropDatabase": true,
    "createDatabase": true,
    "dba": "sa",
    "dbaPwd": "sa"
}
initDB(options);

conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: '__dba'}, data: "alter database ub_autotest set SINGLE_USER with rollback immediate"})
conn.xhr({endpoint: 'runSQL', URLParams: {CONNECTION: 'ftsDefault'}, data: "PRAGMA table_info(fts_ftsDefault_uk)"})




var options = {
    "u": "admin",
    "p": "admin",
    "cfg": "ubConfigOracle.json"
}
var testELS = require('D:\\projects\\UnityBase\\models\\UBA\\_autotest\\010_testELS.js');
testELS(options);
 
var tests = require('cmd/autotest');
tests(options);



user = UB.Repository('uba_user').attrs(['name', 'uData', 'mi_modifyDate']).where('ID', '=', 10).select();

UB.Repository('ubs_settings').attrs(['*']).select();

console.log(user.entity.connectionConfig)

var _e = App.domain.byName('fts_tst_ftsentity_uk');
debugger

var Mustache = require('mustache')
function testMustache(template, data, partial, iterCount){ var result = ""; for(var i=0; i<iterCount; i++){     result = Mustache.render(template, data, partial)  } return result; }1;
var tpl = '<h1>{{a}}</h1>'; 
testMustache('<h1>{{a}}</h1>', {a: 1}, '', 10)


var hogan = require('D:/projects/Autotest/node_modules/hogan.js/web/builds/3.0.2/hogan-3.0.2.js');
var c = hogan.compile(tpl)
c.render({a: 1})



var a = null
console.log(a == null);
a = undefined;
console.log(a==null);
a=false;
console.log(a==null);


var cron = require('node-cron');
var CronJob = require('node-cron').CronJob;
var job = new CronJob('* * * * * *', function() {
    console.log('CRON JOB RUN');
  }, function () {
    console.log('CRON JOB STOP');
  },
  true, /* Start the job right now */
  ''
);

console.log(App.serverURL)

console.log(App.localIPs.indexOf('10.8.24.87\r\n'))
console.log('aa %j bb', {a: 12, b: {a: 11}});


App.globalCachePut('val', '1');
console.log(App.globalCacheGet('val'));


var attrs = JSON.parse(ubq_schedulers.entity.attributes.asJSON);
var def = _(attrs).toArray().filter('defaultValue').value()
 .reduce(function(result, attr){
   result[attr.name] = attr.defaultValue;
   return result;
 }, {});
 
console.log(def) 

UB.Repository('ubq_scheduler').attrs('*').select()

debugger


console.log(eval(App.serverConfig.application.fts && App.serverConfig.application.fts.enabled && App.serverConfig.application.fts.async))

var s = new TubDataStore('uba_user');
s.runSQL('PRAGMA table_info(uba_user)', {tableName: 'uba_user'});
console.log(s.asJSONObject)

s.runSQL('PRAGMA foreign_key_list(uba_user)', {tableName: 'uba_user'});
console.log(s.asJSONObject)

conn.post('generateDDL', {unsafe: true, resultAsObject: true, entities: ['tst_maind_dict'] });

conn.post('generateDDL', {unsafe: true, resultAsObject: true, entities: ['cdn_building'] });

var s = new TubDataStore('uba_user');
s.runSQL('select * from uba_user where id IN (?)', {user: [10,20]});


var assert = require('assert');
assert.equal(1, 16, 'must ne 16');


var http = require('http');
http.setGlobalConnectionDefaults({receiveTimeout: 300000});

conn.run({
        entity: 'tst_maindata',
		method: 'select',
        fieldList: ['ID', 'manyValue'],
		whereList: {
			w1: {
				expression: '[manyValue]',
				condition: 'in',
				values: {v1: [6]}
			}
		}
    });

UB.Repository('tst_maindata').attrs(['ID', 'dateTimeValue', 'mi_deleteDate']).misc({__allowSelectSafeDeleted: true}).select()

UB.Repository('tst_maindata').attrs(['ID', 'dateTimeValue', 'mi_deleteDate'])
  .where('code', '=', '111')
  .misc({__allowSelectSafeDeleted: true}).select()

UB.Repository('tst_maindata').attrs('*').where('dateTimeValue', '=', '#maxdate').select()

UB.Repository('tst_maindata').attrs(['ID', 'dateTimeValue', 'mi_deleteDate']).where('mi_deleteDate', '=', '#maxdate').select()

conn.run({
        entity: 'tst_maindata',
		method: 'insert',
        execParams: {
         ID: 58090835977785, 
         code:"222",
         caption: "Заголовок 100",
         nonNullDict_ID:1,
         nullDict_ID:null,
         enumValue:"TST1",
         booleanValue:0,
         manyValue:"1,2",
         dateTimeValue:'#maxdate'
       }
    });
    
UB.Repository('ubm_desktop').attrs(['ID', 'mi_deleteDate'])
  .where('mi_deleteDate', '=', '#maxdate')
  .misc({__allowSelectSafeDeleted: true}).select()
      
UB.Repository('ubm_desktop').attrs(['ID', 'mi_deleteDate']).where('mi_deleteDate', '=', '#maxdate').select()

UB.Repository('tst_clob', {}, conn).attrs(['code', 'mi_tr_text100', 'mi_tr_text2']).orderBy('code').selectAsObject();

    var s200 = '1234567890'.repeat(2000), insertedIDs = [];

    var values2insert = [{
            code: '1truncate', text100: s200, text2: s200
        }, {
            code: '2strip', text100: '<i>' + s200 + '<i>', text2: '<b><i>' + s200 + '</b></i>'
        }, {
            code: '3empty', text100: null, text2: '<b><i></b></i>'
        }, {
            code: '4strip', text100: '<a>a&gt;b&lt;&nbsp;c &amp;Y&quot;</a>', text2: '<a>a&gt;b</a>'
        }],
        mustBe = [{
            code: '1truncate', mi_tr_text100: s200.substr(0, 100), mi_tr_text2: s200.substr(0, 2)
        }, {
            code: '2strip', mi_tr_text100: s200.substr(0, 100), mi_tr_text2: s200.substr(0, 2)
        },  {
            code: '3empty', mi_tr_text100: null, mi_tr_text2: null
        }, {
            code: '4strip', mi_tr_text100: 'a>b< c &Y"', mi_tr_text2: 'a>'
        }];



    var
        dayDate = new Date(),
        row2Insert, inserted;

    dayDate.setMilliseconds(0);
    row2Insert = {
        code: '2014-01-01',
        docDate: dayDate,
        docDateTime: dayDate
    };

    inserted = conn.insert({
        entity: 'tst_document',
        fieldList: ['code', 'docDate', 'docDateTime'],
        execParams: row2Insert
    });
    assert.equal(row2Insert.code, inserted[0], 'tile-like value must not be converted to time');
    assert.equal(row2Insert.docDate.getTime(), Date.parse(inserted[1]), 'date field w/o time');
    inserted[2]

UB.Repository('tst_document').attrs('*').where('code', '=', '2014-01-01').select()


    res2 = UB.Repository('tst_document').attrs("ID")
        .where('', 'match', 'Україна')
        .where('docDate', '<', new Date(2015, 2, 13))
        .selectAsArray();
        
        
UB.Repository('udisk_card').attrs("*").select()


var formatSql = require('./format-sql');
var sql = "SELECT employeeId, givenName, familialName FROM dbo.Employee WHERE familialName LIKE '%son%' ORDER BY familialName asc, givenName asc"; 
var formatted = formatSql.formatQuery(sql);
console.log('sql', sql, 'formatted', formatted);



var s = new TubDataStore('fts_tst_ftsentity_uk');
//s.runSQL('PRAGMA foreign_keys', {tableName: 'uba_user'});
//var SQL = "SELECT A.ID,A.entity,A.ftsentity,A.dy,A.dm,A.dd,A.datacode,A.aclrls,A.entitydescr,A.databody,"+
//  "(snippet(ftsDefault_uk, '<b>', '</b>', '<b>...</b>', 9)) AS snippet "+
//  ",rank(matchinfo(ftsDefault_uk),1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0) AS rank " +  
//  "FROM ftsDefault_uk A limit 2";
  
var SQL = "SELECT ID, databody,"+
  "(snippet(ftsDefault_uk, '<b>', '</b>', '<b>...</b>', 9)) AS snippet "+
  ",rank(matchinfo(ftsDefault_uk),1,1,1,1,1,1,1,1,1,1,1,1) AS rank " + //  
  "FROM ftsDefault_uk A where databody match 'Україна' limit 2";
  
s.runSQL(SQL, {tableName: 'uba_user'});
console.log(s.asJSONObject)



UB.Repository('fts_ftsDefault_uk').attrs('*').select()

UB.Repository('tst_maindata').attrs('*').select()

UB.Repository('tst_maindata').attrs('*').using('adminSelect').select()

while (true){
 sleep(1);
}


throw new Error('Ху'); 