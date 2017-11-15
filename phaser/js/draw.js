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
  });
let map;
let layer;
let players = {};
let bg;

function playerSetup(playerName, x=0, y=0)
{
  function Player(character, cursor, x=0, y=0){
    this.character = character;
    this.cursor = cursor;
    this.action = {
      facing: 'idle',
      attack: 'none'
    };
    this.x = x;
    this.y = y;
  }

  let character = Game.add.sprite(x, y, 'player');
  let cursor = Game.input.keyboard.createCursorKeys();
  Game.physics.enable(character);
  //character.body.linearDamping = 1;
  character.body.collideWorldBounds = true;
  // set up animations by Phaser engine
  character.animations.add('left', [0, 1, 2, 3], 10, true);
  character.animations.add('idle', [4], 20, true);
  character.animations.add('right', [4, 5, 6, 7], 10, true);
  players[playerName] = new Player(character, cursor, x, y);
}

// load image and tilemap
function preload()
{
    Game.load.tilemap('mario', 'phaser/assets/map1.json', null, Phaser.Tilemap.TILED_JSON);
    Game.load.image('tileset', 'phaser/assets/tileset_x32.png');
    Game.load.image('bg','phaser/assets/01.png');
    Game.load.spritesheet('player', 'phaser/assets/mariox32.png',32,56);
}

function create()
{
    Game.physics.startSystem(Phaser.Physics.ARCADE);
    bg = Game.add.tileSprite(0,0,8000,600,'bg');
    bg.fixedToCamera = true;
    map = Game.add.tilemap('mario');
    layer = map.createLayer('tile');
    layer.resizeWorld();
    map.addTilesetImage('World', 'tileset');
    map.setCollisionBetween(1,6);
    map.setCollisionBetween(9,14);
    map.setCollisionBetween(17,22);
    map.setCollisionBetween(25,29);
    map.setCollisionBetween(33,38);
    playerSetup('self');
    Game.camera.follow(players.self.character);
}

function update()
{
  for(let name in players)
  {

      let character = players[name].character;
      let cursor = players[name].cursor;
      let action = players[name].action;
      let velocity = character.body.velocity;

      Game.physics.arcade.collide(character, layer);
      // stop moving to left or right
      velocity.x = 0;
      if (cursor.up.isDown)
      {
        if (character.body.onFloor()) velocity.y = -600;
      }
      if(!character.body.onFloor()) velocity.y += 20;
      if(cursor.left.isDown)
      {
        velocity.x = -200;
        if (action.facing != 'left')
        {
          character.animations.play('left');
          action.facing = 'left';
        }
      }
      else if (cursor.right.isDown)
      {
        velocity.x = 200;
        if (action.facing != 'right')
        {
          character.animations.play('right');
          action.facing = 'right';
        }
      else
      {
          character.animations.stop();
          if (action.facing == 'left') character.frame = Config.frame.leftFrame;
          else character.frame = Config.frame.rightFrame;
          action.facing = 'idle';
      }
    }
  }
  /*

  player.body.velocity.x=0;
  if (cursors.up.isDown)
  {
    if (player.body.onFloor()) player.body.velocity.y = -600;
  }
  if(!player.body.onFloor()) player.body.velocity.y+=20;

  if (cursors.left.isDown)
  {

  }
  else if (cursors.right.isDown)
  {
    player.body.velocity.x = 200;
    if (facing != 'right')
    {
      player.animations.play('right');
      facing = 'right';
    }
  }
  else
  {
    if (facing != 'idle')
    {
      player.animations.stop();
      if (facing == 'left') player.frame = 0;
      else player.frame = 4;
      facing = 'idle';
    }
  }
  */

}

function render()
{
}

window.addEventListener("keydown",function(e){
  switch (e.which)
  {
    case 71:  //key 'g'
    console.log(e.which);
      playerSetup('Alice',10,20);
      break;
  }
});
