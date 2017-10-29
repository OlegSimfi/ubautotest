require('chai').should();

var ExtLocator = require("./ExtJSlocatorHelper.js");

function SetTextToCodeMirrorByLocator (locator, text) {
    browser.execute(function(locator, text) {
        var element = Ext.ComponentQuery.query(locator)[0];
        element.setValue(text);
    }, locator, text);
    return;
}

function GetTextFromCodeMirrorByLocator(locator){
    var codeMirrorValue = browser.execute(function(locator) {
        var element = Ext.ComponentQuery.query(locator)[0];
        var value = element.getValue();
        return (value);
    },locator);
    return codeMirrorValue.value;
}


describe("Login to the system", function () {
    it("Login to the system as admin/admin", function () {
        browser.windowHandleMaximize();
        browser.url('/ubadminui');
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Автотест UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Користувач]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        // browser.pause(3000);//temporary solution before bug fixing
        // browser.click('.ub-error-win-btn.ub-error-win-btn-ok'); //temporary solution before bug fixing
        browser.pause(1000)
    });
});

describe("Check Pure ExtJS Form", function () {
    it("Open top navbar menuAdministrator / UI / Forms", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Forms]'));
        browser.pause(1000);
    });
    it("Select and open existing Form", function () {
        var existingFormInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="ubm_desktop-scanerSettings"]';
        browser.waitForVisible(existingFormInGrid);
        browser.doubleClick(existingFormInGrid);
        browser.pause(3000);
    });
    it("Check Base Property tab", function () {
        var entity = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=entity]') + '"]');
        entity.should.equal(true);
        var model = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=model]') + '"]');
        model.should.equal(true);
        var formCode = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=code]') + '"]');
        formCode.should.equal(true);
        var description = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=description]') + '"]');
        description.should.equal(true);
        var formTitle = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=caption]') + '"]');
        formTitle.should.equal(true);
        var formType = browser.isExisting('//*[@id="' + ExtLocator.getId('ubbasebox[attributeName=formType]') + '"]');
        formType.should.equal(true);
        var byDefault = browser.isExisting('//*[@id="' + ExtLocator.getId('checkboxfield[attributeName=isDefault]') + '"]');
        byDefault.should.equal(true);
    });
    it("Check Interface's definition tab", function () {
        browser.click(ExtLocator.getCss("tab[el][text=Interface's definition]"));
        browser.pause(1000);
        var codemirrorText = browser.getText('//*[@id="' + ExtLocator.getId('ubdocument[attributeName=formDef]') + '"]');
        var searchInCodemirrorText = (codemirrorText.indexOf("Ext.create('Ext.data.Store', {"));  //Return of the position on which the substring is found or -1, if nothing is found
        console.log(searchInCodemirrorText);
        var codemirrorOk = (searchInCodemirrorText >= 0);
        codemirrorOk.should.equal(true);
    });
    it("Check Methods' definition tab", function () {
        browser.click(ExtLocator.getCss("tab[el][text=Methods' definition]"));
        browser.pause(1000);
        var codemirrorText = browser.getText('//*[@id="' + ExtLocator.getId('ubdocument[attributeName=formCode]') + '"]');
        var searchInCodemirrorText = (codemirrorText.indexOf("{}"));  //Return of the position on which the substring is found or -1, if nothing is found
        console.log(searchInCodemirrorText);
        var codemirrorOk = (searchInCodemirrorText >= 0);
        codemirrorOk.should.equal(true);
    });
    it("Check Visual designer tab", function () {
        browser.click(ExtLocator.getCss("tab[el][text=Visual designer]"));
        var tabText = browser.getText('//*[@id="' + ExtLocator.getId('panel[title=Visual designer]') + '"]');
        var searchInText = (tabText.indexOf("The visual designer do not work with type of this form"));  //Return of the position on which the substring is found or -1, if nothing is found
        console.log(searchInText);
        var codemirrorOk = (searchInText >= 0);
        codemirrorOk.should.equal(true);
    });
    it("Close UnityBase form's editor tab", function () {
        browser.click(ExtLocator.getCss("tab[text=Form editor]") + '-closeEl');
        browser.click(ExtLocator.getCss("tab[text=Form]") + '-closeEl');
    });
});

