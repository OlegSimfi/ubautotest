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
        entity: 'ubm_enum',
        keyAttribute: 'code',
        localization: [
            // CDN_ACCOUNTTYPE
			{keyValue: 'CHECK',  execParams: {name: 'Розрахунковий'}},
			{keyValue: 'CURR',  execParams: {name: 'Поточний'}},
			{keyValue: 'BUDGET',  execParams: {name: 'Бюджетний'}},
			{keyValue: 'SAVE',  execParams: {name: 'Депозитний'}},
			{keyValue: 'CORR',  execParams: {name: 'Кореспондентський'}},
			//CDN_ADMINUNITTYPE 
			{keyValue: 'COUNTRY',  execParams: {name: 'Країна'}},
			{keyValue: 'DISTRICT',  execParams: {name: 'Регіон'}},
			{keyValue: 'CITY',  execParams: {name: 'Місто'}},
			{keyValue: 'F',  execParams: {name: 'Ж'}},
			{keyValue: 'M',  execParams: {name: 'Ч'}}			
        ]
    };
    loader.localizeEntity(session, localizationConfig, __filename);
};