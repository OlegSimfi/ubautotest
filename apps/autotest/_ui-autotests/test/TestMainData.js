require('chai').should();
var fs = require('fs');

var ExtLocator = require("./ExtJSlocatorHelper.js");
var newCode = 'Код777';
var engLoc = 'Caption Test ENG';
var uaLoc = 'Caption Test UA';
var complexCaption = "Test complexCaption";
var nonNullDict_ID = "caption 70";
var codeNewNonNullDict_ID = 'code 80';
var captionEngCodeNewNonNullDict_ID = 'caption 80 ENG';
var captionUkrCodeNewNonNullDict_ID = 'caption 80 UKR';
var filterValueNewNonNullDict_ID = '25';
var captionEngCodeNewNonNullDictID_Edit = 'caption 80 Edited';
var nonNullDictIdElementFromDictionary = 'caption 10';
var nullDict_ID = "caption 50";
var codeNewNullDict_ID = 'caption 90';
var captionEngCodeNewNullDict_ID = 'caption 90 ENG';
var captionUkrCodeNewNullDict_ID = 'caption 90 UKR';
var filterValueNewNullDict_ID = '35';
var captionEngCodeNullDictID_Edit = 'caption 90 Edited';
var nullDictIdElementFromDictionary = 'caption 40';
var enumValue = 'Long enumeration caption for test must be last in order';
var testManyData = 'caption 70';
var test2dManyData = 'caption 70';
var bigInt16 = '1234567899999999';
var bigIntRounding = '12345678999999999';
var valueOfBigIntRoundingfromField;



//Data for "Add item to grid" test
var codeForNew = 'Код99';
var captionForNew = 'Заголовок 99';
var complexCaptionForNew = 'Test complexCaption 99';
var bigInt = '7777777777777777777777777';
var parent1 = 'Заголовок 101';
var parent2 = 'Заголовок 104';
var testManyDataForNew = 'caption 10';
var test2dManyDataForNew = 'caption 50';
var mappedToSelf = 'admin';
var valueOfDateTimeField;
var valueOfBigInt;

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
        browser.pause(3000);
    });
});

describe("Open 'Test main data'", function () {
    it("Open 'Test main data' on top menu", function () {
        browser.click(ExtLocator.getCss('button[text=Test][ui=default-toolbar-small]'));
        browser.click(ExtLocator.getCss('menuitem[text=tst_maindata]'));
        browser.pause(3000);
    });
    it("Check displayed columns", function () {
        var tab = browser.getText(ExtLocator.getCss('tab[tooltip=ub test main data]'));
        tab.should.equal('UB TEST MAIN DATA');
        console.log('Tab is ' + tab);
        var tabCode = browser.isExisting('.x-column-header-text=Code');
        tabCode.should.equal(true);
        var tabCaption = browser.isExisting('.x-column-header-text=Caption');
        tabCaption.should.equal(true);
        var tabComplexCaption = browser.isExisting('.x-column-header-text=complexCaption');
        tabComplexCaption.should.equal(true);
        var tabNonNullDictID = browser.isExisting('.x-column-header-text=nonNullDict_ID');
        tabNonNullDictID.should.equal(true);
        var tabEnumValue = browser.isExisting('.x-column-header-text=enumValue');
        tabEnumValue.should.equal(true);
        var DateTimeValue = browser.isExisting('.x-column-header-text=dateTimeValue');
        DateTimeValue.should.equal(true);
        var tabBooleanValue = browser.isExisting('.x-column-header-text=booleanValue');
        tabBooleanValue.should.equal(true);
        var tabTestManyData = browser.isExisting('.x-column-header-text=test many data');
        tabTestManyData.should.equal(true);
        var tabBigInt = browser.isExisting('.x-column-header-text=BigInt');
        tabBigInt.should.equal(true);
        browser.pause(3000);
    })
});

describe("Open item in Test Main data", function () {
    it("Select item in grid and open tab with edit form of item ", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Заголовок 100"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Check opened item in Test Main data", function () {
        var code = browser.isExisting('//*[@id="' + ExtLocator.getId('ubtextfield[attributeName=code]') + '"]');
        code.should.equal(true);
        var caption = browser.isExisting('//*[@id="' + ExtLocator.getId('ubtextfield[attributeName=caption]') + '"]');
        caption.should.equal(true);
        var complexCaption = browser.isExisting('//*[@id="' + ExtLocator.getId('ubtextfield[attributeName=complexCaption]') + '"]');
        complexCaption.should.equal(true);
        var nonNullDictID =browser.isExisting('//*[@id="' + ExtLocator.getId('ubcombobox[attributeName=nonNullDict_ID]') + '"]');
        nonNullDictID.should.equal(true);
        var nullDictID =browser.isExisting('//*[@id="' + ExtLocator.getId('ubcombobox[attributeName=nullDict_ID]') + '"]');
        nullDictID.should.equal(true);
        var parent =browser.isExisting('//*[@id="' + ExtLocator.getId('ubcombobox[attributeName=parent]') + '"]');
        parent.should.equal(true);
        var parent1 =browser.isExisting('//*[@id="' + ExtLocator.getId('ubcombobox[attributeName=parent1]') + '"]');
        parent.should.equal(true);
        var parent1 =browser.isExisting('//*[@id="' + ExtLocator.getId('ubcombobox[attributeName=parent1]') + '"]');
        parent.should.equal(true);
        var enumValue =browser.isExisting('//*[@id="' + ExtLocator.getId('ubbasebox[attributeName=enumValue]') + '"]');
        enumValue.should.equal(true);
        var dateTimeValue =browser.isExisting('//*[@id="' + ExtLocator.getId('ubdatetimefield[attributeName=dateTimeValue]') + '"]');
        dateTimeValue.should.equal(true);
        var booleanValue =browser.isExisting('//*[@id="' + ExtLocator.getId('checkboxfield[attributeName=booleanValue]') + '"]');
        booleanValue.should.equal(true);
        var testManyData =browser.isExisting('//*[@id="' + ExtLocator.getId('ubboxselect[attributeName=manyValue]') + '"]');
        testManyData.should.equal(true);
        var caption10IntestManyData =browser.isExisting('//*[@id="' + ExtLocator.getId('ubboxselect[attributeName=manyValue]') + '"]//div[.="caption 10"]');
        caption10IntestManyData.should.equal(true);
        var caption20IntestManyData =browser.isExisting('//*[@id="' + ExtLocator.getId('ubboxselect[attributeName=manyValue]') + '"]//div[.="caption 20"]');
        caption20IntestManyData.should.equal(true);
        var test2dManyData =browser.isExisting('//*[@id="' + ExtLocator.getId('ubboxselect[attributeName=manyValue2]') + '"]');
        test2dManyData.should.equal(true);
        var bigint =browser.isExisting('//*[@id="' + ExtLocator.getId('numberfield[attributeName=bigintValue]') + '"]');
        bigint.should.equal(true);
        var mappedToSelf =browser.isExisting('//*[@id="' + ExtLocator.getId('ubcombobox[attributeName=mappedToSelf]') + '"]');
        mappedToSelf.should.equal(true);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(3000);
    });
});

