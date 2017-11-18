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
let map;
let layer;
let bg;
// players group
let players = {};
// monsters group
let monsters;
// items group
let items;
// interactive blocks group
let interactiveBlocks;

function playerSetup(playerName, x=0, y=0, controlable=false)
{
    function Player(character, cursor, x=0, y=0,text){
        this.character = character;
        this.cursor = cursor;
        this.action = {
              facing: 'idle',
              attack: 'none'
        };
        this.x = x;
        this.y = y;
        let style = { font: "16px Arial", fill: "#000000", wordWrapWidth: character.width, align: "center"};
        this.text=Game.add.text(x,y,playerName,style);
    }

    function SyncCursor(){
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

// load image and tilemap
function preload()
{
    Game.load.tilemap(
        'mario',
        'phaser/assets/map.json',
        null,
        Phaser.Tilemap.TILED_JSON);
    Game.load.image(
        'tileset',
        'phaser/assets/tileset_x32.png');
    Game.load.image(
        'bg',
        'phaser/assets/nature.png');
    Game.load.spritesheet(
        'player',
        'phaser/assets/mariox32.png',
        Config.picture.mario.width,
        Config.picture.mario.height);
}

function create()
{
    Game.physics.startSystem(Phaser.Physics.ARCADE);
    bg = Game.add.tileSprite(
        Config.picture.background.x,
        Config.picture.background.y,
        Config.picture.background.width,
        Config.picture.background.height,
        'bg');
    bg.fixedToCamera = true;
    map = Game.add.tilemap('mario');
    layer = map.createLayer('Solid');
    map.addTilesetImage('World', 'tileset');
    layer.resizeWorld();
    map.setCollisionByExclusion(map.tilesets[0].tileProperties.collisionExclusion);
    playerSetup('self', 0, 0, true);
    Game.camera.follow(players.self.character);

    /* debug */
    playerSetup('Alice',100,20);
    playerSetup('fuck',150,20);
    layer.debug=true;
    monsters = Game.add.group();
    items = Game.add.group();
    interactiveBlocks = Game.add.group();
}

function update()
{
    for(let name in players)
    {
        let character = players[name].character;
        Game.physics.arcade.collide(character, layer);
        for(let other in players)
        {
            let otherCharacter = players[other].character;
            //Game.physics.arcade.collide(character, otherCharacter,function(){console.log("hello")});
            Game.physics.arcade.overlap(character, otherCharacter, playerOverlap(character,otherCharacter));
        }
        Game.physics.arcade.collide(character, layer);
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
    Game.debug.body(map);
    Game.debug.bodyInfo(players['Alice'], 32, 320);

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
    if (player.body.touching.down){
            player.body.velocity.y = -80;
    }
}
function detectWorldBound(character)
{
    if(character.y>=400)
    {
        character.body.velocity.x=0;
        character.body.velocity.y=0;
        character.x=0;
        character.y=0;
    }
}