module.exports = function(server){

    const io = require('socket.io').listen(server);

    let playerList = {};
    let superUser = null;
    io.on('connection', function(socket){
        // new player tell server to join game
        socket.on('00 playerJoin', function(playerData){
            
            // if player open multiple tabs
            if(playerList[playerData.name])
            {
                socket.emit('multipleConnection');
                return;
            }

            console.log(playerData.name + ' join');
            
            // server tell existed player(s) info of new player
            socket.broadcast.emit(
                '01 toExistPlayer',
                playerData
                );
            socket.username = playerData.name;

            // server store new player info
            playerList[playerData.name] = {
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
        
        // existed player(s) tell server its info
        socket.on('02 toNewPlayer', function(playerData){
            // if new player not disconnect
            if(playerList[playerData.requestName])
            {
                // server tell new player info of exist player(s)
                playerList[playerData.requestName].socket.emit(
                    '02 toNewPlayer',
                    playerData.data
                );
            }
        });
        
        // new player tell server to get monster info
        socket.on('04 requestMonster', function(playerData){
            // new player be super user if super does not exist
            if(superUser == null)
            {
                superUser = playerData.name;
                // server tell new player to generate monster by itself
                socket.emit(
                     '07 spawnMonster',
                     {
                         superUser: true
                     }
                );
            }
            // new player is super user
            else if(superUser == socket.username)
            {
                // server tell new player to generate monster by itself
                socket.emit(
                    '07 spawnMonster',
                    {
                        superUser: true
                    }
                );
            }
            // new player is not super user
            else
            {
                // server tell super user to return monster info
                playerList[superUser].socket.emit(
                    '05 getMonsterInfo',
                    playerData
                );
            }
        });

        // super user tell server monster info
        socket.on('06 parseMonsterInfo', function(monsterData){
            // if new player not disconnect
            if(playerList[monsterData.requestName])
            {
                // server tell new player to parse monster info
                playerList[monsterData.requestName].socket.emit(
                    '07 spawnMonster',
                    {
                        superUser: false,
                        monsterGroup: monsterData.monsterGroup
                    }
                );
            }
        });

        // new player tell server to get item info
        socket.on('08 requestItem', function(playerData){
            // new player be super user if super does not exist
            if(superUser == null)
            {
                superUser = playerData.name;
                // server tell new player to generate item by itself
                socket.emit(
                    '11 spawnItem',
                    {
                        superUser: true
                    }
                );
            }
            // new player is not super user
            else if(superUser == socket.username)
            {
                // server tell new player to generate item by itself
                socket.emit(
                    '11 spawnItem',
                    {
                        superUser: true
                    }
                );
            }
            // new player is not super user
            else
            {
                // server tell super user to return item info
                playerList[superUser].socket.emit(
                    '09 getItemInfo',
                    playerData
                );
            }
        });

        // super user tell server item info
        socket.on('10 parseItemInfo', function(itemData){
            // if new player not disconnect
            if(playerList[itemData.requestName])
            {
                // server tell new player to parse item info
                playerList[itemData.requestName].socket.emit(
                    '11 spawnItem',
                    {
                        superUser: false,
                        itemGroup: itemData.itemGroup
                    }
                );
            }
        });

        // player disconnect
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

            // delete player from player list
            delete playerList[socket.username];
            // server tell everyone to delete player
            socket.broadcast.emit(
                'playerDelete',
                {
                    name: socket.username
                }
            );
        });

        // existed player(s) tell server it move
        socket.on('playerMove',function(playerData){
            // server tell other player(s) it move
            socket.broadcast.emit(
                'playerMove',
                playerData);
        });

        // existed player(s) tell server it stop
        socket.on('playerStop',function(playerData){
            // server tell other player(s) it stop
            socket.broadcast.emit(
                'playerStop',
                playerData);
        });

        // existed player(s) tell server it dead
        socket.on('playerDead', function(playerData){
            // server tell everyone it dead
            io.emit(
                'playerDead',
                playerData
            );
            setTimeout
            (
                function(){
                    io.emit(
                        'playerRespawn',
                        playerData
                    )
                },
                3000
            );
        });

        // existed player(s) tell server it respawn
        socket.on('playerRespawn', function(playerData){
            // server tell everyone it respawn
            io.emit(
                'playerRespawn',
                playerData
            );
        });

        // existed player(s) tell server it hit middle point
        socket.on('playerMidpoint', function(playerData){
            // server tell everyone it hit middle point
            io.emit(
                'playerMidpoint',
                playerData
            );
        });

        // existed player(s) tell server it hit finish point
        socket.on('playerFinish', function(playerData){
            // server tell everyone it hit finish point
            io.emit(
                'playerFinish',
                playerData
            );
        });

        // existed player(s) tell server it kill monster
        socket.on('monsterDead', function(monsterData){
            // server tell everyone it kill monster
            io.emit(
                'monsterDead',
                monsterData
            );
            setTimeout
            (
                function(){
                    io.emit(
                        'monsterRespawn',
                        monsterData
                    );
                },
                3000
            );
        });

        // existed player(s) tell server it respawn monster
        socket.on('monsterRespawn', function(monsterData){
            // server tell everyone it respawn monster
            io.emit(
                'monsterRespawn',
                monsterData
            );
        });

        // existed player(s) tell server it kill item
        socket.on('itemDead', function(itemData){
            // server tell everyone it kill item
            io.emit(
                'itemDead',
                itemData
            );
            setTimeout
            (
                function(){
                    io.emit(
                        'itemRespawn',
                        itemData
                    )
                },
                3000
            );
        });

        // existed player(s) tell server it respawn item
        socket.on('itemRespawn', function(itemData){
            // server tell everyone it respawn item
            io.emit(
                'itemRespawn',
                itemData
            )
        });
    });

    io.playerList = playerList;
    return io;
};
