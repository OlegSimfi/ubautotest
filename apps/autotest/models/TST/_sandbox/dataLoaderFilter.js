/**
 * Created by pavel.mash on 10.05.2017.
 */

const {dataLoader, csv, argv} = require('@unitybase/base')
const path = require('path')
const fs = require('fs')

let session = argv.establishConnectionFromCmdLineAttributes()
conn = session.connection

let fn = path.join(__dirname, 'tst_dictionary-TST.csv')
let fContent = fs.readFileSync(fn)
if (!fContent) { throw new Error(`File ${fn} is empty or not exist`) }
fContent = fContent.trim()
let csvData = csv.parse(fContent)

csvData.splice(0, 1) // remove first row

// for each row try to lookup value with specified code in database. If found - skip row
let notExisted = csvData.filter(
  (row) => !conn.lookup('tst_dictionary', 'ID',
      conn.Repository('tst_dictionary').where('code', '=', row[1]).ubql().whereList
    )
)

// load only non-existed rows
dataLoader.loadArrayData(conn, notExisted, 'tst_dictionary',
  'ID;code;caption;filterValue;booleanColumn;currencyValue;floatValue'.split(';')
)
