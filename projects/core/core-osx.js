#!/usr/bin/env node

/* Retrieving the hostname on the current node */

var os = require('os');
var hostname = os.hostname();
console.log(hostname);
console.log(os.release());




/* mDNS info channel (inch) advertisement */


// npm install mdns 
var mdns = require('mdns');
// npm install zmq
var zmq = require('zmq');



// Info Channel advertisement in Zeroconf

var txt_record = { id: 'clement', pp: false};
var inch = mdns.createAdvertisement(mdns.tcp('http'), 45678, {txtRecord: txt_record});


inch.start();



// _node._tcp. service browser

var browser = mdns.createBrowser(mdns.tcp('node'));
var network_cap = new network_capabilities();

browser.on('serviceUp', function(service) {
  console.log("service up: ", service.name);
  network_cap.nodes.push(new node(service.host, service.addresses));
  console.log(network_cap.nodes);
});
browser.on('serviceDown', function(service) {
  console.log("service down: ", service.name);
});

browser.start();

// function zeroconfAdvertisement() {}


// network object
function network_capabilities (){
	this.nodes = [];
};


// node object 
function node (host, ip){
	this.host = host;
	this.ip = ip;
	this.subscribe_socket = new subscribe_socket(ip[0]);
};

// subscribe socket object
function subscribe_socket (peer){
	var subscriber = zmq.socket('sub');
	var tcp_port = "tcp://"+peer+":9999" ;
	subscriber.connect(tcp_port);
	subscriber.subscribe('');

	subscriber.on("message", function(reply) {
  		console.log('Received message: ', reply.toString());
	});
}





