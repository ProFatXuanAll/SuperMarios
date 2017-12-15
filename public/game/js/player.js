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
                src: '/game/assets/sounds/die.wav',
                create: () => {
                    let sfx = Game.engine.add.audio(Player.mario.music.die.name);
                    return () => {
                        sfx.play();
                    }
                }
            }
        },
        animation: {
            left: [ 0, 1, 2, 3 ],
            leftIdle: [ 0 ],
            right: [ 4, 5, 6, 7 ],
            rightIdle: [ 4 ],
            die: [ 8 ],
            frameRate: 10
        },
        velocity: {
            horizontal: {
                move: 200,
                idle: 0.1
            },
            vertical: {
                bounce: -200,
                jump: -600,
                gravity: 20   
            }
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
        collide: function(character, otherCharacter){
            if (character.body.touching.down)
            {
                console.log(Config.currentUserName+"is touching down");
                
                socket.emit(
                    'someOneDie',
                    {
                        name: otherCharacter.name._text
                    }
                );
                character.body.velocity.y = Player[character.key].velocity.vertical.bounce;
            }
            if(character.body.touching.left)
            {
                //console.log(Config.currentUserName+"is touching left");
            }
            if(character.body.touching.up)
            {
                //console.log(Config.currentUserName+"is touching up");
            }
            if(character.body.touching.right)
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
    character.animations.add('right', playerType.animation.right, playerType.animation.frameRate, true);
    character.animations.add('leftIdle', playerType.animation.leftIdle, playerType.animation.frameRate, true);
    character.animations.add('rightIdle', playerType.animation.rightIdle, playerType.animation.frameRate, true);
    character.animations.add('die', playerType.animation.die, playerType.animation.frameRate, true);
    character.dieyet = false;

    character.name = Game.engine.add.text(
        x,
        y,
        playerName,
        Config.font.Arial
    );
    character.item = {};
    for(let itemType in Item)
    {
        character.item[itemType] = 0;
    }

    return character;
}
