#!/usr/bin/env node

const service_name = "node";
const service_port = 32323;




/* Retrieving the hostname on the current node */

var os = require('os');
var hostname = os.hostname();
console.log(hostname);
console.log(os.release());




/* mDNS info channel (inch) advertisement */


// dependencies
var mdns = require('mdns');
var zmq = require('zmq');


// advertisement of a _node._tcp. service on this node, on port 32323
var advertiser = mdns.createAdvertisement(mdns.tcp(service_name), service_port);

// _node._tcp. service browser
var browser = mdns.createBrowser(mdns.tcp(service_name));

// network object, containing all _node._tcp. service nodes
var network_cap = new network_capabilities();


// browser events
browser.on('serviceUp', function(service) {
  console.log("InCh : service up: ", service.name);
  network_cap.nodes.push(new node(service.host, service.addresses));
  console.log(network_cap);
});
browser.on('serviceDown', function(service) {
  console.log("InCh : service down: ", service.name);
});


// starting advertiser and browser
advertiser.start();
browser.start();








// network object
function network_capabilities (){
	this.nodes = [];
};

// function filtering ipv6 addresses in the "addresses" field of the object return by the mdns browse
function filter_ipv4(addresses){
	var res = "undefined";
	for (k in addresses){
		if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(addresses[k])) res = addresses[k];
	}
	console.log(res);
	return res;
}
// node object 
function node (host, ip, port){
	this.host = host;
	this.ip = filter_ipv4(ip);
	this.subscribe_socket = new subscribe_socket(ip);
};

// publish socket object
function publish_socket(){
	var publisher = zmq.socket('pub');
	var tcp_port = "tcp://*:"+ service_port;

	process.stdin.setEncoding('utf8');

	publisher.bind(tcp_port, function(err) {
  		if(err)
    		console.log(err);
  		else
    		console.log("Inch : Listening on "+service_port+"...");
	});


	process.stdin.on('readable', function() {
  		var chunk = process.stdin.read();
  		if (chunk !== null) {
   			publisher.send(chunk);
    		console.log("Inch : Published ==>: "+chunk);
  		}
	});
}

// subscribe socket object
function subscribe_socket (peer){
	var subscriber = zmq.socket('sub');
	var tcp_port = "tcp://"+peer+":" + service_port ;
	subscriber.connect(tcp_port);
	subscriber.subscribe('');

	console.log("InCh : Created subscribe socket to:" + tcpport);

	subscriber.on("message", function(reply) {
  		console.log("InCh : Received <==: ", reply.toString());
	});
}





