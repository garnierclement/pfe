/**
 * Constants
 */
const NODE_SERVICE = 'node';
const INCH_PORT = 32323;
const LOCAL_PORT = 42424;

/** 
 * Module dependencies
 */
var uuid = require('uuid');
var mdns = require('mdns');		// Zeroconf / mDNS / DNS-SD
var zmq = require('zmq');		// ZeroMQ
var dgram = require('dgram');	// for UDP sockets
var util = require('util'),		// extend the Core to be an EventEmitter
	EventEmitter = require('events').EventEmitter;

/**
 * SubSocket object
 * 
 * @param {String} peer IP address of the peer
 * @param {String} host hostname of the peer
 */
function SubSocket (peer, host){
	var subscriber = zmq.socket('sub');
	subscriber.connect('tcp://'+peer+':'+INCH_PORT);
	subscriber.subscribe('');
	subscriber.identity = host ;

	console.log('+[INCH] Subscribe to '+peer);

	subscriber.on("message", function(msg) {
  		console.log('>[INCH] From ' + subscriber.identity +' : ' + msg.toString());
	});

	subscriber.on('error', function(err) {
		console.log('![INCH] Subscriber error'+err);
	});
}

/**
 * filter_ipv4 filtering ipv6 addresses in the "addresses" field of the object return by the mdns browse]
 * @param  {[type]} addresses [description]
 * @return {String}           [first IPv4 address found]
 */
function filter_ipv4(addresses){
	var res = "undefined";
	for (k in addresses){
		if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(addresses[k])) 
			res = addresses[k];
	}
	return res;
}

/**
 * Node object
 * @param {String} host    node hostname
 * @param {String} name    node canonical name
 * @param {String} ip      node IP address
 * @param {String} my_uuid current uuid
 * @param {String} uuid    node uuid
 */
function Node (host, name, ip, my_uuid, uuid)
{
	this.id = uuid;
	this.host = host;
	this.name = name;
	this.ip = filter_ipv4(ip);
	if(my_uuid != uuid){
		this.subscribe_socket = new SubSocket(this.ip, host);
	}else{
		this.subscribe_socket = null;
	}
}

/**
 * Core object
 */
function Core() 
{
	var self = this;

	// name
	this.name = require('os').hostname();

	this.uuid = uuid.v1();

	// nodes
	// store node objects { name: "", id: "", ip: "", ...}
	this.nodes = [];

	// toString()
	this.toString = function() 
	{
		return this.name;
	};

	// publisher socket (inch)
	this.publisher = zmq.socket('pub');

	// local channel
	this.loch = dgram.createSocket('udp4');

	// advertisement of a _node._tcp. service on this node, on port 32323
	this.advertiser = createAdvertisement(this.uuid);

	// _node._tcp. service browser
	this.browser = mdns.createBrowser(mdns.tcp(NODE_SERVICE));

	// browser events
	this.browser.on('serviceUp', function(service) {
		console.log('+[INCH] Service up: '+service.name+' at '+service.addresses+' ('+service.networkInterface+')');
		if(!findIdNodes(self.nodes,service.txtRecord.id)){
			self.nodes.push(new Node(service.host, service.name, service.addresses, self.uuid, service.txtRecord.id));
			console.log('+[INCH] Adding node id '+service.txtRecord.id);
		}
		else {
			console.log('![INCH] Node id '+service.txtRecord.id+' is already present');
		}
	});
	this.browser.on('serviceDown', function(service) {
		console.log('-[INCH] Service down: '+service.name+' ('+service.networkInterface+')');
		deleteDeadNode(self.nodes,service.name);

	});

	this.browser.on('error', function(error) {
		console.log('![INCH] Browser error: '+error)
	});

	// initialisation
	this.init = function() {
		// start init
		console.log('+[CORE] Core starting on '+self.name);
		// bind local socket
		self.loch.bind(LOCAL_PORT, '127.0.0.1', function() {
			var address = self.loch.address();
			console.log('+[LOCH] Local UDP socket listening on '+address.address+':'+address.port);
		});
		// TODO for all theses initialization
		// see if async and waterfall can simplify the code (callback hell ?)
		self.publisher.bind('tcp://*:'+INCH_PORT, function(err) {
			if (err) {
				console.log('![INCH] Publisher binding error: '+err);
			}
			else {
				// bind ok
				console.log('+[INCH] Publisher socket listening on '+INCH_PORT);
				// start advertising
				self.advertiser.start();
				console.log('+[CORE] Advertising _'+NODE_SERVICE+'._tcp on '+INCH_PORT);
				// start browser
				self.browser.start();
				console.log('+[INCH] Start browsing for _'+NODE_SERVICE+'._tcp services');

			}
		});
		self.emit('ready');
	};

	// closing, cleaning
	this.close = function() {
		self.browser.stop();
		self.advertiser.stop();
		console.log('[CORE] Closing');
		process.exit();
	};
}
util.inherits(Core, EventEmitter);

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

/**
 * Delete node when service down
 * @param  {Node[]}	nodes      list of nodes
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
		console.log('![INCH] Error cannot delete node '+node_name+', not found');
	}
}

/**
 * Check if a particular node is present within a list of node
 * Using uuid to distinguish nodes
 * 
 * @param  {Node[]} nodes list of nodes
 * @param  {String} uuid  uuid of the sought node
 * @return {Boolean}      return true if found
 */
function findIdNodes(nodes, uuid){
	var res = false;
	for(k in nodes){
		if (nodes[k].id == uuid)  
			res = true;
	}
	return res;
}

/**
 * Wrapper for creating mDNS advertiser
 * @param  {String} uuid identifier of the node
 * @return {Advertiser}
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

/*
 * Expose the Core object
 */
module.exports = new Core();
