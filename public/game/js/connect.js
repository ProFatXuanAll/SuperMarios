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
    if(monsterData.superUser)
    {
        Game.monsters ={};
        MonsterSetup(Game.map,Map.structure[0]);
    }
    else
    {
        Game.monsters = {};
        monsterSetupClient(monsterData);
    }

});

socket.on('move',function(datamove){

    if(datamove.name in Game.players)
    {
        Game.players[datamove.name].character.cursor[datamove.move].isDown=true;
    }
});

socket.on('stop',function(datamove){
    if(datamove.name in Game.players)
    {
        Game.players[datamove.name].character.cursor[datamove.move].isDown=false;
    }
});

// delete other players
socket.on('userdis',function(dele){
    Game.players[dele.name].character.name.destroy();
    Game.players[dele.name].character.destroy();
    delete Game.players[dele.name];
});
