/**
 * Constants
 */
const NODE_SERVICE = 'node'; // _node._tcp
const INCH_PORT = 32323;
const UDP_PORT = 42424;
const MACH_PORT = 45454;

/** 
 * Module dependencies
 */
var uuid = require('uuid');
var mdns = require('mdns');		// Zeroconf / mDNS / DNS-SD
var zmq = require('zmq');		// ZeroMQ
var dgram = require('dgram');	// for UDP sockets
var util = require('util'),		// extend the Core to be an EventEmitter
	EventEmitter = require('events').EventEmitter;
var _ = require("underscore");
var fs = require('fs');
var os = require('os');

var Node = require('./node.js');		// Node object
var Sensor = require('./sensor.js');	// Sensor object
var Record = require('./record.js');	// Record object

/**
 * Core object
 *
 * @name		hostname of the current computer
 * @uuid		unique identifier of the current core process
 * @nodes		array of Node objects 
 * @publisher	publisher socket (ZeroMQ) for information channel (InCh)
 * @udp			udp socket 
 * @advertiser	mDNS advertiser of service _node._tcp
 * @browser		DNS-SD browser of _node._tcp services		
 * @mach		tcp socket for direct communication between node's core (MaCh)
 */
function Core()
{
	this.name = os.hostname();
	this.uuid = uuid.v1();
	this.arch = os.arch();
	this.platform = os.platform();
	this.nodes = [];						// store discovered nodes
	this.ip = null;							// IP address advertised on Zeroconf
	this.sensors = [];						// store local sensors
	this.records = [];
	this.lastPublish = null;
	this.publisher = zmq.socket('pub');		// publisher socket (InCh)
	this.subscriber = zmq.socket('sub');	// subscriber socket (InCh)
	this.udp = dgram.createSocket('udp4');	// local udp socket for receiving OSC data
	this.requester = zmq.socket('dealer');	//
	this.mach = zmq.socket('router');
	this.syncRequester = zmq.socket('req');
	// advertisement of a _node._tcp. service on this node, on port 32323
	this.advertiser = createAdvertisement(this.uuid);
	// _node._tcp. service browser
	this.browser = mdns.createBrowser(mdns.tcp(NODE_SERVICE));
}
// Inherit from `EventEmitter.prototype`.
util.inherits(Core, EventEmitter);

// Expose the Core singleton 
// Provide self for convenience within module
var self = module.exports = new Core();

/**
 * Initiliaze the Core singleton
 * Binding sockets, advertising and browsing for other _node._tcp cores
 * Emit 'ready' event when initialized
 */
Core.prototype.init = function() {
	console.log('+[CORE]\tCore starting on '+this.name);
	console.log('+[CORE]\tCore id '+this.uuid);
	// bind local socket
	this.udp.bind(UDP_PORT, function() {
		var address = self.udp.address();
		console.log('+[UDP]\tUDP socket listening on '+address.address+':'+address.port);
	});
	// bind publish socket and start advertising and browsing
	this.publisher.bind('tcp://*:'+INCH_PORT, function(err) {
		if (err) {
			console.log('![PUB]\tPublisher binding error: '+err);
		}
		else {
			console.log('+[PUB]\tPublisher socket listening on '+INCH_PORT);
			self.advertise();
			self.browse();
		}
	});
	// bind mach channel
	this.mach.bind('tcp://*:'+MACH_PORT, function(err) {
		if (err)
			console.log('![MACH]\tSocket binding error: '+err);
		else
			console.log('+[MACH]\tSocket listening on '+MACH_PORT);
	});
	console.log('+[CORE]\tDetect sensors');
	this.detectSensors();
	// subscribe socket
	this.emit('ready');
};

/**
 * Start mDNS advertisement of _node._tcp service
 */
Core.prototype.advertise = function() {
	this.advertiser.start();
	console.log('+[CORE]\tAdvertising _'+NODE_SERVICE+'._tcp on '+INCH_PORT);
};

/**
 * Start discovery of _node._tcp services
 */
Core.prototype.browse = function() {
	this.browser.start();
	console.log('+[mDNS]\tStart browsing for _'+NODE_SERVICE+'._tcp services');
};

/**
 * Handle the reception of messages on the subscriber socket (inch)
 * Emits 'inch' event on core
 * 
 * @param  {blob} data [blob of data (JSON)]
 */
self.subscriber.on('message', function(data) {
	// console.log(':[DBUG]\tSubscriber: '+arguments.length);
	// for (var k in arguments)
	// 	console.log(arguments[k].toString());
	var msg = JSON.parse(data);
	self.emit('inch', msg.header, msg.payload);
});

