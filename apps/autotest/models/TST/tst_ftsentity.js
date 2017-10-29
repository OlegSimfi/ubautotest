'use strict'

var
  me = tst_ftsentity,
  _attrForFTS = ['caption', 'regDate']

me.entity.addMethod('getFTSData')

/**
 * Create and return string for fts index
 * @param {ubMethodParams} ctxt
 * @return {Boolean}
 */
me.getFTSData = function (ctxt) {
  var
        /** @type {TubDataStore} */
    iDoc,
    rp = ctxt.mParams,
    fldValue = '',
    res = '',
    attrList

  attrList = _.clone(_attrForFTS)

  iDoc = UB.Repository('tst_ftsentity').attrs(attrList)
        .where('[ID]', '=', rp.ID)
        .select()

  if (!iDoc.eof) {
    for (let i = 0, l = _attrForFTS.length; i < l; i++) {
      fldValue = iDoc.get(i)
      if (fldValue) {
        res += ' z' + _attrForFTS[i] + 'z:' + fldValue
      }
    }
    rp._ftsContent = res
    rp._ftsDescription = iDoc.get('caption')
    rp._ftsDate = iDoc.get('regDate')
  }

  return true
}