describe("Check UB Form", function () {
    it("Open top navbar menuAdministrator / UI / Forms", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Forms]'));
        browser.pause(1000);
    });
    it("Select and open existing Form", function () {
        var existingFormInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="ubm_desktop"]';
        browser.waitForVisible(existingFormInGrid);
        browser.doubleClick(existingFormInGrid);
        browser.pause(3000);
    });
    it("Check Base Property tab", function () {
        var entity = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=entity]') + '"]');
        entity.should.equal(true);
        var model = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=model]') + '"]');
        model.should.equal(true);
        var formCode = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=code]') + '"]');
        formCode.should.equal(true);
        var description = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=description]') + '"]');
        description.should.equal(true);
        var formTitle = browser.isExisting('//*[@id="' + ExtLocator.getId('field[entityName=ubm_form][attributeName=caption]') + '"]');
        formTitle.should.equal(true);
        var formType = browser.isExisting('//*[@id="' + ExtLocator.getId('ubbasebox[attributeName=formType]') + '"]');
        formType.should.equal(true);
        var byDefault = browser.isExisting('//*[@id="' + ExtLocator.getId('checkboxfield[attributeName=isDefault]') + '"]');
        byDefault.should.equal(true);
        browser.pause(1000);
    });
    it("Check Interface's definition tab", function () {
        browser.click(ExtLocator.getCss("tab[el][text=Interface's definition]"));
        browser.pause(3000);
        var codemirrorText = browser.getText('//*[@id="' + ExtLocator.getId('ubdocument[attributeName=formDef]') + '"]');
        var searchInCodemirrorText = (codemirrorText.indexOf("ubm_desktop_adm"));  //Return of the position on which the substring is found or -1, if nothing is found
        console.log(searchInCodemirrorText);
        var codemirrorOk = (searchInCodemirrorText >= 0);
        codemirrorOk.should.equal(true);
    });
    it("Check Methods' definition tab", function () {
        browser.click(ExtLocator.getCss("tab[el][text=Methods' definition]"));
        browser.pause(1000);
        var codemirrorText = browser.getText('//*[@id="' + ExtLocator.getId('ubdocument[attributeName=formCode]') + '"]');
        var searchInCodemirrorText = (codemirrorText.indexOf("initUBComponent: function () {"));  //Return of the position on which the substring is found or -1, if nothing is found
        console.log(searchInCodemirrorText);
        var codemirrorOk = (searchInCodemirrorText >= 0);
        codemirrorOk.should.equal(true);
        browser.pause(3000);
    });
    it("Check Visual designer tab", function () {
        browser.click(ExtLocator.getCss("tab[el][text=Visual designer]"));
        browser.pause(3000);
        var desktopName = browser.isExisting('//*[@id="' + ExtLocator.getId('ubtextfield[fieldLabel=Desktop name]') + '"]');
        desktopName.should.equal(true);
        var code = browser.isExisting('//*[@id="' + ExtLocator.getId('ubtextfield[fieldLabel=Code]') + '"]');
        code.should.equal(true);
        var byDefault = browser.isExisting('//*[@id="' + ExtLocator.getId('checkboxfield[fieldLabel=By default?]') + '"]');
        byDefault.should.equal(true);
        var url = browser.isExisting('//*[@id="' + ExtLocator.getId('ubtextfield[fieldLabel=URL]') + '"]');
        url.should.equal(true);
        var userBuildInRole = browser.isExisting('//*[@id="' + ExtLocator.getId('ubdetailgrid') + '"]//div[.="User build-in role"]');
        userBuildInRole.should.equal(true);
    });
    it("Close UnityBase form's editor tab", function () {
        browser.click(ExtLocator.getCss("tab[text=Form editor]") + '-closeEl');
        browser.click(ExtLocator.getCss("tab[text=Form]") + '-closeEl');
    });
});

describe("Edit Form", function () {
    it("Open top navbar menu Administrator / UI / Desktops", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Desktops]'));
        browser.pause(1000);
    });
    it("Select existing Desktop and open Edit Desktop tab", function () {
        var existingDesktop = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="cdn_desktop"]';
        browser.doubleClick(existingDesktop);
        browser.pause(1000);
    });
    it("Check of existence of the URL field", function () {
        var urlField = browser.isExisting('//*[@id="' + ExtLocator.getId('ubtextfield[fieldLabel=URL]') + '"]');
        urlField.should.equal(true);
        browser.click(ExtLocator.getCss("tab[text=Desktop]") + '-closeEl');
        browser.click(ExtLocator.getCss("tab[text=Desktop]") + '-closeEl');
    });
    it("Open top navbar menuAdministrator / UI / Forms", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Forms]'));
        browser.pause(1000);
    });
    it("Open ubm_desktop form", function () {
        var ubmDesktopForm = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="ubm_desktop"]';
        browser.rightClick(ubmDesktopForm);
        browser.click(ExtLocator.getCss('menu[el][hidden=false] menuitem[text=Edit (Ctrl+E)][el][hidden=false]'));
        browser.pause(1000);
    });
    it("Edit source code in Interface's Definition tab ", function () {
        browser.click(ExtLocator.getCss("tab[el][text=Interface's definition]"));
        browser.pause(1000);
        var codeFromCodeMirror = GetTextFromCodeMirrorByLocator('ubcodemirror[name=formDef]');
        var replaceCode = codeFromCodeMirror.replace('{ attributeName: "url"},','');
        SetTextToCodeMirrorByLocator('ubcodemirror[name=formDef]',replaceCode);
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.click(ExtLocator.getCss("tab[text=Form]") + '-closeEl');
    });
    it("Check deletion of the field URL field at Edit Desktop tab", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Desktops]'));
        browser.pause(1000);
        var existingDesktop = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="cdn_desktop"]';
        browser.doubleClick(existingDesktop);
        browser.pause(1000);
        var allFields = browser.elements('//*[@id="'+ExtLocator.getId('panel[el][formCode="ubm_desktop"]') + '-targetEl"]/table[starts-with(@id,"ubtextfield-")]').value;
        console.log(allFields);
        for (var index = 0; index < allFields.length; index+=1){
            var currentField = browser.elementIdText(allFields[index].ELEMENT).value;
            var searchField = (currentField.indexOf("URL"));  //Return of the position on which the substring is found or -1, if nothing is found
            console.log(currentField);
            var fieldURL = (searchField < 0);
            fieldURL.should.equal(true);
        }
    });
});


