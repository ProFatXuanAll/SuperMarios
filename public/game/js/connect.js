let socket = io();

// server tell current player info of new player
socket.on('player-join', function(newPlayerData){
    // create new player
    Game.players[newPlayerData.name] = new PlayerSetup(
        newPlayerData.name,
        Player[newPlayerData.typeName],
        newPlayerData.x,
        newPlayerData.y
    )

    socket.emit('player-join-succeeded',
        {
            requestName: newPlayerData.name,
            data: {
                name: Config.currentUserName,
                typeName: Player.mario.spriteName,
                x: Game.players[Config.currentUserName].character.x,
                y: Game.players[Config.currentUserName].character.y
            }
        }
    );
});

// server tell new player info of exist player(s)
socket.on('player-join-succeeded', function(playerData){
    // need to decode because server encode to speed up
    // create existed player(s)
    Game.players[playerData.name] = new PlayerSetup(
        playerData.name,
        Player[playerData.typeName],
        playerData.x,
        playerData.y
    );
});

socket.on('monster-join', function(nameData){

    let dataString = '{';
    for(let monsterType in Game.monsters)
    {
        if(dataString.length > 1)
            dataString += ',';

        dataString += `"${monsterType}":[`
        
        let children = Game.monsters[monsterType].children;
        for(let i = 0; i < children.length; ++i)
        {
            if(i != 0)
                dataString += ',';
            dataString += '{'
            dataString += '"x":'+children[i].position.x + ',';
            dataString += '"y":'+children[i].position.y + ',';
            dataString += '"vx":'+children[i].body.velocity.x + ',';
            dataString += '"vy":'+children[i].body.velocity.y + ',';
            dataString += '"sx":'+children[i].spawn.x + ',';
            dataString += '"sy":'+children[i].spawn.y;
            dataString += '}'
        }

        dataString += ']'
    }
    dataString += '}';

    console.log(dataString);

    // return monster info
    socket.emit('monster-join-succeeded',
        {
            requestName: nameData.name,
            monsterGroup: dataString
        }
    );
});

socket.on('monster-join-succeeded', function(monsterData){
    // create monster
    console.log('monster-join-succeeded');

    // first one join game
    if(!monsterData.findOther)
    {
        Game.monsters = new MonsterSetup(
            Game.map,
            Map.structure[0]
        )
    }
    else
    {
        monsterData = JSON.parse(monsterData.monsterGroup);
        
        Game.monsters = {};
        for(let monsterType in monsterData)
        {
            Game.monsters[monsterType] = Game.engine.add.group();
            Game.monsters[monsterType].enableBody = true;

            monsterData[monsterType].forEach(function(monster)
            {
                let spawnMonster = Game.engine.add.sprite(
                    monster.x,
                    monster.y,
                    monsterType
                );
                
                Game.engine.physics.enable(spawnMonster);
                spawnMonster.body.enable = true;
                spawnMonster.body.velocity.x = monster.vx;
                spawnMonster.body.velocity.y = monster.vy;
                
                spawnMonster.name = monsterType;
                spawnMonster.spawn = {
                    x: monster.sx,
                    y: monster.sy 
                }

                Game.monsters[monsterType].add(spawnMonster);
            });

            Game.monsters[monsterType].callAll(
                'animations.add',
                'animations',
                'walk',
                Monster[monsterType].animation.walk,
                Monster[monsterType].animation.frame_rate,
                true
            )
            
            Game.monsters[monsterType].callAll(
                'animations.add',
                'animations',
                'die',
                Monster[monsterType].animation.die,
                Monster[monsterType].animation.frame_rate,
                true
            );
            
            Game.monsters[monsterType].callAll('animations.play', 'animations', 'walk');
            Game.monsters[monsterType].setAll('body.gravity.y', Monster[monsterType].gravity.y);
            Game.monsters[monsterType].setAll('body.bounce.x', 1);
        }
    
    }

});

socket.on('move',function(datamove){
    Game.players[datamove.name].cursor[datamove.move].isDown=true;
});

socket.on('stop',function(datamove){
    Game.players[datamove.name].cursor[datamove.move].isDown=false;
});

// delete other players
socket.on('userdis',function(dele){
    Game.players[dele.name].character.destroy();
    Game.players[dele.name].name.destroy();
    delete Game.players[dele.name];
});
