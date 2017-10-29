const assert = require('assert')

module.exports = function testBrokenCSV () {
  assert.throws(() => {
    throw 'THROW STRING'
  }, /THROW STRING/, 'throws a string instead of error dont raise AV')

/*  assert.throws(() => {
    throw 1
  }, /plain/, 'throws a Number dont raise AV and expose a stack')

*/
  assert.throws(() => {
    throw new Error('mamamia')
  }, /mamamia/, 'throws a Error dont raise AV and expose a stack')

  assert.throws(() => {
    throw new assert.AssertionError({message: 'yoYoYo', actual: 1, expected: 2})
  }, /yoYoYo/, 'throws a inherited Error dont raise AV and expose a stack')
}
