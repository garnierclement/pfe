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


// function zeroconfAdvertisement() {}


