module.exports = function(server){

    const io = require('socket.io').listen(server);

    let playerList = {};
    let superUser = null;
    io.on('connection', function(socket){
        // new player tell server to join game
        socket.on('00 playerJoin', function(playerData){
            
            // if someone open multiple tabs
            if(playerList[playerData.name])
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
            
            if(superUser == null)
            {
                superUser = playerData.name;
            }
        });
        
        // server tell new player info of exist player(s)
        socket.on('02 toNewPlayer', function(playerData){
            playerList[playerData.requestName].socket.emit(
                '02 toNewPlayer',
                playerData.data
            );
        });
        
        // new player tell server to get monster
        socket.on('04 requestMonster', function(playerData){
            // find exist user to sync monster
            if(superUser == null)
            {
                superUser = playerData.name;
                socket.emit(
                     '07 spawnMonster',
                     {
                         superUser: true
                     }
                );
            }
            else if(superUser == socket.username)
            {
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
                    playerData
                );
            }
        });

        // parsing item info
        socket.on('06 parseMonsterInfo', function(monsterData){
            playerList[monsterData.requestName].socket.emit(
                '07 spawnMonster',
                {
                    superUser: false,
                    monsterGroup: monsterData.monsterGroup
                }
            );
        });

        // new player tell server to get item
        socket.on('08 requestItem', function(playerData){
            // find exist user to sync item
            if(superUser == null)
            {
                superUser = playerData.name;
                socket.emit(
                    '11 spawnItem',
                    {
                        superUser: true
                    }
                );
            }
            else if(superUser == socket.username)
            {
                socket.emit(
                    '11 spawnItem',
                    {
                        superUser: true
                    }
                );
            }
            else
            {
                playerList[superUser].socket.emit(
                    '09 getItemInfo',
                    playerData
                );
            }
        });

        // parsing item info
        socket.on('10 parseItemInfo', function(itemData){
            playerList[itemData.requestName].socket.emit(
                '11 spawnItem',
                {
                    superUser: false,
                    itemGroup: itemData.itemGroup
                }
            );
        });

        socket.on('playerMove',function(playerData){
            socket.broadcast.emit(
                'playerMove',
                playerData);
        });

        socket.on('playerStop',function(playerData){
            socket.broadcast.emit(
                'playerStop',
                playerData);
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
        socket.on('playerDead', function(playerData){
            io.emit(
                'playerDead',
                playerData
            );
        });

        socket.on('playerRespawn', function(playerData){
            io.emit(
                'playerRespawn',
                playerData
            );
        });

        socket.on('playerFinish', function(playerData){
            io.emit(
                'playerFinish',
                playerData
            );
        });

        // some monster dead
        socket.on('monsterDead', function(monsterData){
            io.emit(
                'monsterDead',
                monsterData
            );
        });

        socket.on('monsterRespawn', function(monsterData){
            io.emit(
                'monsterRespawn',
                monsterData
            );
        });

        // some item dead
        socket.on('itemDead', function(itemData){
            io.emit(
                'itemDead',
                itemData
            );
        });

        socket.on('itemRespawn', function(itemData){
            io.emit(
                'itemRespawn',
                itemData
            )
        });
    });

    io.playerList = playerList;
    return io;
};
