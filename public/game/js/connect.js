$(function () {
    var socket = io();
    socket.emit('login',
    {
        time: new Date()
    });

    socket.on('return', function(data){
        console.log(data.time);
    });
});
