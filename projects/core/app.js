#!/usr/bin/env node

var express = require('express');
var api = express();
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
				// remote execution with child_process ?
				//throw "NOT IMPLEMENTED YET";
				exec(cmd, function(err, stdout, stderr){
					console.log("+[EXEC] \n"+stdout+stderr);
				});
			}
			catch(e) {
				console.log("![EXEC] "+e);
			}
		}
		else if (/^send/.test(chunk)) {
			var msg = chunk.slice(5,chunk.length-1);
			try {
				console.log("+[INCH] Published: "+msg);
				core.publisher.send(msg);
			}
			catch(e) {
				console.log("![SEND] "+e);
			}
		}
		else {
			console.log("![CORE] available commands : debug|eval|log|send");
		}
	}
});

// Gracefully exit on SIGINT (Ctrl+C)
process.on('SIGINT', function() {
	core.close();
});

// Start HTTP server to serve JSON API
api.listen(3000, function() {
	console.log('+[API] Listening on 3000');
});

// Upon core initialization
core.on('ready', function() {
	api.get('/', function(req, res) {
		res.set({'Content-Type': 'application/json'});
		res.send({nodes: core.nodes });
	});
});

// Upon receiving a message on MaCh
core.mach.on('message', function(data) {
	console.log("[MACH] "+data);
});

// Test core event
core.on('test', function(){
	console.log('test');
});

// Initialize core, everything starts from here
// Note : in order to avoid asunc issues, register callbacks event before calling init()
core.init();



