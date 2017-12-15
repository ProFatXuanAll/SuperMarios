let socket = io();

// server tell current player info of new player
socket.on('toExistPlayer', function(newPlayerData){
    // create new player
    Game.players.hash[newPlayerData.name] = Game.players.others.add(
        new PlayerSetup(
            newPlayerData.name,
            Player[newPlayerData.typeName],
            newPlayerData.x,
            newPlayerData.y
        )
    );

    socket.emit(
        'toNewPlayer',
        {
            requestName: newPlayerData.name,
            data: {
                name: Config.currentUserName,
                typeName: Player.mario.spriteName,
                x: Game.players.current.position.x,
                y: Game.players.current.position.y,
            }
        }
    );
});

// server tell new player info of exist player(s)
socket.on('toNewPlayer', function(playerData){
    // need to decode because server encode to speed up
    // create existed player(s)
    Game.players.hash[playerData.name] = Game.players.others.add(
        new PlayerSetup(
            playerData.name,
            Player[playerData.typeName],
            playerData.x,
            playerData.y,
        )
    );
    /* need vx vy ????????????????????????????????????????? */
});

socket.on('spawnMonster', function(monsterData){
    Game.monsters = {};
    if (monsterData.superUser)
    {
        MonsterSetup(Map.structure[0]);

        let monsterList = "{";
        for(let monsterType in Game.monsters)
        {
            if(monsterList.length > 1)
            	monsterList += ',';
            monsterList += `"${monsterType}":${Game.monsters[monsterType].children.length}`;
        }
        monsterList += "}";
        socket.emit(
            'getMonsterList',
            {
            monsterData:monsterList
            }
        );
    }
    else
    {
        monsterData = JSON.parse(monsterData.monsterGroup);
        MonsterSetup(Map.structure[0], monsterData);
    }
});

socket.on('getMonsterInfo', function(nameData){

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
            // dataString += 'bodyenable'
            dataString += '}'
        }
        dataString += ']'
    }
    dataString += '}';
    // return monster info
    socket.emit(
        'parseMonsterInfo',
        {
            requestName: nameData.name,
            monsterGroup: dataString
        }
    );
});

socket.on('move',function(datamove){

    if(datamove.name in Game.players.hash)
    {
        Game.players.hash[datamove.name].cursor[datamove.move].isDown = true;
        Game.players.hash[datamove.name].position.x = datamove.x;
        Game.players.hash[datamove.name].position.y = datamove.y;
        Game.players.hash[datamove.name].body.velocity.x = datamove.vx;
        Game.players.hash[datamove.name].body.velocity.y = datamove.vy;
    }
});

socket.on('stop',function(datamove){
    if(datamove.name in Game.players.hash)
    {
        Game.players.hash[datamove.name].cursor[datamove.move].isDown = false;
        Game.players.hash[datamove.name].position.x = datamove.x;
        Game.players.hash[datamove.name].position.y = datamove.y;
        Game.players.hash[datamove.name].body.velocity.x = datamove.vx;
        Game.players.hash[datamove.name].body.velocity.y = datamove.vy;
    }
});

// delete other players
socket.on('playerDelete',function(dele){
    Game.players.hash[dele.name].name.destroy();
    Game.players.hash[dele.name].destroy();
    delete Game.players.hash[dele.name];
});

socket.on('someOneDie',function(die){
    let deadPlayer = Game.players.hash[die.name];
    deadPlayer.dieyet=true;
    Game.map.music.stop();
    Player[deadPlayer.key].music.die.play();
    deadPlayer.animations.stop();
    deadPlayer.animations.play('die');
    deadPlayer.body.enable = false;
    deadPlayer.immovable = true;

    Game.engine.time.events.add(Phaser.Timer.SECOND * 3,function()
        {
            Player[deadPlayer.key].respawn(deadPlayer);
	    }
    );
});

socket.on('monsterDead',function(monsterData){
    let deadMonster = Game.monsters[monsterData.monsterType].children[monsterData.id];
    deadMonster.animations.stop();
    deadMonster.animations.play('die');
    deadMonster.body.enable = false;
    let sfx=Game.engine.add.audio(Monster[monsterData.monsterType].music.die.name);
    sfx.play();
    Game.engine.time.events.add(Phaser.Timer.SECOND * 3,function()
        {
            Monster[monsterData.monsterType].respawn(deadMonster);
	    }
    );
    
});
