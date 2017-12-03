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
    // load all background music
    for(let i = 0; i < Map.music.length; ++i)
    {
        Game.engine.load.audio(
            Map.music[i].name,
            Map.music[i].src
        );
    }
    // load all player spritesheet and music
    for(let playerType in Player)
    {
        console.log(Player[playerType]);
        Game.engine.load.spritesheet(
            Player[playerType].spriteName,
            Player[playerType].picture.src,
            Player[playerType].picture.width,
            Player[playerType].picture.height
        );
        Game.engine.load.audio(
            Player[playerType].music.die.name,
            Player[playerType].music.die.src,
        );
    }
    // load all monster spritesheet and music
    for(let monsterType in Monster)
    {
        Game.engine.load.spritesheet(
            Monster[monsterType].spriteName,
            Monster[monsterType].picture.src,
            Monster[monsterType].picture.width,
            Monster[monsterType].picture.height
        );
        Game.engine.load.audio(
            Monster[monsterType].music.die.name,
            Monster[monsterType].music.die.src
        );
    }
    // load all item spritesheet and music
    for(let itemType in Items)
    {
        Game.engine.load.spritesheet(
            Items[itemType].spriteName,
            Items[itemType].picture.src,
            Items[itemType].picture.width,
            Items[itemType].picture.height
        );
    }
    // add promise make sure pictures loaded
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
        Map.music[2]
    );

    // start loop map music
    Game.map.music.loopFull();

    // create monster
    Game.monsters = new MonsterSetup(
        Game.map,
        Map.structure[0]
    );

    // create item
    Game.items = new ItemSetup(
        Game.map,
        Map.structure[0]
    );

    //create players' container
    Game.players = {};

    // create player for client
    Game.players['self'] = new PlayerSetup(
        'self',
        Player.mario,
        0,
        0,
        true
    );


    /*----------------- debug */
    Game.players['Alice'] = new PlayerSetup(
        'Alice',
        Player.mario,
        100,
        20
    );
    Game.players['fuck'] = new PlayerSetup(
        'fuck',
        Player.mario,
        150,
        20
    );
    deathsound=Game.engine.add.audio(Player.mario.music.die.name);
    /*------------------ debug */

}

function update()
{
    for(let player in Game.players)
    {
        let character = Game.players[player].character;

        //player vs solidlayer
        Game.engine.physics.arcade.collide(character, Game.map.solid);
        
        //player vs other players        
        for(let other in Game.players)
        {
            if(player==other) continue;
            let otherCharacter = Game.players[other].character;
            Game.engine.physics.arcade.collide(character, otherCharacter);
        }
        
        //player vs monsters
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
                Map.detectMonsterWorldBound(Game.monsters[monsterType].children[i],Game.map);
            }
        }

        //player vs items
        for(let itemType in Game.items)
        {
            Game.engine.physics.arcade.collide(Game.items[itemType], Game.map.solid);
            
            Game.engine.physics.arcade.overlap(
                character,
                Game.items[itemType],
                Items[itemType].overlap(Game.players[player].currentType)
            );
        }

        //set each players' title on head
        let text=Game.players[player].text;
        text.x = Math.floor(character.x);
        text.y = Math.floor(character.y-character.height/3);
        Map.detectPlayerWorldBound(character,Game.map);
        Map.detectFinished(character,Game.map);
    }

    //player movement setting
    for(let player in Game.players)
    {
        let character = Game.players[player].character;
        let cursor = Game.players[player].cursor;
        let action = Game.players[player].action;
        let velocity = character.body.velocity;
        let currentType = Game.players[player].currentType;

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

function render(){}

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
