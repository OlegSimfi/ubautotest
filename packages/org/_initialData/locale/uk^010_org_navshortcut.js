/**
 * @author pavel.mash
 * Navigation shortcuts localization to Ukrainian for CDN model
 * Used by `ubcli initialize` command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session){
var
    loader = require('@unitybase/base').dataLoader,
    localizationConfig = {
        entity: 'ubm_desktop',
        keyAttribute: 'code',
        localization: [
            {keyValue: 'org_desktop',  execParams: {caption: 'Орг. структура'}}
        ]
    };

    loader.localizeEntity(session, localizationConfig, __filename);


    localizationConfig = {
        entity: 'ubm_navshortcut',
        keyAttribute: 'code',
        localization: [
            {keyValue: 'org_folder_internal',  execParams: {caption: 'Орг. структура'}},
                {keyValue: 'org_department',  execParams: {caption: 'Внутрішні підрозділи'}},
                {keyValue: 'org_organization',  execParams: {caption: 'Внутрішні організації'}},
                {keyValue: 'org_employeeonstaff',  execParams: {caption: 'Внутрішні призначення'}},
		{keyValue: 'org_employeeonstaff_all',  execParams: {caption: 'Внутрішні призначення (всі)'}},
		{keyValue: 'org_staffunit',  execParams: {caption: 'Штатні одиниці'}},
		{keyValue: 'org_unit',  execParams: {caption: 'Внітрішні орг.одиниці'}},
		{keyValue: 'org_employee',  execParams: {caption: 'Внутрішні працівники'}},
	        {keyValue: 'org_folder_dict',  execParams: {caption: 'Додатково'}},
                {keyValue: 'org_profession',  execParams: {caption: 'Професії'}},
		{keyValue: 'org_diagram',  execParams: {caption: 'Орантограми'}},
		{keyValue: 'org_borderunit',  execParams: {caption: 'Граничні елементи'}}
        ]
    };

    loader.localizeEntity(session, localizationConfig, __filename);
};