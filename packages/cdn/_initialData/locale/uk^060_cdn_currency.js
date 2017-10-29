/**
 * @author pavel.mash
 * Currency localization to Ukrainian for CDN model
 * Used by `ubcli initialize` command
 * @param {ServerSession} session
 */
module.exports = function(session){
    var
        loader = require('@unitybase/base').dataLoader,
        CSV = require('@unitybase/base').csv,
        fs = require('fs'),
        localizationConfig = {
            entity: 'cdn_currency',
            keyAttribute: 'intCode',
            localization: [
                // {keyValue: 'CHECK',  execParams: {name: 'Розрахунковий'}}
            ]
        };
    let rawData = fs.readFileSync(__filename.replace(/\.js$/, '.csv'));
    let rows = CSV.parse(rawData);
    if (!rows.length) {
        console.error('CSV file with currency localisation is empty');
        return;
    }
    let intCodeIndex = rows[0].indexOf('intCode');
    let nameIndex = rows[0].indexOf('name');
    if (intCodeIndex === -1 || nameIndex === -1 ){
        console.error('CSV file must contains a columns with names intCode & name');
        return;
    }
    for (let r = 1, l = rows.length; r < l; r++){
        if (rows[r][intCodeIndex]){
            localizationConfig.localization.push({
                keyValue: rows[r][intCodeIndex],
                execParams: {
                    name: rows[r][nameIndex]
                }
            })
        } else {
            console.warn(`Empty intCode in row ${r}`);
        }

    }
    loader.localizeEntity(session, localizationConfig, __filename);
};