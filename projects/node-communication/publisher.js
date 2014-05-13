var zmq = require('zmq');
var publisher = zmq.socket('pub');

process.stdin.setEncoding('utf8');

publisher.bind('tcp://*:9999', function(err) {
  if(err)
    console.log(err);
  else
    console.log("Listening on 9999...");
});


process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    publisher.send(chunk);
    console.log("## envoi de "+chunk);
  }
});