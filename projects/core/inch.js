/** 
 * Module dependencies
 */
var exec = require('child_process').exec;

/**
 * Handle messages published by other nodes
 * 
 * @param  {String} peer [IP address of the peer]
 * @param  {String} msg  [content of the message]
 */
function handleMessage(peer, msg) {
	if (/^exec/.test(msg)) {
		var cmd = chunk.slice(5,msg.length-1);
		try {
			exec(cmd, function(err, stdout, stderr){
				console.log("+[EXEC] \n"+stdout+stderr);
			});
		}
		catch(e) {
			console.log("![EXEC] "+e);
		}
	}
}

exports.handleMessage = handleMessage;