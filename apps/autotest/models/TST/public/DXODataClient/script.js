$(function () {
    /**
     * @type {UBSession}
     */
  var $session
  var attributes4Select = ['ID', 'code', 'caption', {dataField: 'dateColumn', dataType: 'date'}, 'enumColumn', 'booleanColumn', {dataField: 'filterValue', groupIndex: 0}]
  var ODATA_ENDPOINT = '../../../ODataV4'

  var $UBConnection = new UBConnection({
    host: location.protocol + '//' + location.host,
    appName: 'autotest/',
    requestAuthParams: function (conn, isRepeat) {
      if (isRepeat) {
        throw new UB.AbortError('invalid')
      } else {
        return Q.resolve({authSchema: 'UB', login: 'admin', password: 'admin'})
      }
    }
  })

  $UBConnection.authorize().then(function (session) {
    $session = session
    $('#getMetadataBtn').click(function (event) {
      window.open(ODATA_ENDPOINT + '/$metadata?SESSION_SIGNATURE=' + $session.signature())
      event.preventDefault()
    })
    var dataSource = new DevExpress.data.DataSource({
      store: {
        type: 'odata',
        url: ODATA_ENDPOINT + '/tst_ODataSimple',
        key: 'ID',
        keyType: 'Int64',
        version: 4,
        beforeSend: function (options) {
          options.headers.Authorization = $session.authSchema + ' ' + $session.signature()
        }
      },
      select: attributes4Select.map(function (col) { return _.isObject(col) ? col.dataField : col })
    })
    var dataGrid = $('#gridContainer').dxDataGrid({
      dataSource: dataSource,
      columns: attributes4Select,
      filterRow: {
        visible: true, applyFilter: 'auto'
      },
      searchPanel: {
        visible: true, width: 240, placeholder: 'Search...'
      },
      headerFilter: {
        visible: true
      },
      editing: {
        editMode: 'batch',
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true
      },
      paging: { pageSize: 5 },
      groupPanel: {
        visible: true,
        allowColumnDragging: true
      }
    })
  }).catch(function (err) {
    $('#gridContainer').text('Error:' + err)
  }).done()
})
