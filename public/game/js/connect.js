let socket = io();

// server tell current player info of new player
socket.on('01 toExistPlayer', function(newPlayerData){

    // update state if haven't reach
    if(Config.state.current < Config.state.toExistPlayer)
    {
        Config.state.current = Config.state.toExistPlayer;
    }

    // create new player
    Game.players.hash[newPlayerData.name] = Game.players.others.add(
        new PlayerSetup(
            newPlayerData.name,
            Player[newPlayerData.typeName],
            newPlayerData.x,
            newPlayerData.y
        )
    );

    //emit player's stats to new player
    socket.emit(
        '02 toNewPlayer',
        {
            requestName: newPlayerData.name,
            data: {
                name: Config.currentUserName,
                typeName: Player.mario.spriteName,
                x: Game.players.current.position.x,
                y: Game.players.current.position.y,
                vx: Game.players.current.body.velocity.x,
                vy: Game.players.current.body.velocity.y,
                status: Game.players.current.status
            }
        }
    );
});

// server tell new player info of exist player(s)
socket.on('02 toNewPlayer', function(playerData){

    // update state if haven't reach
    if(Config.state.current < Config.state.toNewPlayer)
    {
        Config.state.current = Config.state.toNewPlayer;
    }

    // need to decode because server encode to speed up
    // create existed player(s)
    Game.players.hash[playerData.name] = Game.players.others.add(
        new PlayerSetup(
            playerData.name,
            Player[playerData.typeName],
            playerData.x,
            playerData.y,
            playerData.vx,
            playerData.vy,
            playerData.status
        )
    );
});

// a new player is finish join into playerlist
socket.on('03 playerJoinFinish', function(){

    // update state if haven't reach
    if(Config.state.current < Config.state.playerJoinFinish)
    {
        Config.state.current = Config.state.playerJoinFinish;
    }

    //ask superuser to get monster list
    socket.emit(
        '04 requestMonster',
        {
            name: Config.currentUserName
        }
    );
});

//ask server to get monster list
socket.on('05 getMonsterInfo', function(playerData){

    // update state if haven't reach
    if(Config.state.current < Config.state.getMonsterInfo)
    {
        Config.state.current = Config.state.getMonsterInfo;
    }

    // stringify monster info
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
        '06 parseMonsterInfo',
        {
            requestName: playerData.name,
            monsterGroup: dataString
        }
    );
});

//spawn monster in world
socket.on('07 spawnMonster', function(monsterData){

    // update state if haven't reach
    if(Config.state.current < Config.state.spawnMonster)
    {
        Config.state.current = Config.state.spawnMonster;
    }

    Game.monsters = {};
    
    // if you're superuser, init the list and emit to server
    // let server has a monster list
    if (monsterData.superUser)
    {
        // spawn monster from tileset
        MonsterSetup(Map.structure[0]);
    }
    // if you're not superuser then ask monster list from server
    else
    {
        // parse from monster list
        monsterData = JSON.parse(monsterData.monsterGroup);
        MonsterSetup(Map.structure[0], monsterData);
    }
    socket.emit(
        '08 requestItem',
        {
            name: Config.currentUserName
        }
    );
});

