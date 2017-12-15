const Item = {
    coin:{
        tileNumber: 60,
        spriteName: 'coin',

        gravity: {
            x: 0,
            y: 0
        },
        music : {
            get : {
                name: 'coinGet',
                src:'/game/assets/sounds/get.wav',
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
            character.item.coin += 1;
            Item.coin.music.get.play();
            item.destroy();
            Game.engine.time.events.add(
                Phaser.Timer.SECOND * 3,
                function()
                {
                    character.item.coin -= 1;
                    Item.coin.respawn(item);
                }
            );
        },
        respawn: function(item)
        {
            let spawnedItem = Game.engine.add.sprite(
                item.spawn.x,
                item.spawn.y,
                item.name
            );
            //reassign spawnpoint
            spawnedItem.name = item.name;
            spawnedItem.spawn = {
                x: item.spawn.x,
                y: item.spawn.y 
            }
            //set physic
            Game.engine.physics.enable(spawnedItem);
            spawnedItem.body.enable = true;
            Game.items[item.name].add(spawnedItem);
            item.destroy();
        }
    },
}

function ItemSetup(structure)
{
    for(let itemType in Item)
    {
        this[itemType] = Game.engine.add.group();
        this[itemType].enableBody = true;
        for(let musicType in Item[itemType].music)
        {
            Item[itemType].music[musicType].play = Item[itemType].music[musicType].create();
        }

        Game.map.tileMap.createFromTiles(
            Item[itemType].tileNumber,
            null,
            itemType,
            structure.layer.item,
            this[itemType]);
            for(let i = 0;i<this[itemType].length;i++)
            {
                let child = this[itemType].children[i];
                child.name = itemType;
                child.spawn = {
                    x: child.position.x,
                    y: child.position.y
                }
            }
    
        this[itemType].setAll('body.gravity.y', Item[itemType].gravity.y);
        this[itemType].setAll('body.bounce.x', Item[itemType].bounce.x);
        this[itemType].setAll('body.bounce.y', Item[itemType].bounce.y);
    }
}
