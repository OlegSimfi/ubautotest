/**
 * User: pavel.mash
 * Date: 17.10.14
 * Test clobTruncate mixin
 */
var
    assert = require('assert'),
    fs = require('fs'),
    argv = require('@unitybase/base').argv,
    session, conn;

if (argv.findCmdLineSwitch('help') !== -1){
    console.info([
        'Test "Many" attribute. tst_maindata, tst_dictionary entities require',
        'Usage: ',
            '>UB ' + __fileName + ' ' + argv.establishConnectionFromCmdLineAttributesUsageInfo
    ].join('\r\n'));
    return;
}

session = argv.establishConnectionFromCmdLineAttributes();
conn = session.connection;

try {
    console.debug('testManyAttribute');
    testManyAttribute(conn);
} finally {
    session.logout();
}

/**
 *
 * @param {UBConnection} conn
 */
function testManyAttribute(conn){

    var selected = conn.run({
        entity: 'tst_maindata',
		method: 'select',
        fieldList: ['ID', 'manyValue']
    });
    assert.equal(selected.resultData.rowCount, 16, 'Total row count in "tst_maindata" must be 16');

    //console.debug('Проверка корректности агрегированного значения атрибута "manyValue"');
    var selected = conn.run({
        entity: 'tst_maindata',
		method: 'select',
        fieldList: ['ID', 'manyValue'],
		whereList: {
			w1: {
				expression: '[code]',
				condition: '=',
				values: {v1: 'Код1'}
			}
		}
    });
	assert.equal(selected.resultData.data[0][1], '1,2', 'For row woth code="Код1" many must contein 2 value: 1 и 2');

    //console.debug('Проверка корректности фильтрации по атрибуту "manyValue" условием "IN". Важно одновременно этот же атрибут иметь в fieldList');
    var selected = conn.run({
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
    assert.equal(selected.resultData.rowCount, 3, '"manyValue IN (6)" condition must rerurn 3 row');

    //console.debug('Проверка корректности фильтрации по атрибуту "manyValue" условием "NOT IN". Важно одновременно этот же атрибут иметь в fieldList');
    var selected = conn.run({
        entity: 'tst_maindata',
		method: 'select',
        fieldList: ['ID', 'manyValue'],
		whereList: {
			w1: {
				expression: '[manyValue]',
				condition: 'notIn',
				values: {v1: [6]}
			}
		}
    });
	//Должно быть 14 записей
    assert.equal(selected.resultData.rowCount, 13, '"manyValue NOT IN (6)" condition must rerurn 13 row');

	//console.debug('Проверка корректности фильтрации по атрибуту "manyValue" условием "IS NULL". Важно одновременно этот же атрибут иметь в fieldList');
    var selected = conn.run({
        entity: 'tst_maindata',
		method: 'select',
        fieldList: ['ID', 'manyValue'],
		whereList: {
			w1: {
				expression: '[manyValue]',
				condition: 'isNull'
			}
		}
    });
    assert.equal(selected.resultData.rowCount, 0, '"manyValue IS NULL" condition with manyValue in fieldList must return 0 row');

	//console.debug('Проверка корректности фильтрации по атрибуту "manyValue" условием "IS NOT NULL". Важно одновременно этот же атрибут иметь в fieldList');
    var selected = conn.run({
        entity: 'tst_maindata',
		method: 'select',
        fieldList: ['ID', 'manyValue'],
		whereList: {
			w1: {
				expression: '[manyValue]',
				condition: 'isNotNull'
			}
		}
    });
    assert.equal(selected.resultData.rowCount, 16, '"manyValue IS NOT NULL" condition with manyValue in fieldList must return 16 row');
}
