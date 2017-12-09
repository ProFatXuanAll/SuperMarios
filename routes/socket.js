module.exports = function(server){

    const io = require('socket.io').listen(server);

    let playerList = {};
    let superUser = null;

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
            if(superUser == null)
            {
               superUser = nameData.name;
               socket.emit('monster-join-succeeded',
                   {
                       superUser: true
                   }
               );
            }
            else{
                playerList[superUser].socket.emit(
                    'monster-join', 
                    nameData
                );
            }
           
        });

        socket.on('monster-join-succeeded', function(monsterData){
            playerList[monsterData.requestName].socket.emit('monster-join-succeeded',
                {
                    superUser: false,
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
            if(socket.username == superUser){
                let findOther = false;
                for(let player in playerList)
                {
                    if(player != superUser){
                        findOther = true;
                        superUser = player;
                        break;
                    }
                }

                if(!findOther)
                    superUser = null;
            }


            delete playerList[socket.username];
            socket.broadcast.emit('userdis',
                    {
                        name:socket.username
                    });
        });
    });

    return io;
};
