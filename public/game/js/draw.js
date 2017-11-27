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
    Game.engine.load.tilemap(
        'mario',
        '/game/assets/map.json',
        null,
        Phaser.Tilemap.TILED_JSON
    );
    Game.engine.load.image(
        'tileset',
        '/game/assets/tilesetx32.png'
    );
    Game.engine.load.image(
        'bg',
        '/game/assets/nature.png'
    );
    Game.engine.load.spritesheet(
        Player.mario.spriteName,
        Player.mario.picture.src,
        Player.mario.picture.width,
        Player.mario.picture.height
    );
    Game.engine.load.spritesheet(
        Monster.goomba.spriteName,
        Monster.goomba.picture.src,
        Monster.goomba.picture.width,
        Monster.goomba.picture.height
    );
    Game.engine.load.spritesheet(
        Monster.spikeTurtle.spriteName,
        Monster.spikeTurtle.picture.src,
        Monster.spikeTurtle.picture.width,
        Monster.spikeTurtle.picture.height,
    );
    // add promise make sure pictures loaded
}

function create()
{
    Game.engine.physics.startSystem(Phaser.Physics.ARCADE);

    // create map
    Game.map = new MapSetup(Game.engine);

    // create monster
    Game.monsters = new MonsterSetup(
        Game.engine,
        [
            Monster.goomba,
            Monster.spikeTurtle
        ],
        Game.map.tileMap
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
    Game.map.solidBlocks.debug = true;
    /*------------------ debug */
}

function update()
{
    for(let name in Game.players)
    {
        let character = Game.players[name].character;
        Game.engine.physics.arcade.collide(character, Game.map.solidBlocks);
        for(let other in Game.players)
        {
            let otherCharacter = Game.players[other].character;
            //Game.engine.physics.arcade.collide(character, otherCharacter,function(){console.log("hello")});
            Game.engine.physics.arcade.overlap(character, otherCharacter, playerOverlap(character,otherCharacter));
        }
        Game.engine.physics.arcade.collide(character, Game.map.solidBlocks);
        for(let monster in Game.monsters)
        {
            Game.engine.physics.arcade.collide(Game.monsters[monster], Game.map.solidBlocks);
            Game.engine.physics.arcade.overlap(character, Game.monsters[monster], goombaOverlap);
        }
    }
    for(let name in Game.players)
    {
        let character = Game.players[name].character;
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

        // stop moving to left or right
        velocity.x = Config.velocity.idle;
        if (cursor.up.isDown)
        {
            if (character.body.onFloor()) velocity.y = Config.velocity.up;
        }
        if(!character.body.onFloor()) velocity.y += Config.velocity.gravity;
        if(cursor.left.isDown)
        {
            velocity.x = Config.velocity.left;
            character.animations.play('left');
            action.facing = 'left';
        }
        else if (cursor.right.isDown)
        {
            velocity.x = Config.velocity.right;
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
    //Game.engine.debug.body(Game.map.solidBlocks);
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
        /* spawn event
        case 'g':
            playerSetup('Alice',10,20);
            fuck++;
            break;
        */
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
            //playerDeath(otherCharacter);
    }
    else if(player.body.touching.left)
    {
        //someone do something.
    }
}

function goombaOverlap(character,monster)
{
    if (character.body.touching.down) {
        monster.animations.stop();
        monster.frame = 2;
        monster.body.enable = false;
        character.body.velocity.y = -80;
        Game.engine.time.events.add(Phaser.Timer.SECOND, function() {
            monster.kill();
        });
    } else {
        playerDeath(character);
      }    
}

function spikeTurtleOverlap(character,monster)
{
    playerDeath(character);
}

function detectWorldBound(character)
{
    if(character.y+character.height>=Game.map.width)
    {
        playerDeath(character);
    }
}

function playerDeath(character)
{
    character.body.velocity.x=0;
    character.body.velocity.y=0;
    character.x=0;
    character.y=0;
    character.body.enable=false;
    character.visible=false;
    Game.engine.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
        character.body.enable=true;
        character.visible = true;
    });
}
