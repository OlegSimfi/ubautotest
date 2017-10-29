exports.formCode = {
    dataBind: {
        fullFIO: {
            value: '({lastName} || "?") + " " + ({firstName} || "?") + ({middleName} ? " " + {middleName}:"")'
            //visible: '([taskType] === "ONDATE")'
        },
        shortFIO: {
            value: '({lastName} || "?") + " " + ({firstName} || "?")[0].toUpperCase() + "." + ({middleName} ? {middleName}[0].toUpperCase() + "." : "")'
        },
        lastNameGen: {
            value: '{lastName}'
        },
        lastNameDat: {
            value: '{lastName}'
        },
        firstNameGen: {
            value: '{firstName}'
        },
        firstNameDat: {
            value: '{firstName}'
        },
        middleNameGen: {
            value: '{middleName}'
        },
        middleNameDat: {
            value: '{middleName}'
        },
        shortFIOGen: {
            value: '{shortFIO}'
        },
        shortFIODat: {
            value: '{shortFIO}'
        },
        fullFIOGen: {
            value: '{fullFIO}'
        },
        fullFIODat: {
            value: '{fullFIO}'
        },
        applyGen: {
            value: '{apply}'
        },
        applyDat: {
            value: '{apply}'
        }
    },


    initUBComponent: function () {
        UBS.dataBinder.applyBinding(this);
        var customParams = this.customParams;
        if (customParams && customParams.organizationID){
            var organizationID = this.getUBCmp('attrOrganizationID');
            organizationID.setValueById(customParams.organizationID);
        }
        if (this.isEditMode) {
            this.setTitle('<span style="text-align:right; width: 50%"> ' + UB.i18n('employeeOfExternalOrganization') || "----");
        } else {
            this.setTitle('<span style="text-align:right; width: 50%"> ' + UB.i18n('employeeOfExternalOrganization') +  Ext.String.format(' ({0})', UB.i18n('dobavlenie')) || "----");
            this.getUBCmp('attrSexType').setValue('M');
        }
    }
}; 