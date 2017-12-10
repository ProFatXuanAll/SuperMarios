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
            socket.broadcast.emit('toExistPlayer', playerData);
            socket.username = playerData.name;

            // server store new player info
            playerList[playerData.name] = {
                // data about player
                data: playerData,
                // socket between server and player
                socket: socket,
                // respawn success flag
                respawnSuccess : false
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
	    for(let type in monsterData){
		monsterList[type]=[];
		for(let i=0; i<monsterData[type]; ++i){
		   monsterList[type].push({valid : true});
		};
	    };
	});

        socket.on('parseMonsterInfo', function(monsterData){
            playerList[monsterData.requestName].socket.emit('spawnMonster',
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
            socket.broadcast.emit('playerDelete',
                    {
                        name:socket.username
                    });
        });
        socket.on('someOneDie',function(die){
            socket.broadcast.emit('someOneDie',die);
        });
        socket.on('monsterDead',function(monsterDie){
            if(monsterList[monsterDie.kind][monsterDie.id].valid)
            {
                monsterList[monsterDie.kind][monsterDie.id].valid = false;
                console.log(monsterDie.kind + monsterDie.id + ' has died');
                io.emit('monsterDead',monsterDie);
                setTimeout(checkAllRespawned,1000,monsterDie.kind,monsterDie.id);
            }
        });
        socket.on('monsterRespawned',function(user){
            playerList[user.name].respawnSuccess = true;
            console.log(user.name+' have respawned');
        });
    });

    function checkAllRespawned(kind,id){
        for(let player in playerList){
            if(!playerList[player].respawnSuccess){
                setTimeout(checkAllRespawned,1000,kind,id);
                return;
            };
        };
        monsterList[kind][id].valid = true;
        for(let player in playerList){
            playerList[player].respawnSuccess = false;
        };
    };

    return io;
};
