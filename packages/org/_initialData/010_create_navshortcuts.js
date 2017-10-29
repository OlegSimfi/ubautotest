/**
 * User: pavel.mash
 * Fill navigation shortcuts for ORG model
 */

/**
 * Initial script for create UnityBase Organizational Structure desktop navigation short-cuts (ORG model)
 * Used by ubcli initialize command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session){
var
    desktopID, folderID, conn = session.connection;

    "use strict";
    desktopID =  conn.lookup('ubm_desktop', 'ID', {expression: 'code', condition: 'equal', values: {code: 'org_desktop'}});
    console.info('\tFill `Organizational Structure` desktop');
    if (!desktopID) {
        console.info('\t\tcreate new `Organizational Structure` desktop');
        desktopID = conn.insert({
            entity: 'ubm_desktop',
            fieldList: ['ID'],
            execParams: {
                code: 'org_desktop',
                caption: 'Organizational Structure'
            }
        });
    } else {
        console.info('\t\tuse existed desktop with code `org_desktop`', desktopID)
    }

    console.log('\t\tcreate `Internal org structure` folder');
    folderID = conn.insert({
        entity: 'ubm_navshortcut',
        fieldList: ['ID'],
        execParams: {
            desktopID:  desktopID,
            code:       'org_folder_internal',
            caption:    'Org internal',
            isFolder:   true,
            isCollapsed:false,
            iconCls:    'fa fa-globe',
            displayOrder: 10
        }
    });


    console.log('\t\t\tcreate `Department` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_department',
            caption:    'Departments',
            iconCls:    'fa fa-cubes',
            displayOrder: 10,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_department', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });

    console.log('\t\t\tcreate `Internal organization` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_organization',
            caption:    'Organizations',
		iconCls:    'fa fa-university',
            displayOrder: 20,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_organization', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });

    console.log('\t\t\tcreate `Employee on staff` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_employeeonstaff',
            caption:    'Employee on staff',
            iconCls:    'fa fa-briefcase',
            displayOrder: 30,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_employeeonstaff', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });
    console.log('\t\t\tcreate `All Employee on staff` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_employeeonstaff_all',
            caption:    'Employee on staff',
            iconCls:    'fa fa-briefcase',
            displayOrder: 35,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_employeeonstaff', method: 'select', fieldList: '*', __mip_recordhistory_all: true}]}}, null, '\t')
        }
    });

	
	console.log('\t\t\tcreate `Org staff units` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_staffunit',
            caption:    'Staff units',
            displayOrder: 40,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_staffunit', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });
	
	console.log('\t\t\tcreate `Org units` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_unit',
            caption:    'Org units',
            displayOrder: 100,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_unit', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });
	
	console.log('\t\t\tcreate `Employees` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_employee',
            caption:    'Employeers',
		iconCls:    'fa fa-male',
            displayOrder: 110,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_employee', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });


    console.log('\t\tcreate `Internal org dictionaries` folder');
    folderID = conn.insert({
        entity: 'ubm_navshortcut',
        fieldList: ['ID'],
        execParams: {
            desktopID:  desktopID,
            code:       'org_folder_dict',
            caption:    'Additional',
            isFolder:   true,
            isCollapsed:false,
            displayOrder: 20
        }
    });


    console.log('\t\t\tcreate `Professions` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_profession',
            caption:    'Professions',
            iconCls:    'fa fa-cloud',
            displayOrder: 10,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_profession', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });

    console.log('\t\t\tcreate `Organizational chart` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_diagram',
            caption:    'Organizational chart',
            iconCls:    'fa fa-sitemap',
            displayOrder: 20,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_diagram', method: 'select', fieldList: ["ID","caption", "orgunitID.caption"]}]}}, null, '\t')
        }
    });

    console.log('\t\t\tcreate `Border units` shortcut');
    conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'org_borderunit',
            caption:    'Border units',
            iconCls:    'fa',
            displayOrder: 10,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'org_borderunit', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });

};