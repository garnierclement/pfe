var zmq = require('zmq');
var subscriber = zmq.socket('sub');

subscriber.on("message", function(reply) {
  console.log('Received message: ', reply.toString());
});

subscriber.connect('tcp://macbook-cgarnier.local:9999');
subscriber.subscribe('');

process.on('SIGINT', function() {
  subscriber.close();
  console.log('\nClosed');
});