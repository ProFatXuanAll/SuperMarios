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
                src:'/game/assets/monster/sound/hit.wav',
                create: () => {
                    let sfx = Game.engine.add.audio(Monster.goomba.music.die.name);
                    return () => {
                        sfx.play();
                    }
                }
            }
        },
        animation: {
            walkLeft: [ 0, 1 ],
            walkRight: [ 2, 3 ],
            die: [ 4 ],
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
        overlap: function(character, monster){
            if(character.body.touching.down && !character.body.touching.up)
            {
                socket.emit(
                    'monsterDead',
                    {
                        monsterKiller: Config.currentUserName,
                        monsterType: 'goomba',
                        id: monster.id
                    }
                );
                Game.engine.time.events.add(Phaser.Timer.SECOND * 3,function(){
                    // respawn monster to its spawnpoint
                    socket.emit(
                        'monsterRespawn',
                        {
                            monsterType: 'goomba',
                            id: monster.id
                        }
                    );
                });
            }
            else
            {
                socket.emit(
                    'playerDead',
                    {
                        name: character.name._text
                    }
                );
                Game.engine.time.events.add(Phaser.Timer.SECOND * 3,function(){
                    // respawn monster to its spawnpoint
                    socket.emit(
                        'playerRespawn',
                        {
                            name: character.name._text,
                        }
                    );
                });
            }
        },
        destroy: function(monster){
            monster.animations.stop();
            monster.animations.play('die');
            monster.body.enable = false;
        },
        respawn: function(monster){
	        monster.body.enable = true;
            monster.animations.play('walkLeft');
	        monster.position.x = monster.spawn.x;
            monster.position.y = monster.spawn.y;       
            monster.body.velocity.x = Monster.goomba.velocity.x;
            monster.body.velocity.y = Monster.goomba.velocity.y;
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
                src:'/game/assets/monster/sound/hit.wav',
                create: () => {
                    let sfx = Game.engine.add.audio(Monster.caveTurtle.music.die.name);
                    return () => {
                        sfx.play();
                    }
                }
            }
        },
        animation: {
            walkLeft: [ 0, 1 ],
            walkRight: [ 2, 3 ],
            die: [ 4 ],
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
            if(character.body.touching.down && !character.body.touching.up)
            {
                socket.emit(
                    'monsterDead',
                    {
                        monsterKiller: Config.currentUserName,
                        monsterType: 'caveTurtle',
                        id: monster.id
                    }
                );
                Game.engine.time.events.add(Phaser.Timer.SECOND * 3,function()
                {
                    // respawn monster to its spawnpoint
                    Monster.caveTurtle.respawn(monster);
                });
            }
            else
            {
                socket.emit(
                    'playerDead',
                    {
                        name: character.name._text
                    }
                );
                Game.engine.time.events.add(Phaser.Timer.SECOND * 3,function(){
                    // respawn monster to its spawnpoint
                    socket.emit(
                        'playerRespawn',
                        {
                            name: character.name._text,
                        }
                    );
                });
            }
        },
        destroy: function(monster){
            monster.animations.stop();
            monster.animations.play('die');
            monster.body.enable = false;
        },
        respawn: function(monster){
	        monster.body.enable = true;
            monster.animations.play('walkLeft');
	        monster.position.x = monster.spawn.x;
            monster.position.y = monster.spawn.y;
            monster.body.velocity.x = Monster.caveTurtle.velocity.x;
            monster.body.velocity.y = Monster.caveTurtle.velocity.y;
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
            walkLeft: [ 0, 1 ],
            walkRight: [ 2, 3 ],
            die: [ 4 ],
            frame_rate: 2
        },
        music: {
            die: {
                name: 'spikeTurtleDie',
                src: '/game/assets/monster/sound/empty.wav',
                create: () => {
                    let sfx = Game.engine.add.audio(Monster.spikeTurtle.music.die.name);
                    return () => {
                        sfx.play();
                    }
                }
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
            socket.emit(
                'playerDead',
                {
                    name: character.name._text
                }
            );
            Game.engine.time.events.add(Phaser.Timer.SECOND * 3,function(){
                // respawn monster to its spawnpoint
                socket.emit(
                    'playerRespawn',
                    {
                        name: character.name._text,
                    }
                );
            });
        },
        destroy: function(monster){
            monster.animations.stop();
            monster.animations.play('die');
            monster.body.enable = false;
        },
        respawn: function(monster){
            monster.body.enable = true;
            monster.animations.play('walkLeft');
            monster.position.x = monster.spawn.x;
            monster.position.y = monster.spawn.y;
            monster.body.velocity.x = Monster.spikeTurtle.velocity.x;
            monster.body.velocity.y = Monster.spikeTurtle.velocity.y;
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
        },
        animation: {
            walkLeft: [ 0, 1 ],
            walkRight: [ 0, 1 ],
            die: [ 1 ],
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
            socket.emit(
                'playerDead',
                {
                    name: character.name._text
                }
            );
            Game.engine.time.events.add(Phaser.Timer.SECOND * 3,function(){
                // respawn monster to its spawnpoint
                socket.emit(
                    'playerRespawn',
                    {
                        name: character.name._text,
                    }
                );
            });
        },
        respawn: function(monster)
        {
            //ironFlower never die!
            return;
        }
    }
}

function MonsterSetup(structure=null, monsterData=null)
{
    for(let monsterType in Monster)
    {
        Game.monsters[monsterType] = Game.engine.add.group();
        Game.monsters[monsterType].enableBody = true;
        for(let musicType in Monster[monsterType].music)
        {
            Monster[monsterType].music[musicType].play = Monster[monsterType].music[musicType].create();
        }

        // create monster from map
        Game.map.tileMap.createFromTiles(
            Monster[monsterType].tileNumber,
            null,
            monsterType,
            structure.layer.monster,
            Game.monsters[monsterType]
        );
        
        for(let i = 0; i < Game.monsters[monsterType].length; ++i)
        {
            let child = Game.monsters[monsterType].children[i];
            child.name = monsterType;
            child.id=i;
            if(monsterData)
            {
                child.position.x = monsterData[monsterType][i].x;
                child.position.y = monsterData[monsterType][i].y;
                child.body.velocity.x = monsterData[monsterType][i].vx;
                child.body.velocity.y = monsterData[monsterType][i].vy;
                child.spawn = {
                    x: monsterData[monsterType][i].sx,
                    y: monsterData[monsterType][i].sy
                };
            }
            else
            {
                child.body.velocity.x = Monster[monsterType].velocity.x;
                child.body.velocity.y = Monster[monsterType].velocity.y;
                child.spawn = {
                    x: child.position.x,
                    y: child.position.y
                };
            }
            child.animations.add('walkLeft', Monster[monsterType].animation.walkLeft, Monster[monsterType].animation.frame_rate, true);
            child.animations.add('walkRight', Monster[monsterType].animation.walkRight, Monster[monsterType].animation.frame_rate, true);
            child.animations.add('die', Monster[monsterType].animation.die, Monster[monsterType].animation.frame_rate, true);
            
            if(child.body.velocity.x < 0)
            {
                child.animations.play('walkLeft');
            }
            else
            {
                child.animations.play('walkRight');
            }
        }

        Game.monsters[monsterType].setAll(
            'body.gravity.y',
            Monster[monsterType].gravity.y
        );

        Game.monsters[monsterType].setAll(
            'body.bounce.x',
            1
        );
    }
}
