var WebSocket = require("ws");
// var WebSocketServer = require('websocket').server;
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var osc = require('osc');
var app = express();
app.use("/", express.static(__dirname + "/web"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
var options = process.argv;

var port = options[3] ? options[3] : 8081;
// var server = app.listen(port);
var server = http.createServer(app).listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});
// Listen for Web Socket requests.
var wss = new WebSocket.Server({
    server: server
});

var dataQueue = {};
var requesters = {};
var table = {};

// Listen for Web Socket connections.
wss.on("connection", function (socket) {
  var socketPort = new osc.WebSocketPort({
      socket: socket
  });
  var id;
  socketPort.on("bundle", function (oscMsg) {
    id = oscMsg.packets[3].args[0];
    if (!table[id]) {
	  	table[id] = 1;
	  	request.post('http://127.0.0.1:3000/mobile', {form: {status: 1, id: id}}, function(error) {});
    }
    if (requesters[id] != undefined) {
    	for (var rid in requesters[id]) {
    		requesters[id][rid].data.push(oscMsg);
    	}
    }
  });
  socketPort.on("close", function() {
  	console.log((new Date()) + ' Peer ' + id + ' disconnected.');
  	request.post('http://127.0.0.1:3000/mobile', {form: {status: 0, id: id}}, function(error) {});
  	// for (var rid in requesters[id]) {
  	// 	clearInterval(requesters[id][rid].tid);
  	// }
  	// delete requesters[id];
  	delete table[id];
  });
});
// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 57121
});

// Listen for incoming OSC bundles.
udpPort.on("message", function (oscBundle) {
    console.log("An OSC bundle just arrived!", oscBundle);
});

// Open the socket.
udpPort.open();

// Send an OSC message to, say, SuperCollider
// udpPort.send({
//     address: "/s_new",
//     args: ["default", 100]
// }, "127.0.0.1", 57121);

// wsServer = new WebSocketServer({
//     httpServer: server,
//     autoAcceptConnections: false
// });


// wsServer.on('request', function(req) {
//   var connection = req.accept('manticore', req.origin);
//   console.log((new Date()) + ' Connection accepted.');
//   connection.on('message', function(message) {
//     var data = JSON.parse(message.utf8Data);
//   	if (!table[connection.remoteAddress] || table[connection.remoteAddress] != data.id) {
//     	table[connection.remoteAddress] = data.id;
//     	request.post('http://127.0.0.1:3000/mobile', {form: {status: 1, id: data.id}}, function(error) {});
//     }
//     if (requesters[data.id] != undefined) {
//     	for (var rid in requesters[data.id]) {
//     		requesters[data.id][rid].data.push(data);
//     	}
//     }
//     // connection.sendUTF(message.utf8Data);
//   });
//   connection.on('close', function(reasonCode, description) {
//       console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
//       if (table[connection.remoteAddress]) {
//       	var id = table[connection.remoteAddress]; 
//       	request.post('http://127.0.0.1:3000/mobile', {form: {status: 0, id: id}}, function(error) {});
//       	// for (var rid in requesters[id]) {
//       	// 	clearInterval(requesters[id][rid].tid);
//       	// }
//       	// delete requesters[id];
//       	delete table[connection.remoteAddress];
//       }
//   });
// });

app.post('/addRequester', function(req, res) {
	var id = req.body.id;
	var addr = req.body.address;
	var port = req.body.port;
	var rid = addr + ':' + port;
	req.body.data = [];
	req.body.tid = setInterval(function() {
		if (requesters[id][rid].data.length > 0) {
			var data = requesters[id][rid].data.shift();
			// request.post('http://' + addr + ':' + port, {form: data}, function(error) {});
			udpPort.send(data, addr, port);
		}
	}, 100);
	if (!requesters[req.body.id]) {
		requesters[req.body.id] = {};
	}
	requesters[req.body.id][rid] = req.body;
	res.end('ok');
});