require('@unitybase/ubs/public/MessageBar.js')
$App.on('buildMainMenu', function (items) {
  // items.length = 0;
  items.push(
     Ext.create('UBS.MessageBar'),
     Ext.create('UB.view.FullTextSearchWidget')
  )
  return false
})
