require('chai').should();

var ExtLocator = require("./ExtJSlocatorHelper.js");

function SetTextToCodeMirrorByLocator (locator, text) {
    browser.execute(function(locator, text) {
        var element = Ext.ComponentQuery.query(locator)[0];
        element.setValue(text);
    }, locator, text);
    return;
}


//Data for "Add Shortcut base on existing Shortcut" test
var timestamp = + new Date();
var caption1 = 'test_shortcut1_' + timestamp;
var code1 = 'test_code_shotcut1_' + timestamp;

//Data for "Add Shortcut" test
var timestamp = + new Date();
var caption2 = 'test_shortcut2_' + timestamp;
var code2 = 'test_code_shotcut2_' + timestamp;

//Data for Edit existing Shortcut" test
var timestamp = + new Date();
var captionRenamed = 'test_shortcut1_re' + timestamp;
var codeRenamed = 'test_code_shotcut1_re' + timestamp;

var maskToDisappearLocator = '//*[(contains(@class, "ub-mask") or contains(@class,"x-mask")) and not(contains(@style,"display: none"))]';

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
        browser.pause(3000)
    });
});

describe("Add Shortcut base on existing Shortcut", function () {
    it("Select existing Shortcut and open Shortcut creation window", function () {
        browser.click(ExtLocator.getCss('button[cls=ub-desktop-button]'));
        browser.click(ExtLocator.getCss('menuitem[text=Test]'));
        browser.rightClick('//span[contains(.,"Document test")]');
        browser.waitForVisible(ExtLocator.getCss('menuitem[text=Add shortcut]'));
        browser.click(ExtLocator.getCss('menuitem[text=Add shortcut]'));
        browser.pause(1000);
    });
    it("Set data for a new Shortcut and 'save and close'", function () {
        var desktopcombobox = '//table[@id="' + ExtLocator.getId('ubcombobox[attributeName=desktopID]') + '"]//div[contains(@class, "x-form-arrow-trigger")]';
        browser.click(desktopcombobox);
        browser.click('//ul[@class="x-list-plain"]//li[contains(.,"Test")]');
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl', caption1);
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl', code1);
        SetTextToCodeMirrorByLocator('ubcodemirror[attributeName=cmdCode]', '{\r\n	"cmdType": "showList",\r\n	"cmdData": {\r\n		"params": [\r\n			{\r\n				"entity": "tst_document",\r\n				"method": "select",\r\n				"fieldList": [\r\n					"favorites.code",\r\n					"docDate",\r\n					"code",\r\n					"description",\r\n					"fileStoreSimple"\r\n				]\r\n			}\r\n		]\r\n	}\r\n}');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Open and check added Shortcut base on existing Shortcut", function () {
        browser.waitForVisible(maskToDisappearLocator, 10000, true);
        browser.click(ExtLocator.getCss('button[cls=ub-desktop-button]'));
        browser.click(ExtLocator.getCss('menuitem[text=Test]'));
        var createdchortcut = '//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="'+caption1+'"]';
        browser.waitForExist(createdchortcut);
        browser.click(createdchortcut);
        browser.pause(1000);
        var tab = browser.getText(ExtLocator.getCss('tab[tooltip=DocumentTest]'));
        tab.should.equal('DOCUMENTTEST');
        console.log('Tab is ' + tab);
        var tabCode = browser.isExisting('.x-column-header-text=Document date');
        tabCode.should.equal(true);
        var tabCaption = browser.isExisting('.x-column-header-text=Code');
        tabCaption.should.equal(true);
        var tabComplexCaption = browser.isExisting('.x-column-header-text=Description');
        tabComplexCaption.should.equal(true);
        var tabNonNullDictID = browser.isExisting('.x-column-header-text=Simple');
        tabNonNullDictID.should.equal(true);
        browser.pause(1000);
        console.log(ExtLocator.getCss('tab[text=DocumentTest]') + '-closeEl');
        browser.click(ExtLocator.getCss('tab[text=DocumentTest]') + '-closeEl');
    });
});

