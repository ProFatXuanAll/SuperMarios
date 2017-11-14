
var game = new Phaser.Game(1200, 480, Phaser.CANVAS, 'demo', { preload: preload, create: create, update: update, render: render });

function preload()
{
    game.load.tilemap('mario', 'phaser/assets/map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'phaser/assets/tileset_x32.png');
    game.load.image('bg','phaser/assets/01.png');
    game.load.spritesheet('player', 'phaser/assets/mariox32.png',32,56);
}

var map;
var tileset;
var layer;
var p;
var box;
var cursors;
var facing = 'left';
var bg;

function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#787878';

    bg=game.add.tileSprite(0,0,8000,600,'bg');
    bg.fixedToCamera=true;
    map = game.add.tilemap('mario');

    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

    map.setCollision(18);

    layer = map.createLayer('World1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    p = game.add.sprite(32, 32, 'player');

    //p.scale.setTo(0.5,0.5);

    game.physics.enable(p);

    game.physics.arcade.gravity.y = 300;

    p.body.bounce.y = 0.00;
    p.body.linearDamping = 1;
    p.body.collideWorldBounds = true;
    p.animations.add('left', [0, 1, 2, 3], 10, true);
        p.animations.add('turn', [4], 20, true);
    p.animations.add('right', [4, 5, 6, 7], 10, true);
    game.camera.follow(p);

    cursors = game.input.keyboard.createCursorKeys();
    wasd=
    {
      up:game.input.keyboard.addKey(Phaser.Keyboard.W),
      down:game.input.keyboard.addKey(Phaser.Keyboard.S),
      left:game.input.keyboard.addKey(Phaser.Keyboard.A),
      right:game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
}

function update()
{
    game.physics.arcade.collide(p, layer);
    p.body.velocity.x = 0;
    if (cursors.up.isDown||wasd.up.isDown)
    {
        if (p.body.onFloor())
        {
            p.body.velocity.y = -300;
        }
    }

    if (cursors.left.isDown||wasd.left.isDown)
    {
        p.body.velocity.x = -200;
        if (facing != 'left')
        {
            p.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown||wasd.right.isDown)
    {
        p.body.velocity.x = 200;
        if (facing != 'right')
        {
            p.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            p.animations.stop();

            if (facing == 'left')
            {
                p.frame = 0;
            }
            else
            {
                p.frame = 4;
            }
            facing = 'idle';
        }
    }
}

function render()
{
    // game.debug.body(p);
    //game.debug.bodyInfo(p, 32, 320);

}
