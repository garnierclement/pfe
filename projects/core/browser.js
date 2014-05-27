
var mdns = require('mdns2');

try {
  var b = mdns.createBrowser(mdns.tcp('http'));
} catch (ex) {
  console.log('something bad happened. we better start over.')
}

b.on('error', function(error) {
  console.log('something bad happened. we better start over.')
});
b.start();
