/**
 * User: pavel.mash
 * Create roles users / powerUsers / supervisors
 */

/**
 * Initial script for create UnityBase Administration desktop navigation shortcuts for UBA model
 * Used by `ubcli initialize` command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session){

    var conn = session.connection;

    console.log('\t\tcreate `orgNodeAdmin` role');
    var usersRoleID = conn.insert({
        entity: 'uba_role',
        fieldList: ['ID'],
        execParams: {
            name: 'orgNodeAdmin',
            description: 'Administrator of organization node.',
	    sessionTimeout: 30
        }
    });

    console.log('\t\tcreate `orgAllNodeAccess` role');
    var usersRoleID = conn.insert({
        entity: 'uba_role',
        fieldList: ['ID'],
        execParams: {
            name: 'orgAllNodeAccess',
            description: 'Administrator of all organization node.',
	    sessionTimeout: 30
        }
    });


};