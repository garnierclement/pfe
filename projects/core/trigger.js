/** 
 * Module dependencies
 */
var exec = require('child_process').exec;

exports.execute = function(cmd, callback) {
	try {
		exec(cmd, function(err, stdout, stderr){
			console.log("+[EXEC] Executing "+cmd+"\n"+stdout+stderr);
			callback(stdout, stderr);
		});
	}
	catch(e) {
		console.log("![EXEC] "+e);
	}
};

exports.generate = function(ip, port) {
	return filename;
};

exports.check = function() {

};

exports.kill = function() {

};

