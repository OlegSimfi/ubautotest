/**
 * User: pavel.mash
 * Fill navigation shortcuts for CDN model
 */

var UBA_COMMON = require('@unitybase/uba/modules/uba_common');
/**
 * Initial script for create UnityBase Common Dictionaries desktop navigation short-cuts (CDN model)
 * Used by ubcli initialize command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session){
var
    desktopID, usersRoleID, folderID, lastID, conn = session.connection;

    desktopID =  conn.lookup('ubm_desktop', 'ID', {expression: 'code', condition: 'equal', values: {code: 'cdn_desktop'}});
    usersRoleID = UBA_COMMON.ROLES.USER.ID;
    console.info('\tFill `Common dictionary` desktop');
    if (!desktopID) {
        console.info('\t\tcreate new `Common dictionary` desktop');
        desktopID = conn.insert({
            entity: 'ubm_desktop',
            fieldList: ['ID'],
            execParams: {
                code: 'cdn_desktop',
                caption: 'Common dictionary'
            }
        });
        console.info('\t\tprovide rights for `Common dictionary` to users role');
        conn.insert({
            entity: 'ubm_desktop_adm',
            execParams: {
                instanceID: desktopID,
                admSubjID: usersRoleID
            }
        });
    } else {
        console.info('\t\tuse existed desktop with code `cdn_desktop`', desktopID)
    }

    console.log('\t\tcreate `Territorial` folder');
    folderID = conn.insert({
        entity: 'ubm_navshortcut',
        fieldList: ['ID'],
        execParams: {
            desktopID:  desktopID,
            code:       'cdn_folder_territorial',
            caption:    'Territorial',
            isFolder:   true,
            isCollapsed:false,
            iconCls:    'fa fa-globe',
            displayOrder: 10
        }
    });
    console.info('\t\tprovide rights for `Territorial` folder to users role');
    conn.insert({
        entity: 'ubm_navshortcut_adm',
        execParams: {
            instanceID: folderID,
            admSubjID: usersRoleID
        }
    });


    console.log('\t\t\tcreate `Regions` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_region',
            caption:    'Regions',
            iconCls:    'fa fa-cloud',
            displayOrder: 10,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_region', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `Regions` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });

    console.log('\t\t\tcreate `City` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_city',
            caption:    'Cities',
			iconCls:    'fa fa-group', //'fa fa-institution' - where is this icon??
            displayOrder: 20,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_city', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `City` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });

    console.log('\t\t\tcreate `Country` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_country',
            caption:    'Countries',
            iconCls:    'fa fa-flag-o',
            displayOrder: 30,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_country', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `Country` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });
	
	console.log('\t\t\tcreate `Admin units` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_adminunit',
            caption:    'Admin units',
            displayOrder: 40,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_adminunit', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `Admin units` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });
	
	console.log('\t\t\tcreate `Region types` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_regiontype',
            caption:    'Region types',
            displayOrder: 100,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_regiontype', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `Region types` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });
	
	console.log('\t\t\tcreate `City types` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_citytype',
            caption:    'City types',
            displayOrder: 110,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_citytype', method: 'select', fieldList: '*'}]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `City types` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });

    // Subjects
    console.log('\t\tcreate `Subjects` folder');
    folderID = conn.insert({
        entity: 'ubm_navshortcut',
        fieldList: ['ID'],
        execParams: {
            desktopID:  desktopID,
            code:       'cdn_folder_subjects',
            caption:    'Subjects',
            isFolder:   true,
            isCollapsed:false,
            iconCls:    'fa fa-globe',
            displayOrder: 10
        }
    });
    console.info('\t\tprovide rights for `City types` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: folderID, admSubjID: usersRoleID } });

    console.log('\t\t\tcreate `Organizations` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_organization',
            caption:    'Organizations',
            iconCls:    'fa fa-university',
            displayOrder: 10,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_organization', method: 'select',
                fieldList: ["OKPOCode", "name", "fullName", "description", "orgBusinessTypeID.name","orgOwnershipTypeID.name"]
            }]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `Organizations` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });

    console.log('\t\t\tcreate `Employee` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_employee',
            caption:    'Employee',
            iconCls:    'fa fa-briefcase',
            displayOrder: 20,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_employee', method: 'select',
                fieldList: '*'
            }]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `Employee` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });

    console.log('\t\t\tcreate `Departments` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_department',
            caption:    'Departments',
            iconCls:    'fa fa-cubes',
            displayOrder: 30,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_department', method: 'select',
                fieldList: '*'
            }]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `Departments` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });

    console.log('\t\t\tcreate `Persons` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_person',
            caption:    'Persons',
            iconCls:    'fa fa-male',
            displayOrder: 40,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_person', method: 'select',
                fieldList: ["lastName","firstName","middleName","birthDate","description"]
            }]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `Persons` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });


    console.log('\t\tcreate `Miscellaneous` folder');
    folderID =  conn.lookup('ubm_navshortcut', 'ID', {expression: 'code', condition: 'equal', values: {code: 'cdn_folder_misc'}});
    if (!folderID) {
        folderID = conn.insert({
            entity: 'ubm_navshortcut',
            fieldList: ['ID'],
            execParams: {
                desktopID: desktopID,
                code: 'cdn_folder_misc',
                caption: 'Miscellaneous',
                isFolder: true,
                isCollapsed: true,
                iconCls: 'fa fa-cogs',
                displayOrder: 40
            }
        });
    }
    console.info('\t\tprovide rights for Miscellaneous` folder to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: folderID, admSubjID: usersRoleID } });


    console.log('\t\t\tcreate `Currency` shortcut');
    lastID = conn.insert({
        fieldList: ['ID'],
        entity: 'ubm_navshortcut',
        execParams: {
            desktopID:  desktopID,
            parentID:   folderID,
            code:       'cdn_currency',
            caption:    'Currency',
            iconCls:    'fa fa-usd',
            displayOrder: 10,
            cmdCode : JSON.stringify({cmdType: 'showList', cmdData: {params:[{ entity: 'cdn_currency', method: 'select',
                fieldList: ["intCode","code3","name"]
            }]}}, null, '\t')
        }
    });
    console.info('\t\tprovide rights for `Currency` shortcut to users role');
    conn.insert({ entity: 'ubm_navshortcut_adm', execParams: {instanceID: lastID, admSubjID: usersRoleID } });

};