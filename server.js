var app = require('express')();
var http =require('http').Server(app);
var path = require('path');
var port =8050;
var io = require('socket.io')(http);
/*var express =require('express');
var app =express();
var port =8050;
var io =require('socket.io')(app);*/

app.get('/',function (req,res) {
    res.sendFile(__dirname +'/test.html');
});

io.on('connection',function(socket){
    console.log('a user connected');
    socket.on('login',function(){
    socket.broadcast.emit('login');
    });
    socket.on('chat message',function(msg){
        //console.log('message:  ' +msg);
        socket.broadcast.emit('chat message',msg);
    });
});

http.listen(port,function(){
    console.log('listen ....');
});

