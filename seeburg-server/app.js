var express = require(express);
var socketio = require('socket.io');
var app = express();

var io = socketio.listen(app.listen(3000));

io.sockets.on('connection', function (socket) {
  console.log('A user has connected');
});
