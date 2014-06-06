/** 
 * Module dependencies
 */
var exec = require('child_process').exec;
var zmq = require('zmq');

/**
 * Constants
 */
var MACH_PORT = 45454;

/**
 * Handle messages published by other nodes
 * Theses messages are received on the information channel (InCh)
 * 
 * @param  {String} peer [IP address of the peer]
 * @param  {String} msg  [content of the message]
 */
function handleMessage(peer, msg) {
	if (/^exec/.test(msg)) {
		var cmd = msg.slice(5,msg.length-1);
		try {
			exec(cmd, function(err, stdout, stderr){
				console.log("+[EXEC] \n"+stdout+stderr);
				sendReply(peer, stdout);
			});
		}
		catch(e) {
			console.log("![EXEC] "+e);
		}
	}
}

/**
 * Send a reply to a particular node on the main channel (MaCh)
 * 
 * @param  {String} dst  [IP address of the recipient]
 * @param  {String} data [data to be sent]
 */
function sendReply(dst, data) {
	var socket = zmq.socket('req');
	socket.connect('tcp://'+dst+':'+MACH_PORT);
	socket.identity = dst;
	socket.send(data);

	socket.on('message', function(data) {
        console.log("[MACH] Sending data to "+socket.identity);
    });
}

exports.handleMessage = handleMessage;