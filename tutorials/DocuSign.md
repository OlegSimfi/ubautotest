  [DocuSign®](https://www.docusign.com/) is The Global Standard for Digital Transaction Management. 
Accessible anytime, anywhere on any device, global enterprises, business departments, individual professionals, 
and consumers in all industries solve their paper problems by replacing manual, paper-based methods with DocuSign. 
The result is accelerated transactions that increase speed to results, reduce costs, improve visibility and control, and delight customers. 
DocuSign helps you keep business digital with the easiest, fastest, most secure way to send, sign, manage and store documents in the cloud.
  
  Now UnityBase support DocuSign by model *ub_model_dses*. You can create your own envelope, define document and signers for it and subscribe
for [DocuSign envent notifications](https://www.docusign.com/supportdocs/dfs-admin-guide/Content/admin-guide/envelope-recipient-events-ref.htm), 
witch is emited when DocuSign calls application calback.
 
## Getting started
  [Create your developer sandbox](https://secure.docusign.com/signup/develop) and generate an [Integrator Key](https://www.docusign.com/developer-center/api-overview#integrator-key).
  Enable [docusign-connect](https://www.docusign.com/developer-center/api-overview#docusign-connect).

  Add model *ub_model_dses* to your application.
  
  Install required npm modules for *ub_model_dses*.
	>cd <path to *ub_model_dses*>
	>npm install

  Fill *docusign* section in *customSettings* section of application config
  
    {
	    ...
		"application": {
		    ...
			"customSettings": {
			    ...
				"docuSign": {
				    "userName": "<userName>",
				    "password": "<password>",
				    "integratorKey": "<integratorKey>",
				    "apiUrl": "https://demo.docusign.net/restapi"//"https://docusign.net/restapi" for production
				}
				...
			}
		    ...
		}
		...
	}
  
  Be sure that method dses_envelope.eventNotification is accessible for anonymous user and UB is accessible for DocuSign.
  
  Now you are redy to use *ub_model_dses*
  
  For production you have to Purchase an [API Plan](https://secure.docusign.com/developer) and [enable your Integrator Key](https://www.docusign.com/developer-center/api-overview#go-live)
  
## Quick demo
  Set up a *Autotest* application, run it, go to adminui. Enter into *TEST* decktop and enter into *Docusign test* shortcut. Create new envelope.
Add document(with content) and receiver (with email). Press send button. Now you can see new envelope in your DocuSign accout in documents section.

  Also all your recepients will get email notification then they must sign documents. After all recipients sign document Docusign will call UB method 
*rest/dses_envelope/eventNotification* (UB must be accessible for DocuSign) and your document's content will be updated(it can take several time).

## Using  
### Creating new envelope
  Method dses_envelope.addEnvelope
  
    dses_envelope.addEnvelope({
	    entity: 'tst_docusign',
		entityID: <tst_docusignID>,
		emailSubject: 'Please Sign my tst_docusign Envelope',
		emailBlurb: 'Hello, Please sign my my tst_docusign Envelope.',
		documents: [{
            entity: 'tst_document',
            attribute: 'fileStoreSimple',
            id: <tst_documentID1>,
            documentId: 1
		},{
            entity: 'tst_document',
            attribute: 'fileStoreSimple',
            id: <tst_documentID2>,
            documentId: 2
		}],
		signers: [{
                email: <email1>,
                fullName: <fullName1>,
                tabs: {
                    signHere: [{
					    documentId: 1,
						pageNumber: 1,
						xPosition: 10,
						yPosition: 10
					},{
					    documentId: 2,
						pageNumber: 1,
						xPosition: 10,
						yPosition: 10
					}],
                    fullName: [{
					    documentId: 1,
						pageNumber: 1,
						xPosition: 10,
						yPosition: 50
					}],
                    dateSigned: [{
					    documentId: 2,
						pageNumber: 1,
						xPosition: 10,
						yPosition: 50
					}]
                }
		},{
                email: <email2>,
                fullName: <fullName2>,
                tabs: {
                    signHere: [{
					    documentId: 2,
						pageNumber: 1,
						xPosition: 100,
						yPosition: 10
					}],
                    fullName: [{
					    documentId: 2,
						pageNumber: 1,
						xPosition: 100,
						yPosition: 50
					}]
                }
		}]
	});
  
### Event Notifications
  Event, than call method dses_envelope.addEnvelope emits next [events](https://www.docusign.com/supportdocs/dfs-admin-guide/Content/admin-guide/envelope-recipient-events-ref.htm) : 
*dses:Created*, *dses:Sent*, *dses:Delivered*, *dses:Signed*, *dses:Completed*, *dses:Declined*, *dses:Voided*.
You can subscribe for some of them.

    tst_docusign.on('dses:Completed',function(id, envelopeID){dses_envelope.updateDocuments(envelopeID);});

### See also
  [*ub_model_dses*](/api/serverNew/module-ub_model_dses_dses_envelope.html) module
  