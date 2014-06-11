var exec = require('child_process').exec;
var core = require('./manticore.js');

process.stdin.setEncoding('utf8');

// Interactive commands within the terminal
process.stdin.on('readable', function() {
	var chunk = process.stdin.read();
	if (chunk !== null) {
		if (chunk == "debug\n") {
			console.log(core.nodes);
		}
		else if (chunk == "exit\n") {
			core.close();
		}
		else if (chunk == "help\n") {
			console.log("[HELP] Usage: cmd [param], see examples below");
			console.log("\tdebug");
			console.log("\teval core.nodes");
			console.log("\tlog core.nodes");
			console.log("\tsend hello");
			console.log("\texec hostname");
			console.log("\tremote hostname");
			console.log("\temit test");
		}
		else if (/^eval/.test(chunk)) {
			var command = chunk.slice(5);
			try {
				eval(command);
			}
			catch(e) {
				console.log("![EVAL] "+e+"\nUsage: 'eval [javascript code]'");
			}
		}
		else if (/^log/.test(chunk)) {
			var obj = chunk.slice(4);
			try {
				console.log(eval(obj));
			}
			catch(e) {
				console.log("![LOG] "+e+"\nUsage: 'log [javascript object]'");
			}
			
		}
		else if (/^emit/.test(chunk)) {
			var evt = chunk.slice(5,chunk.length-1);
			try {
				core.emit(evt);
			}
			catch(e) {
				console.log("![EMIT] "+e+"\nUsage: 'emit [javascript event on core]'");
			}
		}
		else if (/^exec/.test(chunk)) {
			var cmd = chunk.slice(5,chunk.length-1);
			try {
				exec(cmd, function(err, stdout, stderr){
					console.log("+[EXEC] \n"+stdout+stderr);
				});
			}
			catch(e) {
				console.log("![EXEC] "+e);
			}
		}
		else if (/^send /.test(chunk)) {
			var msg = chunk.slice(5,chunk.length-1);
			try {
				console.log("+[INCH] Published: "+msg);
				core.publish(core.createMessage('raw',msg));
			}
			catch(e) {
				console.log("![SEND] "+e);
			}
		}
		else if (/^remote /.test(chunk)) {
			var cmd = chunk.slice(7,chunk.length-1);
			try {
				console.log("+[INCH] Remote execution of '"+cmd+"'");
				core.publish(core.createMessage('exec',cmd));
			}
			catch(e) {
				console.log("![SEND] "+e);
			}
		}
		else if (/^request /.test(chunk)) {
			var res = chunk.slice(8,chunk.length-1);
			try {
				console.log("+[REQR] Request resource: "+res);
				core.syncSend(res, 'request', res, function(reply) {
					console.log('>[SYNC] Resource status');
					console.log(reply);
				});
			}
			catch(e) {
				console.log("![SEND] "+e);
			}
		}
		else {
			console.log("![CORE] Available commands : help|debug|eval|log|exec|send|remote|emit|request");
		}
	}
});
