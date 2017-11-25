let Game = new Phaser.Game(
    Config.window.width,
    Config.window.height,
    Phaser.CANVAS,
    'demo',
    {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
);

// map of the game
let Map;

// players group
let players = {};

// load image and tilemap
function preload()
{
    Game.load.tilemap(
        'mario',
        '/game/assets/map.json',
        null,
        Phaser.Tilemap.TILED_JSON
    );
    Game.load.image(
        'tileset',
        '/game/assets/tilesetx32.png'
    );
    Game.load.image(
        'bg',
        '/game/assets/nature.png'
    );
    Game.load.spritesheet(
        'player',
        '/game/assets/mariox32.png',
        Config.picture.mario.width,
        Config.picture.mario.height
    );
    Game.load.spritesheet(
        Monster.goomba.spriteName,
        Monster.goomba.path,
        Monster.goomba.picture.width,
        Monster.goomba.picture.height
    );
    Game.load.spritesheet(
        Monster.spikeTurtle.spriteName,
        Monster.spikeTurtle.path,
        Monster.spikeTurtle.picture.width,
        Monster.spikeTurtle.picture.height,
    );
    // add promise make sure pictures loaded
}

function create()
{
    function MapSetup()
    {
        function MonsterSetup(MonsterList, tileMap)
        {
            self = this;
            MonsterList.forEach(function(monster){
                self[monster.spriteName] = Game.add.group();
                self[monster.spriteName].enableBody = true;
                tileMap.createFromTiles(monster.tileNumber, null, monster.spriteName, 'Monster', self[monster.spriteName]);
                self[monster.spriteName].callAll(
                    'animations.add',
                    'animations',
                    monster.animation.name,
                    monster.animation.frame,
                    monster.animation.frame_rate,
                    true
                );
                self[monster.spriteName].callAll('animations.play', 'animations', monster.animation.name);
                self[monster.spriteName].setAll('body.velocity.x', monster.velocity.x);
                self[monster.spriteName].setAll('body.gravity.y', monster.gravity.y);
            });
        }
        // add background
        this.background = Game.add.tileSprite(
            Config.picture.background.x,
            Config.picture.background.y,
            Config.picture.background.width,
            Config.picture.background.height,
            'bg' // add config
        );
        // background camera fixed to center
        this.background.fixedToCamera = true;

        // add tile map (previous defined map.json)
        this.tileMap = Game.add.tilemap('mario');        
        // load image --??
        this.tileMap.addTilesetImage('World', 'tileset');

        // add layer
        this.solidBlocks = this.tileMap.createLayer('Solid');
        // ????
        this.solidBlocks.resizeWorld();

        // add items
        this.items = Game.add.group();

        // add interactive blocks
        this.activeBlocks = Game.add.group();
        
        // enable collision on tile map
        this.tileMap.setCollisionByExclusion(this.tileMap.tilesets[0].tileProperties.collisionExclusion);

        // add monsters
        this.monsters = new MonsterSetup([
            Monster.goomba,
            Monster.spikeTurtle
        ],
        this.tileMap);
    }

    Game.physics.startSystem(Phaser.Physics.ARCADE);

    Map = new MapSetup();

    // create player for client
    playerSetup('self', 0, 0, true);

    // main camera follow main character
    Game.camera.follow(players.self.character);

    /*----------------- debug */
    playerSetup('Alice',100,20);
    playerSetup('fuck',150,20);
    Map.solidBlocks.debug = true;
    /*------------------ debug */
}
function playerSetup(playerName, x=0, y=0, controlable=false)
{
    function Player(character, cursor, x=0, y=0,text)
    {
        this.character = character;
        this.cursor = cursor;
        this.action = {
              facing: 'idle',
              attack: 'none'
        };
        this.x = x;
        this.y = y;
        let style = Config.font.style;
        this.text=Game.add.text(x,y,playerName,style);
    }

    function SyncCursor()
    {
        this.up = {isDown: false};
        this.down = {isDown: false};
        this.left = {isDown: false};
        this.right = {isDown: false};
    }

    let character = Game.add.sprite(x, y, 'player');
    let cursor;
    if(controlable)
        cursor = Game.input.keyboard.createCursorKeys();
    else
        cursor = new SyncCursor();
    Game.physics.enable(character);
    character.body.collideWorldBounds = true;
    // set up animations by Phaser engine
    character.animations.add('left', Config.animation.left, Config.animation.frameRate, true);
    character.animations.add('idle', Config.animation.idle, Config.animation.frameRate, true);
    character.animations.add('right', Config.animation.right, Config.animation.frameRate, true);
    players[playerName] = new Player(character, cursor, x, y);
    /*coin tileset collision and text debug*/
}

function update()
{
    for(let name in players)
    {
        let character = players[name].character;
        Game.physics.arcade.collide(character, Map.solidBlocks);
        for(let other in players)
        {
            let otherCharacter = players[other].character;
            //Game.physics.arcade.collide(character, otherCharacter,function(){console.log("hello")});
            Game.physics.arcade.overlap(character, otherCharacter, playerOverlap(character,otherCharacter));
        }
        Game.physics.arcade.collide(character, Map.solidBlocks);
        for(let monster in Map.monsters)
        {
            Game.physics.arcade.collide(Map.monsters[monster], Map.solidBlocks);
            Game.physics.arcade.overlap(character, Map.monsters[monster], goombaOverlap);
        }
    }
    for(let name in players)
    {
        let character = players[name].character;
        let text=players[name].text;
        text.x = Math.floor(character.x);
        text.y = Math.floor(character.y-character.height/3);
        detectWorldBound(character);
    }
    for(let name in players)
    {
        let character = players[name].character;
        let cursor = players[name].cursor;
        let action = players[name].action;
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
    for(let name in players)
    {
        let character = players[name].character;
            Game.debug.body(character);
    }
    //Game.debug.body(Map.solidBlocks);
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
            players.Alice.cursor.up.isDown = true;
            break;
        case 'a':
            players.Alice.cursor.left.isDown = true;
            break;
        case 's':
            players.Alice.cursor.down.isDown = true;
            break;
        case 'd':
            players.Alice.cursor.right.isDown = true;
            break;
        case 'i':
            players.fuck.cursor.up.isDown = true;
            break;
        case 'j':
            players.fuck.cursor.left.isDown = true;
            break;
        case 'k':
            players.fuck.cursor.down.isDown = true;
            break;
        case 'l':
            players.fuck.cursor.right.isDown = true;
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
            players.Alice.cursor.up.isDown = false;
            break;
        case 'a':
            players.Alice.cursor.left.isDown = false;
            break;
        case 's':
            players.Alice.cursor.down.isDown = false;
            break;
        case 'd':
            players.Alice.cursor.right.isDown = false;
            break;
        case 'i':
            players.fuck.cursor.up.isDown = false;
            break;
        case 'j':
            players.fuck.cursor.left.isDown = false;
            break;
        case 'k':
            players.fuck.cursor.down.isDown = false;
            break;
        case 'l':
            players.fuck.cursor.right.isDown = false;
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
        Game.time.events.add(Phaser.Timer.SECOND, function() {
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
    if(character.y+character.height>=Map.width)
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
    Game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
        character.body.enable=true;
        character.visible = true;
    });
}