describe("Add Shortcut", function () {
    it("Open Folder creation window from left sidebar menu", function () {
        browser.rightClick(ExtLocator.getCss('navigationpanel'));
        browser.waitForVisible(ExtLocator.getCss('menuitem[text=Add shortcut]'));
        browser.click(ExtLocator.getCss('menuitem[text=Add shortcut]'));
        browser.pause(1000);
    });
    it("Set data for a new Shortcut and 'save and close'", function () {
        var desktopcombobox = '//table[@id="' + ExtLocator.getId('ubcombobox[attributeName=desktopID]') + '"]//div[contains(@class, "x-form-arrow-trigger")]';
        browser.click(desktopcombobox);
        browser.click('//ul[@class="x-list-plain"]//li[contains(.,"Test")]');
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl', caption2);
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl', code2);
        SetTextToCodeMirrorByLocator('ubcodemirror[attributeName=cmdCode]', '{\r\n	"cmdType": "showList",\r\n	"cmdData": {\r\n		"params": [\r\n			{\r\n				"entity": "tst_ODataSimple",\r\n				"method": "select",\r\n				"fieldList": "*"\r\n			}\r\n		]\r\n	}\r\n}');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(1000);
    });
    it("Open and check added Shortcut", function () {
        browser.click(ExtLocator.getCss('button[cls=ub-desktop-button]'));
        browser.click(ExtLocator.getCss('menuitem[text=Test]'));
        browser.pause(1000);
        var createdchortcut = '//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="'+caption2+'"]';
        browser.click(createdchortcut);
        browser.pause(1000);
        var tab = browser.getText(ExtLocator.getCss('tab[tooltip=tst_ODataSimple]'));
        tab.should.equal('TST_ODATASIMPLE');
        console.log('Tab is ' + tab);
        var tabCode = browser.isExisting('.x-column-header-text=Code');
        tabCode.should.equal(true);
        var tabCaption = browser.isExisting('.x-column-header-text=Caption');
        tabCaption.should.equal(true);
        var tabComplexCaption = browser.isExisting('.x-column-header-text=filterValue');
        tabComplexCaption.should.equal(true);
        var tabNonNullDictID = browser.isExisting('.x-column-header-text=Currency Data');
        tabNonNullDictID.should.equal(true);
        var tabEnumValue = browser.isExisting('.x-column-header-text=Назва');
        tabEnumValue.should.equal(true);
        var DateTimeValue = browser.isExisting('.x-column-header-text=Test boolean column');
        DateTimeValue.should.equal(true);
        var tabBooleanValue = browser.isExisting('.x-column-header-text=Document date');
        tabBooleanValue.should.equal(true);
        console.log(ExtLocator.getCss('tab') + '-closeEl');
        browser.click(ExtLocator.getCss('tab') + '-closeEl');
    });
});

describe("Delete Shortcut", function () {
    it("Open in the top menu: Administrator- UI- Shortcuts", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(3000);
        browser.click(ExtLocator.getCss('menuitem[text=Shortcuts]'));
        browser.pause(1000);
    });
    it("Find shortcut in the grid and delete", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Filter by]') + '-btnEl');
        browser.click(ExtLocator.getCss('menuitem[text=Code][el]'));
        browser.click('//*[@id="' + ExtLocator.getId('combobox') + '"]//td[@class=" x-trigger-cell x-unselectable"]');
        browser.click('//*[@id="' + ExtLocator.getId('boundlist') + '"]//li[.="Contains"]');
        browser.setValue(ExtLocator.getCss('textfield[el][hidden=false][labelCls=ub-overflow-elips]') + '-inputEl', code2);
        browser.click('//*[@id="' + ExtLocator.getId('toolbar[el][hidden=false][ptype=multifilter]') + '"]//a[@data-qtip="Search"]');
        var createdShortcutInTab = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="' + code2 + '"]';
        browser.waitForVisible(createdShortcutInTab);
        browser.rightClick(createdShortcutInTab);
        browser.click(ExtLocator.getCss('menuitem[text=Delete (Ctrl+Delete)][el][hidden=false]'));
        var deleteMessageBox = browser.getText('//*[@id="' + ExtLocator.getId('messagebox') + '"]//span[.="Confirm delete"]');
        deleteMessageBox.should.equal('Confirm delete');
        console.log('Tab is ' + deleteMessageBox);
        browser.click('//*[@id="' + ExtLocator.getId('messagebox') + '"]//span[.="No"]');
        browser.rightClick(createdShortcutInTab);
        browser.click(ExtLocator.getCss('menuitem[text=Delete (Ctrl+Delete)][el][hidden=false]'));
        deleteMessageBox.should.equal('Confirm delete');
        console.log('Tab is ' + deleteMessageBox);
        browser.click('//*[@id="' + ExtLocator.getId('messagebox') + '"]//span[.="Yes"]');
        browser.click(ExtLocator.getCss('button[el][hidden=false][tooltip=Clear]'));
        browser.pause(1000);
    });
    it("Checking Shortcut deleting", function () {
        var createdShortcutInTab = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="' + code2 + '"]';
        var shortcutPresence = browser.isExisting(createdShortcutInTab);
        console.log(shortcutPresence);
        shortcutPresence.should.equal(false);
        browser.pause(1000);
        console.log(ExtLocator.getCss('tab') + '-closeEl');
        browser.click(ExtLocator.getCss('tab') + '-closeEl');
    });
});

