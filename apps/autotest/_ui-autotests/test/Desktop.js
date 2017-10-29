require('chai').should();

var ExtLocator = require("./ExtJSlocatorHelper.js");


//Data for "Preparing data for Move folder and shortcut to Desktop test"
//======Add folder======
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
        browser.pause(3000)

    });
});

describe("Add Desktop", function () {
    it("Open in the top menu: Administrator- UI- Desktops", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Desktops]'));
    });
    it("Open Folder creation window", function () {
        browser.waitForExist(ExtLocator.getCss('button[tooltip=Add (Ctrl+Ins)]') + '-btnEl');
        browser.click(ExtLocator.getCss('button[tooltip=Add (Ctrl+Ins)]') + '-btnEl');
        browser.pause(3000);
    });
    it("Set data for a new Desktop and 'save and close'", function () {
        browser.waitForExist(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl');
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=caption]') + '-inputEl', 'test_desktop_name');
        browser.setValue(ExtLocator.getCss('ubtextfield[attributeName=code]') + '-inputEl', 'test_desktop_code');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(3000);
    });
    it("Check added Desktop in the grid of Desktops", function () {
        var createdDesktopInTab = browser.isExisting('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="test_desktop_name"]');
        createdDesktopInTab.should.equal(true);
    });
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
        browser.pause(3000)
    });
    it("Check added Desktop on the top menu", function () {
        var createdDesktopOnTopMenu = browser.isExisting(ExtLocator.getCss('button[text=test_desktop_name][ui=default-toolbar-small]'));
        createdDesktopOnTopMenu.should.equal(true);
    });
    it("Check added Desktop on the left side bar", function () {
        browser.click(ExtLocator.getCss('button[cls=ub-desktop-button]'));
        var createdDesktopOnLeftSideBar = browser.isExisting(ExtLocator.getCss('menuitem[text=test_desktop_name]'));
        createdDesktopOnLeftSideBar.should.equal(true);
        browser.click(ExtLocator.getCss('button[cls=ub-desktop-button]'));
        browser.pause(3000);

    });
});

describe("Move folder and shortcut to Desktop", function () {
    it("Select existing Desktop with Shortcut in Folder on sidebar menu", function () {
        browser.click(ExtLocator.getCss('button[cls=ub-desktop-button]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Test]'));
        browser.pause(3000);
    });
    it("Select existing Folder with Shortcut and click 'Edit'", function (){
        var folderOnSidebar = '//*[@id="' + ExtLocator.getId('treeview') + '"]//span[.="Folder for moved Shortcuts"]';
        browser.rightClick(folderOnSidebar);
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Edit]'));
        browser.pause(3000);
    });
    it("Сhange Desktop on 'Desktop drop-down menu'", function (){
        var desktopCombobox = '//table[@id="' + ExtLocator.getId('ubcombobox[attributeName=desktopID]') + '"]//div[contains(@class, "x-form-arrow-trigger")]';
        browser.click(desktopCombobox);
        browser.click('//ul[@class="x-list-plain"]//li[contains(.,"Administrator")]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(1000);
    });
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
        browser.pause(3000);
    });
    it("Switch Desktop to which the folder was moved", function () {
        browser.click(ExtLocator.getCss('button[cls=ub-desktop-button]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Administrator]'));
        browser.pause(1000);
    });
    it("Check the Folder move on sidebar", function () {
        var movedFolderOnSidebar = browser.isExisting('//*[@id="' + ExtLocator.getId('treeview') + '"]//span[.="Folder for moved Shortcuts"]');
        movedFolderOnSidebar.should.equal(true);
    });
    it("Check the Folder move on top navbar", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.pause(1000);
        var movedFolderOnTopNavbar = browser.isExisting('//*[@id="' + ExtLocator.getId('menuitem[text=Folder for moved Shortcuts]') + '"]');
        movedFolderOnTopNavbar.should.equal(true);
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.pause(1000);
    });
    it("Open Administrator / UI / Shortcuts", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(3000);
        browser.click(ExtLocator.getCss('menuitem[text=Shortcuts]'));
        browser.pause(1000);
    });
    it("Select Shortcut and open edit tab", function () {
        browser.click(ExtLocator.getCss('button[tooltip=Filter by]') + '-btnEl');
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Shortcut caption]'));
        browser.pause(1000);
        browser.click('//*[@id="' + ExtLocator.getId('combobox') + '"]//td[@class=" x-trigger-cell x-unselectable"]');
        browser.click('//*[@id="' + ExtLocator.getId('boundlist') + '"]//li[.="Contains"]');
        browser.setValue(ExtLocator.getCss('textfield[el][hidden=false][labelCls=ub-overflow-elips]') + '-inputEl', 'Shortcut inside Folder');
        browser.click('//*[@id="' + ExtLocator.getId('toolbar[ptype=multifilter]') + '"]//a[@data-qtip="Search"]');
        var shortcutInTab = '//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Shortcut inside Folder"]';
        browser.waitForVisible(shortcutInTab);
        browser.rightClick(shortcutInTab);
        browser.click(ExtLocator.getCss('menuitem[text=Edit (Ctrl+E)]'));
        browser.pause(1000);
    });
    it("Сhange Desktop on 'Desktop drop-down menu'", function (){
        var desktopCombobox = '//table[@id="' + ExtLocator.getId('ubcombobox[attributeName=desktopID]') + '"]//div[contains(@class, "x-form-arrow-trigger")]';
        browser.click(desktopCombobox);
        browser.click('//ul[@class="x-list-plain"]//li[contains(.,"Administrator")]');
        browser.click(ExtLocator.getCss('button[cls=save-and-close-action]'));
        browser.pause(1000);
    });
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
        browser.pause(3000);
    });
    it("Check the Shortcut move in Folder on sidebar", function (){
        var movedFolderOnSidebar = '//*[@id="' + ExtLocator.getId('treeview') + '"]//span[.="Folder for moved Shortcuts"]';
        browser.click(movedFolderOnSidebar);
        browser.pause(1000);
        var movedShortcutOnSidebar = browser.isExisting('//*[@id="' + ExtLocator.getId('treeview') + '"]//span[.="Shortcut inside Folder"]');
        movedShortcutOnSidebar.should.equal(true);
        browser.click(movedFolderOnSidebar);
    });
});

