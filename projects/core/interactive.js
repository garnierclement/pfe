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
				core.publish(core.createMessage('send',msg));
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
		else if (/^pub /.test(chunk)) {
			var msg = chunk.slice(4,chunk.length-1);
			try {
				console.log("+[INCH] Published: "+msg);
				core.publisher.send(msg);
			}
			catch(e) {
				console.log("![SEND] "+e);
			}
		}
		else {
			console.log("![CORE] Available commands : debug|eval|log|send|remote|emit");
		}
	}
});
