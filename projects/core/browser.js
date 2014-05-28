#!/usr/bin/env node

var mdns = require('mdns2');

const NODE_SERVICE = 'node';

try {
  var browser = mdns.createBrowser(mdns.tcp(NODE_SERVICE));
} catch (ex) {
  console.log('exception while creating the browser: '+ex);
}

browser.on('error', function(error) {
  console.log('error browser'+error);
});

browser.on('serviceUp', function(service) {
	console.log('[UP] '+ service.host+' '+service.addresses+':'+service.port);
});

browser.on('serviceDown', function(service) {
	console.log('[DOWN] '+service.hosts);
});

browser.start();
