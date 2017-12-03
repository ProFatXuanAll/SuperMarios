const Player = {
    mario: {
        spriteName: 'Mario',
        animation: {
            left: [ 0, 1, 2, 3 ],
            idle: [ 4 ],
            right: [ 4, 5, 6, 7 ],
            frameRate: 10
        },
        picture: {
            width: 32,
            height: 56,
            src: '/game/assets/player/image/mariox32.png'
        },
        velocity: {
            left: -200,
            right: 200,
            up: -600,
            idle: 0
        },
        gravity: 20,
        width: 32,
        height: 56,
        ispressed: {
            up:false,
            down:false,
            left:false,
            right:false
        }
    }
};

function PlayerSetup(GameEngine, playerName, playerType, x=0, y=0, controlable=false)
{
    function SyncCursor()
    {
        this.up = {isDown: false};
        this.down = {isDown: false};
        this.left = {isDown: false};
        this.right = {isDown: false};
    }

    this.playerType = playerType;
    this.ispressed=playerType.ispressed;
    this.character = GameEngine.add.sprite(x, y, this.playerType.spriteName);
    this.cursor = controlable ? 
        GameEngine.input.keyboard.createCursorKeys() : new SyncCursor();

    GameEngine.physics.enable(this.character);
    this.character.body.collideWorldBounds = true;
    // set up animations by Phaser engine
    this.character.animations.add('left', this.playerType.animation.left, this.playerType.animation.frameRate, true);
    this.character.animations.add('idle', this.playerType.animation.idle, this.playerType.animation.frameRate, true);
    this.character.animations.add('right', this.playerType.animation.right, this.playerType.animation.frameRate, true);
    this.action = {
        facing: 'idle',
        attack: 'none'
    };
    this.x = x;
    this.y = y;
    this.text = GameEngine.add.text(x, y, playerName, Config.font.Arial);
}
