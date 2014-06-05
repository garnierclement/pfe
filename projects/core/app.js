#!/usr/bin/env node

var core = require('./manticore.js');

var express = require('express');

var loch_api = express();

loch_api.listen(3000, function() {
	console.log('Listening');
});

// gracefully exit on ctrl+C (SIGINT)
process.on('SIGINT', function() {
  //subscriber.close();
  core.close();
});



process.stdin.setEncoding('utf8');

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
		else {
			core.publisher.send(chunk);
			console.log("+[INCH] Published: "+chunk);
		}
	}
});
core.on('ready', function() {

	loch_api.get('/', function(req, res) {
		res.set({'Content-Type': 'application/json'});
		res.send({nodes: core.nodes });
	});
});

core.on('test', function(){
	console.log('test');
});

// register callback on events before init
core.init();



