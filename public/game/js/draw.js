let Game = {};

Game.engine = new Phaser.Game(
    // game window width
    Config.window.width,
    // game window height
    Config.window.height,
    // phaser draw engine
    Phaser.CANVAS,
    // html tag id
    Config.html.main,
    // phaser state object
    // state order: preload -> create-> update -> render
    // keep looping between update and render states
    {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
);

// load image and tilemap
function preload()
{
    // cancel onblur event
    Game.engine.stage.disableVisibilityChange = true;
    // load all map
    for(let i = 0; i < Map.structure.length; ++i)
    {
        Game.engine.load.tilemap(
            Map.structure[i].name,
            Map.structure[i].src,
            null, 
            Phaser.Tilemap.TILED_JSON
        );
    }
    // load all tileset
    for(let i = 0; i < Map.tileset.length; ++i)
    {
        Game.engine.load.image(
            Map.tileset[i].name,
            Map.tileset[i].src
        );
    }
    // load all background
    for(let i = 0; i < Map.background.length; ++i)
    {
        Game.engine.load.image(
            Map.background[i].name,
            Map.background[i].src
        );
    }
    // load all background music
    for(let i = 0; i < Map.music.length; ++i)
    {
        Game.engine.load.audio(
            Map.music[i].name,
            Map.music[i].src
        );
    }
    // load all player spritesheet and music
    for(let playerType in Player)
    {
        Game.engine.load.spritesheet(
            Player[playerType].spriteName,
            Player[playerType].picture.src,
            Player[playerType].picture.width,
            Player[playerType].picture.height
        );
        for(let musicType in Player[playerType].music)
        {
            Game.engine.load.audio(
                Player[playerType].music[musicType].name,
                Player[playerType].music[musicType].src
            );
        }
    }
    // load all monster spritesheet and music
    for(let monsterType in Monster)
    {
        Game.engine.load.spritesheet(
            Monster[monsterType].spriteName,
            Monster[monsterType].picture.src,
            Monster[monsterType].picture.width,
            Monster[monsterType].picture.height
        );
        for(let musicType in Monster[monsterType].music)
        {
            Game.engine.load.audio(
                Monster[monsterType].music[musicType].name,
                Monster[monsterType].music[musicType].src
            );
        }
    }
    // load all item spritesheet and music
    for(let itemType in Item)
    {
        Game.engine.load.spritesheet(
            Item[itemType].spriteName,
            Item[itemType].picture.src,
            Item[itemType].picture.width,
            Item[itemType].picture.height
        );
        Game.engine.load.audio(
            Item[itemType].music.get.name,
            Item[itemType].music.get.src
        );
    }
}

function create()
{
    // start physics system
    Game.engine.physics.startSystem(Phaser.Physics.ARCADE);

    // create map
    Game.map = new MapSetup(
        Map.structure[0],
        Map.tileset[0],
        Map.background[0],
        Map.music[2]
    );

    for(let playerType in Player)
    {
        for(let musicType in Player[playerType].music)
        {
            Player[playerType].music[musicType].play = Player[playerType].music[musicType].create();
        }
    }
    // create players' container
    Game.players = {
        current: new PlayerSetup(
            Config.currentUserName,
            Player.mario,
            Map.structure[0].start[0].x,
            Map.structure[0].start[0].y,
            0,
            0,
            Map.structure[0].start[0].x,
            Map.structure[0].start[0].y,
            null,
            true
        ),
        others: Game.engine.add.group(),
        hash: {}
    };
    Game.players.hash[Config.currentUserName] = Game.players.current;
    
    // create monsters' container
    Game.monsters = {};
    
    // create items' container
    Game.items = {};

    // new player tell server to join game
    socket.emit(
        '00 playerJoin', 
        {
            name: Config.currentUserName,
            typeName: Player.mario.spriteName,
            x: Game.players.current.position.x,
            y: Game.players.current.position.y
        }
    );

    socket.on('multipleConnection',function(){
        socket.emit('disconnect');
        window.location.replace("/game/error");
    });
}


function update()
{
    // current player collide with other player
    Game.engine.physics.arcade.collide(
        Game.players.others,
        Game.players.current,
        Player.mario.collide
    );
    
    // other player collide with other player
    Game.engine.physics.arcade.collide(
        Game.players.others,
        Game.players.others
    );

    // current player collide with solid layer
    Game.engine.physics.arcade.collide(
        Game.players.current,
        Game.map.solid
    );

    // current player overlap with event layer
    Game.engine.physics.arcade.overlap(
        Game.players.current,
        Game.map.event,
        Map.detectPoint
    );
    
    // other player collide with solid layer
    Game.engine.physics.arcade.collide(
        Game.players.others,
        Game.map.solid
    );

    for(let monsterType in Game.monsters)
    {
        let monsterGroup = Game.monsters[monsterType];
        // monster collide with solid layer
        Game.engine.physics.arcade.collide(
            monsterGroup,
            Game.map.solid,
            Map.monsterCollide
        );
        // monster overlap with character
        Game.engine.physics.arcade.overlap(
            Game.players.current,
            monsterGroup,
            Monster[monsterType].overlap
        );
        // detect each monster fall through world bound
        for(let i = 0; i < monsterGroup.length; i++)
        {
            Map.detectMonsterWorldBound(
                monsterGroup.children[i]
            );
        }
    }

    // character collide with item
    for(let itemType in Game.items)
    {
        let itemGroup = Game.items[itemType];

        Game.engine.physics.arcade.collide(
            itemGroup,
            Game.map.solid
        );

        Game.engine.physics.arcade.overlap(
            Game.players.current,
            itemGroup,
            Item[itemType].overlap
        );
    }

    //detect player finish and fall out of the world
    //only need to detect myself and emit
    Map.detectPlayerWorldBound(Game.players.current);

    // player movement update
    let all_players = Game.players.hash;
    for(let player in all_players)
    {
        //render player's movement
        let character = all_players[player];
        let name = character.name;
        let cursor = character.cursor;
        let velocity = character.body.velocity;
        let playerTypeVelocity = Player[character.key].velocity;
        let status = character.status;
        let coin = status.coin;
        let feather = status.feather;
        let facing;
        
        // delete player if signaled
        if(character.delete)
        {
            Game.players.hash[player].name.destroy();
            Game.players.hash[player].destroy();
            delete Game.players.hash[player];
            continue;
        }
        
        // set each players' title on head
        name.x = Math.floor(all_players[player].position.x);
        name.y = Math.floor(all_players[player].position.y - all_players[player].height / 3);

        // stop moving to left or right
        if(!character.body.onFloor())
            //if player pick more than 1 feather, only 1 feather will effect(or it will be overpowered)
            velocity.y += playerTypeVelocity.vertical.gravity - Item.feather.effect * (feather >= 1 ? 1 : 0);

        if (cursor.up.isDown)
        {
            if(character.body.onFloor())
            {
                velocity.y = playerTypeVelocity.vertical.jump;
            }
        }
        if(cursor.left.isDown)
        {
            if(!character.dieyet)
            {
                facing = Config.status.left;
                velocity.x = facing * (coin * Item.coin.effect + playerTypeVelocity.horizontal.move);
                character.animations.play('left');
            }
        }
        else if (cursor.right.isDown)
        {
            if(!character.dieyet)
            {
                facing = Config.status.right;
                velocity.x = facing * (coin * 50 + playerTypeVelocity.horizontal.move);
                character.animations.play('right');

            }
        }
        else if (cursor.down.isDown)
        {
                    //temporary unusable for hacks
        }
        else
        {
            if(!character.dieyet)
            {
                if(velocity.x >= 0)
                {
                    facing = Config.status.right;
                    character.animations.play('rightIdle');
                }
                else
                {
                    facing = Config.status.left;
                    character.animations.play('leftIdle');
                }
                velocity.x = facing * playerTypeVelocity.horizontal.idle;
            }
        }
    }

    // current player key press and release event
    let currentCharacter = Game.players.current;
    let currentCharacterCursor = currentCharacter.cursor;
    let currentCharacterIspressed = currentCharacter.ispressed;

    // press up and on floor
    if(currentCharacterCursor.up.isDown && currentCharacter.body.onFloor())
    {
        socket.emit(
            'playerMove',
            {
                name: Config.currentUserName,
                move: 'up',
                x: currentCharacter.position.x,
                y: currentCharacter.position.y,
                vx: currentCharacter.body.velocity.x,
                vy: currentCharacter.body.velocity.y
            }
        );
    }

    // press or release left
    else if(currentCharacterCursor.left.isDown != currentCharacterIspressed.left)
    {
        // press left
        if(currentCharacterCursor.left.isDown)
        {
            socket.emit(
                'playerMove',
                {
                    name: Config.currentUserName,
                    move: 'left',
                    x: currentCharacter.position.x,
                    y: currentCharacter.position.y,
                    vx: currentCharacter.body.velocity.x,
                    vy: currentCharacter.body.velocity.y
                }
            );
            currentCharacterIspressed.left = true;
        }
        // release left
        else
        {
            socket.emit(
                'playerStop',
                {
                    name: Config.currentUserName,
                    move: 'left',
                    x: currentCharacter.position.x,
                    y: currentCharacter.position.y,
                    vx: currentCharacter.body.velocity.x,
                    vy: currentCharacter.body.velocity.y
                }
            );
            currentCharacterIspressed.left = false;
        }
    }

    // press or release right
    else if(currentCharacterCursor.right.isDown != currentCharacterIspressed.right)
    {
        // press right
        if(currentCharacterCursor.right.isDown)
        {
            socket.emit(
                'playerMove',
                {
                    name: Config.currentUserName,
                    move: 'right',
                    x: currentCharacter.position.x,
                    y: currentCharacter.position.y,
                    vx: currentCharacter.body.velocity.x,
                    vy: currentCharacter.body.velocity.y
                }
            );
            currentCharacterIspressed.right = true;
        }
        // release right
        else
        {
            socket.emit(
                'playerStop',
                {
                    name: Config.currentUserName,
                    move: 'right',
                    x: currentCharacter.position.x,
                    y: currentCharacter.position.y,
                    vx: currentCharacter.body.velocity.x,
                    vy: currentCharacter.body.velocity.y
                }
            );
            currentCharacterIspressed.right = false;
        }
    }
}

function render(){}
