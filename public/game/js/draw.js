let Game = {};

var socket=io();
var playerlist={};

var radomname=Math.random().toString();
var radomx=Math.floor(Math.random()*(150-90+1))+90;
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
    // future version: load all map at once
    /*for(let i = 0; i < Map.structure.length; ++i)
      {
      Game.engine.load.tilemap(
      Map.structure[i].name,
      Map.structure[i].src,
      null, 
      Phaser.Tilemap.TILED_JSON
      );
      }*/
    Game.engine.stage.disableVisibilityChange=true;
    Game.engine.load.tilemap(
            Map.structure[0].name,
            Map.structure[0].src,
            null,
            Phaser.Tilemap.TILED_JSON
            );
    // future version: load all tileset at once
    /*for(let i = 0; i < Map.tileset.length; ++i)
      {
      Game.engine.load.image(
      Map.tileset[i].name,
      Map.tileset[i].src
      );
      }*/
    Game.engine.load.image(
            Map.tileset[0].name,
            Map.tileset[0].src
            );
    // future version: load all background at once
    /*for(let i = 0; i < Map.background.length; ++i)
      {
      Game.engine.load.image(
      Map.background[i].name,
      Map.background[i].src
      );
      }*/
    Game.engine.load.image(
            Map.background[0].name,
            Map.background[0].src
            );
    // load all bgm
    for(let i = 0; i < Map.music.length; ++i)
    {
        Game.engine.load.audio(
                Map.music[i].name,
                Map.music[i].src
                );
    }
    // future version: load all player spritesheet at once
    /*for(let playerType in Player)
      {
      Game.engine.load.spritesheet(
      Player[playerType].spriteName,
      Player[playerType].picture.src,
      Player[playerType].picture.width,
      Player[playerType].picture.height
      );
      }*/
    Game.engine.load.spritesheet(
            Player.mario.spriteName,
            Player.mario.picture.src,
            Player.mario.picture.width,
            Player.mario.picture.height
            );
    // load all monster spritesheet
    for(let monsterType in Monster)
    {
        Game.engine.load.spritesheet(
                Monster[monsterType].spriteName,
                Monster[monsterType].picture.src,
                Monster[monsterType].picture.width,
                Monster[monsterType].picture.height
                );
    }
    // add promise make sure pictures loaded
}

function create()
{
    Game.engine.physics.startSystem(Phaser.Physics.ARCADE);

    // create map
    Game.map = new MapSetup(
            Game.engine,
            Map.structure[0],
            Map.tileset[0],
            Map.background[0],
            Map.music[2]
            );

    // start loop map music
    Game.map.music.loopFull();

    // create monster
    Game.monsters = new MonsterSetup(
            Game.engine,
            Game.map,
            Map.structure[0]
            );


    Game.players = {};
    $('.loginclick').on('click',function(){
        socket.emit('login',
                {
                    name:radomname,
                    x:radomx
                });

        Game.players['self'] = new PlayerSetup(
                Game.engine,
                radomname,
                Player.mario,
                0,
                0,
                true
                );

        Game.engine.camera.follow(Game.players.self.character);
    });
    socket.on('newplayer',function(data){
        playerlist[data.name]={};
        Game.players[data.name]=new PlayerSetup(
                Game.engine,
                data.name,
                Player.mario,
                120,
                20
                );
    });
    socket.on('login',function(data){
        playerlist=JSON.parse(data.listdata);
        for(let cyclep in playerlist)
        {
            if(radomname!=playerlist[cyclep].name)
            {
                Game.players[playerlist[cyclep].name]=new PlayerSetup(
                        Game.engine,
                        playerlist[cyclep].name,
                        Player.mario,
                        playerlist[cyclep].x,
                        playerlist[cyclep].y
                        )
            }
        }
    });
    // create player for client
    /*Game.players['self'] = new PlayerSetup(
      Game.engine,
      'self',
      Player.mario,
      0,
      0,
      true
      );*/

    // main camera follow main character

    //Game.engine.camera.follow(Game.players.self.character);

    /*----------------- debug */
    /*Game.players['Alice'] = new PlayerSetup(
      Game.engine,
      'Alice',
      Player.mario,
      100,
      20
      );
      Game.players['fuck'] = new PlayerSetup(
      Game.engine,
      'fuck',
      Player.mario,
      150,
      20
      );*/
    Game.map.solid.debug = true;
    //sound testing
    //music = Game.engine.add.audio(Map.music[0].name);
    //music.play();
    /*------------------ debug */
}

