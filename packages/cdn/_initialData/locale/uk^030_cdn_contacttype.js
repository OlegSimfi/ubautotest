/**
 * @author pavel.mash
 * Enumeration localization to Ukrainian for CDN model
 * Used by `ubcli initialize` command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session){
var
    loader = require('@unitybase/base').dataLoader,

    localizationConfig = {
        entity: 'cdn_contacttype',
        keyAttribute: 'code',
        localization: [
			{keyValue: 'email',  execParams: {name: 'Электронна адреса'}},
			{keyValue: 'legalAddr',  execParams: {name: 'Юридична адреса'}},
			{keyValue: 'actualAddr',  execParams: {name: 'Фактична адреса'}},
			{keyValue: 'phone',  execParams: {name: 'Телефон'}},
			{keyValue: 'mobPhone',  execParams: {name: 'Мобільний телефон'}}
			
        ]
    };
    loader.localizeEntity(session, localizationConfig, __filename);
};