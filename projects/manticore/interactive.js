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
			console.log("[HELP]\tUsage: cmd [param], see examples below");
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
				console.log("![EVAL]\t"+e+"\nUsage: 'eval [javascript code]'");
			}
		}
		else if (/^log/.test(chunk)) {
			var obj = chunk.slice(4);
			try {
				console.log(eval(obj));
			}
			catch(e) {
				console.log("![LOG]\t"+e+"\nUsage: 'log [javascript object]'");
			}
			
		}
		else if (/^emit/.test(chunk)) {
			var evt = chunk.slice(5,chunk.length-1);
			try {
				core.emit(evt);
			}
			catch(e) {
				console.log("![EMIT]\t"+e+"\nUsage: 'emit [javascript event on core]'");
			}
		}
		else if (/^exec/.test(chunk)) {
			var cmd = chunk.slice(5,chunk.length-1);
			try {
				exec(cmd, function(err, stdout, stderr){
					console.log("+[EXEC]\t\n"+stdout+stderr);
				});
			}
			catch(e) {
				console.log("![EXEC]\t"+e);
			}
		}
		else if (/^send /.test(chunk)) {
			var msg = chunk.slice(5,chunk.length-1);
			try {
				console.log("+[INCH]\tPublished: "+msg);
				core.publish('raw', msg);
			}
			catch(e) {
				console.log("![SEND]\t"+e);
			}
		}
		else if (/^remote /.test(chunk)) {
			var cmd = chunk.slice(7,chunk.length-1);
			try {
				console.log("+[INCH]\tRemote execution of '"+cmd+"'");
				core.publish('exec', cmd);
			}
			catch(e) {
				console.log("![SEND]\t"+e);
			}
		}
		else if (/^request /.test(chunk)) {
			var res = chunk.slice(8,chunk.length-1);
			try {
				console.log("+[REQR]\tRequest resource: "+res);
				var dst = core.getNodeIpById(res);
				if (dst != null) 
				core.syncSend(dst, 'request', core.requestPayload(res), function(header, payload) {
					console.log('>[SYNC]\tResource status from '+header);
					console.log(payload);
				});
			}
			catch(e) {
				console.log("![SEND]\t"+e);
			}
		}
		else if (/^fake/.test(chunk)) {
			core.fakeSensors();
		}
		else {
			console.log("![CORE]\tAvailable commands : help|debug|eval|log|exec|send|remote|emit|request");
		}
	}
});
