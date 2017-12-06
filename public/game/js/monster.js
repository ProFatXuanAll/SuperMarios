const Monster = {
    goomba:{
        tileNumber: 87,
        spriteName: 'goomba',
        picture: {
            src: '/game/assets/monster/image/goomba.png',
            width: 32,
            height: 32
        },
        music: {
            die: {
                name: 'goombaDie',
                src:'/game/assets/sounds/hit.wav'
            }
        },
        animation: {
            walk: [ 0, 1 ],
            die: [ 2 ],
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
        overlap: function(character, monster) {
            if(character.body.touching.down && !character.body.touching.up)
            {
                monster.animations.stop();
                monster.animations.play('die');
                monster.body.enable = false;
                character.body.velocity.y = -300;
                let sfx = Game.engine.add.audio(Monster.goomba.music.die.name);
                sfx.play();
                Game.engine.time.events.add(Phaser.Timer.SECOND * 3, function()
                {
                    Monster.goomba.respawn(monster);
                });
            }
            else  Player[character.key].respawn(character);
        },
        respawn: function(monster)
        {
            let spawnedMonster = Game.engine.add.sprite(
                monster.spawn.x,
                monster.spawn.y,
                monster.name
            );

            spawnedMonster.animations.add(
                'walk',
                Monster[monster.name].animation.walk,
                Monster[monster.name].animation.frame_rate,
                true
            );

            spawnedMonster.animations.add(
                'die',
                Monster[monster.name].animation.die,
                Monster[monster.name].animation.frame_rate,
                true
            );

            spawnedMonster.animations.play('walk');

            //reassign spawnpoint
            spawnedMonster.name=monster.name;
            spawnedMonster.spawn={
                x: monster.spawn.x,
                y: monster.spawn.y 
            }

            //set physic
            Game.engine.physics.enable(spawnedMonster);
            spawnedMonster.body.enable=true;
            spawnedMonster.body.velocity.x=Monster[monster.name].velocity.x;
            spawnedMonster.body.gravity.y=Monster[monster.name].gravity.y;
            spawnedMonster.body.bounce.x=1;
            Game.monsters[monster.name].add(spawnedMonster);
            monster.destroy();
        }
    },
    caveTurtle:{
        tileNumber: 88,
        spriteName: 'caveTurtle',
        picture:{
            src: '/game/assets/monster/image/cave_turtle.png',
            width: 32,
            height: 32
        },
        music: {
            die: {
                name: 'caveTurtleDie',
                src:'/game/assets/sounds/hit.wav'
            }
        },
        animation: {
            walk: [ 0, 1 ],
            die: [ 2 ],
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
        spawn:{
            x:0,
            y:0
        },
        overlap: function(character, monster){
            if (character.body.touching.down&&!character.body.touching.up&&!character.body.touching.left&&!character.body.touching.right)
            {
                monster.animations.stop();
                monster.frame = Monster.caveTurtle.animation.die[0];
                monster.body.enable = false;
                character.body.velocity.y = -80;
                Game.engine.time.events.add(Phaser.Timer.SECOND, function()
                {
                    monster.destroy();
                });
            }
            else Player[character.key].respawn(character);
        },
        respawn: function(monster)
        {
            let spawnedMonster = Game.engine.add.sprite(
                monster.spawn.x,
                monster.spawn.y,
                monster.name
            );

            spawnedMonster.animations.add(
                'walk',
                Monster[monster.name].animation.walk,
                Monster[monster.name].animation.frame_rate,
                true
            );

            spawnedMonster.animations.add(
                'die',
                Monster[monster.name].animation.die,
                Monster[monster.name].animation.frame_rate,
                true
            );

            spawnedMonster.animations.play('walk');

            //reassign spawnpoint
            spawnedMonster.name=monster.name;
            spawnedMonster.spawn={
                x: monster.spawn.x,
                y: monster.spawn.y 
            }

            //set physic
            Game.engine.physics.enable(spawnedMonster);
            spawnedMonster.body.enable=true;
            spawnedMonster.body.velocity.x=Monster[monster.name].velocity.x;
            spawnedMonster.body.gravity.y=Monster[monster.name].gravity.y;
            spawnedMonster.body.bounce.x=1;
            Game.monsters[monster.name].add(spawnedMonster);
            monster.destroy();
        }
    },
    spikeTurtle:{
        tileNumber: 86,
        spriteName: 'spikeTurtle',
        picture:{
            src: '/game/assets/monster/image/spike_turtle.png',
            width: 32,
            height: 32
        },
        animation: {
            walk: [ 0, 1 ],
            die: [ 2 ],
            frame_rate: 2
        },
        music: {
            die: {
                name: 'spikeTurtleDie',
                src:'/game/assets/sounds/hit.wav'
            }
        },
        velocity: {
            x: -50,
            y: 0
        },
        gravity: {
            x: 0,
            y: 500
        },
        spawn:{
            x:0,
            y:0
        },
        overlap: function(character, monster){
            Player[character.key].respawn(character);
        },
        respawn: function(monster)  //function(monster,monstertype)
        {  
            //add sprite and animation
            let spawnedMonster = Game.engine.add.sprite(
                monster.spawn.x,
                monster.spawn.y,
                monster.name
            );

            spawnedMonster.animations.add(
                'walk',
                Monster[monster.name].animation.walk,
                Monster[monster.name].animation.frame_rate,
                true
            );

            spawnedMonster.animations.add(
                'die',
                Monster[monster.name].animation.die,
                Monster[monster.name].animation.frame_rate,
                true
            );

            spawnedMonster.animations.play('walk');

            //reassign spawnpoint
            spawnedMonster.name=monster.name;
            spawnedMonster.spawn={
                x: monster.spawn.x,
                y: monster.spawn.y 
            }

            //set physic
            Game.engine.physics.enable(spawnedMonster);
            spawnedMonster.body.enable=true;
            spawnedMonster.body.velocity.x=Monster[monster.name].velocity.x;
            spawnedMonster.body.gravity.y=Monster[monster.name].gravity.y;
            spawnedMonster.body.bounce.x=1;
            Game.monsters[monster.name].add(spawnedMonster);
            monster.destroy();
        }
    },
    ironFlower:{
        tileNumber: 80,
        spriteName: 'ironFlower',
        picture:{
            src: '/game/assets/monster/image/iron_flower.png',
            width: 32,
            height: 32
        },
        music: {
            die: {
                name: 'ironFlowerDie',
                src:'/game/assets/sounds/hit.wav'
            }
        },
        animation: {
            walk: [ 0, 1 ],
            die: [ 2 ],
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
        overlap: function(character, monster){
            Player[character.key].respawn(character);
        },
        respawn: function(monster)
        {
            let spawnedMonster = Game.engine.add.sprite(
                monster.spawn.x,
                monster.spawn.y,
                monster.name
            );

            spawnedMonster.animations.add(
                'walk',
                Monster[monster.name].animation.walk,
                Monster[monster.name].animation.frame_rate,
                true
            );

            spawnedMonster.animations.add(
                'die',
                Monster[monster.name].animation.die,
                Monster[monster.name].animation.frame_rate,
                true
            );

            spawnedMonster.animations.play('walk');

            //reassign spawnpoint
            spawnedMonster.name=monster.name;
            spawnedMonster.spawn={
                x: monster.spawn.x,
                y: monster.spawn.y 
            }

            //set physic
            Game.engine.physics.enable(spawnedMonster);
            spawnedMonster.body.enable=true;
            spawnedMonster.body.velocity.x=Monster[monster.name].velocity.x;
            spawnedMonster.body.gravity.y=Monster[monster.name].gravity.y;
            spawnedMonster.body.bounce.x=1;
            Game.monsters[monster.name].add(spawnedMonster);
            monster.destroy();
        }
    },

}

function MonsterSetup(map, structure)
{
    for(let monsterType in Monster)
    {
        this[monsterType] = Game.engine.add.group();
        this[monsterType].enableBody = true;

        map.tileMap.createFromTiles(
            Monster[monsterType].tileNumber,
            null,
            monsterType,
            structure.layer.monster,
            this[monsterType]
        );

        this[monsterType].callAll(
            'animations.add',
            'animations',
            'walk',
            Monster[monsterType].animation.walk,
            Monster[monsterType].animation.frame_rate,
            true
        );

        this[monsterType].callAll(
            'animations.add',
            'animations',
            'die',
            Monster[monsterType].animation.die,
            Monster[monsterType].animation.frame_rate,
            true
        );
        
        for(let i = 0; i < this[monsterType].length; ++i)
        {
            let child=this[monsterType].children[i];
            child.name=monsterType;
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
