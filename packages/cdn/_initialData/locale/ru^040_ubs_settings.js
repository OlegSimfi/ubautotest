/**
 * @author pavel.mash
 * Navigation shortcuts localization to Ukrainian for UBS model
 * Used by `ubcli initialize` command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session){
var
    loader = require('@unitybase/base').dataLoader;

    localizationConfig = {
        entity: 'ubs_settings',
        keyAttribute: 'settingKey',
        localization: [
            {keyValue: 'cdn.organization.accessAddGovByRoles',  execParams: {
		name: 'Список ролей через запятую',
		description: 'Список ролей через запятую которые могут добавлять записи в `cdn_organigation` с типом `cdn_orgbusinesstype.isGovAuthority`'}
	    },
            {keyValue: 'cdn.organization.allowAutoGenerateOKPO',  execParams: {
		name: 'Автоматическая генерация ОКПО если он не указан',
		description: 'Автоматическая генерация ОКПО если он не указан пользователем'}
	    }
        ]
    };

    loader.localizeEntity(session, localizationConfig, __filename);
};