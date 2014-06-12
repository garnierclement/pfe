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

exports.generate = function(ip, port, file, output) {
	var sed = "sed -e '/^#X msg [0-9]* [0-9]* connect/s/connect [0-9a-z_.\-]* [0-9]*/connect "+ip+" "+port+"/' "+file+" > "+ output;
	console.log(sed);
	exec(sed, function(err,stdout, stderr) {
		console.log('+[GEN] File generated '+output);
	});
	return output;
};

exports.check = function() {

};

exports.kill = function() {

};

