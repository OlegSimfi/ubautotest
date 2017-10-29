/**
 * Fill TST model enums
 * Used by cmd\initialize command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function (session) {
  'use strict'
  var
    csvLoader = require('@unitybase/base').dataLoader,
    conn = session.connection

  console.info('\tFill enumeration for TST model')
  csvLoader.loadSimpleCSVData(conn, __dirname + '/ubm_enum-TST.csv', 'ubm_enum', 'eGroup;code;name;sortOrder'.split(';'), [0, 1, 2, 3], 1)

  console.info('\tFill TST model dictionary')
  csvLoader.loadSimpleCSVData(conn, __dirname + '/tst_dictionary-TST.csv', 'tst_dictionary', 'ID;code;caption;filterValue;booleanColumn;currencyValue;floatValue'.split(';'), [0, 1, 2, 3, 4, 5, 6], 1)

  console.info('\tFill TST model OData dictionary')
  csvLoader.loadSimpleCSVData(conn, __dirname + '/tst_dictionary-TST.csv', 'tst_ODataSimple', 'ID;code;caption;filterValue;booleanColumn'.split(';'), [0, 1, 2, 3, 4], 1)

  console.info('\tFill TST main data')
  csvLoader.loadSimpleCSVData(conn, __dirname + '/tst_maindata-TST.csv', 'tst_maindata', 'code;caption;nonNullDict_ID;nullDict_ID;enumValue;booleanValue;manyValue;dateTimeValue'.split(';'), [0, 1, 2, 3, 4, 5, 6, 7], 1)
}
