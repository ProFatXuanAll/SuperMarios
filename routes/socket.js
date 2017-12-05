module.exports = function(server){

    const io = require('socket.io').listen(server);

    let playerList = {};

    io.on('connection', function(socket){
        console.log('----------------------no fuck----------------------');

        // new player tell server to join game
        socket.on('join', function(playerData){
            // server tell existed player(s) info new of player
            socket.broadcast.emit('join', playerData);
            socket.username = playerData.name;
            // server tell new player info of exist player(s)
            socket.emit('join-succeeded',
                {
                    // stringify to speed up pass data
                    playerList: JSON.stringify(playerList)
                }
            );
            playerList[playerData.name] = playerData;
            /*socket.broadcast.emit('newplayer',
            {
                name:data.name
            });*/
        });

        socket.on('move',function(datamove){
            socket.broadcast.emit('move',datamove);
        });

        socket.on('stop',function(datamove){
            socket.broadcast.emit('stop',datamove);
        });

        socket.on('disconnect',function(){
            delete playerList[socket.username];
            socket.broadcast.emit('userdis',
                    {
                        name:socket.username
                    });
        });

        socket.on('monsterSpawn',function(monsterStat){
            socket.broadcast.emit('monsterSpawn',monsterStat);
        });

    });

    return io;

};