describe("Open Desktop details", function () {
    it("Open top navbar menu Administrator / UI / Desktops", function () {
         browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
         browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
         browser.pause(1000);
         browser.click(ExtLocator.getCss('menuitem[text=Desktops]'));
         browser.pause(3000);
    });
    it("Select on existing Desktop and select menu All action / Detail / Shourtcut (Desktop)", function () {
         browser.rightClick('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Test"]');
         browser.pause(1000);
         browser.moveToObject(ExtLocator.getCss('menuitem[text=Details][el][hidden=false]'));
         browser.pause(1000);
         browser.click(ExtLocator.getCss('menuitem[text=Shortcut (Desktop)][el][hidden=false]'));
         browser.pause(3000);
    });
    it("Check the details of the selected desktop", function () {
         var check_tst_document = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="tst_document"]');
         check_tst_document.should.equal(true);
         var check_tst_clob = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="tst_clob"]');
         check_tst_clob.should.equal(true);
         var check_tst_IITSign = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="tst_IITSign"]');
         check_tst_IITSign.should.equal(true);
    });
    it("Check the details of the another selected desktop", function () {
         browser.click('//*[@id="' + ExtLocator.getId('panel[title=Desktop][entityName=ubm_desktop] tableview') + '"]//td[.="Administrator"]');
         browser.pause(1000);
         var check_adm_folder_users = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="adm_folder_users"]');
         check_adm_folder_users.should.equal(true);
         var check_uba_user = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="uba_user"]');
         check_uba_user.should.equal(true);
         var check_uba_userrole = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="uba_userrole"]');
         check_uba_userrole.should.equal(true);
    });
});

