exports.formCode = {
    initUBComponent: function () {
        if (this.isEditMode) {
            this.setTitle('<span style="text-align:right; width: 50%"> ' + UB.i18n('contact') || "----");
        } else {
            this.setTitle('<span style="text-align:right; width: 50%"> ' + UB.i18n('contact') +  Ext.String.format(' ({0})', UB.i18n('dobavlenie')) || "----");
        }
    }
};