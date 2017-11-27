let Map = {
    structure: [
        {
            name: 'World1',
            src: '/game/assets/map.json'
        }
    ],
    background: [
    
    ],
    tileset: [
    
    ],
}

function MapSetup(GameEngine)
{
    // add background
    this.background = GameEngine.add.tileSprite(
        Config.picture.background.x,
        Config.picture.background.y,
        Config.picture.background.width,
        Config.picture.background.height,
        'bg' // add config
    );
    // background camera fixed to center
    this.background.fixedToCamera = true;

    // add tile map (previous defined map.json)
    this.tileMap = GameEngine.add.tilemap('mario');        
    // load image --??
    this.tileMap.addTilesetImage('World', 'tileset');

    // add layer
    this.solidBlocks = this.tileMap.createLayer('Solid');
    // ????
    this.solidBlocks.resizeWorld();

    // add items
    this.items = GameEngine.add.group();

    // add interactive blocks
    this.activeBlocks = GameEngine.add.group();
    
    // enable collision on tile map
    this.tileMap.setCollisionByExclusion(this.tileMap.tilesets[0].tileProperties.collisionExclusion);
}