describe("Edit 'Code'", function () {
    it("Select item for editing 'Code' in grid and open tab with edit form of item", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код2"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Get content of the 'Code' text field before editing", function () {
        var textInTextAreaBeforeEditing = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl');
        textInTextAreaBeforeEditing.should.equal('Код2');
    });
    it("Edit 'Code' text field", function () {
        browser.setValue((ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl'),newCode);
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check edited item and 'Code' text field", function () {
        var textInCode = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+newCode+'"]');
        textInCode.should.equal(newCode);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+newCode+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(3000);
        var textInTextAreaAfterEditing = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl');
        textInTextAreaAfterEditing.should.equal(newCode);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("Edit 'Caption' localization", function () {
    it("Select item for editing 'Caption' localization in grid and open tab with edit form of item", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код3"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Edit 'Caption' localization text field", function () {
        browser.setValue((ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl'),engLoc);
        var GlobeButton = '//div[@data-qtip="Values for other languages"]';
        browser.click(GlobeButton);
        browser.pause(1000);
        browser.setValue((ExtLocator.getCss('ubtextfield[fieldLabel=Ukrainian]') + '-inputEl'),uaLoc);
        browser.click(ExtLocator.getCss('button[text=Change]'));
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(1000);
    });
    it("Check edited item and 'Caption' localization text field after editing ENG", function () {
        var textInCaptionEng = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+engLoc+'"]');
        textInCaptionEng.should.equal(engLoc);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+engLoc+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textInCaptionAfterEditing = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl');
        textInCaptionAfterEditing.should.equal(engLoc);
        browser.click(ExtLocator.getCss("tab[text=ub test main data]") + '-closeEl');
    });
    it("Change the interface language English to Ukrainian", function () {
        var UBMenuUA = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Menu"]');
        UBMenuUA.should.equal('Menu');
        browser.click(ExtLocator.getCss('ubtoolbaruser'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Change language]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Ukrainian]'));
        browser.waitForExist(ExtLocator.getCss('button[text=Yes]'));
        browser.click(ExtLocator.getCss('button[text=Yes]'));
        browser.pause(1000);
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Автотест UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Користувач]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        browser.pause(3000);
        var UBMenuEn = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Меню"]');
        UBMenuEn.should.equal('Меню');
    });
    it("Check edited item and 'Caption' localization text field after editing UA", function () {
        browser.click(ExtLocator.getCss('button[text=Test][ui=default-toolbar-small]'));
        browser.click(ExtLocator.getCss('menuitem[text=tst_maindata]'));
        browser.pause(1000);
        var textInCaptionUa = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+uaLoc+'"]');
        textInCaptionUa.should.equal(uaLoc);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+uaLoc+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textInCaptionAfterEditing = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl');
        textInCaptionAfterEditing.should.equal(uaLoc);
        browser.click(ExtLocator.getCss("tab[text=ub test main data]") + '-closeEl');
    });
    it("Change the interface language Ukrainian to English", function () {
        var UBMenuUA = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Меню"]');
        UBMenuUA.should.equal('Меню');
        browser.click(ExtLocator.getCss('ubtoolbaruser'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Змінити мову]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Англійська]'));
        browser.waitForExist(ExtLocator.getCss('button[text=Так]'));
        browser.click(ExtLocator.getCss('button[text=Так]'));
        browser.pause(1000);
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Autotest UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Login]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        browser.pause(3000);
        var UBMenuEn = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Menu"]');
        UBMenuEn.should.equal('Menu');
        browser.pause(1000);
    });
    it("Recheck edited item and 'Caption' localization text field after editing ENG", function () {
        browser.click(ExtLocator.getCss('button[text=Test][ui=default-toolbar-small]'));
        browser.click(ExtLocator.getCss('menuitem[text=tst_maindata]'));
        browser.pause(1000);
        var textInCaptionEng = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+engLoc+'"]');
        textInCaptionEng.should.equal(engLoc);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+engLoc+'"]';
        browser.doubleClick(editedItemInGrid);
        var textInCaptionAfterEditing = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl');
        textInCaptionAfterEditing.should.equal(engLoc);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("Edit 'complexCaption'", function () {
    it("Select item for editing 'Code' in grid and open tab with edit form of item", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код4"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Edit 'complexCaption' text field", function () {
        browser.setValue((ExtLocator.getCss('ubtextfield[attributeName=complexCaption]') + '-inputEl'),complexCaption);
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check edited item and 'complexCaption' text field", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var textInComplexCaption = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+complexCaption+'"]');
        textInComplexCaption.should.equal(complexCaption);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+complexCaption+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(3000);
        var textInCaptionAfterEditing = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=complexCaption]') + '-inputEl');
        textInCaptionAfterEditing.should.equal(complexCaption);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("Select 'nonNullDict_ID' from list", function () {
    it("Select item from list for Select 'nonNullDict_ID'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Get content of the 'nonNullDict_ID' text field before editing", function () {
        var textInnonNullDictID = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        textInnonNullDictID.should.equal('caption 30');
    });
    it("Select element of 'NonNullDict_ID' from drop-down list", function () {
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//li[.="'+nonNullDict_ID+'"]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check selected item in 'nonNullDict_ID' text field", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var textInNonNullDictId = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+nonNullDict_ID+'"]');
        textInNonNullDictId.should.equal(nonNullDict_ID);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+nonNullDict_ID+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textInNonNullDictIdAfterEditing = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        textInNonNullDictIdAfterEditing.should.equal(nonNullDict_ID);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("'nonNullDict_ID' empty area", function () {
    it("Select item from list for empty 'nonNullDict_ID' ", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Clear 'nonNullDict_ID' text field", function () {
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]'));
        browser.click(ExtLocator.getCss("menuitem[el][text=Clear selection (Ctrl+BackSpace)]"));
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
    });
    it("Displaying the Error message", function () {
        var errorMessage =browser.isExisting(ExtLocator.getCss('uxNotification'));
        errorMessage.should.equal(true);
        browser.pause(10000); //Wait for the disappearance of the Error message
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
        browser.click(ExtLocator.getCss("button[text=Don't Save]"));
    });
});

describe("Add 'nonNullDict_ID' element", function () {
    it("Select item from list for add 'nonNullDict_ID'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Add new element", function () {
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[el][text=Add new element]'));
        browser.pause(3000);
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=code][entityName=tst_dictionary]') + '-inputEl',codeNewNonNullDict_ID);
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=caption][entityName=tst_dictionary]') + '-inputEl',captionEngCodeNewNonNullDict_ID);
        browser.click('//*[@id="' + ExtLocator.getId('ubtextfield[attributeName=caption][entityName=tst_dictionary]') + '"]//div[@data-qtip="Values for other languages"]');
        browser.setValue((ExtLocator.getCss('ubtextfield[fieldLabel=Ukrainian]') + '-inputEl'),captionUkrCodeNewNonNullDict_ID);
        browser.click(ExtLocator.getCss('button[text=Change]'));
        browser.setValue((ExtLocator.getCss('numberfield[attributeName=filterValue]') + '-inputEl'),filterValueNewNonNullDict_ID);
        browser.click('//*[@id="' + ExtLocator.getId('basepanel[entityName=tst_dictionary]') + '"]//a[@data-qtip="Save and close (Ctrl+Enter)"]');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(3000);
    });
    it("Check added 'nonNullDict_ID' element ENG", function () {
        var textEngInNonNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNonNullDict_ID+'"]');
        textEngInNonNullDict_ID.should.equal(captionEngCodeNewNonNullDict_ID);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNonNullDict_ID+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textEngInCaption = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        textEngInCaption.should.equal(captionEngCodeNewNonNullDict_ID);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
    it("Change the interface language English to Ukrainian", function () {
        var UBMenuUA = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Menu"]');
        UBMenuUA.should.equal('Menu');
        browser.click(ExtLocator.getCss('ubtoolbaruser'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Change language]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Ukrainian]'));
        browser.waitForExist(ExtLocator.getCss('button[text=Yes]'));
        browser.click(ExtLocator.getCss('button[text=Yes]'));
        browser.pause(1000);
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Автотест UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Користувач]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        browser.pause(3000);
        var UBMenuEn = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Меню"]');
        UBMenuEn.should.equal('Меню');
        browser.pause(3000);
    });
    it("Check added 'nonNullDict_ID' element UKR", function () {
        browser.click(ExtLocator.getCss('button[text=Test][ui=default-toolbar-small]'));
        browser.click(ExtLocator.getCss('menuitem[text=tst_maindata]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[tooltip=Оновити (Ctrl+R)]'));
        browser.pause(3000);
        var textUkrInNonNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionUkrCodeNewNonNullDict_ID+'"]');
        textUkrInNonNullDict_ID.should.equal(captionUkrCodeNewNonNullDict_ID);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionUkrCodeNewNonNullDict_ID+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textUKRInNonNullDictID_EditForm = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        textUKRInNonNullDictID_EditForm.should.equal(captionUkrCodeNewNonNullDict_ID);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
    it("Change the interface language Ukrainian to English", function () {
        var UBMenuUA = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Меню"]');
        UBMenuUA.should.equal('Меню');
        browser.click(ExtLocator.getCss('ubtoolbaruser'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Змінити мову]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Англійська]'));
        browser.waitForExist(ExtLocator.getCss('button[text=Так]'));
        browser.click(ExtLocator.getCss('button[text=Так]'));
        browser.pause(1000);
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Autotest UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Login]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        browser.pause(3000);
        var UBMenuEn = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Menu"]');
        UBMenuEn.should.equal('Menu');
        browser.pause(3000);
    });
    it("Recheck added 'nonNullDict_ID' element ENG", function () {
        browser.click(ExtLocator.getCss('button[text=Test][ui=default-toolbar-small]'));
        browser.click(ExtLocator.getCss('menuitem[text=tst_maindata]'));
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(3000);
        var textEngInNonNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNonNullDict_ID+'"]');
        textEngInNonNullDict_ID.should.equal(captionEngCodeNewNonNullDict_ID);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNonNullDict_ID+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textEngInNonNullDictID_EditForm = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        textEngInNonNullDictID_EditForm.should.equal(captionEngCodeNewNonNullDict_ID);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("Edit 'nonNullDict_ID' element", function () {
    it("Select item from list for edit 'nonNullDict_ID element'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Edit Selected Element", function () {
        var textEngInNonNullDict_ID = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        textEngInNonNullDict_ID.should.equal(captionEngCodeNewNonNullDict_ID);
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]'));
        browser.click(ExtLocator.getCss("menuitem[el][text=Edit selected element (Ctrl+E)]"));
        browser.pause(1000);
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=caption][entityName=tst_dictionary]') + '-inputEl',captionEngCodeNewNonNullDictID_Edit);
        browser.click('//*[@id="' + ExtLocator.getId('basepanel[entityName=tst_dictionary]') + '"]//a[@data-qtip="Save and close (Ctrl+Enter)"]');
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(3000);
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(3000);
    });
    it("Check edited 'nonNullDict_ID' element", function () {
        var editedCaptionEngInNonNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNonNullDictID_Edit+'"]');
        editedCaptionEngInNonNullDict_ID.should.equal(captionEngCodeNewNonNullDictID_Edit);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNonNullDictID_Edit+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var editedCaptionInInNonNullDictId_editForm = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        editedCaptionInInNonNullDictId_editForm.should.equal(captionEngCodeNewNonNullDictID_Edit);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("Select from dictionary 'nonNullDict_ID' element ", function () {
    it("Select item from list for select from dictionary 'nonNullDict_ID'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Select 'nonNullDict_ID' element from dictionary", function () {
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]'));
        browser.click(ExtLocator.getCss("menuitem[el][text=Select from dictionary (F9)]"));
        browser.pause(1000);
        browser.click('//*[@id="' + ExtLocator.getId('entitygridpanel[entityName=tst_dictionary]') + '"]//div[.="'+nonNullDictIdElementFromDictionary+'"]');
        browser.click(ExtLocator.getCss("button[actionId=itemSelect]"));
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
    });
    it("Check selected 'nonNullDict_ID' element from dictionary", function () {
        var selectedNonNullDictIdElementFromDictionary = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[3]');
        selectedNonNullDictIdElementFromDictionary.should.equal(nonNullDictIdElementFromDictionary);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+nonNullDictIdElementFromDictionary+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(3000);
        var selectedNonNullDictIdElementFromDictionary_EditForm = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        selectedNonNullDictIdElementFromDictionary_EditForm.should.equal(nonNullDictIdElementFromDictionary);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
    });
});

describe("Delete element 'nonNullDict_ID' from list", function () {
    it("Select item from list for deleting 'NonNullDict_ID' element", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Deleting 'NonNullDict_ID' from drop-down list", function () {
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//li[.="'+captionEngCodeNewNonNullDictID_Edit+'"]');
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]'));
        browser.click(ExtLocator.getCss("menuitem[el][text=Edit selected element (Ctrl+E)]"));
        browser.pause(1000);
        browser.click('//*[@id="' + ExtLocator.getId('basepanel[entityName=tst_dictionary]') + '"]//a[@data-qtip="Delete (Ctrl+DELETE)"]');
        browser.pause(1000);
        var confirmDeleteHeader = browser.getText(ExtLocator.getCss('messagebox[title=Confirm delete]') + '_header_hd-textEl');
        confirmDeleteHeader.should.equal('Confirm delete');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[text=Yes]'));
        browser.pause(3000);
        browser.click(ExtLocator.getCss('panel[hidden=false][entityName=tst_maindata] button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var messageText = browser.getText(ExtLocator.getCss('messagebox') + '-displayfield-inputEl');
        messageText.should.equal('Form was changed. Are you sure want to refresh and discard changes?');
        browser.click(ExtLocator.getCss('button[text=Yes]'));
        browser.pause(3000);
    });
    it("Check deleting 'NonNullDict_ID' from drop-down list", function () {
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl','caption');
        browser.pause(3000);
        var deletedNonNullDictIDElement = browser.isExisting('//li[.="'+captionEngCodeNewNonNullDictID_Edit+'"]');
        deletedNonNullDictIDElement.should.equal(false);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
        var messageText = browser.getText(ExtLocator.getCss('messagebox') + '-displayfield-inputEl');
        messageText.should.equal('Do you want to save changes?');
        browser.click(ExtLocator.getCss("button[text=Don't Save]"));
        browser.pause(3000);
    });
});

describe("Select 'nullDict_ID ' from list", function () {
    it("Select item from list for Select 'nullDict_ID'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Get content of the 'nonNullDict_ID' text field before editing", function () {
        var textInnonNullDictID = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        textInnonNullDictID.should.equal('caption 30');
    });
    it("Select element of 'nullDict_ID' from drop-down list", function () {
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//li[.="'+nullDict_ID+'"]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check selected item in 'nullDict_ID' text field", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var textInNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[4]');
        textInNullDict_ID.should.equal(nullDict_ID);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textInNullDictIdAfterEditing = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        textInNullDictIdAfterEditing.should.equal(nullDict_ID);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("'nullDict_ID' empty area", function () {
    it("Select item from list for empty 'nullDict_ID'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Clear selection 'nullDict_ID' text field", function () {
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]'));
        browser.click(ExtLocator.getCss("menuitem[el][text=Clear selection (Ctrl+BackSpace)]"));
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check cleared selection 'nullDict_ID' text field", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var textInNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[4]');
        textInNullDict_ID.should.equal(String.fromCharCode(32));
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textInNullDictIdAfterEditing = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        textInNullDictIdAfterEditing.should.equal('');
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
    });
});

describe("Add 'nullDict_ID' element", function () {
    it("Select item from list for add 'nullDict_ID'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Add new element", function () {
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[el][text=Add new element]'));
        browser.pause(1000);
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=code][entityName=tst_dictionary]') + '-inputEl',codeNewNullDict_ID);
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=caption][entityName=tst_dictionary]') + '-inputEl',captionEngCodeNewNullDict_ID);
        browser.click('//*[@id="' + ExtLocator.getId('ubtextfield[attributeName=caption][entityName=tst_dictionary]') + '"]//div[@data-qtip="Values for other languages"]');
        browser.setValue((ExtLocator.getCss('ubtextfield[fieldLabel=Ukrainian]') + '-inputEl'),captionUkrCodeNewNullDict_ID);
        browser.click(ExtLocator.getCss('button[text=Change]'));
        browser.setValue((ExtLocator.getCss('numberfield[attributeName=filterValue]') + '-inputEl'),filterValueNewNullDict_ID);
        browser.click('//*[@id="' + ExtLocator.getId('basepanel[entityName=tst_dictionary]') + '"]//a[@data-qtip="Save and close (Ctrl+Enter)"]');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(3000);
    });
    it("Check added 'nullDict_ID' element ENG", function () {
        var textEngInNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNullDict_ID+'"]');
        textEngInNullDict_ID.should.equal(captionEngCodeNewNullDict_ID);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNullDict_ID+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textEngInCaption = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        textEngInCaption.should.equal(captionEngCodeNewNullDict_ID);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
    it("Change the interface language English to Ukrainian", function () {
        var UBMenuUA = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Menu"]');
        UBMenuUA.should.equal('Menu');
        browser.click(ExtLocator.getCss('ubtoolbaruser'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Change language]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Ukrainian]'));
        browser.waitForExist(ExtLocator.getCss('button[text=Yes]'));
        browser.click(ExtLocator.getCss('button[text=Yes]'));
        browser.pause(1000);
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Автотест UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Користувач]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        browser.pause(3000);
        var UBMenuEn = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Меню"]');
        UBMenuEn.should.equal('Меню');
        browser.pause(3000);
    });
    it("Check added 'nullDict_ID' element UKR", function () {
        browser.click(ExtLocator.getCss('button[text=Test][ui=default-toolbar-small]'));
        browser.click(ExtLocator.getCss('menuitem[text=tst_maindata]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[tooltip=Оновити (Ctrl+R)]'));
        browser.pause(3000);
        var textUkrInNonNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionUkrCodeNewNullDict_ID+'"]');
        textUkrInNonNullDict_ID.should.equal(captionUkrCodeNewNullDict_ID);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionUkrCodeNewNullDict_ID+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(3000);
        var textUKRInNonNullDictID_EditForm = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        textUKRInNonNullDictID_EditForm.should.equal(captionUkrCodeNewNullDict_ID);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
    it("Change the interface language Ukrainian to English", function () {
        var UBMenuUA = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Меню"]');
        UBMenuUA.should.equal('Меню');
        browser.click(ExtLocator.getCss('ubtoolbaruser'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Змінити мову]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Англійська]'));
        browser.waitForExist(ExtLocator.getCss('button[text=Так]'));
        browser.click(ExtLocator.getCss('button[text=Так]'));
        browser.pause(1000);
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Autotest UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Login]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        browser.pause(3000);
        var UBMenuEn = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Menu"]');
        UBMenuEn.should.equal('Menu');
        browser.pause(3000);
    });
    it("Recheck added 'nullDict_ID' element ENG", function () {
        browser.click(ExtLocator.getCss('button[text=Test][ui=default-toolbar-small]'));
        browser.click(ExtLocator.getCss('menuitem[text=tst_maindata]'));
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(3000);
        var textEngInNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNullDict_ID+'"]');
        textEngInNullDict_ID.should.equal(captionEngCodeNewNullDict_ID);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+captionEngCodeNewNullDict_ID+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textEngInNullDictID_EditForm = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        textEngInNullDictID_EditForm.should.equal(captionEngCodeNewNullDict_ID);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("Edit 'nullDict_ID' element", function () {
    it("Select item from list for edit 'nullDict_ID element'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Edit Selected Element", function () {
        var textEngInNullDict_ID = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        textEngInNullDict_ID.should.equal(captionEngCodeNewNullDict_ID);
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]'));
        browser.click(ExtLocator.getCss("menuitem[el][text=Edit selected element (Ctrl+E)]"));
        browser.pause(1000);
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=caption][entityName=tst_dictionary]') + '-inputEl',captionEngCodeNullDictID_Edit);
        browser.click('//*[@id="' + ExtLocator.getId('basepanel[entityName=tst_dictionary]') + '"]//a[@data-qtip="Save and close (Ctrl+Enter)"]');
        browser.pause(1000);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(3000);
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(3000);
    });
    it("Check edited 'nullDict_ID' element", function () {
        var editedCaptionEngInNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[4]');
        editedCaptionEngInNullDict_ID.should.equal(captionEngCodeNullDictID_Edit);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var editedCaptionInInNullDictId_editForm = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        editedCaptionInInNullDictId_editForm.should.equal(captionEngCodeNullDictID_Edit);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("Select from dictionary 'nullDict_ID' element", function () {
    it("Select item from list for select from dictionary 'nullDict_ID'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Select 'nullDict_ID' element from dictionary", function () {
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]'));
        browser.click(ExtLocator.getCss("menuitem[el][text=Select from dictionary (F9)]"));
        browser.pause(1000);
        browser.click('//*[@id="' + ExtLocator.getId('entitygridpanel[entityName=tst_dictionary]') + '"]//div[.="'+nullDictIdElementFromDictionary+'"]');
        browser.click(ExtLocator.getCss("button[actionId=itemSelect]"));
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
    });
    it("Check selected 'nullDict_ID' element from dictionary", function () {
        var selectedNullDictIdElementFromDictionary = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[4]');
        selectedNullDictIdElementFromDictionary.should.equal(nullDictIdElementFromDictionary);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+nullDictIdElementFromDictionary+'"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var selectedNullDictIdElementFromDictionary_EditForm = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        selectedNullDictIdElementFromDictionary_EditForm.should.equal(nullDictIdElementFromDictionary);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
    });
});

describe("Delete element 'nullDict_ID' from list", function () {
    it("Select item from list for deleting 'nullDict_ID' element", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Deleting 'nullDict_ID' from drop-down list", function () {
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//li[.="'+captionEngCodeNullDictID_Edit+'"]');
        browser.rightClick(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]'));
        browser.click(ExtLocator.getCss("menuitem[el][text=Edit selected element (Ctrl+E)]"));
        browser.pause(1000);
        browser.click('//*[@id="' + ExtLocator.getId('basepanel[entityName=tst_dictionary]') + '"]//a[@data-qtip="Delete (Ctrl+DELETE)"]');
        browser.pause(1000);
        var confirmDeleteHeader = browser.getText(ExtLocator.getCss('messagebox[title=Confirm delete]') + '_header_hd-textEl');
        confirmDeleteHeader.should.equal('Confirm delete');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[text=Yes]'));
        browser.pause(3000);
        browser.click(ExtLocator.getCss('panel[hidden=false][entityName=tst_maindata] button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var messageText = browser.getText(ExtLocator.getCss('messagebox') + '-displayfield-inputEl');
        messageText.should.equal('Form was changed. Are you sure want to refresh and discard changes?');
        browser.click(ExtLocator.getCss('button[text=Yes]'));
        browser.pause(3000);
    });
    it("Check deleting 'nullDict_ID' from drop-down list", function () {
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl','caption');
        browser.pause(3000);
        var deletedNullDictIDElement = browser.isExisting('//li[.="'+captionEngCodeNullDictID_Edit+'"]');
        deletedNullDictIDElement.should.equal(false);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
        var messageText = browser.getText(ExtLocator.getCss('messagebox') + '-displayfield-inputEl');
        messageText.should.equal('Do you want to save changes?');
        browser.click(ExtLocator.getCss("button[text=Don't Save]"));
        browser.pause(3000);
    });
});

describe("Select 'enumValue'", function () {
    it("Select item from list for select 'nullDict_ID'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Select element of 'enumValue' from drop-down list", function () {
        var valueInEnumValue = browser.getValue(ExtLocator.getCss('ubbasebox[attributeName=enumValue]') + '-inputEl');
        valueInEnumValue.should.equal('Test1');
        browser.click(ExtLocator.getCss('ubbasebox[attributeName=enumValue]') + '-inputEl');
        browser.pause(3000);
        browser.click('//li[.="'+enumValue+'"]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check selected item in 'enumValue'", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var textEnumValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[7]');
        textEnumValue.should.equal(enumValue);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var textEnumValue_EditForm = browser.getValue(ExtLocator.getCss('ubbasebox[attributeName=enumValue]') + '-inputEl');
        textEnumValue_EditForm.should.equal(enumValue);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
    });
});

describe("Add 'test many data'", function () {
    it("Select item from list for Add 'test many data'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Add 'test many data' element", function () {
        browser.setValue(ExtLocator.getCss('ubboxselect[attributeName="manyValue"]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//li[.="'+testManyData+'"]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check added element in 'test many data'", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var textEnumValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[10]');
        textEnumValue.should.equal('2,4,7');
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var addedElementTestManyData_EditForm = browser.isExisting('//div[.="'+testManyData+'"]');
        addedElementTestManyData_EditForm.should.equal(true);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
    });
});

describe("Delete 'test many data'", function () {
    it("Select item from list for delete 'test many data'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Delete element from 'test many data'", function () {
        browser.click ('//li[@qtip="caption"]//div[.="'+testManyData+'"]/following-sibling::div[contains(@class,"x-tab-close-btn")]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check deleted element in 'test many data'", function () {
        var valueManyData = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[10]');
        valueManyData.should.equal('2,4');
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var addedElementTestManyData_EditForm = browser.isExisting('//div[.="'+testManyData+'"]');
        addedElementTestManyData_EditForm.should.equal(false);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(3000);
    });
});

describe("Add 'test 2d many data'", function () {
    it("Select item from list for Add 'test 2d many data'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Add 'test 2d many data' element", function () {
        browser.setValue(ExtLocator.getCss('ubboxselect[attributeName="manyValue2"]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//li[.="'+test2dManyData+'"]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check added element in 'test 2d many data'", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var textEnumValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[11]');
        textEnumValue.should.equal('7');
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var addedElementTestManyData_EditForm = browser.isExisting('//div[.="'+test2dManyData+'"]');
        addedElementTestManyData_EditForm.should.equal(true);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
    });
});

describe("Delete 'test 2d many data'", function () {
    it("Select item from list for delete 'test 2d many data'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Delete element from 'test 2d many data'", function () {
        browser.click ('//li[@qtip="caption"]//div[.="'+test2dManyData+'"]/following-sibling::div[contains(@class,"x-tab-close-btn")]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check deleted element in 'test 2d many data'", function () {
        var valueManyData = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[11]');
        valueManyData.should.equal(String.fromCharCode(32));
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var addedElementTestManyData_EditForm = browser.isExisting('//div[.="'+test2dManyData+'"]');
        addedElementTestManyData_EditForm.should.equal(false);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(3000);
    });
});

describe("booleanValue", function () {
    it("Select item from list for activate 'booleanValue'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Activate 'booleanValue' checkbox", function () {
        var deactivatedBooleanValue = browser.isExisting(ExtLocator.getCss('checkboxfield[attributeName=booleanValue][checked=false]'));
        deactivatedBooleanValue.should.equal(true);
        browser.click('//*[@id="' + ExtLocator.getId('checkboxfield[attributeName=booleanValue]') + '"]//input[@role="checkbox"]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check activated 'booleanValue' checkbox", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var valueBooleanValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[9]');
        valueBooleanValue.should.equal('Yes');
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var activatedBooleanValue = browser.isExisting(ExtLocator.getCss('checkboxfield[attributeName=booleanValue][checked=true]'));
        activatedBooleanValue.should.equal(true);
    });
    it("deactivate 'booleanValue' checkbox", function () {
        browser.click('//*[@id="' + ExtLocator.getId('checkboxfield[attributeName=booleanValue]') + '"]//input[@role="checkbox"]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check deactivated 'booleanValue' checkbox", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var valueBooleanValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[9]');
        valueBooleanValue.should.equal('No');
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var deactivatedBooleanValue = browser.isExisting(ExtLocator.getCss('checkboxfield[attributeName=booleanValue][checked=false]'));
        deactivatedBooleanValue.should.equal(true);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(3000);
    });
});

describe("Set dateTimeValue by date picker, ENG language", function () {
    it("Select item from testMainData list", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Click date picker", function () {
        browser.click('//*[@id="' + ExtLocator.getId('ubdatetimefield[attributeName=dateTimeValue]') + '"]//td/div[contains(@class,"x-form-date-trigger")]');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('splitbutton[tooltip*=Choose month]'));
        browser.pause(1000);
        browser.click('//*[@id="' + ExtLocator.getId('monthpicker') + '"]//a[.="Jan"]');
        var yearPresent = false;
        for(var searchYear=0; searchYear<5; searchYear++) {
            yearPresent = browser.isExisting('//*[@id="' + ExtLocator.getId('monthpicker') + '"]//div/a[.="1993"]');
            if(yearPresent) break;
            browser.click('//*[@id="' + ExtLocator.getId('monthpicker') + '-prevEl"]');
            browser.pause(500);
        }
        yearPresent.should.equal(true);
        browser.click('//*[@id="' + ExtLocator.getId('monthpicker') + '"]//div/a[.="1993"]');
        browser.click(ExtLocator.getCss('button[text=&#160;OK&#160;]'));
        browser.pause(1000);
        browser.setValue('//*[@id="' + ExtLocator.getId('padnumberfield:first') + '-inputEl"]', '22');
        browser.setValue('//*[@id="' + ExtLocator.getId('padnumberfield:last') + '-inputEl"]', '58');
        browser.click('//*[@id="' + ExtLocator.getId('datetimepicker') + '"]//td[contains(@class,"x-datepicker-active")]/a[.=31]');
        browser.pause(1000);
        var fieldValue = browser.getAttribute('//*[@id="' + ExtLocator.getId('ubdatetimefield[attributeName=dateTimeValue]') + '-inputEl"]', 'value');
        fieldValue.should.equal('01/31/1993 22:58');
        browser.click(ExtLocator.getCss('button[eventId=save][actionId=saveAndClose]'));
        browser.pause(1000);
    });
    it("Check datetime value in grid column", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var datetimeGridValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[8]');
        datetimeGridValue.should.equal('01/31/1993 22:58');
    });
    it("open item and check saved value", function () {
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var fieldValue = browser.getAttribute('//*[@id="' + ExtLocator.getId('ubdatetimefield[attributeName=dateTimeValue]') + '-inputEl"]', 'value');
        fieldValue.should.equal('01/31/1993 22:58');
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
    });
});

describe("Set dateTimeValue by date picker, UA language", function () {
    it("Change the interface language English to Ukrainian", function () {
        var UBMenuUA = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Menu"]');
        UBMenuUA.should.equal('Menu');
        browser.click(ExtLocator.getCss('ubtoolbaruser'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Change language]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Ukrainian]'));
        browser.waitForExist(ExtLocator.getCss('button[text=Yes]'));
        browser.click(ExtLocator.getCss('button[text=Yes]'));
        browser.pause(1000);
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Автотест UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Користувач]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        browser.pause(3000);
        var UBMenuEn = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Меню"]');
        UBMenuEn.should.equal('Меню');
    });
    it("Open 'Test main data' on top menu", function () {
        browser.click(ExtLocator.getCss('button[text=Test][ui=default-toolbar-small]'));
        browser.click(ExtLocator.getCss('menuitem[text=tst_maindata]'));
        browser.pause(3000);
    });
    it("Select item from testMainData list", function () {
        browser.pause(3000);
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });
    it("Click date picker", function () {
        browser.click('//*[@id="' + ExtLocator.getId('ubdatetimefield[attributeName=dateTimeValue]') + '"]//td/div[contains(@class,"x-form-date-trigger")]');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('splitbutton[tooltip*=Вибір місяця]'));
        browser.pause(1000);
        browser.click('//*[@id="' + ExtLocator.getId('monthpicker') + '"]//a[.="Лют"]');
        var yearPresent = false;
        for(var searchYear=0; searchYear<5; searchYear++) {
            yearPresent = browser.isExisting('//*[@id="' + ExtLocator.getId('monthpicker') + '"]//div/a[.="1994"]');
            if(yearPresent) break;
            browser.click('//*[@id="' + ExtLocator.getId('monthpicker') + '-prevEl"]');
            browser.pause(500);
        }
        yearPresent.should.equal(true);
        browser.click('//*[@id="' + ExtLocator.getId('monthpicker') + '"]//div/a[.="1994"]');
        browser.click(ExtLocator.getCss('button[text=&#160;OK&#160;]'));
        browser.pause(1000);
        browser.setValue('//*[@id="' + ExtLocator.getId('padnumberfield:first') + '-inputEl"]', '21');
        browser.setValue('//*[@id="' + ExtLocator.getId('padnumberfield:last') + '-inputEl"]', '57');
        browser.click('//*[@id="' + ExtLocator.getId('datetimepicker') + '"]//td[contains(@class,"x-datepicker-active")]/a[.=26]');
        browser.pause(1000);
        var fieldValue = browser.getAttribute('//*[@id="' + ExtLocator.getId('ubdatetimefield[attributeName=dateTimeValue]') + '-inputEl"]', 'value');
        fieldValue.should.equal('26.02.1994 21:57');
        browser.click(ExtLocator.getCss('button[eventId=save][actionId=saveAndClose]'));
        browser.pause(1000);
    });
    it("Check datetime value in grid column", function () {
        browser.click(ExtLocator.getCss('button[eventId=refresh][actionId=refresh]'));
        browser.pause(1000);
        var datetimeGridValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[8]');
        datetimeGridValue.should.equal('26.02.1994 21:57');
    });
    it("open item and check saved value", function () {
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var fieldValue = browser.getAttribute('//*[@id="' + ExtLocator.getId('ubdatetimefield[attributeName=dateTimeValue]') + '-inputEl"]', 'value');
        fieldValue.should.equal('26.02.1994 21:57');
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(1000);
    });
    it("Change the interface language Ukrainian to English", function () {
        var UBMenuUA = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Меню"]');
        UBMenuUA.should.equal('Меню');
        browser.click(ExtLocator.getCss('ubtoolbaruser'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Змінити мову]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Англійська]'));
        browser.waitForExist(ExtLocator.getCss('button[text=Так]'));
        browser.click(ExtLocator.getCss('button[text=Так]'));
        browser.pause(1000);
        browser.waitForExist('//h2');
        var title = browser.getText('//h2');
        title.should.equal('Autotest UB SQLITE');
        console.log('Title is: ' + title);
        browser.setValue(ExtLocator.getCss('textfield[requireText=Login]') + '-inputEl', 'admin');
        browser.setValue(ExtLocator.getCss('textfield[inputType=password]') + '-inputEl', 'admin');
        browser.click(ExtLocator.getCss('button[cls=ub-login-btn]'));
        browser.pause(3000);
        var UBMenuEn = browser.getText('//*[@id="' + ExtLocator.getId('ubtoolbarmenubutton') + '"]//label[.="Menu"]');
        UBMenuEn.should.equal('Menu');
        browser.pause(1000);
    });
    it("Open 'Test main data' on top menu", function () {
        browser.click(ExtLocator.getCss('button[text=Test][ui=default-toolbar-small]'));
        browser.click(ExtLocator.getCss('menuitem[text=tst_maindata]'));
        browser.pause(3000);
    });
});

describe("Biglnt (16 digits)", function () {
    it("Select item from list for add 'Biglnt(16 digits)'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });

    it("Add 'Biglnt (16 digits)'", function () {
        browser.setValue((ExtLocator.getCss('numberfield[attributeName=bigintValue]') + '-inputEl'),bigInt16);
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check added value (16 digits) in 'bigInt'", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var textEnumValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[12]');
        textEnumValue.should.equal(bigInt16);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var valueOfBigInt16 = browser.getValue(ExtLocator.getCss('numberfield[attributeName=bigintValue]') + '-inputEl');
        valueOfBigInt16.should.equal(bigInt16);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(3000);
    });
});

describe("Biglnt (Rounding)", function () {
    it("Select item from list for add 'Biglnt(Rounding)'", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="Код9"]';
        browser.doubleClick(itemInGrid);
        browser.pause(1000);
    });

    it("Add 'Biglnt (Rounding)'", function () {
        browser.setValue((ExtLocator.getCss('numberfield[attributeName=bigintValue]') + '-inputEl'),bigIntRounding);
        browser.click(ExtLocator.getCss('ubcombobox[attributeName=mappedToSelf]') + '-inputEl');
        browser.pause(3000);
        valueOfBigIntRoundingfromField = browser.getValue(ExtLocator.getCss('numberfield[attributeName=bigintValue]') + '-inputEl');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check added value (Rounding) in 'bigInt'", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        var textEnumValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]/following-sibling::td[12]');
        textEnumValue.should.equal(valueOfBigIntRoundingfromField);
        var editedItemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Код9"]';
        browser.doubleClick(editedItemInGrid);
        browser.pause(1000);
        var valueInBigIntRoundingfromField = browser.getValue(ExtLocator.getCss('numberfield[attributeName=bigintValue]') + '-inputEl');
        valueInBigIntRoundingfromField.should.equal(valueOfBigIntRoundingfromField);
        browser.pause(1000);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(3000);
    });
});

describe("Add item to grid", function () {
    it("Open UB test main data creating tab", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Add (Ctrl+Ins)]'));
        browser.pause(3000);
        var textTabHeader = browser.getText('//*[@id="' + ExtLocator.getId('header[cls=ub-toolbar-header]') + '"]//span[.="ub test main data (creating)"]');
        textTabHeader.should.equal('ub test main data (creating)');
    });
    it("Add data for new item and save", function () {
        browser.setValue((ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl'),codeForNew);
        browser.setValue((ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl'),captionForNew);
        browser.setValue((ExtLocator.getCss('ubtextareafield[attributeName=complexCaption]') + '-inputEl'),complexCaptionForNew);//
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//li[.="'+nonNullDict_ID+'"]');
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//div[not(contains(@style,"display: none")) and contains(@id,"boundlist-") and contains(@class,"x-boundlist-floating")]//li[.="'+nullDict_ID+'"]');
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=parent]') + '-inputEl','Заголовок');
        browser.pause(3000);
        browser.click('//li[.="'+parent1+'"]');
        browser.setValue(ExtLocator.getCss('ubcombobox[attributeName=parent1]') + '-inputEl','Заголовок');
        browser.pause(3000);
        browser.click('//div[not(contains(@style,"display: none")) and contains(@id,"boundlist-") and contains(@class,"x-boundlist-floating")]//li[.="'+parent2+'"]');
        browser.click(ExtLocator.getCss('ubbasebox[attributeName=enumValue]') + '-inputEl');
        browser.pause(3000);
        browser.click('//li[.="'+enumValue+'"]');
        var deactivatedBooleanValue = browser.isExisting(ExtLocator.getCss('checkboxfield[attributeName=booleanValue][checked=false]'));
        deactivatedBooleanValue.should.equal(true);
        browser.click('//*[@id="' + ExtLocator.getId('checkboxfield[attributeName=booleanValue]') + '"]//input[@role="checkbox"]');
        browser.setValue(ExtLocator.getCss('ubboxselect[attributeName="manyValue"]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//div[not(contains(@style,"display: none")) and contains(@id,"boundlist-") and contains(@class,"x-boundlist-floating")]//li[.="'+testManyDataForNew+'"]');
        browser.click(ExtLocator.getCss('ubtextfield[attributeName=code]')); // to hide boundlist
        browser.setValue(ExtLocator.getCss('ubboxselect[attributeName="manyValue2"]') + '-inputEl','caption');
        browser.pause(3000);
        browser.click('//div[not(contains(@style,"display: none")) and contains(@id,"boundlist-") and contains(@class,"x-boundlist-floating")]//li[.="'+test2dManyDataForNew+'"]');
        browser.click(ExtLocator.getCss('ubtextfield[attributeName=code]')); // to hide boundlist
        browser.setValue((ExtLocator.getCss('numberfield[attributeName=bigintValue]') + '-inputEl'),bigInt);
        browser.pause(1000);
        browser.setValue((ExtLocator.getCss('ubcombobox[attributeName=mappedToSelf]') + '-inputEl'),mappedToSelf);
        browser.pause(3000);
        browser.click('//li[.="'+mappedToSelf+'"]');
        browser.click('//*[@id="' + ExtLocator.getId('ubdatetimefield') + '"]//div[contains(@class,"x-form-date-trigger")]');
        browser.click('//*[@id="' + ExtLocator.getId('datetimepicker') + '"]//td[@title="Now"]');
        browser.pause(1000);
        valueOfDateTimeField = browser.getValue(ExtLocator.getCss('ubdatetimefield') + '-inputEl');
        valueOfBigInt = browser.getValue(ExtLocator.getCss('numberfield[attributeName=bigintValue]') + '-inputEl');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check added item on grid of items", function () {
        var valueInCode = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+codeForNew+'"]');
        valueInCode.should.equal(codeForNew);
        var valueInCaption = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[1]');
        valueInCaption.should.equal(captionForNew);
        var valueInComplexCaption = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[2]');
        valueInComplexCaption.should.equal(complexCaptionForNew);
        var valueInNonNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[3]');
        valueInNonNullDict_ID.should.equal(nonNullDict_ID);
        var valueInNullDict_ID = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[4]');
        valueInNullDict_ID.should.equal(nullDict_ID);
        var valueInParent1 = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[5]');
        valueInParent1.should.equal(parent1);
        var valueInParent2 = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[6]');
        valueInParent2.should.equal(parent2);
        var valueInEnumValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[7]');
        valueInEnumValue.should.equal(enumValue);
        var valueInDateTime = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[8]');
        valueInDateTime.should.equal(valueOfDateTimeField);
        var valueInBooleanValue = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[9]');
        valueInBooleanValue.should.equal("Yes");
        var valueInTestManyData = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[10]');
        valueInTestManyData.should.equal("1");
        var valueInTest2dManyData = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[11]');
        valueInTest2dManyData.should.equal("5");
        var valueInBigInt = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[12]');
        valueInBigInt.should.equal('7.77777777777778e+24');
        // var valueInMappedToSelf = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="'+codeForNew+'"]/following-sibling::td[13]'); // The value is not save in the controll
        // valueInMappedToSelf.should.equal(mappedToSelf);
    });
    it("Check added item on Edit form of items", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+codeForNew+'"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
        var valueInCode = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl');
        valueInCode.should.equal(codeForNew);
        var valueInCaption = browser.getValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl');
        valueInCaption.should.equal(captionForNew);
        var valueInComplexCaption =  browser.getValue(ExtLocator.getCss('ubtextareafield[attributeName=complexCaption]') + '-inputEl');
        valueInComplexCaption.should.equal(complexCaptionForNew);
        var valueInNonNullDict_ID = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nonNullDict_ID]') + '-inputEl');
        valueInNonNullDict_ID.should.equal(nonNullDict_ID);
        var valueInNullDict_ID = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=nullDict_ID]') + '-inputEl');
        valueInNullDict_ID.should.equal(nullDict_ID);
        var valueInParent1 = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=parent]') + '-inputEl');
        valueInParent1.should.equal(parent1);
        var valueInParent2 = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=parent1]') + '-inputEl');
        valueInParent2.should.equal(parent2);
        var valueInEnumValue = browser.getValue(ExtLocator.getCss('ubbasebox[attributeName=enumValue]') + '-inputEl');
        valueInEnumValue.should.equal(enumValue);
        var valueInDateTime = browser.getValue(ExtLocator.getCss('ubdatetimefield') + '-inputEl');
        valueInDateTime.should.equal(valueOfDateTimeField);
        var valueInBooleanValue = browser.isExisting(ExtLocator.getCss('checkboxfield[attributeName=booleanValue][checked=true]'));
        valueInBooleanValue.should.equal(true);
        var valueInBigInt = browser.getValue(ExtLocator.getCss('numberfield[attributeName=bigintValue]') + '-inputEl');
        valueInBigInt.should.equal('7.77777777777778e+24');
        // var valueInMappedToSelf = browser.getValue(ExtLocator.getCss('ubcombobox[attributeName=mappedToSelf]') + '-inputEl'); // The value is not save in the controll
        // valueInMappedToSelf.should.equal(mappedToSelf);
        browser.click(ExtLocator.getCss("tab[text=ub test main data][active=true]") + '-closeEl');
        browser.pause(3000);
    });
});

describe("Delete item from grid", function () {
    it("Select and open Edit form of item for deleting", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+codeForNew+'"]';
        browser.doubleClick(itemInGrid);
        browser.pause(3000);
    });
    it("Deleting item", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Delete (Ctrl+DELETE)]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[text=Yes]'));
        browser.pause(3000);
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(3000);
    });
    it("Check deleting item", function () {
        var itemInGrid = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//div[.="'+codeForNew+'"]';
        var itemPresence = browser.isExisting(itemInGrid);
        itemPresence.should.equal(false);
        browser.pause(1000);
    });
});

describe("Export to HTML", function () {
    it("Download HTML file", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[tooltip=All actions]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Export]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Export to Html]'));
        browser.pause(3000);
    });
    it("Comparison of the downloaded HTML file with the sample", function () {
        var dynamicDataTimeValueFromItem = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="#Код16"]/following-sibling::td[8]'); //Get a dynamic DataTimeValue value from item in the grid
        var sampleHTML = fs.readFileSync(browser.options.mochaOpts.files[0].replace(/\\test.+\.js/i, "\\samples\\sampleHTML.html"), 'utf8');
        var files = fs.readdirSync(browser.options.desiredCapabilities.chromeOptions.prefs['download.default_directory']);
        var fileForThisTest;
        for(index = 0; index < files.length; index++) {
            var currentFile = files[index];
            var offsetOfPrefix = (currentFile.indexOf("ub test main data"));
            var offsetOfExtension = (currentFile.indexOf(".html"));
            if((offsetOfPrefix === 0) && (offsetOfExtension > 0)) {
                fileForThisTest = currentFile;
                break;
            }
        }
        var downloadedHTML = fs.readFileSync(browser.options.desiredCapabilities.chromeOptions.prefs['download.default_directory']+'\\'+fileForThisTest, "utf8");
        var ReplacedCaptionInDownloadedHTML = downloadedHTML.replace(/<caption.+<\/caption>/i, '<caption>ub test main data 0000 00 00  00:00:00</caption>'); // Replace of dynamic caption in downloaded HTML file
        var ReplacedDownloadedHTML = ReplacedCaptionInDownloadedHTML.replace(dynamicDataTimeValueFromItem, '01/01/1970 02:00'); // Replace of dynamic DataTimeValue value in downloaded HTML file
        console.log(ReplacedDownloadedHTML);
        var comparison = sampleHTML===ReplacedDownloadedHTML ;
        comparison.should.equal(true);
        browser.pause(3000);
    });
});

describe("Export to CSV", function () {
    it("Download CSV file", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Refresh (Ctrl+R)]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('button[tooltip=All actions]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Export]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Export to CSV]'));
        browser.pause(3000);
    });
    it("Comparison of the downloaded CSV file with the sample", function () {
        var dynamicDataTimeValueFromItem = browser.getText('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="#Код16"]/following-sibling::td[8]'); //Get a dynamic DataTimeValue value from item in the grid
        var sampleCSV = fs.readFileSync(browser.options.mochaOpts.files[0].replace(/\\test.+\.js/i, "\\samples\\sampleCSV.csv"), 'utf8');
        var files = fs.readdirSync(browser.options.desiredCapabilities.chromeOptions.prefs['download.default_directory']);
        var fileForThisTest;
        for(index = 0; index < files.length; index++) {
            var currentFile = files[index];
            var offsetOfPrefix = (currentFile.indexOf("ub test main data"));
            var offsetOfExtension = (currentFile.indexOf(".csv"));
            if((offsetOfPrefix === 0) && (offsetOfExtension > 0)) {
                fileForThisTest = currentFile;
                break;
            }
        }
        var downloadedCSV = fs.readFileSync(browser.options.desiredCapabilities.chromeOptions.prefs['download.default_directory']+'\\'+fileForThisTest, "utf8");
        var ReplacedDownloadedCSV = downloadedCSV.replace(dynamicDataTimeValueFromItem, '01/01/1970 02:00'); // Replace of dynamic DataTimeValue value in downloaded HTML file
        var comparison = sampleCSV===ReplacedDownloadedCSV;
        comparison.should.equal(true);
        browser.pause(3000);
    });
});
