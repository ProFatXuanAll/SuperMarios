module.exports = function(server){

    const io = require('socket.io').listen(server);

    let playerList = {};
    let superUser = null;
    io.on('connection', function(socket){
        // new player tell server to join game
        socket.on('00 playerJoin', function(playerData){
            //if someone open multiple tabs
            if(playerList[playerData.name] !== undefined)
            {
                socket.emit('multipleConnection');
                return;
            }
            console.log(playerData.name + ' join');
            // server tell existed player(s) info new of player
            socket.broadcast.emit(
                '01 toExistPlayer',
                playerData
                );
            socket.username = playerData.name;

            // server store new player info
            playerList[playerData.name] = {
                // data about player
                data: playerData,
                // socket between server and player
                socket: socket
            };

            // server tell new player join finish
            socket.emit('03 playerJoinFinish');
        });
        
        // server tell new player info of exist player(s)
        socket.on('02 toNewPlayer', function(playerData){
            playerList[playerData.requestName].socket.emit(
                '02 toNewPlayer',
                playerData.data
            );
        });
        
        // new player tell server to get monster
        socket.on('04 requestMonster', function(nameData){
            // find exist user to sync monster
            if(superUser == null)
            {
               superUser = nameData.name;
               socket.emit(
                    '07 spawnMonster',
                    {
                       superUser: true
                    }
                );
            }
            else
            {
                playerList[superUser].socket.emit(
                    '05 getMonsterInfo',
                    nameData
                );
            }
        });
        
        // parsing monster info
        socket.on('06 parseMonsterInfo', function(monsterData){
            playerList[monsterData.requestName].socket.emit(
                '07 spawnMonster',
                {
                    superUser: false,
                    monsterGroup: monsterData.monsterGroup
                }
            );
        });

        socket.on('move',function(datamove){
            socket.broadcast.emit(
                'move',
                datamove);
        });

        socket.on('stop',function(datamove){
            socket.broadcast.emit(
                'stop',
                datamove);
        });

        // someone disconnect
        socket.on('disconnect', function(){
            if(socket.username == superUser)
            {
                let findOther = false;
                for(let player in playerList)
                {
                    if(player != superUser)
                    {
                        findOther = true;
                        superUser = player;
                        break;
                    }
                }
                if(!findOther)
                    superUser = null;
            }

            delete playerList[socket.username];
            // delete player from player list
            socket.broadcast.emit(
                'playerDelete',
                {
                    name:socket.username
                }
            );
        });

        //someone died
        socket.on('someOneDie', function(die){
            io.emit(
                'someOneDie',
                die
            );
        });

        //some monster died
        socket.on('monsterDead', function(monsterDie){
            io.emit(
                'monsterDead',
                monsterDie
            );
        });
    });

    io.playerList = playerList;
    return io;
};
