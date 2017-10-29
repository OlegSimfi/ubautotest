exports.formCode = {
    initUBComponent: function () {
        this.bindKeys();
	},

    bindKeys: function () {
        var
            me = this,
            wnd = me.up('window');

        if (wnd) {
            new Ext.util.KeyMap({
                target: wnd.getEl(),
                binding: [
                    {
                        key: Ext.EventObject.INSERT,
                        ctrl: true,
                        shift: false,
                        fn: function (keyCode, e) {
                            e.stopEvent();
                            var employeeID = me.getField('employeeID').getValue();
                            if (!employeeID) {
                                UBS.cliUtils.showMessage('Загрузка таб. номеру', 'Не вибраний працівник',me.getField('employeeID'));
                            } else {
                                UBS.cliUtils.loadEntityByID('org_employee',employeeID , ['code'], me.fillTabNo, me );
                            }
                        }
                    }
                ]
            });
        }

        me.getField('employeeID').addListener('change', function (ctrl, newValue, oldValue, eOpts) {
                                                                      if (!oldValue || oldValue == newValue || !newValue ) {
                                                                          return;
                                                                      }
                                                                      UBS.cliUtils.loadEntityByID('org_employee',newValue, ['code'], me.fillTabNo, me );
                                                            } , me);
        me.getField('tabNo').addListener('keydown', function (ctrl, e, eOpts) {
                var
                    me = this,
                    key = e.getKey();
                if (key == Ext.EventObject.SPACE) {
                    e.stopEvent();
                    UBS.cliUtils.loadEntityByID('org_employee',me.getField('employeeID').getValue(), ['code'], me.fillTabNo, me );
                }
        } , me);


    },
    fillTabNo: function (enmployeeRow) {
        var
            me = this,
            tabNo = me.getField('tabNo');
        tabNo.setValue(enmployeeRow.get('code'));
    }


};