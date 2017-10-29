/**
 * @author pavel.mash
 * Enumeration localization to Ukrainian for ORG model
 * Used by `ubcli initialize` command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session){
var
    loader = require('@unitybase/base').dataLoader,
    localizationConfig = {
        entity: 'ubm_enum',
        keyAttribute: 'code',
        localization: [
		{keyValue: 'PERMANENT',  execParams: {name: 'Постійний'}},
		{keyValue: 'TEMPORARY',  execParams: {name: 'т.в.о.'}},
		{keyValue: 'ASSISTANT',  execParams: {name: 'Асистент'}}
        ]
    };
    loader.localizeEntity(session, localizationConfig, __filename);
};