function update()
{
    for(let name in Game.players)
    {
        let character = Game.players[name].character;
        Game.engine.physics.arcade.collide(character, Game.map.solid);
        for(let other in Game.players)
        {
            let otherCharacter = Game.players[other].character;
            //Game.engine.physics.arcade.overlap(character, otherCharacter, playerOverlap(character,otherCharacter));
        }
        //Game.engine.physics.arcade.collide(character, Game.map.solid);
        for(let monsterType in Game.monsters)
        {
            Game.engine.physics.arcade.collide(Game.monsters[monsterType], Game.map.solid);

            Game.engine.physics.arcade.overlap(
                    character,
                    Game.monsters[monsterType],
                    Monster[monsterType].overlap
                    );
        }

        //set each player' title on head
        // let character = Game.players[name].character;
        let text=Game.players[name].text;
        text.x = Math.floor(character.x);
        text.y = Math.floor(character.y-character.height/3);
        //detectWorldBound(character);
    }
    for(let name in Game.players)
    {
        let character = Game.players[name].character;
        let cursor = Game.players[name].cursor;
        let action = Game.players[name].action;
        let velocity = character.body.velocity;
        let playerType = Game.players[name].playerType;

        // stop moving to left or right
        velocity.x = playerType.velocity.idle;
        if (cursor.up.isDown)
        {
            if (character.body.onFloor()) velocity.y = playerType.velocity.up;
        }
        if(!character.body.onFloor()) velocity.y += playerType.gravity;
        if(cursor.left.isDown)
        {
            velocity.x = playerType.velocity.left;
            character.animations.play('left');
            action.facing = 'left';
        }
        else if (cursor.right.isDown)
        {
            velocity.x = playerType.velocity.right;
            character.animations.play('right');
            action.facing = 'right';
        }
        else if (cursor.down.isDown)
        {
            /*temperary unusable */
        }
        else
        {
            character.animations.play('idle');
            action.facing = 'idle';
        }
    }
}

function render()
{
    /*debug*/
    for(let name in Game.players)
    {
        let character = Game.players[name].character;
        Game.engine.debug.body(character);
    }
    //Game.engine.debug.body(Game.map.solid);
}
socket.on('move',function(datamove){
    Game.players[datamove.name].cursor[datamove.move].isDown=true;
    console.log(Game.players[datamove.name].cursor[datamove.move].isDown,datamove.move);
});
socket.on('stop',function(datamove){
    Game.players[datamove.name].cursor[datamove.move].isDown=false;
    console.log(Game.players[datamove.name].cursor[datamove.move].isDown,datamove.move);
});

window.addEventListener("keypress",function(e){
    switch (e.key)
    {
        /* spawn event
           case 'g':
           playerSetup('Alice',10,20);
           fuck++;
           break;
           */
        case 'w':
            if(Game.players.self.cursor.up.isDown == false)
            {
                socket.emit('move',{
                    name:radomname,
                    move:'up'
                })
                Game.players.self.cursor.up.isDown = true;
            }
            break;
        case 'a':
            if(Game.players.self.cursor.left.isDown == false)
            {
                socket.emit('move',{
                    name:radomname,
                    move:'left'
                })
                Game.players.self.cursor.left.isDown = true;
            }
            break;
        case 's':
            if(Game.players.self.cursor.down.isDown == false)
            {
                socket.emit('move',{
                    name:radomname,
                    move:'down'
                })
                Game.players.self.cursor.down.isDown = true;
            }
            break;
        case 'd':
            if(Game.players.self.cursor.right.isDown == false)
            {
                socket.emit('move',{
                    name:radomname,
                    move:'right'
                })
                Game.players.self.cursor.right.isDown = true;
            }
            break;
        case 'i':
            Game.players.fuck.cursor.up.isDown = true;
            break;
        case 'j':
            Game.players.fuck.cursor.left.isDown = true;
            break;
        case 'k':
            Game.players.fuck.cursor.down.isDown = true;
            break;
        case 'l':
            Game.players.fuck.cursor.right.isDown = true;
            break;

    }
});

window.addEventListener("keyup", function(e){
    switch (e.key)
    {
        case 'w':
            socket.emit('stop',{
                name:radomname,
                move:'up'
            })
            Game.players.self.cursor.up.isDown = false;
            break;
        case 'a':
            socket.emit('stop',{
                name:radomname,
                move:'left'
            })
            Game.players.self.cursor.left.isDown = false;
            break;
        case 's':
            socket.emit('stop',{
                name:radomname,
                move:'down'
            })
            Game.players.self.cursor.down.isDown = false;
            break;
        case 'd':
            socket.emit('stop',{
                name:radomname,
                move:'right'
            })
            Game.players.self.cursor.right.isDown = false;
            break;
        case 'i':
            Game.players.fuck.cursor.up.isDown = false;
            break;
        case 'j':
            Game.players.fuck.cursor.left.isDown = false;
            break;
        case 'k':
            Game.players.fuck.cursor.down.isDown = false;
            break;
        case 'l':
            Game.players.fuck.cursor.right.isDown = false;
            break;
    }
});

/* player overlap test*/
function playerOverlap(player,otherCharacter)
{
    if (player.body.touching.down)
    {
        player.body.velocity.y = -120;
        //playerDeath(otherCharacter);
    }
    else if(player.body.touching.left)
    {
        //someone do something.
    }
}
function detectWorldBound(character)
{
    if(character.y+character.height>=Game.map.tileMap.width)
    {
        playerDeath(character);
    }
}

function playerDeath(character)
{
    // need promise object
    character.body.velocity.x=0;
    character.body.velocity.y=0;
    character.x=0;
    character.y=0;
    character.body.enable = false;
    character.visible = false;    
    Game.engine.time.events.add(Phaser.Timer.SECOND, function()
            {
                character.body.enable = true;
                character.visible = true;
            });
}
