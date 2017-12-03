const Monster = {
    goomba:{
        tileNumber: 42,
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
        respawn: function(monster)  //function(monster,monstertype)
        {
            //add sprite and animation
            let test = Game.engine.add.sprite(
                monster.spawn.x,
                monster.spawn.y,
                monster.name
            );

            test.animations.add(
                'walk',
                Monster[monster.name].animation.walk,
                Monster[monster.name].animation.frame_rate,
                true
            );

            test.animations.add(
                'die',
                Monster[monster.name].animation.die,
                Monster[monster.name].animation.frame_rate,
                true
            );

            test.animations.play('walk');

            //reassign spawnpoint
            test.name=monster.name;
            test.spawn={
                x: monster.spawn.x,
                y: monster.spawn.y 
            }

            //set physic
            Game.engine.physics.enable(test);
            test.body.enable=true;
            test.body.velocity.x=Monster[monster.name].velocity.x;
            test.body.gravity.y=Monster[monster.name].gravity.y;
            test.body.bounce.x=1;
            Game.monsters[monster.name].add(test);
            monster.destroy();
        }
    },
    caveTurtle:{
        tileNumber: 43,
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
        respawn: function(monster)  //function(monster,monstertype)
        {  
            //add sprite and animation
            let test = Game.engine.add.sprite(
                monster.spawn.x,
                monster.spawn.y,
                'goomba'
            );

            test.animations.add(
                'walk',
                Monster['goomba'].animation.walk,
                Monster['goomba'].animation.frame_rate,
                true
            );

            test.animations.add(
                'die',
                Monster['goomba'].animation.die,
                Monster['goomba'].animation.frame_rate,
                true
            );

            test.animations.play('walk');

            //reassign spawnpoint
            test.name='goomba';
            test.spawn={
                x: monster.spawn.x,
                y: monster.spawn.y 
            }

            //set physic
            Game.engine.physics.enable(test);
            test.body.enable=true;
            test.body.velocity.x=Monster['goomba'].velocity.x;
            test.body.gravity.y=Monster['goomba'].gravity.y;
            test.body.bounce.x=1;
            Game.monsters['goomba'].add(test);
            monster.destroy();
        }
    },
    spikeTurtle:{
        tileNumber: 41,
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
            let test = Game.engine.add.sprite(
                monster.spawn.x,
                monster.spawn.y,
                monster.name
            );

            test.animations.add(
                'walk',
                Monster[monster.name].animation.walk,
                Monster[monster.name].animation.frame_rate,
                true
            );

            test.animations.add(
                'die',
                Monster[monster.name].animation.die,
                Monster[monster.name].animation.frame_rate,
                true
            );

            test.animations.play('walk');

            //reassign spawnpoint
            test.name=monster.name;
            test.spawn={
                x: monster.spawn.x,
                y: monster.spawn.y 
            }

            //set physic
            Game.engine.physics.enable(test);
            test.body.enable=true;
            test.body.velocity.x=Monster[monster.name].velocity.x;
            test.body.gravity.y=Monster[monster.name].gravity.y;
            test.body.bounce.x=1;
            Game.monsters[monster.name].add(test);
            monster.destroy();
        }
    },
    ironFlower:{
        tileNumber: 35,
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

        for(let i=0;i<this[monsterType].length;i++)
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