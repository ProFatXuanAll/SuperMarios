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
                //status: Game.players.current.status
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
            //playerData.status
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
socket.on('05 getMonsterInfo', function(nameData){

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
            requestName: nameData.name,
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
socket.on('09 getItemInfo', function(nameData){

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
            requestName: nameData.name,
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
socket.on('move',function(datamove){

    // if not in finish state,then don't do anything  
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    if(datamove.name in Game.players.hash)
    {
        if(datamove.move == 'up')
        {
            Game.players.hash[datamove.name].position.x = datamove.x;
            Game.players.hash[datamove.name].position.y = datamove.y;
            Game.players.hash[datamove.name].body.velocity.x = datamove.vx;
            Game.players.hash[datamove.name].body.velocity.y = datamove.vy;
        }
        else
        {
            Game.players.hash[datamove.name].cursor[datamove.move].isDown = true;
            Game.players.hash[datamove.name].position.x = datamove.x;
            Game.players.hash[datamove.name].position.y = datamove.y;
            Game.players.hash[datamove.name].body.velocity.x = datamove.vx;
            Game.players.hash[datamove.name].body.velocity.y = datamove.vy;
        }
    }
});

// someone release key
socket.on('stop',function(datamove){

    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

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

    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    Game.players.hash[dele.name].name.destroy();
    Game.players.hash[dele.name].destroy();
    delete Game.players.hash[dele.name];
});

// someone died
socket.on('someOneDie', function(die){

    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    //player die animation and player death sound
    let deadPlayer = Game.players.hash[die.name];
    deadPlayer.dieyet = true;
    if(die.name == Config.currentUserName)
    {
        Game.map.music.stop();
        Player[deadPlayer.key].music.die.play();
    }
    deadPlayer.animations.stop();
    deadPlayer.animations.play('die');
    deadPlayer.body.enable = false;
    deadPlayer.immovable = true;

    // respawn user
    Game.engine.time.events.add(Phaser.Timer.SECOND * 3, function()
        {
            // avoid respawn after disconnect
            if(die.name in Game.players.hash)
            {
                //respawn player to his spawnpoint
                Player[deadPlayer.key].respawn(deadPlayer);
            }
	    }
    );
});


// some monster died
socket.on('monsterDead',function(monsterData){

    // if not in finish state,then don't do anything
    if(Config.state.current < Config.state.finish)
    {
        return;
    }

    // set monster's animation to die and play die sound
    let deadMonster = Game.monsters[monsterData.monsterType].children[monsterData.id];
    deadMonster.animations.stop();
    deadMonster.animations.play('die');
    Monster[monsterData.monsterType].music.die.play();
    deadMonster.body.enable = false;
    Game.engine.time.events.add(Phaser.Timer.SECOND * 3,function()
        {
            // respawn monster to its spawnpoint
            Monster[monsterData.monsterType].respawn(deadMonster);
	    }
    );
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
    character.status[itemData.itemType] += 1;
    Item[itemData.itemType].music.get.play();
    deadItem.body.enable = false;
    deadItem.visible = false;
});

socket.on('playerStatusChange', function(itemData){

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
