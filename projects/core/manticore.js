/**
 * Constants
 */
const NODE_SERVICE = 'node'; // _node._tcp
const INCH_PORT = 32323;
const LOCAL_PORT = 42424;
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
var Node = require('./node.js');// Node object

/**
 * Core object
 */
function Core() 
{
	var self = this;
	this.name = require('os').hostname();
	this.uuid = uuid.v1();
	this.nodes = [];	// store node objects { name: "", id: "", ip: "", ...}
	this.publisher = zmq.socket('pub');	// publisher socket (inch)
	this.loch = dgram.createSocket('udp4');	// local channel
	// advertisement of a _node._tcp. service on this node, on port 32323
	this.advertiser = createAdvertisement(this.uuid);
	// _node._tcp. service browser
	this.browser = mdns.createBrowser(mdns.tcp(NODE_SERVICE));
	this.mach = zmq.socket('rep');
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
	console.log('+[CORE] Core starting on '+this.name);
	// bind local socket
	this.loch.bind(LOCAL_PORT, '127.0.0.1', function() {
		var address = self.loch.address();
		console.log('+[LOCH] Local UDP socket listening on '+address.address+':'+address.port);
	});
	// bind publish socket and start advertising and browsing
	this.publisher.bind('tcp://*:'+INCH_PORT, function(err) {
		if (err) {
			console.log('![INCH] Publisher binding error: '+err);
		}
		else {
			console.log('+[INCH] Publisher socket listening on '+INCH_PORT);
			self.advertise();
			self.browse();
		}
	});
	// bind mach channel
	self.mach.bind('tcp://*:'+MACH_PORT, function(err) {
		if (err)
			console.log('![MACH] Socket binding error: '+err);
		else
			console.log('+[MACH] Publisher socket listening on '+MACH_PORT);
	});
	self.emit('ready');
};

/**
 * Start mDNS advertisement of _node._tcp service
 */
Core.prototype.advertise = function() {
	this.advertiser.start();
	console.log('+[CORE] Advertising _'+NODE_SERVICE+'._tcp on '+INCH_PORT);
};

Core.prototype.browse = function() {
	this.browser.start();
	console.log('+[INCH] Start browsing for _'+NODE_SERVICE+'._tcp services');
};

/**
 * Handle the discovery of new _node._tcp service
 * (mDNS browser event)
 */
self.browser.on('serviceUp', function(service) {
	console.log('+[INCH] Service up: '+service.name+' at '+service.addresses+' ('+service.networkInterface+')');

	if(!findNodeById(self.nodes,service.txtRecord.id)){
		self.nodes.push(new Node(service.host, service.name, service.addresses, self.uuid, service.txtRecord.id));
		console.log('+[INCH] Adding node id '+service.txtRecord.id);
	}
	else {
		console.log('![INCH] Node id '+service.txtRecord.id+' is already present');
	}
});

/**
 * Delete dead node from local node list
 */
self.browser.on('serviceDown', function(service) {
	console.log('-[INCH] Service down: '+service.name+' ('+service.networkInterface+')');
	deleteDeadNode(self.nodes,service.name);
});

/**
 * Handle mDNS browser errors
 */
self.browser.on('error', function(error) {
	console.log('![INCH] Browser error: '+error);
});

/**
 * Get the name of the Core
 */
Core.prototype.toString = function() {
	return this.name;
};

/**
 * Stopping mDNS advertising/browsing and exiting
 */
Core.prototype.close = function() {
	console.log('[CORE] Closing');
	this.browser.stop();
	this.advertiser.stop();
	process.exit();
};

/**
 * Delete node when service down
 * @param  {Node[]}	nodes      list of Node objects
 * @param  {String} node_name  node canonical name to be deleted
 */
function deleteDeadNode(nodes, node_name){
	var index = null;
	for(k in nodes){
		if (nodes[k].name == node_name)  index = k;
	}
	if(index != null) {
		nodes.splice(index,1);
		console.log('-[INCH] Deleting node '+node_name);
	}
	else {
		console.log('![INCH] Error cannot delete node '+node_name+', not found ; no harm, maybe just a duplicate serviceDown');
	}
}

/**
 * Check if a particular node is present within a list of node
 * Using UUID to disambiguate nodes
 * 
 * @param  {Node[]} nodes list of nodes
 * @param  {String} uuid  uuid of the sought node
 * @return {Boolean}      return true if found
 */
function findNodeById(nodes, uuid){
	var res = false;
	for(k in nodes){
		if (nodes[k].id == uuid)  
			res = true;
	}
	return res;
}

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
        console.log("![CORE] ", error);
        setTimeout(createAdvertisement, 30 * 1000);
    });
    return advertiser;
}

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