//ask server to get item list
socket.on('09 getItemInfo', function(playerData){

    // update state if haven't reach
    if(Config.state.current < Config.state.getItemInfo)
    {
        Config.state.current = Config.state.getItemInfo;
    }

    // stringify item info
    let dataString = '{';
    for(let itemType in Game.items)
    {
        if(dataString.length > 1)
            dataString += ',';

        dataString += `"${itemType}":[`
        
        let children = Game.items[itemType].children;
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
    // return item info
    socket.emit(
        '10 parseItemInfo',
        {
            requestName: playerData.name,
            itemGroup: dataString
        }
    );
});

//spawn item in world
socket.on('11 spawnItem', function(itemData){

    // update state if haven't reach
    if(Config.state.current < Config.state.spawnItem)
    {
        Config.state.current = Config.state.spawnItem;
    }

    Game.items = {};
    // if you're superuser, init the list and emit to server
    // let server has a item list
    if (itemData.superUser)
    {
        // spawn item from tileset
        ItemSetup(Map.structure[0]);
    }
    // if you're not superuser then ask item list from server
    else
    {
        // parse from item list
        itemData = JSON.parse(itemData.itemGroup);
        ItemSetup(Map.structure[0], itemData);
    }
});

// someone press key
socket.on('playerMove',function(playerData){

    // if not in finish state,then don't do anything  
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    if(playerData.name in Game.players.hash)
    {
        if(playerData.move == 'up')
        {
            Game.players.hash[playerData.name].position.x = playerData.x;
            Game.players.hash[playerData.name].position.y = playerData.y;
            Game.players.hash[playerData.name].body.velocity.x = playerData.vx;
            Game.players.hash[playerData.name].body.velocity.y = playerData.vy;
        }
        else
        {
            Game.players.hash[playerData.name].cursor[playerData.move].isDown = true;
            Game.players.hash[playerData.name].position.x = playerData.x;
            Game.players.hash[playerData.name].position.y = playerData.y;
            Game.players.hash[playerData.name].body.velocity.x = playerData.vx;
            Game.players.hash[playerData.name].body.velocity.y = playerData.vy;
        }
    }
});

// someone release key
socket.on('playerStop',function(playerData){

    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    if(playerData.name in Game.players.hash)
    {
        Game.players.hash[playerData.name].cursor[playerData.move].isDown = false;
        Game.players.hash[playerData.name].position.x = playerData.x;
        Game.players.hash[playerData.name].position.y = playerData.y;
        Game.players.hash[playerData.name].body.velocity.x = playerData.vx;
        Game.players.hash[playerData.name].body.velocity.y = playerData.vy;
    }
});

// delete other players
socket.on('playerDelete',function(playerData){

    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    Game.players.hash[playerData.name].delete = true;
});

// someone died
socket.on('playerDead', function(playerData){

    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    let playerKiller = Game.players.hash[playerData.playerKiller];
    if(playerData.playerKiller)
    {
        playerKiller.body.velocity.y = Player[playerKiller.key].velocity.vertical.bounce;
    }
    //player die animation and player death sound
    let deadPlayer = Game.players.hash[playerData.name];
    if(playerData.name == Config.currentUserName)
    {
        Game.map.music.stop();
        Player[deadPlayer.key].music.die.play();
    }
    if(playerData.name in Game.players.hash)
    {
        Player[deadPlayer.key].destroy(deadPlayer);
    }
});

socket.on('playerRespawn',function(playerData){
    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }
    
    let deadPlayer = Game.players.hash[playerData.name];
    // avoid respawn after disconnect
    if(playerData.name in Game.players.hash)
    {
        //respawn player to his spawnpoint
        Player[deadPlayer.key].respawn(deadPlayer);
    }
});

socket.on('playerFinish',function(playerData){
    let finishText = Game.engine.add.text(
        $( window ).width()/3,
        $( window ).height()/2-100,
        playerData.name + ' win!',
        Config.font.Bold
    );
    finishText.fixedToCamera = true;
    Game.map.finish.isFinished = true;
});

// some monster died
socket.on('monsterDead',function(monsterData){
    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    let monsterKiller=Game.players.hash[monsterData.monsterKiller];
    monsterKiller.body.velocity.y = Player[monsterKiller.key].velocity.vertical.bounce;
    if(monsterData.monsterKiller==Config.currentUserName)
    {
        Monster[monsterData.monsterType].music.die.play();
    }
    // set monster's animation to die and play die sound
    let deadMonster = Game.monsters[monsterData.monsterType].children[monsterData.id];
    Monster[monsterData.monsterType].destroy(deadMonster);
});

socket.on('monsterRespawn',function(monsterData){
    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    let deadMonster = Game.monsters[monsterData.monsterType].children[monsterData.id];
    Monster[monsterData.monsterType].respawn(deadMonster);
});

socket.on('itemDead',function(itemData){

    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    // set item's animation to die and play die sound
    let deadItem = Game.items[itemData.itemType].children[itemData.id];
    let character = Game.players.hash[itemData.itemOwner];
    if(itemData.itemOwner==Config.currentUserName)
    {
        Item.coin.music.get.play();
    }
    Item[itemData.itemType].destroy(deadItem, character);
});

socket.on('itemRespawn', function(itemData){

    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    // set item's animation to die and play die sound
    let deadItem = Game.items[itemData.itemType].children[itemData.id];
    let character = Game.players.hash[itemData.itemOwner];
    Item[itemData.itemType].respawn(deadItem, character);
});
