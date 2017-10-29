/**
 * Created by pavel.mash on 25.05.2015.
 */

/**
 * Check Session.uData persistence. Here we fill Session.uData and check it in tst_service.uDataTest
 */
function testOnUserLogin () {
  _.defaults(Session.uData, {
    tstNumArray: [1, 2, 3],
    tstStrArray: ['1', '2', '3'],
    tstNested: {a: 1, b: '2'}
  })
}

Session.on('login', testOnUserLogin)

App.on('domainIsLoaded', function () {
  console.debug('domainIsLoaded fired')
})

/**
 * Deny login for user admin2
 */
function denyAdmin2 () {
  if (Session.uData.login === 'admin2') {
      // throw new Error('Deny login for admin2')
    throw new UB.UBAbort('<<<Deny login for admin2>>>')
  }
}
Session.on('login', denyAdmin2)
