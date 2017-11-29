var express =require('express');
var app = require('express')();
var http =require('http').Server(app);
var path = require('path');
var port =8050;
var io = require('socket.io')(http);
/*var express =require('express');
var app =express();
var port =8050;
var io =require('socket.io')(app);*/

var list=[];

app.use(express.static(__dirname + '/public'));
app.use('/',function (req,res) {
    res.sendFile('public/test.html',{ root: __dirname });
});
io.on('connection',function(socket){

    socket.on('login',function(msg){
        console.log('a user connected');
        socket.broadcast.emit('login',
        {
            name: msg.name
        });
        list.push({name:msg.name});
        console.log(msg.name,list.length,"login~~");
        console.log(list[list.length-1].name);
        });

    socket.on('chat message',function(msg){
        //console.log('message:  ' +msg);
        socket.broadcast.emit('chat message',msg);
    });
});

http.listen(port,function(){
    console.log('listen ....');
});

