const Item = {
    coin:{
        tileNumber: 60,
        spriteName: 'coin',
        velocity: {
            x: 0,
            y: 0
        },
        gravity: {
            x: 0,
            y: 0
        },
        music : {
            get : {
                name: 'coinGet',
                src:'/game/assets/item/sound/coinget.wav',
                create: () => {
                    let sfx = Game.engine.add.audio(Item.coin.music.get.name);
                    return () => {
                        sfx.play();
                    }
                }
            }
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
            socket.emit(
                'itemDead',
                {
                    itemType: item.name,
                    id: item.id
                }
            );
            
        },
        respawn: function(item)
        {
            item.visible=true;
	        item.body.enable = true;
	        item.position.x = item.spawn.x;
            item.position.y = item.spawn.y;
            item.body.velocity.x = Item.coin.velocity.x;
            item.body.velocity.y = Item.coin.velocity.y;
        }
    },
}

function ItemSetup(structure=null, itemData=null)
{
    //setup each item group
    for(let itemType in Item)
    {
        Game.items[itemType] = Game.engine.add.group();
        Game.items[itemType].enableBody = true;

        //set music for eack kind of item
        for(let musicType in Item[itemType].music)
        {
            Item[itemType].music[musicType].play = Item[itemType].music[musicType].create();
        }

        //create item from tilemap
        Game.map.tileMap.createFromTiles(
            Item[itemType].tileNumber,
            null,
            itemType,
            structure.layer.item,
            Game.items[itemType]);
            //assign id to each sprite in group
            for(let i = 0;i<Game.items[itemType].length;i++)
            {
                let child = Game.items[itemType].children[i];
                child.name = itemType;
                child.id=i;
                if(itemData)
                {
                    child.position.x = itemData[itemType][i].x;
                    child.position.y = itemData[itemType][i].y;
                    child.body.velocity.x = itemData[itemType][i].vx;
                    child.body.velocity.y = itemData[itemType][i].vy;
                    child.spawn = {
                        x: itemData[itemType][i].sx,
                        y: itemData[itemType][i].sy
                    };
                }
                else
                {
                    child.body.velocity.x = Item[itemType].velocity.x;
                    child.body.velocity.y = Item[itemType].velocity.y;
                    child.spawn = {
                        x: child.position.x,
                        y: child.position.y
                    };
                }
            }

            Game.items[itemType].setAll('body.gravity.y', Item[itemType].gravity.y);
            Game.items[itemType].setAll('body.bounce.x', Item[itemType].bounce.x);
            Game.items[itemType].setAll('body.bounce.y', Item[itemType].bounce.y);
    }
}
