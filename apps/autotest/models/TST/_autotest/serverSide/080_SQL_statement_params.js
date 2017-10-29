const assert = require('assert')
const ok = assert.ok
const UBA = require('@unitybase/uba/modules/uba_common')
let res
    
function runTest() {
let prm = {
  name: 'admin'
}

let st = new TubDataStore('uba_user')
st.runSQL('select id from uba_user where name = :name:', {name: 'testelsuser'})
assert.equal(st.rowCount, 1, `single named param. Expect 1 row, got ${st.rowCount}`);


st.runSQL(`select id from uba_user where name = :("${UBA.USERS.ADMIN.NAME}"): and name = :('${UBA.USERS.ADMIN.NAME}'): and id = :(${UBA.USERS.ADMIN.ID}):`, {})
assert.equal(st.rowCount, 1, `Simple inlined params. Expect 1 row, got ${st.rowCount}`)

st.runSQL('select id from uba_user where name = :name: or name = :name2:', {name: 'testelsuser', name2: 'admin'})
assert.equal(st.rowCount, 2, `Two named parameters. Expect 2 row, got ${st.rowCount}`);

st.runSQL('select id from uba_user where name = :name: and :name: = \'testelsuser\'', {name: 'testelsuser'})
assert.equal(st.rowCount, 1, `Two same named parameters. Expect 1 row, got ${st.rowCount}`);

st.runSQL('select id from uba_user where name = :name: and :name: = :(\'testelsuser\'):', {name: 'testelsuser'})
assert.equal(st.rowCount, 1, `Mix named and inlined parameters. Expect 1 row, got ${st.rowCount}`);

st.runSQL('select id from uba_user where name = :name: and :name2: = :(\'testinline\'):', {name: 'testelsuser', name2: 'testinline'})
assert.equal(st.rowCount, 1, `Mix named and inlined parameters v2. Expect 1 row, got ${st.rowCount}`);

st.runSQL('select id from uba_user where name = ? and ? = :(\'testinline\'):', {name: 'testelsuser', name2: 'testinline'})
assert.equal(st.rowCount, 1, `Mix un-named and inlined parameters. Expect 1 row, got ${st.rowCount}`);

st.runSQL('select id from uba_user where name = ? and :name2: = :(\'testinline\'):', {name: 'testelsuser', name2: 'testinline'})
assert.equal(st.rowCount, 1, `Mix un-named named and inlined parameters. Expect 1 row, got ${st.rowCount}`);

st.runSQL('select id from uba_user where :name2: = :(\'testinline\'): and name = ?', {name: 'testelsuser', name2: 'testinline'})
assert.equal(st.rowCount, 1, `Mix un-named named and inlined parameters v2. Expect 1 row, got ${st.rowCount}`);


st.runSQL(`select id from uba_user where id in (select id from :(${JSON.stringify([UBA.USERS.ADMIN.ID, UBA.USERS.ANONYMOUS.ID])}):)`, {})
assert.equal(st.rowCount, 2, `Named array binding. Expect 2 row, got ${st.rowCount}`);


return
// below is fails
st.runSQL('select id from uba_user where :name2: = \'testinline\' and name = ?', {name2: 'testinline', name: 'testelsuser'})
assert.equal(st.rowCount, 1, `Mix un-named and named parameters - param order not the same. Expect 1 row, got ${st.rowCount}`);

st.runSQL('select id from uba_user where :name2: = :(\'testinline\'): and name = ?', {name2: 'testinline', name: 'testelsuser'})
assert.equal(st.rowCount, 1, `Mix un-named named and inlined parameters - param order not the same. Expect 1 row, got ${st.rowCount}`);

// this fail for SQLite3 (no array binding) - TB tested for other DB
st.runSQL('select id from uba_user where id in (:ids:)', {ids: [UBA.USERS.ADMIN.ID, UBA.USERS.ANONYMOUS.ID]})
assert.equal(st.rowCount, 2, `Named array binding. Expect 2 row, got ${st.rowCount}`);

st.runSQL(`select id from uba_user where id in :(${JSON.stringify([UBA.USERS.ADMIN.ID, UBA.USERS.ANONYMOUS.ID])}):`, {})
assert.equal(st.rowCount, 2, `Named array binding. Expect 2 row, got ${st.rowCount}`);

}

try {
  runTest()
} catch (e) {
  return {res: e.toString()}
}
  
return {res: true};