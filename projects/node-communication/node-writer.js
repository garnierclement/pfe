var zmq = require('zmq');
var writer = zmq.socket('pub');

var local = 'ipc:///tmp/zmq0';

process.stdin.setEncoding('utf8');

writer.bind(local, function(err) {
  if(err)
    console.log(err);
  else
    console.log("Binding to "+local);
});

// Sending stdin to the ipc socket
process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    writer.send(chunk);
    //console.log("## envoi de "+chunk);
  }
});