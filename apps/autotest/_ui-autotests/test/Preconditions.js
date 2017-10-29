require('chai').should()

var ExtLocator = require("./ExtJSlocatorHelper.js");

describe("Preconditions", function () {
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
        browser.pause(9000)
    });
    it("Switch language to Ukrainian", function () {
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

    });

});
