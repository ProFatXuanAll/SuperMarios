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
        death:
        {
            name: 'goomba',
            frame:2,
            src:'/game/assets/sounds/hit.wav'
        },
        overlap: function(character, monster){
            console.log(monster);
            if (character.body.touching.down)
            {
                monster.animations.stop();
                monster.frame = 2;
                monster.body.enable = false;
                character.body.velocity.y = -80;
                sfx=Game.engine.add.audio(monster.key);
                sfx.play();
                Game.engine.time.events.add(Phaser.Timer.SECOND, function()
                {
                    console.log(monster);
                    Monster.goomba.respawn(monster);
                });
            }
            else playerDeath(character);
        },
        respawn: function(monster)
        {
            test=Game.engine.add.sprite(monster.spawn.x,monster.spawn.y, 'goomba');
            Game.engine.physics.enable(test);
            test.body.enable=true;
            
            test.animations.add('walk', Monster['goomba'].animation.walk, Monster['goomba'].animation.frame_rate, true);
            test.animations.play('walk');
            test.spawn={
                x: monster.spawn.x,
                y: monster.spawn.y 
            }
            test.body.velocity.x=Monster['goomba'].velocity.x;
            test.body.gravity.y=Monster['goomba'].gravity.y;
            test.body.bounce.x=1;
            Game.monsters['goomba'].add(test);
            monster.destroy();
            console.log('fuck');
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
        spawn:{
            x:0,
            y:0
        },
        death:
        {
            name: 'death',
            frame:2,
            src:'/game/assets/sounds/hit.wav'
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
                    monster.destroy();
                    
                });
            }
            else playerDeath(character);
        },
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
        spawn:{
            x:0,
            y:0
        },
        death:
        {
            name: 'death',
            frame:2,
            src:'/game/assets/sounds/hit.wav'
        },
        overlap: function(character, monster){
            playerDeath(character);
        }
    },
    ironFlower:{
        tileNumber: 35,
        spriteName: 'ironFlower',
        animation: {
            walk: [0, 1],
            frame_rate: 6
        },
        velocity: {
            x: 0,
            y: 0
        },
        gravity: {
            x: 0,
            y: 500
        },
        picture:{
            src: '/game/assets/monster/image/iron_flower.png',
            width: 32,
            height: 32
        },

        death:
        {
            name: 'death',
            frame:2,
            src:'/game/assets/sounds/hit.wav'
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
        for(let i=0;i<this[monsterType].length;i++)
        {
            let child=this[monsterType].children[i];
            child.spawn={
                x: child.position.x,
                y: child.position.y
            }
        }
        this[monsterType].callAll('animations.play', 'animations', 'walk');
        this[monsterType].setAll('body.velocity.x', Monster[monsterType].velocity.x);
        this[monsterType].setAll('body.gravity.y', Monster[monsterType].gravity.y);
        this[monsterType].setAll('body.bounce.x', 1);
    }
}
function MonsterDeath()
{

}