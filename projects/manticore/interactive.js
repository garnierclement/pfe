var exec = require('child_process').exec;
var core = require('./manticore.js');

process.stdin.setEncoding('utf8');

// Interactive commands within the terminal
process.stdin.on('readable', function() {
	var chunk = process.stdin.read();
	if (chunk !== null) {
		if (/^debug/.test(chunk)) {
			console.log("+[DBUG] Core.nodes");
			console.log(core.nodes);
			console.log("+[DBUG] Core.sensors");
			console.log(core.sensors);
			console.log("+[DBUG] Core.records");
			console.log(core.records);
		}
		else if (/^exit/.test(chunk)) {
			core.close();
		}
		else if (/^help/.test(chunk)) {
			console.log("+[HELP]\tUsage: cmd [param], see examples below");
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
			console.log("+[REQR]\tRequest resource: "+res);
			core.requestResource(res, 42424, '127.0.0.1', function(err, header, payload) {
				if (err === null) {
					console.log('>[SYNC]\tResource status from '+header);
					console.log(payload);
				}
				else {
					console.log(err);
				}
			});
		}
		else if (/^release /.test(chunk)) {
			var res = chunk.slice(8,chunk.length-1);
			console.log("+[RELR]\tRelease resource: "+res);
			core.releaseResource(res, function(err, header, payload) {
				if (err === null) {
					console.log('>[SYNC]\tResource status from '+header);
					console.log(payload);
				}
				else {
					console.log(err);
				}
			});
		}
		else if (/^fake/.test(chunk)) {
			core.fakeSensors();
		}
		else {
			console.log("![CORE]\tAvailable commands : help|debug|eval|log|exec|send|remote|emit|request|release|fake");
		}
	}
});