/**
 * Wrappers arount socket reception of message
 * Emits 'mach' event on core
 * 
 * @param  {blob} data [blob of data (JSON)]
 */

self.mach.on('message', function() {
	// console.log(':[DBUG]\tRouter: '+arguments.length);
	// for (var k in arguments)
	// 	console.log(arguments[k].toString());
	switch (arguments.length) {
		case 2:
			var envelope = arguments[0];
			var msg = JSON.parse(arguments[1]);
			break;
		case 3:
			var envelope = arguments[0];
			var msg = JSON.parse(arguments[2]);
			break;
		default:
			return;
	}
	self.emit('mach', envelope, msg.header, msg.payload);
});

self.requester.on('message', function(data) {
	// console.log(':[DBUG]\tDealer: '+arguments.length);
	// for (var k in arguments)
	// 	console.log(arguments[k].toString());
	switch (arguments.length) {
		case 2:
			var data = JSON.parse(arguments[1]);
			break;
		case 3:
			var data = JSON.parse(arguments[2]);
			break;
		default:
			return;
	}
	self.emit('reply', data.header, data.payload);
});

/**
 * Display errors with sockets
 */
self.subscriber.on('error', function(err) {
	console.log('![SUB]\tSocket error: '+err);
});

self.mach.on('error', function(err) {
	console.log('![REP]\tSocket error: '+err);
});

self.requester.on('error', function(err) {
	console.log('![REQ]\tSocket error: '+err);
});

self.publisher.on('error', function(err) {
	console.log('![PUB]\tSocket error: '+err);
});

self.udp.on('message', function(buffer, rinfo) {
	console.log('>[UDP]\tfrom '+rinfo.address+' on '+rinfo.port);
	console.log(buffer.toString());
});

/**
 * Handle the discovery of new _node._tcp service
 * (mDNS browser event)
 */
self.browser.on('serviceUp', function(service) {
	console.log('+[mDNS]\tService up: '+service.name+' at '+service.addresses+' ('+service.networkInterface+')');

	if(self.findNodeById(service.txtRecord.id) === false)
	{
		var new_node = new Node(service);
		if (self.uuid != service.txtRecord.id) {
			self.newSubscribe(new_node.ip);
			self.delayedPublishSensors(1000);
		}
		else {
			// note if node discovered itself
			new_node.itself = true;
			// register advertising ip, we should see ourself
			self.ip = new_node.ip;
			// link core.sensors with core.nodes[itself].sensors
			new_node.sensors = self.sensors;
		}
		self.nodes.push(new_node);
		console.log('+[CORE]\tAdding node id '+service.txtRecord.id);
	}
	else {
		console.log('![CORE]\tNode id '+service.txtRecord.id+' is already present');
	}
});

/**
 * Subscribe to new discovered node
 * 
 * @param  {String} peer [IP address of the new discovered node]
 */
Core.prototype.newSubscribe = function(peer) {
	this.subscriber.connect('tcp://'+peer+':'+INCH_PORT);
	this.subscriber.subscribe('');
	console.log('+[SUB]\tSubscribing to '+peer);
};

/**
 * Delete dead node from local node list when 'serviceDown'
 */
self.browser.on('serviceDown', function(service) {
	console.log('-[mDNS]\tService down: '+service.name+' ('+service.networkInterface+')');
	var deadNodeId = self.deleteDeadNode(service);
	self.emit('died', deadNodeId);
});

/**
 * Handle mDNS browser errors
 */
self.browser.on('error', function(error) {
	console.log('![mDNS]\tBrowser error: '+error);
});

/**
 * Get the name of the Core
 */
Core.prototype.toString = function() {
	return this.name;
};

/**
 * Stopping mDNS advertising/browsing,
 * closing sockets and exiting
 */
Core.prototype.close = function(exit) {
	console.log('[CORE]\tClosing');
	this.browser.stop();
	this.advertiser.stop();
	this.publisher.close();
	this.subscriber.close();
	this.requester.close();
	this.udp.close();
	if (typeof exit === "undefined")
		process.exit();
};

/**
 * [publish description]
 * @param  {[type]} data [description]
 */
Core.prototype.publish = function(cmd, data) {
	this.publisher.send(JSON.stringify(this.createMessage(cmd, data)));
};

