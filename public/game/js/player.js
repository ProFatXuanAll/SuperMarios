const Player = {
    mario: {
        spriteName: 'mario',
        picture: {
            width: 32,
            height: 56,
            src: '/game/assets/player/image/mariox32.png'
        },
        music: {
            die: {
                name: 'marioDie',
                src: '/game/assets/sounds/die.wav'
            }
        },
        animation: {
            left: [ 0, 1, 2, 3 ],
            idle: [ 4 ],
            right: [ 4, 5, 6, 7 ],
            die: [ 8 ],
            frameRate: 10
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
        },
        respawn: function(character)
        {
            if(!character.dieyet)
            {
                // need promise object
                character.immovable = true;
                character.body.moves=false;
                character.animations.stop();
                character.frame=8;
                Game.map.music.stop();
                character.sound.die.play();
                character.dieyet=true;

                Game.engine.time.events.add(Phaser.Timer.SECOND*3, function()
                {
                    Game.map.music.loopFull();
                    character.body.velocity.x=0;
                    character.body.velocity.y=0;
                    character.x=Map.structure[0].start[0].x;
                    character.y=Map.structure[0].start[0].y;
                    character.body.moves=true;
                    character.immovable = false;
                    character.animations.play();
                    character.dieyet=false;
                });
            }
            else return;
        },
        overlap: function(player,otherCharacter)
        {
            if(player==otherCharacter){
                return;
            }
            if (player.body.touching.down)
            {
                player.body.velocity.y = -150;
            }
            else if(player.body.touching.left)
            {
                //someone do something.
            }
        }
    }
};

function PlayerSetup(playerName, playerType, x=0, y=0, controlable=false)
{
    function SyncCursor()
    {
        this.up = {isDown: false};
        this.down = {isDown: false};
        this.left = {isDown: false};
        this.right = {isDown: false};
    }

    this.playerType = playerType;
    
    this.ispressed = playerType.ispressed;
    
    this.character = Game.engine.add.sprite(
        x,
        y,
        this.playerType.spriteName
    );

    this.character.currentType = {
        velocity: {
            left: -200,
            right: 200,
            up: -600,
            idle: 0
        },
        gravity: 20
    };

    if(controlable) {
        this.cursor = Game.engine.input.keyboard.createCursorKeys();
        Game.engine.camera.follow(this.character);
    }
    else {
        this.cursor = new SyncCursor();
    }

    Game.engine.physics.enable(this.character);

    this.character.body.collideWorldBounds = false;
    // set up animations by Phaser engine
    this.character.animations.add('left', this.playerType.animation.left, this.playerType.animation.frameRate, true);
    this.character.animations.add('idle', this.playerType.animation.idle, this.playerType.animation.frameRate, true);
    this.character.animations.add('right', this.playerType.animation.right, this.playerType.animation.frameRate, true);
    this.character.animations.add('right', this.playerType.animation.right, this.playerType.animation.frameRate, true);
    this.x = x;
    this.y = y;
    this.character.dieyet = false;
    this.name = Game.engine.add.text(
        x,
        y,
        playerName,
        Config.font.Arial
    );

    this.character.sound = {
        die: Game.engine.add.audio(playerType.music.die.name)
    };
}
