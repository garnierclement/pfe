var WebSocketServer = require('websocket').server;
var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
var options = process.argv;

console.log(options);

var port = options[3] ? options[3] : 8081;

var server = http.createServer(app).listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

var dataQueue = {};
var requesters = {};
var ipTable = {};

wsServer.on('request', function(req) {
  var connection = req.accept('manticore', req.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function(message) {
    var data = JSON.parse(message.utf8Data);
  	if (!ipTable[connection.remoteAddress] || ipTable[connection.remoteAddress] != data.id) {
    	ipTable[connection.remoteAddress] = data.id;
    	request.post('http://127.0.0.1:3000/mobile', {form: {status: 1, id: data.id}}, function(error) {});
    }
    if (requesters[data.id] != undefined) {
    	for (var rid in requesters[data.id]) {
    		requesters[data.id][rid].data.push(data);
    	}
    }
    // connection.sendUTF(message.utf8Data);
  });
  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
      if (ipTable[connection.remoteAddress]) {
      	var id = ipTable[connection.remoteAddress]; 
      	request.post('http://127.0.0.1:3000/mobile', {form: {status: 0, id: id}}, function(error) {});
      	// for (var rid in requesters[id]) {
      	// 	clearInterval(requesters[id][rid].tid);
      	// }
      	// delete requesters[id];
      	delete ipTable[connection.remoteAddress];
      }
  });
});

app.post('/addRequester', function(req, res) {
	var id = req.body.id;
	var addr = req.body.address;
	var port = req.body.port;
	var rid = addr + ':' + port;
	req.body.data = [];
	req.body.tid = setInterval(function() {
		if (requesters[id][rid].data.length > 0) {
			var data = requesters[id][rid].data.shift();
			request.post('http://' + addr + ':' + port, {form: data}, function(error) {});
		}
	}, 100);
	if (!requesters[req.body.id]) {
		requesters[req.body.id] = {};
	}
	requesters[req.body.id][rid] = req.body;
	res.end('ok');
});