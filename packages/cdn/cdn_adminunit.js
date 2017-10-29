/**
 * Created by igor.borisov on 25.10.13.
 * Changed by xmax 22.09.2017
 */
/* global cdn_adminunit */

const me = cdn_adminunit

me.on('insert:before', beforeInsert)

function beforeInsert (ctxt) {
  updateCaption(ctxt, 'INS')
}

me.on('update:before', beforeUpdate)

function beforeUpdate (ctxt) {
  updateCaption(ctxt, 'UPD')
}

me.on('update:after', afterUpdate)

function afterUpdate (ctxt) {
  var execParams = ctxt.mParams.execParams
  if (!ctxt.externalCall && ctxt.mParams.cascadeUpdate) {
    return true
  }

  var name = execParams.name
  var parentAdminUnitID = execParams.parentAdminUnitID
  console.debug('name:', name)
  console.debug('parentAdminUnitID:', parentAdminUnitID)

  if (name || parentAdminUnitID) {
    updateChildCascade(execParams.ID, execParams.caption)
  }
}

function updateChildCascade (id, caption) {
  const child = getChildInfo(id)
  const adminUnitStore = new TubDataStore('cdn_adminunit')
  child.forEach(function (child) {
    const newCaption = makeCaption(child.name, caption)
    adminUnitStore.run('update', {
      execParams: {
        ID: child.ID,
        caption: newCaption
      },
      cascadeUpdate: true,
      __skipOptimisticLock: true
    })
    updateChildCascade(child.ID, newCaption)
  })
}

function updateCaption (ctxt, mode) {
  var execParams = ctxt.mParams.execParams
  if (!ctxt.externalCall && ctxt.mParams.cascadeUpdate) {
    return true
  }
  var dataStore = ctxt.dataStore

  var name = execParams.name
  var parentAdminUnitID = execParams.parentAdminUnitID
  console.debug('name:', name)
  console.debug('parentAdminUnitID:', parentAdminUnitID)

  if (name || parentAdminUnitID) {
    if (mode !== 'INS') {
      if (!name) {
        name = dataStore.get('name')
      }
      if (!parentAdminUnitID) {
        parentAdminUnitID = dataStore.get('parentAdminUnitID')
      }
    }

    if (parentAdminUnitID) {
      var info = getInfo(parentAdminUnitID)
      execParams.caption = makeCaption(name, info ? info.caption || info.name : null)
    } else {
      execParams.caption = name
    }
  }
}

function makeCaption (name, parentCaption) {
  let caption = name + ', ' + (parentCaption || '?')
  if (caption.length >= 1024) return caption.cubstr(0, 1024)
  return caption
}

/**
 *
 * @param {number} id
 * @return {cdn_adminunit_object}
 */
function getInfo (id) {
  if (!id) {
    throw new Error('<<<cdn_adminunit.getInfo - admin unit ID not set>>>')
  }
    /**
     * @type cdn_adminunit_object
     */
  var info = UB.Repository('cdn_adminunit').attrs(['ID', 'name', 'caption']).where('[ID]', '=', id).selectAsObject()[0]
  return info
}

function getChildInfo (id) {
  if (!id) {
    throw new Error('<<<cdn_adminunit.getChild - admin unit ID not set>>>')
  }
  return UB.Repository('cdn_adminunit').attrs(['ID', 'name', 'parentAdminUnitID']).where('[parentAdminUnitID]', '=', id).selectAsObject()
}
