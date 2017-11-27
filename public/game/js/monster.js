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

function MonsterSetup(GameEngine, MonsterList, tileMap)
{
    self = this;
    MonsterList.forEach(function(monster){
        self[monster.spriteName] = GameEngine.add.group();
        self[monster.spriteName].enableBody = true;
        tileMap.createFromTiles(monster.tileNumber, null, monster.spriteName, 'Monster', self[monster.spriteName]);
        self[monster.spriteName].callAll(
            'animations.add',
            'animations',
            monster.animation.name,
            monster.animation.frame,
            monster.animation.frame_rate,
            true
        );
        self[monster.spriteName].callAll('animations.play', 'animations', monster.animation.name);
        self[monster.spriteName].setAll('body.velocity.x', monster.velocity.x);
        self[monster.spriteName].setAll('body.gravity.y', monster.gravity.y);
    });
}
