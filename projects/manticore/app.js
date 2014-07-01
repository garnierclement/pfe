#!/usr/bin/env node

var express = require('express');
var api = express();
var path = require('path');
var _ = require("underscore");

var core = require('./manticore.js');
var interactive = require('./interactive.js');
var trigger = require('./trigger.js');
var Record = require('./record.js');

// view engine set up
api.set('views', path.join(__dirname, 'web/views'));
api.set('view engine', 'jade');
api.use(express.static(path.join(__dirname, 'web/static')));

// Start HTTP server to serve JSON API
api.listen(3000, function() {
	console.log('+[HTTP]\tListening on 3000');
});

/**
 * Handles the 'ready' event on the core
 * This implies that the core has started
 * and have been initialized
 * Thus, we can now handle external communication on the HTTP server
 */
core.on('ready', function() {

	api.get('/', function(req, res) {
		console.log('>[HTTP]\tWeb UI from '+ req.ip +' on ' +req.headers['user-agent']);
		res.render('index', { title: 'Manticore on '+core.name, name: core.name, nodes: core.nodes, sensors: core.sensors, records: core.records});
	});

	api.get('/nodes', function(req, res) {
		console.log('>[HTTP]\t/nodes/ from '+ req.ip +' on '+ req.headers['user-agent']);
		res.set({'Content-Type': 'application/json'});
		res.send({nodes: core.nodes });
	});

	// HTTP GET /request/[uuid]?port=[portnumber]
	api.get('/request/:id', function(req, res) {
		console.log('>[HTTP]\tRequest resource from '+ req.ip +' with id '+req.param('id'));
		res.set({'Content-Type': 'text/plain'});
		var resource = req.param('id');
		var port = req.query.port || 16161;
		var src = req.ip;
		core.requestResource(resource, port, src, function(err, header, payload) {
			if (err === null) {
				if (payload.status)
					res.send(resource);
				else
					res.send(false);
			}
			else {
				res.send(false);
				console.log(err);
			}
		});
	});

	api.get('/release/:id', function(req, res) {
		console.log('>[HTTP]\tRelease resource from '+ req.ip +' with id '+req.param('id')+ " from\n\t"+ req.headers['user-agent']);
		res.set({'Content-Type': 'text/plain'});
		var resource = req.param('id');
		core.releaseResource(resource, function(err, header, payload) {
			if (err === null) {
				if (payload.status)
					res.send(true);
				else
					res.send(false);
			}
			else {
				res.send(false);
				console.log(err);
			}
		});
	});

	api.get('/kill/:pid', function(req, res) {
		console.log('>[HTTP]\tKill resource from '+ req.ip +' with id '+req.param('pid')+ " from\n\t"+ req.headers['user-agent']);
		res.set({'Content-Type': 'text/plain'});
		var pidToKill = req.param('pid');
		// get record with matching PID
		var record = _.find(core.records, function(record) {
			if (record.type === 'active_resource') {
				console.log(record.child.pid);
				return record.child.pid == pidToKill;
			}
			return false;
		});
		if (record !== undefined) {
			record.child.kill();
			var index = _.indexOf(core.records, record);
			core.records.splice(index,1);
			res.send(true);
		}
		else {
			res.send(false);
		}
	});

});

/**
 * Handles the 'inch' event on the core
 * This event corresponds to the reception of a message on the subscriber socket
 */
core.on('inch', function(header, payload) {
	console.log('>[INCH]\t'+header.type+' from '+header.name+' ('+header.ip+')');
	switch(header.type) {
		case 'raw':
			console.log(payload);
			break;
		case 'exec':
			trigger.execute(payload, function(stdout, stderr){
				var dst = header.ip;
				console.log('+[CORE]\tSending result of execution to '+header.name+'('+dst+')');
				if (dst !== null)
					core.send(dst, 'raw', stdout+stderr);
				else
					console.log('![CORE]\tCannot send reply to '+header.name);
			});
			break;
		case 'new_sensor':
			var idx = core.findNodeById(header.src);
			if (idx !== null)
				for (var i = 0; i < payload.length; i++) {
					core.nodes[idx].sensors.push(payload[i]);
				}
			break;
		default:
			console.log('![INCH]\tMessage type not imlemented'+header.type);
			console.log(payload);
	}
});

