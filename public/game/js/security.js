$(document).ready(function(){
        const Config = {
            window: {
                // type stored in string
                width: '100%',
                height: '110%'
            },
            html: {
                main: 'html_game_block'
            },
            font: {
                Arial: {
                    font: "16px Arial",
                    fill: "#000000",
                    align: "center"
                },
                Bold: {
                    font: "64px Arial",
                    fill: "#000000",
                    align: "center"
                }
            },
            // Config.state is used verify state
            state: {
                start: 0,
                playerJoin: 0,
                toExistPlayer: 1,
                toNewPlayer: 2,
                playerJoinFinish: 3,
                requestMonster: 4,
                getMonsterInfo: 5,
                parseMonsterInfo: 6,
                spawnMonster: 7,
                requestItem: 8,
                getItemInfo: 9,
                parseItemInfo: 10,
                spawnItem: 11,
                finish: 11,
                current: 0
            },
            status: {
                left: -1,
                right: 1
            },
            delay: 200,
            currentUserName: $("#userName").html()
        };
        
        const Map = {
            structure: [
                {
                    name: 'world01',
                    src: '/game/assets/maps/jsons/map.json',
                    layer: {
                        solid: 'solidLayer',
                        monster: 'monsterLayer',
                        event: 'eventLayer',
                        item: 'itemLayer',
                    },
                    start: [
                        {
                            x:64,
                            y:1096
                        }
                    ],
                    point: {
                        midpoint: [
                            {
                                x: 5691,
                                y: 1000,
                                id: 0
                            },
                            {
                                x:9500,
                                y:0,
                                id: 1
                            }
                        ],
                        start: -1,
                        end: 1,
                        isFinish: false
                    },
                    size: {
                        x:9600,
                        y:1280
                    }
                    
                }
            ],
            background: [
                {
                    name: 'background01',
                    src: '/game/assets/maps/images/backgrounds/nature.png',
                    width: '1920',
                    height: '1080',
                    x: 0,
                    y: 0
                }
            ],
            tileset: [
                {
                    name: 'tileset01',
                    src: '/game/assets/maps/images/tilesets/tilesetx32.png'
                }
            ],
            sound: [
                {
                    name: 'castle',
                    src: ['/game/assets/maps/sounds/castle.wav']
                },
                {
                    name: 'cave',
                    src: ['/game/assets/maps/sounds/cave.wav']
                },
                {
                    name: 'field',
                    src: ['/game/assets/maps/sounds/field.wav']
                },
                {
                    name: 'finalboss',
                    src: ['/game/assets/maps/sounds/finalboss.wav']
                },
                {
                    name: 'finish',
                    src: ['/game/assets/maps/sounds/finish.wav']
                },
                {
                    name: 'flyship',
                    src: ['/game/assets/maps/sounds/flyship.wav']
                },
                {
                    name: 'ghosthouse',
                    src: ['/game/assets/maps/sounds/ghosthouse.wav']
                },
                {
                    name: 'miniboss',
                    src: ['/game/assets/maps/sounds/miniboss.wav']
                },
                {
                    name: 'rocky',
                    src: ['/game/assets/maps/sounds/rocky.wav']
                },
                {
                    name: 'surprise',
                    src: ['/game/assets/maps/sounds/surprise.wav']
                },
                {
                    name: 'timed',
                    src: ['/game/assets/maps/sounds/timed.wav']
                },
                {
                    name: 'water',
                    src: ['/game/assets/maps/sounds/water.wav']
                },
                {
                    name: 'worldmap',
                    src: ['/game/assets/maps/sounds/worldmap.wav']
                }
            ],
            detectPoint: function(character,map)
            {
                let spawnPointID=character.spawn.id;
                for(let i = spawnPointID; i <= Game.map.point.end; ++i)
                {
                    let newSpawnPoint = {
                        x: Game.map.point.midpoint[i].x,
                        y: Game.map.point.midpoint[i].y,
                    };
                    if(character.y >= newSpawnPoint.y && character.x >= newSpawnPoint.x)
                    {
                        if(spawnPointID < Game.map.point.end)
                        {
                            character.spawn.id = i;
                            socket.emit(
                                'playerMidpoint',
                                {
                                    id: i,
                                    name: character.name._text
                                }
                            );
                        }
                        if(spawnPointID == Game.map.point.end && Game.map.point.isFinish == false)
                        {
                            socket.emit(
                                'playerFinish',
                                {
                                    name: character.name._text
                                }
                            );
                            Game.map.point.isFinish = true;
                        }
                    }
                }
        
        
            },
            detectPlayerWorldBound: function(character)
            {
                if(character.y + character.height >= Game.map.size.y)
                {
                    character.y=Game.map.size.y-character.height-5;
                    socket.emit(
                        'playerDead',
                        {
                            name: character.name._text
                        }
                    );
                }
                if(character.x <= 0)
                {
                    character.position.x = 0;
                }
                if(character.position.x + character.width >= Game.map.size.x)
                {
                    character.position.x = Game.map.size.x - character.width;
                }
            },
            detectMonsterWorldBound: function(monster)
            {
                let monsterName = monster.name;
                if(monster.position.y + monster.height >= Game.map.size.y)
                {
                    monster.position.x = 50;
                    monster.position.y = 50;
                    monster.body.velocity.y=0;
                    Monster[monster.name].destroy(monster);
                    socket.emit(
                        'monsterDead',
                        {
                            monsterType: monster.name,
                            id: monster.id
                        }
                    );
                }
                else if(monster.position.x <= 0)
                {
                    monster.position.x = 50;
                    monster.position.y = 50;
                    monster.body.velocity.y= 0;
                    Monster[monster.name].destroy(monster);
                    socket.emit(
                        'monsterDead',
                        {
                            monsterType: monster.name,
                            id: monster.id
                        }
                    );     
                }
                else if(monster.position.x + monster.width >= Game.map.size.x)
                {
                    monster.position.x = 50;
                    monster.position.y = 50;
                    monster.body.velocity.y = 0;
                    Monster[monster.name].destroy(monster);
                    socket.emit(
                        'monsterDead',
                        {
                            monsterType: monster.name,
                            id: monster.id
                        }
                    );
                }
            },
            overlap: function(player, map)
            {
                if (player.body.blocked.down)
                {
                    //console.log(Config.currentUserName+"is touching down");
                }
                if(player.body.blocked.left)
                {
                    //console.log(Config.currentUserName+"is touching left");
                    player.body.velocity.x = 0;
                }
                if(player.body.blocked.up)
                {
                    //console.log(Config.currentUserName+"is touching up");
                }
                if(player.body.blocked.right)
                {
                    //console.log(Config.currentUserName+"is touching right");
                    player.body.velocity.x = 0;
                }
            },
            monsterCollide: function(monster, map)
            {
                if(monster.body.blocked.left)
                {
                    monster.animations.play('walkRight');
                }
                if(monster.body.blocked.right)
                {
                    monster.animations.play('walkLeft');
                }
            }
        };
        
        function MapSetup(structure, tileset, background, sound)
        {
            // add background
            this.background = Game.engine.add.tileSprite(
                background.x,
                background.y,
                background.width,
                background.height,
                background.name
            );
        
            //give map size(use to detect collide worldbound or not)
            this.size = structure.size;
        
            //give map midpoint
            this.point= structure.point;
        
            // background camera fixed to center
            this.background.fixedToCamera = true;
        
            // add tile map (previous defined map.json)
            this.tileMap = Game.engine.add.tilemap(structure.name);
            
            // load tile set for tile map
            // can have multiple tile set for one map
            this.tileMap.addTilesetImage('tileset', tileset.name);
        
            // add solid block layer
            this.solid = this.tileMap.createLayer(structure.layer.solid);
        
            // add event block layer
            
            // new layer need resize world
            this.solid.resizeWorld();
        
            // enable collision on tile map
            this.tileMap.setCollisionByExclusion([67,68,77,78,98,99,100]);
            
            //add backgroundsound
            this.sound = Game.engine.add.audio(sound.name);
        
            // start loop map sound
            this.sound.loopFull();
        
            //resize game window when initialize the game
            resizeGameWindow();
        }
        // resize Phaser game window 
        function resizeGameWindow()
        {
            Game.engine.scale.setGameSize($( window ).width(), $( window ).height()*0.8);
        }
        // trigger function when resize(using jQuery)
        $(window).resize(function()
        {
            resizeGameWindow();
        });
        
        const Item = {
            coin:{
                tileNumber: 60,
                spriteName: 'coin',
                velocity: {
                    x: 0,
                    y: 0
                },
                gravity: {
                    x: 0,
                    y: 0
                },
                sound : {
                    get : {
                        name: 'coinGet',
                        src:'/game/assets/items/sounds/coinget.wav',
                        create: () => {
                            let sfx = Game.engine.add.audio(Item.coin.sound.get.name);
                            return () => {
                                sfx.play();
                            };
                        }
                    }
                },
                effect: 50,
                bounce: {
                    x: 0,
                    y: 0
                },
                picture: {
                    src: '/game/assets/items/images/coin.png',
                    width: 32,
                    height: 32
                },
                overlap: function(character, item)
                {
                    socket.emit(
                        'itemDead',
                        {
                            itemOwner: Config.currentUserName,
                            itemType: 'coin',
                            id: item.id
                        }
                    );
                },
                destroy: function(item, character)
                {
                    character.status.coin += 1;
                    item.body.enable = false;
                    item.visible = false;
                },
                respawn: function(item, character)
                {
                    character.status.coin -= 1;
                    item.visible = true;
                    item.body.enable = true;
                    item.position.x = item.spawn.x;
                    item.position.y = item.spawn.y;
                }
            },
            feather:{
                tileNumber: 95,
                spriteName: 'feather',
                velocity: {
                    x: 0,
                    y: 0
                },
                gravity: {
                    x: 0,
                    y: 80
                },
                sound : {
                    get : {
                        name: 'featherGet',
                        src:'/game/assets/items/sounds/featherget.wav',
                        create: () => {
                            let sfx = Game.engine.add.audio(Item.coin.sound.get.name);
                            return () => {
                                sfx.play();
                            };
                        }
                    }
                },
                effect: 10,
                bounce: {
                    x: 1,
                    y: 1
                },
                picture: {
                    src: '/game/assets/items/images/feather.png',
                    width: 32,
                    height: 32
                },
                overlap: function(character, item)
                {
                    socket.emit(
                        'itemDead',
                        {
                            itemOwner: Config.currentUserName,
                            itemType: 'feather',
                            id: item.id
                        }
                    );   
                },
                respawn: function(item, character)
                {
                    item.body.velocity.y=0;
                    character.status.feather -= 1;
                    item.visible = true;
                    item.body.enable = true;
                    item.position.x = item.spawn.x;
                    item.position.y = item.spawn.y;
                },
                destroy: function(item, character)
                {
                    character.status.feather += 1;
                    item.body.enable = false;
                    item.visible = false;
                }
            }
        };
        
        function ItemSetup(structure=null, itemData=null)
        {
            //setup each item group
            for(let itemType in Item)
            {
                Game.items[itemType] = Game.engine.add.group();
                Game.items[itemType].enableBody = true;
        
                //set sound for eack kind of item
                for(let soundType in Item[itemType].sound)
                {
                    Item[itemType].sound[soundType].play = Item[itemType].sound[soundType].create();
                }
        
                //create item from tilemap
                Game.map.tileMap.createFromTiles(
                    Item[itemType].tileNumber,
                    null,
                    itemType,
                    structure.layer.item,
                    Game.items[itemType]);
                    //assign id to each sprite in group
                    for(let i = 0;i<Game.items[itemType].length;i++)
                    {
                        let child = Game.items[itemType].children[i];
                        child.name = itemType;
                        child.id=i;
                        if(itemData)
                        {
                            child.position.x = itemData[itemType][i].x;
                            child.position.y = itemData[itemType][i].y;
                            child.body.velocity.x = itemData[itemType][i].vx;
                            child.body.velocity.y = itemData[itemType][i].vy;
                            child.spawn = {
                                x: itemData[itemType][i].sx,
                                y: itemData[itemType][i].sy
                            };
                        }
                        else
                        {
                            child.body.velocity.x = Item[itemType].velocity.x;
                            child.body.velocity.y = Item[itemType].velocity.y;
                            child.spawn = {
                                x: child.position.x,
                                y: child.position.y
                            };
                        }
                    }
        
                    Game.items[itemType].setAll('body.gravity.y', Item[itemType].gravity.y);
                    Game.items[itemType].setAll('body.bounce.x', Item[itemType].bounce.x);
                    Game.items[itemType].setAll('body.bounce.y', Item[itemType].bounce.y);
            }
        }
        
        const Monster = {
            goomba:{
                tileNumber: 87,
                spriteName: 'goomba',
                picture: {
                    src: '/game/assets/monsters/images/goomba.png',
                    width: 32,
                    height: 32
                },
                sound: {
                    die: {
                        name: 'goombaDie',
                        src:'/game/assets/monsters/sounds/hit.wav',
                        create: () => {
                            let sfx = Game.engine.add.audio(Monster.goomba.sound.die.name);
                            return () => {
                                sfx.play();
                            };
                        }
                    }
                },
                animation: {
                    walkLeft: [ 0, 1 ],
                    walkRight: [ 2, 3 ],
                    die: [ 4 ],
                    frame_rate: 2
                },
                velocity: {
                    x: -50,
                    y: 0
                },
                gravity: {
                    x: 0,
                    y: 500
                },
                overlap: function(character, monster){
                    if(character.body.touching.down && !character.body.touching.up)
                    {
                        socket.emit(
                            'monsterDead',
                            {
                                monsterKiller: Config.currentUserName,
                                monsterType: 'goomba',
                                id: monster.id
                            }
                        );
                        character.body.velocity.y = Player[character.key].velocity.vertical.bounce;
                        Monster.goomba.sound.die.play();
                        Monster.goomba.destroy(monster);
                    }
                    else
                    {
                        socket.emit(
                            'playerDead',
                            {
                                name: character.name._text
                            }
                        );
                    }
                },
                destroy: function(monster){
                    monster.animations.stop();
                    monster.animations.play('die');
                    monster.body.enable = false;
                },
                respawn: function(monster){
                    monster.body.enable = true;
                    monster.animations.play('walkLeft');
                    monster.position.x = monster.spawn.x;
                    monster.position.y = monster.spawn.y;       
                    monster.body.velocity.x = Monster.goomba.velocity.x;
                    monster.body.velocity.y = Monster.goomba.velocity.y;
                }
            },
            caveTurtle:{
                tileNumber: 88,
                spriteName: 'caveTurtle',
                picture:{
                    src: '/game/assets/monsters/images/cave_turtle.png',
                    width: 32,
                    height: 32
                },
                sound: {
                    die: {
                        name: 'caveTurtleDie',
                        src:'/game/assets/monsters/sounds/hit.wav',
                        create: () => {
                            let sfx = Game.engine.add.audio(Monster.caveTurtle.sound.die.name);
                            return () => {
                                sfx.play();
                            };
                        }
                    }
                },
                animation: {
                    walkLeft: [ 0, 1 ],
                    walkRight: [ 2, 3 ],
                    die: [ 4 ],
                    frame_rate: 2
                },
                velocity: {
                    x: -50,
                    y: 0
                },
                gravity: {
                    x: 0,
                    y: 500
                },
                spawn:{
                    x:0,
                    y:0
                },
                overlap: function(character, monster){
                    if(character.body.touching.down && !character.body.touching.up)
                    {
                        socket.emit(
                            'monsterDead',
                            {
                                monsterKiller: Config.currentUserName,
                                monsterType: 'caveTurtle',
                                id: monster.id
                            }
                        );
                        character.body.velocity.y = Player[character.key].velocity.vertical.bounce;
                        Monster.caveTurtle.sound.die.play();
                        Monster.caveTurtle.destroy(monster);
                        
                    }
                    else
                    {
                        socket.emit(
                            'playerDead',
                            {
                                name: character.name._text
                            }
                        );
                    }
                },
                destroy: function(monster){
                    monster.animations.stop();
                    monster.animations.play('die');
                    monster.body.enable = false;
                },
                respawn: function(monster){
                    monster.body.enable = true;
                    monster.animations.play('walkLeft');
                    monster.position.x = monster.spawn.x;
                    monster.position.y = monster.spawn.y;
                    monster.body.velocity.x = Monster.caveTurtle.velocity.x;
                    monster.body.velocity.y = Monster.caveTurtle.velocity.y;
                }
            },
            spikeTurtle:{
                tileNumber: 86,
                spriteName: 'spikeTurtle',
                picture:{
                    src: '/game/assets/monsters/images/spike_turtle.png',
                    width: 32,
                    height: 32
                },
                animation: {
                    walkLeft: [ 0, 1 ],
                    walkRight: [ 2, 3 ],
                    die: [ 4 ],
                    frame_rate: 2
                },
                sound: {
                    die: {
                        name: 'spikeTurtleDie',
                        src: '/game/assets/monsters/sounds/empty.wav',
                        create: () => {
                            let sfx = Game.engine.add.audio(Monster.spikeTurtle.sound.die.name);
                            return () => {
                                sfx.play();
                            };
                        }
                    }
                },
                velocity: {
                    x: -50,
                    y: 0
                },
                gravity: {
                    x: 0,
                    y: 500
                },
                spawn:{
                    x:0,
                    y:0
                },
                overlap: function(character, monster){
                    socket.emit(
                        'playerDead',
                        {
                            name: character.name._text
                        }
                    );
                },
                destroy: function(monster){
                    monster.animations.stop();
                    monster.animations.play('die');
                    monster.body.enable = false;
                },
                respawn: function(monster){
                    monster.body.enable = true;
                    monster.animations.play('walkLeft');
                    monster.position.x = monster.spawn.x;
                    monster.position.y = monster.spawn.y;
                    monster.body.velocity.x = Monster.spikeTurtle.velocity.x;
                    monster.body.velocity.y = Monster.spikeTurtle.velocity.y;
                }
            },
            ironFlower:{
                tileNumber: 80,
                spriteName: 'ironFlower',
                picture:{
                    src: '/game/assets/monsters/images/iron_flower.png',
                    width: 32,
                    height: 32
                },
                sound: {
                },
                animation: {
                    walkLeft: [ 0, 1 ],
                    walkRight: [ 0, 1 ],
                    die: [ 1 ],
                    frame_rate: 6
                },
                velocity: {
                    x: 0,
                    y: 0
                },
                gravity: {
                    x: 0,
                    y: 500
                },
                overlap: function(character, monster){
                    socket.emit(
                        'playerDead',
                        {
                            name: character.name._text
                        }
                    );
                },
                respawn: function(monster)
                {
                    //ironFlower never die!
                    return;
                }
            }
        };
        
        function MonsterSetup(structure=null, monsterData=null)
        {
            for(let monsterType in Monster)
            {
                Game.monsters[monsterType] = Game.engine.add.group();
                Game.monsters[monsterType].enableBody = true;
                for(let soundType in Monster[monsterType].sound)
                {
                    Monster[monsterType].sound[soundType].play = Monster[monsterType].sound[soundType].create();
                }
        
                // create monster from map
                Game.map.tileMap.createFromTiles(
                    Monster[monsterType].tileNumber,
                    null,
                    monsterType,
                    structure.layer.monster,
                    Game.monsters[monsterType]
                );
                
                for(let i = 0; i < Game.monsters[monsterType].length; ++i)
                {
                    let child = Game.monsters[monsterType].children[i];
                    child.name = monsterType;
                    child.id = i;
                    if(monsterData)
                    {
                        child.position.x = monsterData[monsterType][i].x;
                        child.position.y = monsterData[monsterType][i].y;
                        child.body.velocity.x = monsterData[monsterType][i].vx;
                        child.body.velocity.y = monsterData[monsterType][i].vy;
                        child.spawn = {
                            x: monsterData[monsterType][i].sx,
                            y: monsterData[monsterType][i].sy
                        };
                    }
                    else
                    {
                        child.body.velocity.x = Monster[monsterType].velocity.x;
                        child.body.velocity.y = Monster[monsterType].velocity.y;
                        child.spawn = {
                            x: child.position.x,
                            y: child.position.y
                        };
                    }
                    child.animations.add('walkLeft', Monster[monsterType].animation.walkLeft, Monster[monsterType].animation.frame_rate, true);
                    child.animations.add('walkRight', Monster[monsterType].animation.walkRight, Monster[monsterType].animation.frame_rate, true);
                    child.animations.add('die', Monster[monsterType].animation.die, Monster[monsterType].animation.frame_rate, true);
                    
                    if(child.body.velocity.x < 0)
                    {
                        child.animations.play('walkLeft');
                    }
                    else
                    {
                        child.animations.play('walkRight');
                    }
                }
        
                Game.monsters[monsterType].setAll(
                    'body.gravity.y',
                    Monster[monsterType].gravity.y
                );
        
                Game.monsters[monsterType].setAll(
                    'body.bounce.x',
                    1
                );
            }
        }
        
        const Player = {
            mario: {
                spriteName: 'mario',
                picture: {
                    width: 32,
                    height: 56,
                    src: '/game/assets/players/images/mariox32.png'
                },
                sound: {
                    die: {
                        name: 'marioDie',
                        src: '/game/assets/players/sounds/die.wav',
                        create: () => {
                            let sfx = Game.engine.add.audio(Player.mario.sound.die.name);
                            return () => {
                                sfx.play();
                            };
                        }
                    },
                    hit: {
                        name: 'marioHit',
                        src: '/game/assets/players/sounds/hit.wav',
                        create: () => {
                            let sfx = Game.engine.add.audio(Player.mario.sound.hit.name);
                            return () => {
                                sfx.play();
                            };
                        }
                    }
                },
                animation: {
                    left: [ 0, 1, 2, 3 ],
                    leftIdle: [ 0 ],
                    right: [ 4, 5, 6, 7 ],
                    rightIdle: [ 4 ],
                    die: [ 8 ],
                    frameRate: 10
                },
                velocity: {
                    horizontal: {
                        move: 200,
                        idle: 0.1
                    },
                    vertical: {
                        bounce: -200,
                        jump: -600,
                        gravity: 20   
                    }
                },
                width: 32,
                height: 56,
                destroy: function(character)
                {
                    if(character.dieyet == false)
                    {
                        character.dieyet = true;
                        character.animations.stop();
                        character.animations.play('die');
                        character.body.enable = false;
                        character.immovable = true;
                    }
                },
                respawn: function(character)
                {
                    if(character.name._text == Config.currentUserName)
                    {
                        Game.map.sound.loopFull();
                    }
                    character.body.velocity.x = 0;
                    character.body.velocity.y = 0;
                    character.x = character.spawn.x;
                    character.y = character.spawn.y;
                    character.body.enable = true;
                    character.immovable = false;
                    character.dieyet = false;
                    for(let itemType in Item)
                    {
                        character.status[itemType] = 0;
                    }
                },
                collide: function(otherCharacter, character){
                    if (character.body.touching.up && otherCharacter.body.touching.down)
                    {
                        //console.log(Config.currentUserName+"is touching down");
                        socket.emit(
                            'playerDead',
                            {
                                playerKiller: otherCharacter.name._text,
                                name: character.name._text
                            }
                        );
                    }
                    if(character.body.touching.left)
                    {
                        //console.log(Config.currentUserName+"is touching left");
                    }
                    if(character.body.touching.up)
                    {
                        //console.log(Config.currentUserName+"is touching up");
                    }
                    if(character.body.touching.right)
                    {
                        //console.log(Config.currentUserName+"is touching right");
                    }
                }
            }
        };
        
        function PlayerSetup(
            playerName,
            playerType, 
            x=0, 
            y=0, 
            vx=0,
            vy=0,
            sx=Map.structure[0].start[0].x,
            sy=Map.structure[0].start[0].y,
            status=null,
            controlable=false)
        {
            // uncontrolable character cursor simulator
            function SyncCursor()
            {
                this.up = {isDown: false};
                this.down = {isDown: false};
                this.left = {isDown: false};
                this.right = {isDown: false};
            }
        
            // add character sprite
            let character = Game.engine.add.sprite(
                x,
                y,
                playerType.spriteName
            );
        
            // test whether player already pressed or not (for socket.io)
            character.ispressed = {
                left: false,
                right: false
            };
        
            if(controlable)
            {
                character.cursor = Game.engine.input.keyboard.createCursorKeys();
                Game.engine.camera.follow(character);
            }
            else
            {
                character.cursor = new SyncCursor();
            }
        
            Game.engine.physics.enable(character);
            character.body.collideWorldBounds = false;
            character.body.velocity.x = vx;
            character.body.velocity.y = vy;
            character.spawn = {
                id : 0,
                x: sx,
                y: sy
            };
        
            // sync player key press event
            if(Math.abs(vx) > Player[playerType.spriteName].velocity.horizontal.idle)
            {
                if(vx > 0)
                {
                    character.cursor.right.isDown = true;
                }
                else
                {
                    character.cursor.left.isDown = true;
                }
            }
            // set up animations by Phaser engine
            character.animations.add('left', playerType.animation.left, playerType.animation.frameRate, true);
            character.animations.add('right', playerType.animation.right, playerType.animation.frameRate, true);
            character.animations.add('leftIdle', playerType.animation.leftIdle, playerType.animation.frameRate, true);
            character.animations.add('rightIdle', playerType.animation.rightIdle, playerType.animation.frameRate, true);
            character.animations.add('die', playerType.animation.die, playerType.animation.frameRate, true);
            // character status: die
            character.dieyet = false;
            // character status: delete
            character.delete = false;
        
            character.name = Game.engine.add.text(
                x,
                y,
                playerName,
                Config.font.Arial
            );
        
            character.status = {};
            if(status == null)
            {
                for(let itemType in Item)
                {
                    character.status[itemType] = 0;
                }
            }
            else
            {
                for(let itemType in status)
                {
                    character.status[itemType] = status[itemType];
                }
            }
            return character;
        }
        
        let socket = io();
        
        // server tell current player info of new player
        socket.on('01 toExistPlayer', function(newPlayerData){
            // to do action
            function toDo(){
                // delay to do if state not reach yet
                if(Config.state.current < Config.state.toExistPlayer)
                {
                    setTimeout(toDo, Config.delay);
                    return;
                }
        
                // avoid multiple signals
                if(!(newPlayerData.name in Game.players.hash))
                {
                    // create new player
                    Game.players.hash[newPlayerData.name] = Game.players.others.add(
                        new PlayerSetup(
                            newPlayerData.name,
                            Player[newPlayerData.typeName],
                            newPlayerData.x,
                            newPlayerData.y
                        )
                    );
                }
        
                // emit player's stats to new player
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
                            sx: Game.players.current.spawn.x,
                            sy: Game.players.current.spawn.y,
                            status: Game.players.current.status
                        }
                    }
                );
            }
        
            // run to do
            toDo();
        });
        
        // server tell new player info of exist player(s)
        socket.on('02 toNewPlayer', function(playerData){
            // to do action
            function toDo(){
                // delay to do if state not reach yet
                if(Config.state.current < Config.state.toNewPlayer)
                {
                    setTimeout(toDo, Config.delay);
                    return;
                }
        
                // avoid multiple signals
                if(!(playerData.name in Game.players.hash))
                {
                    // create existed player(s)
                    Game.players.hash[playerData.name] = Game.players.others.add(
                        new PlayerSetup(
                            playerData.name,
                            Player[playerData.typeName],
                            playerData.x,
                            playerData.y,
                            playerData.vx,
                            playerData.vy,
                            playerData.sx,
                            playerData.sy,
                            playerData.status
                        )
                    );
                }
            }
        
            // run to do
            toDo();
        });
        
        // new player finish join into playerlist
        socket.on('03 playerJoinFinish', function(){
        
            // update state
            Config.state.current = Config.state.playerJoinFinish;
        
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
            // to do action
            function toDo(){
                // delay to do if state not reach yet
                if(Config.state.current < Config.state.getMonsterInfo)
                {
                    setTimeout(toDo, Config.delay);
                    return;
                }
        
                // stringify monster info
                let dataString = '{';
                for(let monsterType in Game.monsters)
                {
                    if(dataString.length > 1)
                        dataString += ',';
        
                    dataString += `"${monsterType}":[`;
                    
                    let children = Game.monsters[monsterType].children;
                    for(let i = 0; i < children.length; ++i)
                    {
                        if(i != 0)
                            dataString += ',';
                        dataString += '{';
                        dataString += '"x":'+children[i].position.x + ',';
                        dataString += '"y":'+children[i].position.y + ',';
                        dataString += '"vx":'+children[i].body.velocity.x + ',';
                        dataString += '"vy":'+children[i].body.velocity.y + ',';
                        dataString += '"sx":'+children[i].spawn.x + ',';
                        dataString += '"sy":'+children[i].spawn.y;
                        // dataString += 'bodyenable'
                        dataString += '}';
                    }
                    dataString += ']';
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
            }
            
            // run to do
            toDo();
        });
        
        // spawn monster in world
        socket.on('07 spawnMonster', function(monsterData){
        
            // update state
            Config.state.current = Config.state.spawnMonster;
        
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
        
        // ask server to get item list
        socket.on('09 getItemInfo', function(playerData){
            // to do action
            function toDo(){
                // delay to do if state not reach yet
                if(Config.state.current < Config.state.getItemInfo)
                {
                    setTimeout(toDo, Config.delay);
                    return;
                }
        
                // stringify item info
                let dataString = '{';
                for(let itemType in Game.items)
                {
                    if(dataString.length > 1)
                        dataString += ',';
        
                    dataString += `"${itemType}":[`;
                    
                    let children = Game.items[itemType].children;
                    for(let i = 0; i < children.length; ++i)
                    {
                        if(i != 0)
                            dataString += ',';
                        dataString += '{';
                        dataString += '"x":'+children[i].position.x + ',';
                        dataString += '"y":'+children[i].position.y + ',';
                        dataString += '"vx":'+children[i].body.velocity.x + ',';
                        dataString += '"vy":'+children[i].body.velocity.y + ',';
                        dataString += '"sx":'+children[i].spawn.x + ',';
                        dataString += '"sy":'+children[i].spawn.y;
                        // dataString += 'bodyenable'
                        dataString += '}';
                    }
                    dataString += ']';
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
            }
        
            // run to do
            toDo();
        });
        
        //spawn item in world
        socket.on('11 spawnItem', function(itemData){
        
            // update state
            Config.state.current = Config.state.spawnItem;
        
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
        
            if(playerData.name in Game.players.hash)
            {
                Game.players.hash[playerData.name].delete = true;
            }
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
            // player die animation and player death sound
            let deadPlayer = Game.players.hash[playerData.name];
            if(playerData.name == Config.currentUserName)
            {
                Game.map.sound.stop();
                Player[deadPlayer.key].sound.die.play();
            }
            else
            {
                Player.mario.sound.hit.play();
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
        
        socket.on('playerMidpoint',function(playerData){
            Game.players.hash[playerData.name].spawn.x=Game.map.point.midpoint[playerData.id].x;
            Game.players.hash[playerData.name].spawn.y=Game.map.point.midpoint[playerData.id].y;
        });
        
        socket.on('playerFinish',function(playerData){
            let finishText = Game.engine.add.text(
                $( window ).width()/3,
                $( window ).height()/2-100,
                playerData.name + ' win!',
                Config.font.Bold
            );
            finishText.fixedToCamera = true;
            Game.map.point.isFinish = true;
        
            //collect data for ranking
            socket.emit('collectData',{
                userName: Config.currentUserName,
                coin: 0, // should be replaced
                kill: 0, //should be replaced
                comp: Game.players.current.x,
            });
        });
        
        socket.on('gotoSummary',function(){
            window.location = "/game/summary";
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
            if(itemData.itemOwner == Config.currentUserName)
            {
                Item.coin.sound.get.play();
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
        
        let Game = {};
        
        Game.engine = new Phaser.Game(
            // game window width
            Config.window.width,
            // game window height
            Config.window.height,
            // phaser draw engine
            Phaser.CANVAS,
            // html tag id
            Config.html.main,
            // phaser state object
            // state order: preload -> create-> update -> render
            // keep looping between update and render states
            {
                preload: preload,
                create: create,
                update: update,
                render: render
            }
        );
        
        // load image and tilemap
        function preload()
        {
            // cancel onblur event
            Game.engine.stage.disableVisibilityChange = true;
            // load all map
            for(let i = 0; i < Map.structure.length; ++i)
            {
                Game.engine.load.tilemap(
                    Map.structure[i].name,
                    Map.structure[i].src,
                    null, 
                    Phaser.Tilemap.TILED_JSON
                );
            }
            // load all tileset
            for(let i = 0; i < Map.tileset.length; ++i)
            {
                Game.engine.load.image(
                    Map.tileset[i].name,
                    Map.tileset[i].src
                );
            }
            // load all background
            for(let i = 0; i < Map.background.length; ++i)
            {
                Game.engine.load.image(
                    Map.background[i].name,
                    Map.background[i].src
                );
            }
            // load all background sound
            for(let i = 0; i < Map.sound.length; ++i)
            {
                Game.engine.load.audio(
                    Map.sound[i].name,
                    Map.sound[i].src
                );
            }
            // load all player spritesheet and sound
            for(let playerType in Player)
            {
                Game.engine.load.spritesheet(
                    Player[playerType].spriteName,
                    Player[playerType].picture.src,
                    Player[playerType].picture.width,
                    Player[playerType].picture.height
                );
                for(let soundType in Player[playerType].sound)
                {
                    Game.engine.load.audio(
                        Player[playerType].sound[soundType].name,
                        Player[playerType].sound[soundType].src
                    );
                }
            }
            // load all monster spritesheet and sound
            for(let monsterType in Monster)
            {
                Game.engine.load.spritesheet(
                    Monster[monsterType].spriteName,
                    Monster[monsterType].picture.src,
                    Monster[monsterType].picture.width,
                    Monster[monsterType].picture.height
                );
                for(let soundType in Monster[monsterType].sound)
                {
                    Game.engine.load.audio(
                        Monster[monsterType].sound[soundType].name,
                        Monster[monsterType].sound[soundType].src
                    );
                }
            }
            // load all item spritesheet and sound
            for(let itemType in Item)
            {
                Game.engine.load.spritesheet(
                    Item[itemType].spriteName,
                    Item[itemType].picture.src,
                    Item[itemType].picture.width,
                    Item[itemType].picture.height
                );
                Game.engine.load.audio(
                    Item[itemType].sound.get.name,
                    Item[itemType].sound.get.src
                );
            }
        }
        
        function create()
        {
            // start physics system
            Game.engine.physics.startSystem(Phaser.Physics.ARCADE);
        
            // create map
            Game.map = new MapSetup(
                Map.structure[0],
                Map.tileset[0],
                Map.background[0],
                Map.sound[2]
            );
        
            for(let playerType in Player)
            {
                for(let soundType in Player[playerType].sound)
                {
                    Player[playerType].sound[soundType].play = Player[playerType].sound[soundType].create();
                }
            }
            // create players' container
            Game.players = {
                current: new PlayerSetup(
                    Config.currentUserName,
                    Player.mario,
                    Map.structure[0].start[0].x,
                    Map.structure[0].start[0].y,
                    0,
                    0,
                    Map.structure[0].start[0].x,
                    Map.structure[0].start[0].y,
                    null,
                    true
                ),
                others: Game.engine.add.group(),
                hash: {}
            };
            Game.players.hash[Config.currentUserName] = Game.players.current;
            
            // create monsters' container
            Game.monsters = {};
            
            // create items' container
            Game.items = {};
        
            // new player tell server to join game
            socket.emit(
                '00 playerJoin', 
                {
                    name: Config.currentUserName,
                    typeName: Player.mario.spriteName,
                    x: Game.players.current.position.x,
                    y: Game.players.current.position.y
                }
            );
        
            socket.on('multipleConnection',function(){
                socket.emit('disconnect');
                window.location.replace("/game/error");
            });
        }
        
        
        function update()
        {
            // current player collide with other player
            Game.engine.physics.arcade.collide(
                Game.players.others,
                Game.players.current,
                Player.mario.collide
            );
            
            // other player collide with other player
            Game.engine.physics.arcade.collide(
                Game.players.others,
                Game.players.others
            );
        
            // current player collide with solid layer
            Game.engine.physics.arcade.collide(
                Game.players.current,
                Game.map.solid
            );
            
            // other player collide with solid layer
            Game.engine.physics.arcade.collide(
                Game.players.others,
                Game.map.solid
            );
        
            for(let monsterType in Game.monsters)
            {
                let monsterGroup = Game.monsters[monsterType];
                // monster collide with solid layer
                Game.engine.physics.arcade.collide(
                    monsterGroup,
                    Game.map.solid,
                    Map.monsterCollide
                );
                // monster overlap with character
                Game.engine.physics.arcade.overlap(
                    Game.players.current,
                    monsterGroup,
                    Monster[monsterType].overlap
                );
                // detect each monster fall through world bound
                for(let i = 0; i < monsterGroup.length; i++)
                {
                    Map.detectMonsterWorldBound(
                        monsterGroup.children[i]
                    );
                }
            }
        
            // character collide with item
            for(let itemType in Game.items)
            {
                let itemGroup = Game.items[itemType];
        
                Game.engine.physics.arcade.collide(
                    itemGroup,
                    Game.map.solid
                );
        
                Game.engine.physics.arcade.overlap(
                    Game.players.current,
                    itemGroup,
                    Item[itemType].overlap
                );
            }
        
            //detect player finish and fall out of the world
            //only need to detect myself and emit
            Map.detectPlayerWorldBound(Game.players.current);
        
            // player movement update
            let all_players = Game.players.hash;
            for(let player in all_players)
            {
                //render player's movement
                let character = all_players[player];
                let name = character.name;
                let cursor = character.cursor;
                let velocity = character.body.velocity;
                let playerTypeVelocity = Player[character.key].velocity;
                let status = character.status;
                let coin = status.coin;
                let feather = status.feather;
                let facing;
                
                // delete player if signaled
                if(character.delete)
                {
                    Game.players.hash[player].name.destroy();
                    Game.players.hash[player].destroy();
                    delete Game.players.hash[player];
                    continue;
                }
                
                // set each players' title on head
                name.x = Math.floor(all_players[player].position.x);
                name.y = Math.floor(all_players[player].position.y - all_players[player].height / 3);
        
                // stop moving to left or right
                if(!character.body.onFloor())
                    //if player pick more than 1 feather, only 1 feather will effect(or it will be overpowered)
                    velocity.y += playerTypeVelocity.vertical.gravity - Item.feather.effect * (feather >= 1 ? 1 : 0);
        
                if (cursor.up.isDown)
                {
                    if(character.body.onFloor())
                    {
                        velocity.y = playerTypeVelocity.vertical.jump;
                    }
                }
                if(cursor.left.isDown)
                {
                    if(!character.dieyet)
                    {
                        facing = Config.status.left;
                        velocity.x = facing * (coin * Item.coin.effect + playerTypeVelocity.horizontal.move);
                        character.animations.play('left');
                    }
                }
                else if (cursor.right.isDown)
                {
                    if(!character.dieyet)
                    {
                        facing = Config.status.right;
                        velocity.x = facing * (coin * 50 + playerTypeVelocity.horizontal.move);
                        character.animations.play('right');
        
                    }
                }
                else if (cursor.down.isDown)
                {
                            //temporary unusable for hacks
                }
                else
                {
                    if(!character.dieyet)
                    {
                        if(velocity.x >= 0)
                        {
                            facing = Config.status.right;
                            character.animations.play('rightIdle');
                        }
                        else
                        {
                            facing = Config.status.left;
                            character.animations.play('leftIdle');
                        }
                        velocity.x = facing * playerTypeVelocity.horizontal.idle;
                    }
                }
            }
        
            // current player key press and release event
            let currentCharacter = Game.players.current;
            let currentCharacterCursor = currentCharacter.cursor;
            let currentCharacterIspressed = currentCharacter.ispressed;
        
            // press up and on floor
            if(currentCharacterCursor.up.isDown && currentCharacter.body.onFloor())
            {
                socket.emit(
                    'playerMove',
                    {
                        name: Config.currentUserName,
                        move: 'up',
                        x: currentCharacter.position.x,
                        y: currentCharacter.position.y,
                        vx: currentCharacter.body.velocity.x,
                        vy: currentCharacter.body.velocity.y
                    }
                );
            }
        
            // press or release left
            else if(currentCharacterCursor.left.isDown != currentCharacterIspressed.left)
            {
                // press left
                if(currentCharacterCursor.left.isDown)
                {
                    socket.emit(
                        'playerMove',
                        {
                            name: Config.currentUserName,
                            move: 'left',
                            x: currentCharacter.position.x,
                            y: currentCharacter.position.y,
                            vx: currentCharacter.body.velocity.x,
                            vy: currentCharacter.body.velocity.y
                        }
                    );
                    currentCharacterIspressed.left = true;
                }
                // release left
                else
                {
                    socket.emit(
                        'playerStop',
                        {
                            name: Config.currentUserName,
                            move: 'left',
                            x: currentCharacter.position.x,
                            y: currentCharacter.position.y,
                            vx: currentCharacter.body.velocity.x,
                            vy: currentCharacter.body.velocity.y
                        }
                    );
                    currentCharacterIspressed.left = false;
                }
            }
        
            // press or release right
            else if(currentCharacterCursor.right.isDown != currentCharacterIspressed.right)
            {
                // press right
                if(currentCharacterCursor.right.isDown)
                {
                    socket.emit(
                        'playerMove',
                        {
                            name: Config.currentUserName,
                            move: 'right',
                            x: currentCharacter.position.x,
                            y: currentCharacter.position.y,
                            vx: currentCharacter.body.velocity.x,
                            vy: currentCharacter.body.velocity.y
                        }
                    );
                    currentCharacterIspressed.right = true;
                }
                // release right
                else
                {
                    socket.emit(
                        'playerStop',
                        {
                            name: Config.currentUserName,
                            move: 'right',
                            x: currentCharacter.position.x,
                            y: currentCharacter.position.y,
                            vx: currentCharacter.body.velocity.x,
                            vy: currentCharacter.body.velocity.y
                        }
                    );
                    currentCharacterIspressed.right = false;
                }
            }
        }
        
        function render(){}
        
});