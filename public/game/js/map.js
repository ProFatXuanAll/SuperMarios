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
            start:{
                x:64,
                y:1096
            },
            finish:{
                x: 3114,
                y:0
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
    ]
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
    this.tileMap.setCollisionByExclusion(this.tileMap.properties.collisionExclusion);

    // add map music
    this.music = Game.engine.add.audio(music.name);
}
