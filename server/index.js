var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
 
    socket.on("user is typing", function(userIsTyping){
        io.emit("user is typing", userIsTyping);
    });     
    socket.on('chat message', function(chat){
        io.emit('chat message', chat);
    });      

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});