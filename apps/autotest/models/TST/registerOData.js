/**
 * Created by pavel.mash on 26.12.2015.
 */

var OData = require('@ub-e/odata')

var endpoint = OData.registerEndpoint({
  endpointName: 'ODataV4',
  namespace: 'autotest',
    // requireAuth: false,
  skipOptimisticLock: true
    //, entitySetMapping: {
    //    tst_ODataRef: App.domain.byName('tst_ODataRef'),
    //    tst_ODataSimple: App.domain.byName('tst_ODataSimple')
    // }
})