/**
 * Create an object representing the structure of message
 * used between cores
 * always adding name and uuid
 * 
 * @param  {String} cmd  [type of the message]
 * @param  {?}		data [payload of the message]
 * @return {Object}      [message sent on the socket]
 */
Core.prototype.createMessage = function(cmd, data) {
	var h = {src: this.uuid, name: this.name, ip: this.ip, type: cmd};
	return {header: h, payload: data};
};

/**
 * [send description]
 * @param  {[type]} dst  [description]
 * @param  {[type]} cmd  [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Core.prototype.send = function(dst, cmd, data) {
	if (dst !== null) {
		this.requester.connect('tcp://'+dst+':'+MACH_PORT);
		this.requester.send([null, JSON.stringify(this.createMessage(cmd, data))]);
		console.log('+[ASYN]\tSending '+cmd+' with '+data+' to '+dst);
	}
	else {
		throw 'send() to null IP';
	}
};

Core.prototype.syncSend = function(dst, cmd, data, callback) {
	var socket = zmq.socket('req');
	if (dst !== null) {
		socket.connect('tcp://'+dst+':'+MACH_PORT);
		socket.send(JSON.stringify(this.createMessage(cmd, data)));
		console.log('+[SYNC]\tSending '+cmd+' with '+data.toString()+' to '+dst);

		socket.on('message', function(data) {
			console.log('>[SYNC]\tReceived '+data.toString());
			var msg = JSON.parse(data);
			callback(msg.header, msg.payload);
			socket.close();
		});
	}
	else {
		throw 'send() to null IP';
	}
};

Core.prototype.reply = function(cmd, envelope, data) {
	var msg = this.createMessage(cmd, data);
	this.mach.send([envelope, '', JSON.stringify(msg)]);
};

/**
 * Delete node when service down
 * @param  {Node[]}	nodes      list of Node objects
 * @param  {Object} service 
 */
Core.prototype.deleteDeadNode = function(service){
	var index = null;
	var deadNodeId = null;
	for(var k in this.nodes){
		if (this.nodes[k].name == service.name && this.nodes[k].network_iface == service.networkInterface)
			index = k;
	}
	if(index !== null) {
		if (service.name != this.name && this.nodes[index].ip != this.ip) {
			this.subscriber.disconnect('tcp://'+this.nodes[index].ip+':'+INCH_PORT);
		}
		deadNodeId = this.nodes[index].id;
		this.nodes.splice(index,1);
		console.log('-[CORE]\tDeleting node '+service.name);
	}
	else {
		console.log('![CORE]\tError cannot delete node '+service.name+', not found ; no harm, maybe just a duplicate \'serviceDown\' or multiple interface self-discovery');
	}
	return deadNodeId;
};

/**
 * Check if a particular node is present within a list of node
 * Using UUID to disambiguate nodes
 * 
 * @param  {String} uuid  [uuid of the sought node]
 * @return {Boolean}      [return true if found}
 */
Core.prototype.findNodeById = function (uuid){
	for(var k in this.nodes){
		if (this.nodes[k].id === uuid)
			return k;
	}
	return false;
};

Core.prototype.getNodeById = function(uuid){
	for(var idx in this.nodes){
		if (this.nodes[idx].id === uuid)
			return this.nodes[idx];
	}
	return null;
};

Core.prototype.getNodeIpById = function(uuid){
	for(var idx in this.nodes){
		if (this.nodes[idx].id === uuid)
			return this.nodes[idx].ip;
	}
	return null;
};

/**
 * Wrapper for creating mDNS advertiser
 * Using DNS TXT records to publish additional information of the node 
 * 
 * @param  {String} uuid identifier of the node
 * @return {mdns.Advertisement}
 */
function createAdvertisement(uuid)  {
    var mdns_txt_record = {
        id: uuid
    };
    
    var advertiser = mdns.createAdvertisement(mdns.tcp(NODE_SERVICE), INCH_PORT, {txtRecord: mdns_txt_record});
    advertiser.on('error', function(error) {
        console.log("![CORE]\t", error);
        setTimeout(createAdvertisement, 30 * 1000);
    });
    return advertiser;
}


/**
 * Procedure for requesting a resource from one node to another
 *		- send a synchronous 'request' 
 *		- return a callback the content of the reply
 * @param  {String}   res      [description]
 * @param  {Integer}   port     [description]
 * @param  {Function} callback [description]
 */
