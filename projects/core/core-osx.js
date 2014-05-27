#!/usr/bin/env node

/* Retrieving the hostname on the current node */

var os = require('os');
var hostname = os.hostname();
console.log(hostname);
console.log(os.release());

/* mDNS info channel (inch) advertisement */

// npm install mdns
var mdns = require('mdns');
// Info Channel advertisement in Zeroconf

var txt_record = { id: 'clement', pp: false};
var inch = mdns.createAdvertisement(mdns.tcp('http'), 45678, {txtRecord: txt_record});


inch.start();

// _node._tcp. service browser

var browser = mdns.createBrowser(mdns.tcp('airdrop'));
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


// Creation of new node object 

function network_capabilities (){
	this.nodes = [];
};

function node (host, ip){
	this.host = host;
	this.ip = ip;
};



