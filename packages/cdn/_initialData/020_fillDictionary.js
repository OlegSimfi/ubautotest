/**
 * Fill CDN dictionaries from csv files
 * Used by `ubcli initialize` command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session){
    "use strict";
    var
        csvLoader = require('@unitybase/base').dataLoader,
        conn = session.connection;

    console.info('\tFill common dictionaries data (CDN model)');

    console.info('\t\tFill enumeration for CDN model');
    csvLoader.loadSimpleCSVData(conn, __dirname + '/ubm_enum-CDN.csv', 'ubm_enum', 'eGroup;code;name;sortOrder'.split(';'), [0, 1, 2, 3]);

    console.info('\t\tCity types (cdn_citytype)');
    csvLoader.loadSimpleCSVData(conn, __dirname + '/cdn_citytype.csv', 'cdn_citytype', 'code;name'.split(';'), [0, 1], 1);
	
	console.info('\t\tRegion types (cdn_regiontype)');
    csvLoader.loadSimpleCSVData(conn, __dirname + '/cdn_regiontype.csv', 'cdn_regiontype', 'code;name'.split(';'), [0, 1], 1);
	
	
	console.info('\t\tCountries (cdn_country)');
    csvLoader.loadSimpleCSVData(conn, __dirname + '/cdn_country.csv', 'cdn_country', 'code;name;fullName;intCode;symbol2;symbol3'.split(';'), [4, 0, 1, 2, 3, 4], 1);
	
	console.info('\t\tRegions of Ukraine (cdn_region)');
    var ukraineID = conn.lookup('cdn_country', 'ID', {expression: 'code', condition: 'equal', values: {code: 'UKR'}});
    if (!ukraineID) {
        throw new Error('Country with code UKR not found');
    }

    // CSV columns: code,regionType,name,fullName
    csvLoader.loadSimpleCSVData(conn, __dirname + '/cdn_region_ukraine.csv', 'cdn_region',
        ['parentAdminUnitID', 'code', 'regionTypeID', 'name', 'caption', 'fullName'],
        [
            function(){return ukraineID;},
            0,
            function(row){
                var regionType;
                regionType = conn.lookup('cdn_regiontype', 'ID', {expression: 'code', condition: 'equal', values: {code: row[1]}});
                if (!regionType){
                    throw new Error('Unknown region type ' + row[1]);
                }
                return regionType;
            }, 2, 2, 3
        ], 1, ','
    );
	
	console.info('\t\tContact types (cdn_contacttype)');
    csvLoader.loadSimpleCSVData(conn, __dirname + '/cdn_contacttype.csv', 'cdn_contacttype', 'code;name'.split(';'), [0, 1], 1);

	console.info('\t\tCurrency (cdn_currency)');
    csvLoader.loadSimpleCSVData(conn, __dirname + '/cdn_currency.csv', 'cdn_currency', 'name;intCode;code3'.split(';'), [0, 1, 2], 1);	
};