Core.prototype.requestResource = function (res, port, src_ip, callback) {
	// Check validity of the request (port, resource)
	var p = isValidPort(port) ? port : 16161;
	var found = false;
	for (var i = 0; i < this.nodes.length; i++) {
		if (this.nodes[i].id === res || _.findWhere(this.nodes[i].sensors, {id: res}) !== undefined) {
			found = true;
			break;
		}
	}
	// Send the request to the corresponding node 
	// (i.e. the one providing the resource)
	if (found) {
		var dst = this.nodes[i].ip;
		if (dst === this.ip) dst = '127.0.0.1';
		this.syncSend(dst, 'request', this.requestPayload(res,p), function(header, payload) {
			if (payload.status) {
				var new_record = new Record(res, 'client_request', src_ip, dst, port);
				self.records.push(new_record);
			}
			callback(null, header, payload);
		});
	}
	else {
		var err = '![REQR] Resource '+res+' not valid';
		callback(err, null, null);
	}
};

/**
 * Send a realease message to release a resource
 * @param  {String}   res      UUID of the resource to be released
 * @param  {Function} callback [description]
 */
Core.prototype.releaseResource = function (res, callback) {
	// Check Core.records if the release request is correct
	// i.e there is a record for it
	var correct = false;
	var dst = "";
	for (var idx = 0; idx < this.records.length; idx++) {
		if (this.records[idx].resource === res && this.records[idx].type === 'client_request') {
			correct = true;
			var record = this.records[idx];
			dst = record.dst;
			break;
		}
	}
	if (correct) {
		this.syncSend(dst, 'release', this.releasePayload(res), function(header, payload) {
			// remove the 'client_request' record
			// need to think about the status from the ack
			// now we erase the record all the time (either the release was successful or not)
			// 
			var index = _.indexOf(self.records, record);
			self.records.splice(index,1);
			callback(null, header, payload);
		});
	}
	else {
		var err = '![RELR] The release resource is not correct, record not found';
		callback(err);
	}
};

function isValidPort(port) {
	if(!isNaN(Number(port))) {
		if (port > 0 && port <= 65536)
			return true;
	}
	return false;
}

/**
 * Sensors detection
 */
Core.prototype.detectSensors = function() {
	console.log("+[DTEC] Looking for sensors");
	var sensorsPath = '../../sensors/';
	var list = fs.readdirSync(sensorsPath);
	for (var i = 0; i < list.length; i++) {
		var elemPath = sensorsPath+list[i];
		var stat = fs.statSync(elemPath);
		if (stat.isDirectory()) {
			try {
				var descriptionFile = require(elemPath+'/description.json');
				var systems = [];
				_.each(descriptionFile.systems, function(system, system_name) {
					if (system.platform === self.platform) {
						if (system.arch) {
							if (system.arch === self.arch) {
								systems.push(system_name);
							}
						}
						else {
							systems.push(system_name);
						}
					}
				});
				if (systems.length > 0) {
					var new_sensor = new Sensor(descriptionFile, systems);
					this.sensors.push(new_sensor);
				}
			}
			catch (e) {
				console.log('![DTEC] '+e);
			}
		}
	}
	this.delayedPublishSensors(5000);
};

Core.prototype.delayedPublishSensors = function(delay) {
	var now = new Date();
	if (this.sensors.length > 0 && (now - lastPublish) > 2000)  {
		setTimeout(function() {
			console.log("+[SENS] Publishing "+self.sensors.length+" sensors");
			self.publish('new_sensor', {sensors: self.sensors});
		}, delay);
	}
};

/******* Message payloads *********/
Core.prototype.requestPayload = function (res, port) {
	var _p = port || UDP_PORT;
	return {data: res, port: _p};
};

Core.prototype.ackPayload = function (s) {
	return {status: s};
};

Core.prototype.releasePayload = function (res) {
	return {data: res};
};

/**
 * Fake the detection of sensors and publish them on InCh
 * This function is intented to be removed later
 * It is just used to simulate the presence of sensors and their capabilities
 */
Core.prototype.fakeSensors = function () {
	// Generate fake sensors
	var sensor1 = new Sensor({name: "Mouse"}, null);
	sensor1.addData('X','/mouse/x f');
	sensor1.addData('Y','/mouse/y f');
	this.sensors.push(sensor1);
	var sensor2 = new Sensor({name: "Intertial"}, null);
	sensor2.addData('Roll','/intertial/roll f');
	sensor2.addData('Pitch','/intertial/pitch f');
	sensor2.addData('Yaw','/intertial/yaw f');
	this.sensors.push(sensor2);
	// publish them
	this.publish('new_sensor', {sensors: this.sensors});
};