describe("Edit existing Shortcut", function () {
    it("Open in the top menu: Administrator- UI- Shortcuts", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Shortcuts]'));
        browser.pause(1000);
    });
    it("Find shortcut in the grid and open edit window", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Filter by]') + '-btnEl');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menu[el][hidden=false] menuitem[text=Shortcut caption][el]'));
        browser.pause(1000);
        browser.click('//*[@id="' + ExtLocator.getId('combobox') + '"]//td[@class=" x-trigger-cell x-unselectable"]');
        browser.click('//*[@id="' + ExtLocator.getId('boundlist') + '"]//li[.="Contains"]');
        browser.setValue(ExtLocator.getCss('textfield[el][hidden=false][labelCls=ub-overflow-elips]') + '-inputEl', caption1);
        browser.click('//*[@id="' + ExtLocator.getId('toolbar[el][hidden=false][ptype=multifilter]') + '"]//a[@data-qtip="Search"]');
        var createdShortcutInTab = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="' + caption1 + '"]';
        browser.waitForVisible(createdShortcutInTab);
        browser.rightClick(createdShortcutInTab);
        browser.click(ExtLocator.getCss('menu[el][hidden=false] menuitem[text=Edit (Ctrl+E)][el][hidden=false]'));
    });
    it("Editing a shortcut and 'save and close' ", function () {
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl', captionRenamed);
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl', codeRenamed);
        SetTextToCodeMirrorByLocator('ubcodemirror[attributeName=cmdCode]', '{\r\n	"cmdType": "showList",\r\n	"cmdData": {\r\n		"params": [\r\n			{\r\n				"entity": "tst_document",\r\n				"method": "select",\r\n				"fieldList": [\r\n					"favorites.code",\r\n					"docDate",\r\n					"code",\r\n					"description"\r\n				]\r\n			}\r\n		]\r\n	}\r\n}');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
    });
});

describe("Checking of edited Shortcut", function () {
    it("Reload page and login to the system", function () {
        browser.url('/ubadminui');
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Autotest UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Login]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        // browser.pause(3000);//temporary solution before bug fixing
        // browser.click('.ub-error-win-btn.ub-error-win-btn-ok'); //temporary solution before bug fixing
        browser.pause(1000)
    });
    it("Open and check edited Shortcut on left side menu", function () {
        var editedShortcut = '//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="' + captionRenamed + '"]';
        browser.click(editedShortcut);
        browser.pause(1000);
        var tab = browser.getText(ExtLocator.getCss('tab[tooltip=DocumentTest]'));
        tab.should.equal('DOCUMENTTEST');
        console.log('Tab is ' + tab);
        var tabCode = browser.isExisting('.x-column-header-text=Document date');
        tabCode.should.equal(true);
        var tabCaption = browser.isExisting('.x-column-header-text=Code');
        tabCaption.should.equal(true);
        var tabComplexCaption = browser.isExisting('.x-column-header-text=Description');
        tabComplexCaption.should.equal(true);
        var tabNonNullDictID = browser.isExisting('.x-column-header-text=Simple');
        tabNonNullDictID.should.equal(false);
        browser.pause(1000)
    });
    it("Open in the top menu: Administrator- UI- Shortcuts", function () {
        console.log(ExtLocator.getCss('tab[text=DocumentTest]') + '-closeEl');
        browser.click(ExtLocator.getCss('tab[text=DocumentTest]') + '-closeEl');
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
    });
    it("Find edited shortcut in the grid and open edit window", function () {
        browser.click(ExtLocator.getCss('menuitem[text=Shortcuts]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[tooltip=Filter by]') + '-btnEl');
        browser.click(ExtLocator.getCss('menu[el][hidden=false] menuitem[text=Shortcut caption][el]')); // or ('menuitem[text=Code][el][activated!=false]')
        browser.click('//*[@id="' + ExtLocator.getId('combobox') + '"]//td[@class=" x-trigger-cell x-unselectable"]');
        browser.click('//*[@id="' + ExtLocator.getId('boundlist') + '"]//li[.="Contains"]');
        browser.setValue(ExtLocator.getCss('textfield[el][hidden=false][labelCls=ub-overflow-elips]') + '-inputEl', captionRenamed);
        browser.click('//*[@id="' + ExtLocator.getId('toolbar[el][hidden=false][ptype=multifilter]') + '"]//a[@data-qtip="Search"]');
        var createdShortcutInTab = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+captionRenamed+'"]';
        browser.waitForVisible(createdShortcutInTab);
        browser.rightClick(createdShortcutInTab);
        browser.click(ExtLocator.getCss('menu[el][hidden=false] menuitem[text=Edit (Ctrl+E)][el][hidden=false]'));
    });
    it("Check edited Shortcut caption and Code fields", function () {
        browser.waitForVisible(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl');
        var renamedCaption = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl');
        renamedCaption.should.equal(captionRenamed);
        console.log('Caption is: ' + renamedCaption);
        browser.waitForVisible(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl');
        var renamedCode = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl');
        renamedCode.should.equal(codeRenamed);
        console.log('Code is: ' + renamedCode);
    });
});