describe("Delete Desktop", function () {
    it("Open top navbar menu Administrator / UI / Desktops", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Desktops]'));
        browser.pause(1000);
    });
    it("Find Desktop in the grid and delete", function () {
        var desktopForDelete = ('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="test_desktop_name"]');
        browser.rightClick(desktopForDelete);
        browser.click(ExtLocator.getCss('menuitem[text=Delete (Ctrl+Delete)][el][hidden=false]'));
        var deleteMessageBox = browser.getText('//*[@id="' + ExtLocator.getId('messagebox') + '"]//span[.="Confirm delete"]');
        deleteMessageBox.should.equal('Confirm delete');
        console.log('Tab is ' + deleteMessageBox);
        browser.click('//*[@id="' + ExtLocator.getId('messagebox') + '"]//span[.="No"]');
        browser.rightClick(desktopForDelete);
        browser.click(ExtLocator.getCss('menuitem[text=Delete (Ctrl+Delete)][el][hidden=false]'));
        deleteMessageBox.should.equal('Confirm delete');
        console.log('Tab is ' + deleteMessageBox);
        browser.click('//*[@id="' + ExtLocator.getId('messagebox') + '"]//span[.="Yes"]');
        browser.pause(1000);
    });
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
        browser.pause(3000)
    });
    it("Check deleted Desktop on the Top Menu", function () {
        var deletedDesktopOnTopMenu = browser.isExisting('//*[contains(@id, "ubtoolbarmenu")]//span[.="test_desktop_name"]'); //In the future, make a more reliable method of verification
        deletedDesktopOnTopMenu.should.equal(false);
    });
});

describe("All actions - Details (Not selected item)", function () {
    it("Open top navbar menu Administrator / UI / Desktops", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Desktops]'));
        browser.pause(3000);
    });
    it("Click 'All actions' and select 'Details' - 'Shortcut(Desktop)'", function () {
        browser.click(ExtLocator.getCss('button[tooltip=All actions]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Details]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Shortcut (Desktop)]'));
        browser.pause(3000);
    });
    it("Check Information message", function () {
        var windowTitle = browser.getText(ExtLocator.getCss('messagebox[title=Information]') + '_header_hd-textEl');
        windowTitle.should.equal('Information');
        var meaasgeText = browser.getText(ExtLocator.getCss('messagebox[title=Information]') + '-displayfield-inputEl');
        meaasgeText.should.equal('Select row in grid first');
        browser.click(ExtLocator.getCss('button[text=OK]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss("tab[text=Desktop][active=true]") + '-closeEl');
        browser.pause(1000);
    });
});

describe("All actions - Details", function () {
    it("Open top navbar menu Administrator / UI / Desktops", function () {
        browser.click(ExtLocator.getCss('button[text=Administrator][ui=default-toolbar-small]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=UI]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Desktops]'));
        browser.pause(3000);
    });
    it("Select item ans click 'All actions' and select 'Details' - 'Shortcut(Desktop)", function () {
        browser.click('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Test"]');
        browser.click(ExtLocator.getCss('button[tooltip=All actions]'));
        browser.moveToObject(ExtLocator.getCss('menuitem[text=Details][activeUI=default]'));
        browser.pause(1000);
        browser.click(ExtLocator.getCss('menuitem[text=Shortcut (Desktop)][activeUI=default]'));
        browser.pause(3000);
    });
    it("Check 'Details' - 'Shortcut(Desktop)' of the selected item", function () {
        var tabTitle = browser.getText(ExtLocator.getCss('tab[text=Desktop->Shortcut]'));
        tabTitle.should.equal('DESKTOP->SHORTCUT');
        var check_tst_document = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="tst_document"]');
        check_tst_document.should.equal(true);
        var check_tst_clob = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="tst_clob"]');
        check_tst_clob.should.equal(true);
        var check_tst_IITSign = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="tst_IITSign"]');
        check_tst_IITSign.should.equal(true);
    });
    it("Select another item and check 'Details' - 'Shortcut(Desktop)'", function () {
        browser.click('//*[@id="' + ExtLocator.getId('ubtableview') + '"]//td[.="Administrator"]');
        browser.pause(3000);
        var adm_folder_users = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="adm_folder_users"]');
        adm_folder_users.should.equal(true);
        var uba_user = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="uba_user"]');
        uba_user.should.equal(true);
        var uba_userrole = browser.isExisting('//*[@id="' + ExtLocator.getId('tab[text=Desktop->Shortcut] ^ tabpanel[isMainTabPanel!=true] tableview') + '"]//td[.="uba_userrole"]');
        uba_userrole.should.equal(true);
    });
});
