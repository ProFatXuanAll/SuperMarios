const Items = {
    coin:{
        tileNumber: 60,
        spriteName: 'coin',

        gravity: {
            x: 0,
            y: 0
        },
        bounce: {
            x: 0,
            y: 0
        },
        picture: {
            src: '/game/assets/item/image/coin.png',
            width: 32,
            height: 32
        },
        overlap: function(character, item)
        {
            character.currentType.velocity.left -= 50;
            character.currentType.velocity.right += 50;
            item.destroy();
            Game.engine.time.events.add(
                Phaser.Timer.SECOND * 3,
                function()
                {
                    character.currentType.velocity.left+=50;
                    character.currentType.velocity.right-=50;
                    Items.coin.respawn();
                }
            );
        },
        respawn: function()
        {
            console.log('fuck');
        }
    },
}

function ItemSetup(map, structure)
{
    for(let itemType in Items)
    {
        this[itemType] = Game.engine.add.group();
        this[itemType].enableBody = true;

        map.tileMap.createFromTiles(
            Items[itemType].tileNumber,
            null,
            itemType,
            structure.layer.item,
            this[itemType]);

            for(let i=0;i<this[itemType].length;i++)
            {
                let child=this[itemType].children[i];
                child.name=itemType;
                child.spawn={
                    x: child.position.x,
                    y: child.position.y
                }
            }
    
        this[itemType].setAll('body.gravity.y', Items[itemType].gravity.y);
        this[itemType].setAll('body.bounce.x', Items[itemType].bounce.x);
        this[itemType].setAll('body.bounce.y', Items[itemType].bounce.y);
    }
}
