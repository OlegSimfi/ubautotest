/**
 * Created by v.orel on 20.09.2016.
 */

const me = tst_docusign,
  dsEnvelope = new TubDataStore('tst_docusign'),
  dsDocuments = new TubDataStore('tst_docusign_doc'),
  dsReceivers = new TubDataStore('tst_docusign_receiver')

me.entity.addMethod('sendEnvelope')
me.sendEnvelope = sendEnvelope
/**
 * Create new envelope and send it to docuSign
 *
 * @param fake
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function sendEnvelope (fake, req, resp) {
  const {id} = JSON.parse(req.read())

  UB.Repository('tst_docusign').attrs('name', 'mi_modifyDate').where('ID', '=', id).select(dsEnvelope)
  UB.Repository('tst_docusign_doc').attrs('document').where('envelope', '=', id).select(dsDocuments)
  UB.Repository('tst_docusign_receiver').attrs('receiver.email', 'receiver.name').where('envelope', '=', id).select(dsReceivers)

  const envelope = {
    entity: 'tst_docusign',
    entityID: id,
    emailSubject: 'Please Sign my tst_docusign Envelope',
    emailBlurb: 'Hello, Please sign my my tst_docusign Envelope.',
    documents: [],
    signers: []
  }

  for (let doc of JSON.parse(dsDocuments.asJSONObject)) {
    envelope.documents.push({
      entity: 'tst_document',
      attribute: 'fileStoreSimple',
      id: doc.document,
      documentId: envelope.documents.length + 1
    })
  }

  for (let receiver of JSON.parse(dsReceivers.asJSONObject)) {
    const index = envelope.signers.push({
      email: receiver['receiver.email'],
      fullName: receiver['receiver.name'],
      tabs: {
        signHere: [],
        fullName: [],
        dateSigned: []
      }
    }) - 1
    for (let i = 0; i < envelope.documents.length; i++) {
      envelope.signers[index].tabs.signHere.push({
        documentId: i + 1,
        pageNumber: 1,
        xPosition: 10,
        yPosition: 10 + index * 30
      })
      envelope.signers[index].tabs.fullName.push({
        documentId: i + 1,
        pageNumber: 1,
        xPosition: 100,
        yPosition: 10 + index * 30
      })
      envelope.signers[index].tabs.dateSigned.push({
        documentId: i + 1,
        pageNumber: 1,
        xPosition: 150,
        yPosition: 10 + index * 30
      })
    }
  }

  const envelop_id = dses_envelope.addEnvelope(envelope)
  console.log(envelop_id)
  dsEnvelope.run('update', {
    entity: 'tst_docusign',
    execParams: {
      ID: id,
      mi_modifyDate: dsEnvelope.get('mi_modifyDate'),
      envelope: envelop_id
    }
  })
  resp.statusCode = 200
  resp.writeEnd('')
}

me.entity.addMethod('updateDocuments')
me.updateDocuments = updateDocuments

/**
 * Update envelope documents from DocuSign
 *
 * @param fake
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function updateDocuments (fake, req, resp) {
  const {id} = JSON.parse(req.read())

  UB.Repository('tst_docusign').attrs('envelope').where('ID', '=', id).select(dsEnvelope)

  dses_envelope.updateDocuments(dsEnvelope.get(0))

  resp.statusCode = 200
  resp.writeEnd('')
}

me.on('dses:Created', function () { debugger })
me.on('dses:Completed', function (id, envelopeID) {
  dses_envelope.updateDocuments(envelopeID)
})
