const Items = {
    coin:{
        tileNumber: 27,
        spriteName: 'coin',

        gravity: {
            x: 0,
            y: 500
        },
        picture:{
            src: '/game/assets/item/image/coin.png',
            width: 32,
            height: 32
        },
        overlap:function(currentType)
        {
            
            return function(character, item){
                console.log(character);
                currentType.velocity.left-=50;
                currentType.velocity.right+=50;
                //playerDeath(character);
                item.kill();
            }
        }
        
    },
}

function ItemSetup(GameEngine, map, structure)
{
    for(let itemType in Items)
    {
        this[itemType] = GameEngine.add.group();
        this[itemType].enableBody = true;

        map.tileMap.createFromTiles(
            Items[itemType].tileNumber,
            null,
            itemType,
            structure.layer.item,
            this[itemType]);
        this[itemType].setAll('body.gravity.y', Items[itemType].gravity.y);
        this[itemType].setAll('body.bounce.x', 1);
        this[itemType].setAll('body.bounce.y', 1);
    }
}
