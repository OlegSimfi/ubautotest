exports.formCode = {
    dataBind: {
        fullName: {
            value: '{name}'
        },
        nameDat: {
            value: '{name}'
        },
        nameGen: {
            value: '{name}'
        },
        fullNameDat: {
            value: '{fullName}'
        },
        fullNameGen: {
            value: '{fullName}'
        }

    },
    initUBComponent: function () {
        UBS.dataBinder.applyBinding(this);
        this.getField('professionID').addListener("change", this.professionChange, this);
	},
    professionChange: function(ctrl, newValue, oldValue, eOpts) {
        this.getField('name').setValue(ctrl.getRawValue());
    }


};