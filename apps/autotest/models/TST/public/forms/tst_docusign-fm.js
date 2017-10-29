function doSend () {
  var form = this
  $App.connection.xhr({
    url: 'rest/tst_docusign/sendEnvelope',
    method: 'POST',
    data: {
      id: form.instanceID
    }
  }).done(function () {
    $App.dialogInfo('Sended').done()
  })
}

function doUpdate () {
  var form = this
  $App.connection.xhr({
    url: 'rest/tst_docusign/updateDocuments',
    method: 'POST',
    data: {
      id: form.instanceID
    }
  }).done(function () {
    $App.dialogInfo('Updated').done()
  })
}

exports.formCode = {
  addBaseActions: function () {
    this.callParent(arguments)
    this.actions.ActionSendID = new Ext.Action({
      actionId: 'ActionSendID',
      actionText: 'send',
      handler: doSend.bind(this)
    })
    this.actions.ActionUpdateID = new Ext.Action({
      actionId: 'ActionUpdateID',
      actionText: 'Update',
      handler: doUpdate.bind(this)
    })
  }

}
