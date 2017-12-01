let Map = {
    structure: [
        {
            name: 'World01',
            src: '/game/assets/map1.json',
            layer: {
                solid: 'solidLayer',
                monster: 'monsterLayer',
                item: 'itemLayer'
            }
        }
    ],
    background: [
        {
            name: 'Background01',
            src: '/game/assets/nature.png',
            width: '1920',
            height: '1080',
            x: 0,
            y: 0
        }
    ],
    tileset: [
        {
            name: 'TileSet01',
            src: '/game/assets/tilesetx32.png'
        }
    ]
}

function MapSetup(GameEngine, structure, tileset, background)
{
    // add background
    this.background = GameEngine.add.tileSprite(
        background.x,
        background.y,
        background.width,
        background.height,
        background.name
    );
    // background camera fixed to center
    this.background.fixedToCamera = true;

    // add tile map (previous defined map.json)
    this.tileMap = GameEngine.add.tilemap(structure.name);        

    // load tile set for tile map
    // can have multiple tile set for one map
    this.tileMap.addTilesetImage('tileset', tileset.name);

    // add solid block layer
    this.solid = this.tileMap.createLayer(structure.layer.solid);
    // new layer need resize world
    this.solid.resizeWorld();

    // enable collision on tile map

    this.tileMap.setCollisionByExclusion(this.tileMap.properties.collisionExclusion);
}
