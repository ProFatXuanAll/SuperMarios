module.exports = function(server){

    const io = require('socket.io').listen(server);

    let playerList = {};
    let monsterList = {};
    let superUser = null;

    io.on('connection', function(socket){
        // new player tell server to join game
        socket.on('join', function(playerData){
            console.log(playerData.name + ' join');
            // server tell existed player(s) info new of player
            socket.broadcast.emit(
                'toExistPlayer',
                playerData
                );
            socket.username = playerData.name;

            // server store new player info
            playerList[playerData.name] = {
                // data about player
                data: playerData,
                // socket between server and player
                socket: socket,
                // respawn monster list
                respawnList: {}
            };
        });
        
        // server tell new player info of exist player(s)
        socket.on('toNewPlayer', function(playerData){
            playerList[playerData.requestName].socket.emit(
                'toNewPlayer',
                playerData.data
            );
        });
        
        // new player tell server to get monster
        socket.on('requestMonster', function(nameData){
            // find exist user to sync monster
            if(superUser == null)
            {
               superUser = nameData.name;
               socket.emit(
                    'spawnMonster',
                    {
                       superUser: true
                    }
                );
            }
            else
            {
                playerList[superUser].socket.emit(
                    'getMonsterInfo',
                    nameData
                );
            }
        });

        socket.on('getMonsterList', function(monsterData){
            monsterData = JSON.parse(monsterData.monsterData);
            for(let monsterType in monsterData)
            {
                monsterList[monsterType] = (new Array(monsterData[monsterType])).fill(0);
                playerList[superUser].respawnList[monsterType] = [];
            }
        });

        socket.on('parseMonsterInfo', function(monsterData){
            for(let monsterType in playerList[superUser].respawnList)
            {
                playerList[monsterData.requestName].respawnList[monsterType] = [];
                console.log('------------------------');
                console.log(playerList[monsterData.requestName].respawnList[monsterType]);
                console.log('------------------------');
            }
            playerList[monsterData.requestName].socket.emit(
                'spawnMonster',
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

            for(let monsterType in playerList[socket.username].respawnList)
            {
                playerList[socket.username].respawnList[monsterType].forEach((id) => {
                    monsterList[monsterType][id] -= 1;
                });
            }

            delete playerList[socket.username];
            socket.broadcast.emit(
                'playerDelete',
                {
                    name:socket.username
                }
            );
        });

        socket.on('someOneDie', function(die){
            io.emit(
                'someOneDie',
                die
            );
        });

        socket.on('monsterDead', function(monsterDie){
            if(monsterList[monsterDie.monsterType][monsterDie.id] === 0)
            {
                monsterList[monsterDie.monsterType][monsterDie.id] = Object.keys(playerList).length;
                console.log(socket.username + " tell server:" + monsterDie.monsterType + monsterDie.id + ' has died');
                for(let playerName in playerList)
                {
                    console.log(playerName + ' before push: '+playerList[playerName].respawnList[monsterDie.monsterType]);
                    console.log('monsterType: '+ monsterDie.monsterType + ', id: ' +monsterDie.id);
                    playerList[playerName].respawnList[monsterDie.monsterType].push(monsterDie.id);
                    console.log(playerName + ' after push: '+playerList[playerName].respawnList[monsterDie.monsterType]);
                }
                //io.emit('monsterDead',monsterDie);
                socket.broadcast.emit(
                    'monsterDead',
                    monsterDie);
                socket.emit(
                    'monsterDead',
                    monsterDie);
                // ??? setTimeout(checkAllRespawned,1000,monsterDie.monsterType,monsterDie.id);
            }
        });

        socket.on('monsterRespawned', function(monsterData){
            let index = playerList[socket.username].respawnList[monsterData.monsterType].indexOf(monsterData.id);
            playerList[socket.username].respawnList[monsterData.monsterType].splice(index, 1);
            monsterList[monsterData.monsterType][monsterData.id] -= 1;
            console.log(socket.username + ' have respawned');
        });
    });

    return io;
};
