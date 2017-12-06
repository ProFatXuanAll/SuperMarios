module.exports = function(server){

    const io = require('socket.io').listen(server);

    let playerList = {};

    io.on('connection', function(socket){
        console.log('----------------------no fuck----------------------');
        
        // new player tell server to join game
        socket.on('player-join', function(playerData){
            // server tell existed player(s) info new of player
            socket.broadcast.emit('player-join', playerData);
            socket.username = playerData.name;
            /*
            let dataString = '{';
            for(let player in playerList){
                if(dataString.length > 1)
                    dataString += ',';
                dataString += `"${player}":${JSON.stringify(playerList[player].data)}`;
            }
            dataString+='}'
            */

            // server store new player info
            playerList[playerData.name] = {
                // data about player
                data: playerData,
                // socket between server and player
                socket: socket
            };
        });
        
        // server tell new player info of exist player(s)
        socket.on('player-join-succeeded', function(playerData){
            playerList[playerData.requestName].socket.emit(
                'player-join-succeeded',
                playerData.data
            );
        });

        
        // new player tell server to get monster
        socket.on('monster-join', function(nameData){
            // find exist user to sync monster
            let findOther = false;
            for(let player in playerList){
                if(player != nameData.name){
                    playerList[player].socket.emit('monster-join', nameData);
                    findOther = true;
                    break;
                }
            }
           
            if(!findOther) {
                socket.emit('monster-join-succeeded',
                    {
                        findOther: false
                    }
                );
            }
        });

        socket.on('monster-join-succeeded', function(monsterData){
            playerList[monsterData.requestName].socket.emit('monster-join-succeeded',
                {
                    findOther: true,
                    monsterGroup: monsterData.monsterGroup
                }
            );
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
    });

    return io;
};
