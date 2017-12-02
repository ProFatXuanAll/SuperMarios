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
    Game.engine.stage.disableVisibilityChange = true;
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
        Game.engine.load.audio(Monster[monsterType].death.name,Monster[monsterType].death.src);
    }
    for(let itemType in Items)
    {
        Game.engine.load.spritesheet(
            Items[itemType].spriteName,
            Items[itemType].picture.src,
            Items[itemType].picture.width,
            Items[itemType].picture.height
        );
    }
    Game.engine.load.audio('youdie','/game/assets/sounds/die.wav');
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
    Game.items = new ItemSetup(
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
    deathsound=Game.engine.add.audio('youdie');
    resizeGame();
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
            if(name==other) continue;
            let otherCharacter = Game.players[other].character;
            Game.engine.physics.arcade.collide(character, otherCharacter);
        }
        for(let monsterType in Game.monsters)
        {
            Game.engine.physics.arcade.collide(Game.monsters[monsterType], Game.map.solid);
            
            Game.engine.physics.arcade.overlap(
                character,
                Game.monsters[monsterType],
                Monster[monsterType].overlap
            );
            for(let i=0;i<Game.monsters[monsterType].length;i++)
            {
                detectWorldBoundm(Game.monsters[monsterType].children[i]);
                /*
                detectworlbound(monster,monstertype)
                Monster[monstertype]=....
                merge it into Monster.js

                */
            }
        }
        for(let itemType in Game.items)
        {
            Game.engine.physics.arcade.collide(Game.items[itemType], Game.map.solid);
            
            Game.engine.physics.arcade.overlap(
                character,
                Game.items[itemType],
                Items[itemType].overlap(Game.players[name].currentType)
            );
        }

        //set each players' title on head
        let text=Game.players[name].text;
        text.x = Math.floor(character.x);
        text.y = Math.floor(character.y-character.height/3);
        detectWorldBound(character);
        detectFinished(character);
    }
    for(let name in Game.players)
    {
        let character = Game.players[name].character;
        let cursor = Game.players[name].cursor;
        let action = Game.players[name].action;
        let velocity = character.body.velocity;
        let currentType = Game.players[name].currentType;

        // stop moving to left or right
        velocity.x = currentType.velocity.idle;
        if (cursor.up.isDown)
        {
            if (character.body.onFloor()) velocity.y = currentType.velocity.up;
        }
        if(!character.body.onFloor()) velocity.y += currentType.gravity;
        if(cursor.left.isDown)
        {
            velocity.x = currentType.velocity.left;
            character.animations.play('left');
            action.facing = 'left';
        }
        else if (cursor.right.isDown)
        {
            velocity.x = currentType.velocity.right;
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
    if(player==otherCharacter){
        console.log('fuck');
        return;
    }
    if (player.body.touching.down)
    {
            player.body.velocity.y = -150;
            //playerDeath(otherCharacter);
    }
    else if(player.body.touching.left)
    {
        //someone do something.
    }
}
function detectWorldBound(character)
{
    /*
    should be merged into player.js
    maybe rename to playerDetectWorldBound(character)
    */
    if(character.position.y+character.height>=Game.map.tileMap.height*Game.map.tileMap.tileHeight)
    {
       playerDeath(character);
       character.position.y=Game.map.tileMap.height*Game.map.tileMap.tileHeight-character.height-1;
    }
    if(character.position.x<=0)
    {
        character.position.x=0;
    }
    if(character.position.x+character.width>=Game.map.tileMap.width*Game.map.tileMap.tileWidth)
    {
        character.position.x=Game.map.tileMap.width*Game.map.tileMap.tileWidth-character.width;
    }
}

function detectWorldBoundm(monster)
{
    if(monster.position.y+monster.height>=Game.map.tileMap.height*Game.map.tileMap.tileHeight)
    {
        Monster.goomba.respawn(monster);        
    }
    if(monster.position.x<=0)
    {
        Monster.goomba.respawn(monster);        
    }
    if(monster.position.x+monster.width>=Game.map.tileMap.width*Game.map.tileMap.tileWidth)
    {
        Monster.goomba.respawn(monster);        
    }
}
function detectFinished(character)
{
    if(character.position.y>=Map.structure[0].finish.y&&character.position.x>=Map.structure[0].finish.x)
    {
        console.log('finished');
    }
}

function playerDeath(character)
{
    if(!character.dieyet)
    {
        // need promise object
        character.animations.stop();
        character.frame=1;    
        character.immovable = true;
        character.body.moves=false;
        deathsound.play();
        console.log(character.dieyet);
        character.dieyet=true;
        
        Game.engine.time.events.add(Phaser.Timer.SECOND*2, function()
        {
            character.body.velocity.x=0;
            character.body.velocity.y=0;
            character.x=Map.structure[0].start.x;
            character.y=Map.structure[0].start.y;
            character.body.moves=true;
            character.immovable = false;
            character.animations.play();
            character.dieyet=false;
        });
    }
    else return;
}

function resizeGame() {
    Game.engine.scale.setGameSize($( window ).width(), $( window ).height()*0.8);
}

$( window ).resize(function() {
    resizeGame();
});


function MonsterRespawn()
{
    let map=Game.map;
    let mon=Game.monsters;
    let structure=Map.structure[0];
    for(let monsterType in Monster)
    {
        map.tileMap.createFromTiles(
            Monster[monsterType].tileNumber,
            null,
            monsterType,
            structure.layer.monster,
            mon[monsterType]);

        mon[monsterType].callAll(
            'animations.add',
            'animations',
            'walk',
            Monster[monsterType].animation.walk,
            Monster[monsterType].animation.frame_rate,
            true
        );
        mon[monsterType].callAll('animations.play', 'animations', 'walk');
        mon[monsterType].setAll('body.velocity.x', Monster[monsterType].velocity.x);
        mon[monsterType].setAll('body.gravity.y', Monster[monsterType].gravity.y);
        mon[monsterType].setAll('body.bounce.x', 1);
    }
}
