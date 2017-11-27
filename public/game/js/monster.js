let Monster = {
    goomba:{
        tileNumber: 42,
        spriteName: 'goomba',
        animation: {
            name: 'walk',
            frame: [0, 1],
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
            src: '/game/assets/goomba.png',
            width: 32,
            height: 32
        }
    },
    spikeTurtle:{
        tileNumber: 41,
        spriteName: 'spikeTurtle',
        animation: {
            name: 'walk',
            frame: [0, 1],
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
            src: '/game/assets/spikeTurtle.png',
            width: 32,
            height: 32
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
            Monster[monsterType].animation.name,
            Monster[monsterType].animation.frame,
            Monster[monsterType].animation.frame_rate,
            true
        );
        this[monsterType].callAll('animations.play', 'animations', Monster[monsterType].animation.name);
        this[monsterType].setAll('body.velocity.x', Monster[monsterType].velocity.x);
        this[monsterType].setAll('body.gravity.y', Monster[monsterType].gravity.y);
    }
}
