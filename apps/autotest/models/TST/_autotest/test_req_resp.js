/**
 * User: pavel.mash
 * Date: 17.10.14
 * Test HTTP communication layer
 */
var
    assert = require('assert'),
    ok = assert.ok,
    fs = require('fs'),
    argv = require('@unitybase/base').argv,
    session, conn, domain;

if (argv.findCmdLineSwitch('help') !== -1){
    console.info([
        'This test connect to UB server and send data to echo method defined in appLevelMethod.js ',
        'Usage: ',
            '>UB -f cmd/test_req_resp ' + argv.establishConnectionFromCmdLineAttributesUsageInfo
    ].join('\r\n'));
    return;
}

session = argv.establishConnectionFromCmdLineAttributes();
conn = session.connection;

try {
    var config;

    domain = conn.getDomainInfo();

    testHTTP(conn, domain);
} finally {
    session.logout();
}

/**
 *
 * @param {UBConnection} conn
 * @param {UBDomain} domain
 */
function testHTTP(conn, domain){
    "use strict";
    var
        http = require('http');

    var req = http.request({
        URL: session.HOST + '/echoToFile',
        method: 'POST'
    });
    var 
        data = 'Строка по русски',
        resp = req.end(data);

    assert.equal(resp.statusCode, 200, 'echo text string - response status is 200');
    assert.equal(resp.read(), data, 'got the same text as send');
    
    data = new Uint8Array(255);
    for(var n=0; n<255; n++){
      data[n] = n;
    }
    resp = req.end(data);
    assert.equal(resp.statusCode, 200, 'echo binary - response status is 200');
    assert.deepEqual(resp.read('bin'), data.buffer, 'got the same text as send');  
}


