const Monster = {
    goomba:{
        tileNumber: 42,
        spriteName: 'goomba',
        animation: {
            walk: [0, 1],
            frame_rate: 2
        },
        velocity: {
            x: -50,
            y: 0
        },
        gravity: {
            x: 0,
            y: 500
        },
        picture:{
            src: '/game/assets/monster/image/goomba.png',
            width: 32,
            height: 32
        },
        overlap: function(character, monster){
            console.log(character);
            if (character.body.touching.down)
            {
                monster.animations.stop();
                monster.frame = 2;
                monster.body.enable = false;
                character.body.velocity.y = -80;
                Game.engine.time.events.add(Phaser.Timer.SECOND, function()
                {
                    monster.kill();
                });
            }
            else playerDeath(character);
        }
    },
    caveTurtle:{
        tileNumber: 43,
        spriteName: 'caveTurtle',
        animation: {
            walk: [0, 1],
            frame_rate: 2
        },
        velocity: {
            x: -50,
            y: 0
        },
        gravity: {
            x: 0,
            y: 500
        },
        picture:{
            src: '/game/assets/monster/image/cave_turtle.png',
            width: 32,
            height: 32
        },
        overlap: function(character, monster){
            if (character.body.touching.down)
            {
                monster.animations.stop();
                monster.frame = 2;
                monster.body.enable = false;
                character.body.velocity.y = -80;
                Game.engine.time.events.add(Phaser.Timer.SECOND, function()
                {
                    monster.kill();
                });
            }
            else playerDeath(character);
        }
    },
    spikeTurtle:{
        tileNumber: 41,
        spriteName: 'spikeTurtle',
        animation: {
            walk: [0, 1],
            frame_rate: 2
        },
        velocity: {
            x: -50,
            y: 0
        },
        gravity: {
            x: 0,
            y: 500
        },
        picture:{
            src: '/game/assets/monster/image/spike_turtle.png',
            width: 32,
            height: 32
        },
        overlap: function(character, monster){
            playerDeath(character);
        }
    },
}

function MonsterSetup(GameEngine, map, structure)
{
    for(let monsterType in Monster)
    {
        this[monsterType] = GameEngine.add.group();
        this[monsterType].enableBody = true;

        map.tileMap.createFromTiles(
            Monster[monsterType].tileNumber,
            null,
            monsterType,
            structure.layer.monster,
            this[monsterType]);

        this[monsterType].callAll(
            'animations.add',
            'animations',
            'walk',
            Monster[monsterType].animation.walk,
            Monster[monsterType].animation.frame_rate,
            true
        );
        this[monsterType].callAll('animations.play', 'animations', 'walk');
        this[monsterType].setAll('body.velocity.x', Monster[monsterType].velocity.x);
        this[monsterType].setAll('body.gravity.y', Monster[monsterType].gravity.y);
        this[monsterType].setAll('body.bounce.x', 1);
    }
}
