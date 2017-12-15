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
        width: 32,
        height: 56,
        ispressed: {
            up:false,
            down:false,
            left:false,
            right:false,
            die:false
        },
        respawn: function(character)
        {
            // need promise object
            Game.map.music.loopFull();
            character.body.velocity.x = 0;
            character.body.velocity.y = 0;
            character.x = Map.structure[0].start[0].x;
            character.y = Map.structure[0].start[0].y;
            character.body.enable = true;
            character.immovable = false;
            character.dieyet = false;
        },
        collide: function(player, otherCharacter){
            if (player.body.touching.down)
            {
                console.log(Config.currentUserName+"is touching down");
                
                socket.emit(
                    'someOneDie',
                    {
                        name: otherCharacter.name._text
                    }
                );
                player.body.velocity.y-= 200;
            }
            if(player.body.touching.left)
            {
                //console.log(Config.currentUserName+"is touching left");
            }
            if(player.body.touching.up)
            {
                //console.log(Config.currentUserName+"is touching up");
            }
            if(player.body.touching.right)
            {
                //console.log(Config.currentUserName+"is touching right");
            }
        }
    }
};

function PlayerSetup(playerName, playerType, x=0, y=0, controlable=false)
{
    //set up player type
    // the ultimate goal is to define things inside character and make it become a group
    
    //add character sprite
    let character = Game.engine.add.sprite(
        x,
        y,
        playerType.spriteName
    );

    //test whether player is pressed or not (for socket.io)
    character.ispressed = playerType.ispressed;

    //player's initial velocity, must be initial inside or other will get its reference
    character.currentType = {
        velocity: {
            left: -200,
            right: 200,
            up: -600,
            idle: 0.1
        },
        gravity: 20
    };

    if(controlable)
    {
        character.cursor = Game.engine.input.keyboard.createCursorKeys();
        Game.engine.camera.follow(character);
    }
    else
    {
        character.cursor = new SyncCursor();
    }

    function SyncCursor()
    {
        this.up = {isDown: false};
        this.down = {isDown: false};
        this.left = {isDown: false};
        this.right = {isDown: false};
    }

    Game.engine.physics.enable(character);
    character.body.collideWorldBounds = false;
    // set up animations by Phaser engine
    character.animations.add('left', playerType.animation.left, playerType.animation.frameRate, true);
    character.animations.add('idle', playerType.animation.idle, playerType.animation.frameRate, true);
    character.animations.add('right', playerType.animation.right, playerType.animation.frameRate, true);
    character.animations.add('die', playerType.animation.die, playerType.animation.frameRate, true);
    character.dieyet = false;

    character.sound = {
        die: Game.engine.add.audio(playerType.music.die.name)
    };
    character.name = Game.engine.add.text(
        x,
        y,
        playerName,
        Config.font.Arial
    );

    return character;
}
