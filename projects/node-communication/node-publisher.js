var zmq = require('zmq');
var localsock = zmq.socket('sub');
var publisher = zmq.socket('pub');

var tcpport = 'tcp://*:9999';
var multicast = 'epgm://239.255.1.1:5555';
var local = 'ipc:///tmp/zmq0';

// Local socket
localsock.connect(local);
localsock.subscribe('');

// Publisher
publisher.bind(tcpport, function(err) {
  if(err)
    console.log(err);
  else
    console.log("Listening on "+tcpport);
});

// Upon receiving a message on the local socket, 
// it is sent to all subscribers
localsock.on("message", function(data) {
	publisher.send(data);
});

process.on('SIGINT', function() {
  localsock.close();
  console.log('\nClosed');
});