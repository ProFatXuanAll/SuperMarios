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
    Game.engine.load.audio('test','/game/assets/sounds/hit.wav');
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

    // create player for client
    Game.players['self'] = new PlayerSetup(
        Game.engine,
        'self',
        Player.mario,
        0,
        0,
        true
    );

    // main camera follow main character
    Game.engine.camera.follow(Game.players.self.character);

    /*----------------- debug */
    Game.players['Alice'] = new PlayerSetup(
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
    );
    Game.map.solid.debug = true;
    //sound testing
    //music = Game.engine.add.audio(Map.music[0].name);
    //music.play();
    sfx=Game.engine.add.audio('test');
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
        detectWorldBound(character);
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
            Game.players.Alice.cursor.up.isDown = true;
            break;
        case 'a':
            Game.players.Alice.cursor.left.isDown = true;
            break;
        case 's':
            Game.players.Alice.cursor.down.isDown = true;
            break;
        case 'd':
            Game.players.Alice.cursor.right.isDown = true;
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
            Game.players.Alice.cursor.up.isDown = false;
            break;
        case 'a':
            Game.players.Alice.cursor.left.isDown = false;
            break;
        case 's':
            Game.players.Alice.cursor.down.isDown = false;
            break;
        case 'd':
            Game.players.Alice.cursor.right.isDown = false;
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
            playerDeath(otherCharacter);
    }
    else if(player.body.touching.left)
    {
        //someone do something.
    }
}
function detectWorldBound(character)
{
    if(character.position.y+character.height>=Game.map.tileMap.height*Game.map.tileMap.tileHeight)
    {
        playerDeath(character);
        sfx.play();
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
