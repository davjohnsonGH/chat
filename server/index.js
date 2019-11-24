var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
 
    socket.on("user is typing", function(userIsTyping){
        io.emit("user is typing", userIsTyping);
    });     
    socket.on('chat message', function(chat){
        io.emit('chat message', chat);
    });      

});
