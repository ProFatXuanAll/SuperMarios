const Map = {
    structure: [
        {
            name: 'world01',
            src: '/game/assets/map/json/map.json',
            layer: {
                solid: 'solidLayer',
                monster: 'monsterLayer',
                item: 'itemLayer',
            },
            start: [
                {
                    x:64,
                    y:1096
                }
            ],
            finish: {
                x: 9500,
                y:0
            },
            size: {
                x:9600,
                y:1280
            }
            
        }
    ],
    background: [
        {
            name: 'background01',
            src: '/game/assets/map/image/background/nature.png',
            width: '1920',
            height: '1080',
            x: 0,
            y: 0
        }
    ],
    tileset: [
        {
            name: 'tileset01',
            src: '/game/assets/map/image/tileset/tilesetx32.png'
        }
    ],
    music: [
        {
            name: 'castle',
            src: ['/game/assets/map/music/castle.wav']
        },
        {
            name: 'cave',
            src: ['/game/assets/map/music/cave.wav']
        },
        {
            name: 'field',
            src: ['/game/assets/map/music/field.wav']
        },
        {
            name: 'finalboss',
            src: ['/game/assets/map/music/finalboss.wav']
        },
        {
            name: 'finish',
            src: ['/game/assets/map/music/finish.wav']
        },
        {
            name: 'flyship',
            src: ['/game/assets/map/music/flyship.wav']
        },
        {
            name: 'ghosthouse',
            src: ['/game/assets/map/music/ghosthouse.wav']
        },
        {
            name: 'miniboss',
            src: ['/game/assets/map/music/miniboss.wav']
        },
        {
            name: 'rocky',
            src: ['/game/assets/map/music/rocky.wav']
        },
        {
            name: 'surprise',
            src: ['/game/assets/map/music/surprise.wav']
        },
        {
            name: 'timed',
            src: ['/game/assets/map/music/timed.wav']
        },
        {
            name: 'water',
            src: ['/game/assets/map/music/water.wav']
        },
        {
            name: 'worldmap',
            src: ['/game/assets/map/music/worldmap.wav']
        }
    ],
    detectFinished: function(character)
    {
        if(character.y >= Game.map.finish.y && character.x >= Game.map.finish.x)
        {
            console.log('finished');
        }
    },
    detectPlayerWorldBound: function(character)
    {
        if(character.y + character.height >= Game.map.size.y)
        {
           Player[character.key].respawn(character);
           character.y = Game.map.size.y-character.height;
        }
        if(character.x<=0)
        {
            character.position.x = 0;
        }
        if(character.position.x+character.width >= Game.map.size.x)
        {
            character.position.x = Game.map.size.x - character.width;
        }
    },
    detectMonsterWorldBound: function(monster)
    {
        let monsterName = monster.name;
        if(monster.position.y + monster.height >= Game.map.size.y)
        {
            Monster[monsterName].respawn(monster);        
        }
        if(monster.position.x <= 0)
        {
            Monster[monsterName].respawn(monster);        
        }
        if(monster.position.x + monster.width >= Game.map.size.x)
        {
            Monster[monsterName].respawn(monster);        
        }
    }
}

function MapSetup(structure, tileset, background, music)
{
    // add background
    this.background = Game.engine.add.tileSprite(
        background.x,
        background.y,
        background.width,
        background.height,
        background.name
    );

    //give map size(use to detect collide worldbound or not)
    this.size=structure.size;

    //give map finish point
    this.finish=structure.finish;

    // background camera fixed to center
    this.background.fixedToCamera = true;

    // add tile map (previous defined map.json)
    this.tileMap = Game.engine.add.tilemap(structure.name);
    
    // load tile set for tile map
    // can have multiple tile set for one map
    this.tileMap.addTilesetImage('tileset', tileset.name);

    // add solid block layer
    this.solid = this.tileMap.createLayer(structure.layer.solid);
    
    // new layer need resize world
    this.solid.resizeWorld();

    // enable collision on tile map
    this.tileMap.setCollisionByExclusion([67,68,77,78,98,99,100]);
    
    //add backgroundmusic
    this.music = Game.engine.add.audio(music.name);

    //resize game window when initialize the game
    resizeGameWindow();
}
// resize Phaser game window 
function resizeGameWindow()
{
    Game.engine.scale.setGameSize($( window ).width(), $( window ).height()*0.8);
}
// trigger function when resize(using jQuery)
$(window).resize(function()
{
    resizeGameWindow();
});
