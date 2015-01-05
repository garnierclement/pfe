#!/usr/bin/env node

var express = require('express');
var api = express();
var path = require('path');
var _ = require("underscore");
var bodyParser = require('body-parser');

var core = require('./manticore.js');
var interactive = require('./interactive.js');
var trigger = require('./trigger.js');
var Record = require('./record.js');
var Sensor = require('./sensor.js');
var request = require('request');
// view engine set up
api.set('views', path.join(__dirname, 'web/views'));
api.set('view engine', 'jade');
api.use(express.static(path.join(__dirname, 'web/static')));

api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json());

/**
 * Handles the 'ready' event on the core
 * This implies that the core has started
 * and have been initialized
 * Thus, we can now handle external communication on the HTTP server
 */
core.on('ready', function() {
	// advertise the sensors every 20s
	setInterval(function() {
		if (_.has(core, 'sensors'))
			core.publish('new_sensor', {sensors: core.sensors});
	}, 20000, 0);

	api.get('/', function(req, res) {
		//console.log('>[HTTP]\tWeb UI from '+ req.ip +' on ' +req.headers['user-agent']);
		res.render('index', { title: 'Manticore on '+core.name, name: core.name, nodes: core.nodes, sensors: core.sensors, records: core.records});
	});

	api.get('/nodes', function(req, res) {
		console.log('>[HTTP]\t/nodes/ from '+ req.ip +' on '+ req.headers['user-agent']);
		res.set({'Content-Type': 'application/json'});
		res.send({nodes: core.nodes });
	});

	// HTTP GET /request/[uuid]?port=[portnumber]?dst=[endpoint]
	api.get('/request/:id', function(req, res) {
		console.log('>[HTTP]\tRequest resource from '+ req.ip +' with id '+req.param('id'));
		res.set({'Content-Type': 'text/plain'});
		var resource = req.param('id');
		var port = req.query.port || 16161;
		var src = req.ip;
		if (src === "127.0.0.1") { src = core.ip; } // if src is local then we want to send to the IP advertised on Bonjour
		var dst = req.query.dst;
		if (dst === "IP") { dst = src; }  // if dst not specified using the IP of the client
		core.requestResource(resource, port, src, dst, function(err, header, payload) {
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

	api.post('/receive/:id', function(req, res) {
		var id = req.param('id');
		if (!core.mobileDevices[id]) {
			core.mobileDevices[id] = {};
			var new_sensor = new Sensor('mobile', id, '', '', function(err){
				if (err === null) {
					core.sensors.push(this);
					core.publishSensors();
				}
				else {
					console.log("![DTEC]\t"+err);
				}
			});
		}
		core.mobileDevices[id].data = [req.body.x, req.body.y, req.body.z, req.body.timestamp];
		res.end('ok');
	});
	setInterval(function() {
		for (var id in core.mobileDevices) {
			if (new Date().getTime() - core.mobileDevices[id].data[3] > 4000) {
				if (core.mobileDevices[id].tid != undefined) {
					clearInterval(core.mobileDevices[id].tid);
				}
				delete core.mobileDevices[id];
				console.log("-[SENS]\tSensor down! Mobile device " + id);
				for (var i in core.sensors) {
					if (core.sensors[i].id == id) {
						core.sensors.splice(i, 1);
					}
				}
			};
		}
	}, 5000);

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
			if (idx !== null) {
				// maybe better to do a diff here
				core.nodes[idx].sensors = payload.sensors;
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
			var returnStatus = false;
			var sensor = _.findWhere(core.sensors, {id: payload.data});
			console.log(sensor);
			if (sensor !== undefined) {
				var dst = payload.dst;
				if (dst === this.ip) dst = '127.0.0.1';
				var opts = [dst, payload.port, header.src+'-'+payload.port+'.pd'];
				var new_record = new Record(payload.data, 'active_resource', header.src, dst, payload.port, core.itself);
				var mode = (mode in payload) ? payload.mode : 'default';
				var type = payload.type;
				if (type == 'normal') {
					sensor.request(mode, opts, function(err, child) {
						if (err === null) {
							returnStatus = true;
							if (child) {
							new_record.addChild(child);
							}
							core.records.push(new_record);
						}
						core.reply('ack', envelope, {status: returnStatus});
					});		
				}
				else if (type == 'mobile') {
					console.log('mobile request');
					returnStatus = true;
					core.records.push(new_record);
					core.reply('ack', envelope, {status: returnStatus});
					var data;
					core.mobileDevices[payload.data].tid = setInterval(function() {
						request.post('http://' + dst + ':' + payload.port + '/receive', {form: core.mobileDevices[payload.data].data});
					}, 100);
				}
			}
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
		// implicit release/kill of active resources
		var deadNodeRecords = _.where(this.records, {type: 'active_resource', source: deadNodeId});
		_.each(deadNodeRecords, function(record) {
			if (record.child) record.child.kill();
			var index = _.indexOf(core.records, record);
			core.records.splice(index,1);
		});
		// TODO need to do sthg with client_request too
	}
});

/**
 * Handles the 'test' event on the core
 * Used for debug purpose only
 */
core.on('test', function(){
	// Do some testing here
	// and use the emit command in interactive mode to trigger the event 'test'
	console.log('This is test mode.');
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

// Start HTTP server to serve JSON API
api.listen(3000, function() {
	console.log('+[HTTP]\tListening on 3000');
});
