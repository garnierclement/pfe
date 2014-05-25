var zmq = require('zmq');
var subscriber = zmq.socket('sub');

var tcpport = 'tcp://macbook-cgarnier.local:9999';
var multicast = 'epgm://239.255.1.1:5555';

subscriber.connect(tcpport);
subscriber.subscribe('');

subscriber.on("message", function(reply) {
  console.log('Received message: ', reply.toString());
});

process.on('SIGINT', function() {
  subscriber.close();
  console.log('\nClosed');
});