/**
 * Handles the 'mach' event on the core
 * This event corresponds to the reception of a msg of the router (aka mach or replier) socket
 * Depending on the type of message received :
 *		- an action is triggered
 *		- nothing is done
 *		- we use the core.reply() command to send a response
 */
core.on('mach', function(envelope, header, payload) {
	console.log('>[MACH]\t'+header.type+' from '+header.name+' ('+header.ip+')');
	switch(header.type) {
		case 'raw':
			console.log(payload);
			core.reply('ack', envelope, "Bien reçu !");
			break;
		case 'ack':
			console.log(payload);
			break;
		case 'request':
			console.log(payload);
			core.reply('ack', envelope, {status: true});
			var dst = header.ip;
			if (dst === this.ip) dst = '127.0.0.1';
			if (dst !== null) {
				var activeRes = new Record(payload.data, 'active_resource', header.src, dst, payload.port);
				var outputfile = trigger.generate(dst, payload.port,'mousePosition.pd','output.pd');
				var pd = "";
				if(isDarwin()) {
					pd = "/Applications/Pd-extended.app/Contents/MacOS/Pd-extended";
				}
				else if (isLinux()) {
					pd = "pd-extended";
				}
				var child = trigger.execute(pd+' '+outputfile, function(err, stdout,stderr) {
					console.log(stdout+stderr);
				});
				activeRes.addChild(child);
				core.records.push(activeRes);
			}
			else
				console.log('![ERR]\tcannot find ip for '+header);
			
			// NOT YET IMPLEMENTED
			// To request a resource
			// Need to trigger.check() (resource availability)
			// Need to send a response true/false according to availability
			// May need to trigger.generate()
			// Need to trigger.execute()
			break;
		case 'release':
			console.log(payload);
			// Check in the records whether the 'release' is valid
			var record = _.findWhere(core.records, {type: 'active_resource', resource: payload.data, source: header.src});
			var replyStatus = false;
			if (record !== undefined) {
				record.child.kill();
				replyStatus = true;
				var index = _.indexOf(core.records, record);
				core.records.splice(index,1);
			}
			core.reply('ack', envelope, core.ackPayload(replyStatus));
			break;
		default:
			console.log('![INCH]\tNo message type');
			console.log(payload);
	}
});

/**
 * Handles the 'reply' event on the core
 */
core.on('reply', function(header, payload) {
	console.log('>[MACH]\t'+header.name+' replied with '+header.type);
	switch(header.type) {
		default:
			console.log(payload);
	}
});

/**
 * Handles the disappearance of a node on the network
 * Implicit release and records cleanup
 */
core.on('died', function(deadNodeId) {
	if (deadNodeId !== null) {
		console.log(deadNodeId);
		var deadNodeRecords = _.where(core.records, {source: deadNodeId});
		console.log('deadNodeRecords:' + deadNodeRecords);
	}
});

/**
 * Handles the 'test' event on the core
 * Used for debug purpose only
 */
core.on('test', function(){
	trigger.generate('192.168.0.1',1234,'../../pd/mousePosition.pd','../../var/run/output.pd');
});

/**
 * Gracefully exit on SIGINT (Ctrl+C)
 * Clean up and exit
 */
process.on('SIGINT', function() {
	core.close();
});

/**
 * Eventually initialize the core, everything starts from here
 * Note : in order to avoid asunc issues, register callbacks event before calling init()
 */
core.init();


/**
 * Check if running on Mac OS X
 * @return {Boolean} true if OS X
 */
function isDarwin() {
	if (require('os').platform() == 'darwin') return true;
	else return false;
}

/**
 * Check if running on Linux
 * @return {Boolean} true if Linux
 */
function isLinux() {
	if (require('os').platform() == 'linux') return true;
	else return false;
}
