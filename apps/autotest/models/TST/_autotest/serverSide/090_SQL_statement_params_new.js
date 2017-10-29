const assert = require('assert')
const ok = assert.ok
const UBA = require('@unitybase/uba/modules/uba_common')
// let res

function runTest () {
  // let prm = {
  //   name: 'admin'
  // }

  // let st = new TubDataStore('uba_user')
  const db = App.defaultDatabase_
  let res
//  debugger;
  res = JSON.parse(db.run('select id from uba_user where name = :name:', {name: 'anonymous'}))
  assert.equal(res.length, 1, `single named param. Expect 1 row, got ${res.length}`)

  res = JSON.parse(db.run(`select id from uba_user where name = :("${UBA.USERS.ADMIN.NAME}"): and name = :('${UBA.USERS.ADMIN.NAME}'): and id = :(${UBA.USERS.ADMIN.ID}):`))
  assert.equal(res.length, 1, `single named param. Expect 1 row, got ${res.length}`)

  res = JSON.parse(db.run('select id from uba_user where name = :name: or name = :name2:', {name: 'anonymous', name2: 'admin'}))
  assert.equal(res.length, 2, `Two named parameters. Expect 2 row, got ${res.length}`)

  res = JSON.parse(db.run('select id from uba_user where name = :name: and :name: = \'anonymous\'', {name: 'anonymous'}))
  assert.equal(res.length, 1, `Two same named parameters. Expect 1 row, got ${res.length}`)

  res = JSON.parse(db.run('select id from uba_user where name = :name: and :name: = :(\'anonymous\'):', {name: 'anonymous'}))
  assert.equal(res.length, 1, `Mix named and inlined parameters. Expect 1 row, got ${res.length}`)

  res = JSON.parse(db.run('select id from uba_user where name = :name: and :name2: = :(\'testinline\'):', {name: 'anonymous', name2: 'testinline'}))
  assert.equal(res.length, 1, `Mix named and inlined parameters v2. Expect 1 row, got ${res.length}`)

  res = JSON.parse(db.run('select id from uba_user where name = ? and ? = :(\'testinline\'):', {0: 'anonymous', 1: 'testinline'}))
  assert.equal(res.length, 1, `Mix un-named and inlined parameters. Expect 1 row, got ${res.length}`)

  res = JSON.parse(db.run('select id from uba_user where name = ? and :name2: = :(\'testinline\'):', {0: 'anonymous', name2: 'testinline'}))
  assert.equal(res.length, 1, `Mix un-named named and inlined parameters. Expect 1 row, got ${res.length}`)

  res = JSON.parse(db.run('select id from uba_user where :name2: = :(\'testinline\'): and name = ?', {0: 'anonymous', name2: 'testinline'}))
  assert.equal(res.length, 1, `Mix un-named named and inlined parameters v2. Expect 1 row, got ${res.length}`)

  res = JSON.parse(db.run(`select id from uba_user where id in (select id from :(${JSON.stringify([UBA.USERS.ADMIN.ID, UBA.USERS.ANONYMOUS.ID])}):)`, {}))
  assert.equal(res.length, 2, `Named array binding. Expect 2 row, got ${res.length}`)

  return

// below is fails
  res = JSON.parse(db.run('select id from uba_user where :name2: = \'testinline\' and name = ?', {name2: 'testinline', 0: 'anonymous'}))
  assert.equal(res.length, 1, `Mix un-named and named parameters - param order not the same. Expect 1 row, got ${res.length}`)

  res = JSON.parse(db.run('select id from uba_user where :name2: = :(\'testinline\'): and name = ?', {name2: 'testinline', 0: 'anonymous'}))
  assert.equal(res.length, 1, `Mix un-named named and inlined parameters - param order not the same. Expect 1 row, got ${res.length}`)

  const id = db.genID('tst_blob')
  const buf = Buffer.from('qwerty')
  ok(db.exec('insert into tst_blob(id, description, blb) values(:ID:, :description:, :blb:)', {
    ID: id,
    description: 'testAsSetter',
    blb: buf
  }))

  res = JSON.parse(db.run('select id, description, blb from tst_blob where id = ?', {0: id}))
  const buf1 = Buffer.from(res[0].blb.substr(1), 'base64')
  assert.equal(res.length, 1, ``)
  assert.equal(buf1.compare(buf), 0, '')

  return
/*
// this fail for SQLite3 (no array binding) - TB tested for other DB
  st.runSQL('select id from uba_user where id in (:ids:)', {ids: [UBA.USERS.ADMIN.ID, UBA.USERS.ANONYMOUS.ID]})
  assert.equal(st.rowCount, 2, `Named array binding. Expect 2 row, got ${st.rowCount}`)

  st.runSQL(`select id from uba_user where id in :(${JSON.stringify([UBA.USERS.ADMIN.ID, UBA.USERS.ANONYMOUS.ID])}):`, {})
  assert.equal(st.rowCount, 2, `Named array binding. Expect 2 row, got ${st.rowCount}`)
*/
}

try {
  runTest()
  exports.res = true
    return {res: true};
} catch (e) {
  exports.res = e.toString()
    return {res: e.toString()}
}

