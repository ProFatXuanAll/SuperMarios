
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'demo', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('mario', 'phaser/assets/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'phaser/assets/super_mario.png');
    game.load.image('player', 'phaser/assets/asuna.png');

}

var map;
var tileset;
var layer;
var p;
var cursors;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#787878';

    map = game.add.tilemap('mario');

    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');

   // 14 = ? block
     map.setCollisionBetween(14, 15);

    map.setCollisionBetween(15, 16);
    map.setCollisionBetween(20, 25);
    map.setCollisionBetween(27, 29);
    map.setCollision(40);

    layer = map.createLayer('World1');

    //  Un-comment this on to see the collision tiles
    // layer.debug = true;

    layer.resizeWorld();

    p = game.add.sprite(32, 32, 'player');
    p.scale.setTo(0.35,0.35);

    game.physics.enable(p);

    game.physics.arcade.gravity.y = 250;

    p.body.bounce.y = 0.0;
    p.body.linearDamping = 1;
    p.body.collideWorldBounds = true;

    game.camera.follow(p);

    cursors = game.input.keyboard.createCursorKeys();
    wasd = {
  up:game.input.keyboard.addKey(Phaser.Keyboard.W),
  down:game.input.keyboard.addKey(Phaser.Keyboard.S),
  left:game.input.keyboard.addKey(Phaser.Keyboard.A),
  right:game.input.keyboard.addKey(Phaser.Keyboard.D),
};
}

function update() {

    game.physics.arcade.collide(p, layer);

    p.body.velocity.x = 0;

    if (cursors.up.isDown||wasd.up.isDown)
    {
        if (p.body.onFloor())
        {
            p.body.velocity.y = -200;
        }
    }

    if (cursors.left.isDown||wasd.left.isDown)
    {
        p.body.velocity.x = -150;
    }
    else if (cursors.right.isDown||wasd.right.isDown)
    {
        p.body.velocity.x = 150;
    }

}

function render() {

    // game.debug.body(p);
    game.debug.bodyInfo(p, 32, 320);

}
