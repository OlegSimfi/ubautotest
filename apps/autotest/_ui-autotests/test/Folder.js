require('chai').should();

var ExtLocator = require("./ExtJSlocatorHelper.js");

//Data for "Add Folder" test
var timestamp = + new Date();
var folderCaption = 'test_folder_' + timestamp;
var folderCode = 'test_code_folder_' + timestamp;


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

describe("Add Folder", function () {
    it("Open Folder creation window from left sidebar menu", function () {
        browser.click(ExtLocator.getCss('button[cls=ub-desktop-button]'));
        browser.click(ExtLocator.getCss('menuitem[text=Test]'));
        browser.rightClick(ExtLocator.getCss('navigationpanel'));
        browser.waitForVisible(ExtLocator.getCss('menuitem[text=Add shortcut]'));
        browser.click(ExtLocator.getCss('menuitem[text=Add folder]'));
        browser.pause(1000);
    });
    it("Set data for a new Folder and 'save and close'", function () {
        var checkboxIsFolderChecked = browser.isExisting(ExtLocator.getCss('checkboxfield[name=isFolder][checked=true]'));  // Checking the activity of the checkbox "Is folder?"
        checkboxIsFolderChecked.should.equal(true);
        var desktopID = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=desktopID]') + '-inputEl');
        desktopID.should.equal('Test');
        browser.waitForVisible(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl');
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl', folderCaption);
        browser.waitForVisible(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl');
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl', folderCode);
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        console.log(folderCaption);
    });
    it("Check of a added folder on left sidebar menu", function () {
        browser.waitForVisible('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="'+folderCaption+'"]');
        var createdFolder = browser.isExisting('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="'+folderCaption+'"]');
        createdFolder.should.equal(true);
    });
});
describe("Move Shortcut to Folder", function () {
    it("Select shortcut for move to folder", function () {
        var shortcutToMove = ('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="tst_ODataRef"]');
        browser.waitForVisible(shortcutToMove);
        browser.rightClick(shortcutToMove);
        browser.click(ExtLocator.getCss('menu[el][hidden=false] menuitem[text=Edit][el][hidden=false]'));
    });
    it("Select Folder for Shortcut and 'save and close'", function () {
        var folderCombobox = '//table[@id="' + ExtLocator.getId('ubcombobox[attributeName=parentID]') + '"]//div[contains(@class, "x-form-arrow-trigger")]';
        browser.waitForVisible(folderCombobox);
        browser.click(folderCombobox);
        browser.waitForVisible('//ul[@class="x-list-plain"]//li[contains(.,"test")]');
        browser.click('//ul[@class="x-list-plain"]//li[contains(.,"'+folderCaption+'")]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(1000);
    });
    it("Check move of the Shortcut to the Folder", function () {
        var shortcutToMoved = browser.isExisting('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="tst_ODataRef"]');
        shortcutToMoved.should.equal(false);
        browser.click('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="'+folderCaption+'"]');
        browser.pause(1000);
        var shortcutInFolder = browser.isExisting('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="tst_ODataRef"]');
        shortcutInFolder.should.equal(true);
        browser.click('//*[@id="' +ExtLocator.getId('ubleftpanel') + '"]//tr[.="'+folderCaption+'"]');
        browser.pause(1000); //Required for the next test
    });
});
describe("Move Shortcut from Folder", function () {
    it("Select Shortcut in Folder", function () {
        var folderWithShortcut = ('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="'+folderCaption+'"]');
        browser.click(folderWithShortcut);
        browser.pause(1000);
        var shortcutInFolder = ('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="tst_ODataRef"]');
        browser.rightClick(shortcutInFolder);
        browser.click(ExtLocator.getCss('menu[el][hidden=false] menuitem[text=Edit][el][hidden=false]'));
    });
    it("Clear 'Shortcut folder' field and 'save and close' ", function () {
        var parentIdFieldLoc = ExtLocator.getCss('ubcombobox[attributeName=parentID]') + '-inputEl';
        browser.pause(1000);
        browser.waitForEnabled(parentIdFieldLoc);
        browser.clearElement(parentIdFieldLoc);
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(1000);
    });
    it("Check move of the Shortcut from the Folder", function () {
        var shortcutMovedFromFolder = browser.isExisting('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="tst_ODataRef"]');
        shortcutMovedFromFolder.should.equal(true);
    });
});

describe("Delete Folder", function () {
    it("Select Folder and delete", function () {
        var folderForDelete = ('//*[@id="' +ExtLocator.getId('ubleftpanel') + '"]//tr[.="'+folderCaption+'"]');
        browser.waitForVisible(folderForDelete);
        browser.rightClick(folderForDelete);
        browser.click(ExtLocator.getCss('menu[el][hidden=false] menuitem[text=Delete][el][hidden=false]'));
        var deleteMessageBox = browser.getText('//*[@id="' + ExtLocator.getId('messagebox') + '"]//span[.="Confirm delete"]');
        deleteMessageBox.should.equal('Confirm delete');
        console.log('Tab is ' + deleteMessageBox);
        browser.click('//*[@id="' + ExtLocator.getId('messagebox') + '"]//span[.="Yes"]');
        browser.pause(1000);
    });
    it("Checking folder deleting", function () {
        var checkFolderForDelete = browser.isExisting('//*[@id="' + ExtLocator.getId('ubleftpanel') + '"]//tr[.="'+folderCaption+'"]');
        checkFolderForDelete.should.equal(false);
    });
});
