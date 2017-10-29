/**
 * User: pavel.mash
 * Date: 29.10.14
 * Common dictionary test.
 */
var
    assert = require('assert'),
    ok = assert.ok,
    fs = require('fs'),
    argv = require('@unitybase/base').argv,
    session, conn;

session = argv.establishConnectionFromCmdLineAttributes();
conn = session.connection;

try {
    var config;
    console.debug('Start CDN subsystem test');
    testCDN();
} finally {
    session.logout();
}

function testCDN(){
    "use strict";

    var simpsonID = conn.insert({
        entity: 'cdn_person',
        fieldList: ['ID'],
        execParams: {
            lastName: 'Simpson',
            firstName: 'Homer',
            fullFIO: 'Simpson Homer',
            shortFIO: 'Simpson H.',
            birthDate: new Date('1955-05-12')
        }
    });
    ok(simpsonID, 'can`t insert person Simpson');
    var phoneTypeID = conn.lookup('cdn_contacttype', 'ID', {expression: 'code', condition: 'equal', values: {code: 'phone'}});
    ok(phoneTypeID, 'cdn_contacttype with code `phone` must exists');
    var num = '555-3223';
    var simpsonPhoneID = conn.insert({
        entity: 'cdn_contact',
        fieldList: ['ID'],
        execParams: {
            contactTypeID: phoneTypeID,
            value: num,
            subjectID: simpsonID
        }
    });
    ok(simpsonPhoneID, 'can`t insert Simpson phone number');
    var resp = conn.post('evaluateScript', 'return cdn_contact.getSubjectsContacts(' + simpsonID + ', "phone", "ClientTestScript");');
    ok(Array.isArray(resp), 'Await array of contacts but got type ' + typeof resp);
    ok(resp[0] = num, 'wrong Simpson phone');
    resp = conn.post('evaluateScript', 'return cdn_contact.getSubjectsContacts(' + 1 + ', "phone", "ClientTestScript");');
    ok(Array.isArray(resp), 'Await array of contacts but got type ' + typeof resp);
    ok(resp.length===0, 'no contacts for unknown subject');

    // test contact type cache
    resp = conn.post('evaluateScript', 'return cdn_contact.getSubjectsContacts(' + simpsonID + ', "phone1", "ClientTestScript");');
    ok(resp.length===0, 'no contacts for unknown type');

    var testTypeID = conn.insert({
        entity: 'cdn_contacttype',
        fieldList: ['ID'],
        execParams: {
            code: 'phone1',
            name: 'test phone1'
        }
    });
    resp = conn.post('evaluateScript', 'return cdn_contacttype.getContactTypeByCode("phone1");');
    ok(resp, 'contact type cache cleared after insert');
    conn.run({
        entity: 'cdn_contacttype',
        method: 'delete',
        execParams: { ID: testTypeID }
    });
    resp = conn.post('evaluateScript', 'return cdn_contacttype.getContactTypeByCode("phone1");');
    ok(resp===0, 'contact type cache must be cleared after delete but got ' + resp);
}

