var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  
var port = process.env.PORT || 3000;
app.listen(port);

io.configure('production', function(){
  io.enable('browser client etag');
  io.set('log level', 1);

  io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
});

io.configure('development', function(){
  io.set('transports', ['websocket']);
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}



io.sockets.on('connection', function (socket) {

var interval = setInterval(function() {
  socket.send('Hello Kitty!');
},20000);

  socket.broadcast.send(socket);
  socket.emit('news', { hello: 'world' });
  socket.on('message', function (data) {
    socket.broadcast.send(data);
  });
});
