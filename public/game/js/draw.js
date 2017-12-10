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
        Game.engine.load.audio(
            Player[playerType].music.die.name,
            Player[playerType].music.die.src,
        );
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
        Game.engine.load.audio(
            Monster[monsterType].music.die.name,
            Monster[monsterType].music.die.src
        );
    }
    // load all item spritesheet and music
    for(let itemType in Items)
    {
        Game.engine.load.spritesheet(
            Items[itemType].spriteName,
            Items[itemType].picture.src,
            Items[itemType].picture.width,
            Items[itemType].picture.height
        );
        Game.engine.load.audio(
            Items[itemType].music.get.name,
            Items[itemType].music.get.src
        );
    }
    // add promise make sure pictures loaded
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

    // create item
    Game.items = new ItemSetup(
        Game.map,
        Map.structure[0]
    );

    // create players' container
    Game.players = {
        current: new PlayerSetup(
            Config.currentUserName,
            Player.mario,
            Map.structure[0].start[0].x,
            Map.structure[0].start[0].y,
            true
        ),
        others: Game.engine.add.group(),
        hash: {}
    };
    
    // new player tell server to join game
    socket.emit(
        'join', 
        {
            name: Config.currentUserName,
            typeName: Player.mario.spriteName,
            x: Game.players.current.position.x,
            y: Game.players.current.position.y
        }
    );
    
    socket.emit(
        'requestMonster',
        {
            name: Config.currentUserName
        }
    );
}


function update()
{
    /**********************
    * how to optimize ??? *
    **********************/

    // current player collide with solid layer
    Game.engine.physics.arcade.collide(
        Game.players.current,
        Game.map.solid
    );
    
    // other player collide with solid layer
    Game.engine.physics.arcade.collide(
        Game.players.others,
        Game.map.solid
    );

    // current player collide with other player
    Game.engine.physics.arcade.collide(
        Game.players.current,
        Game.players.others
    );
    
    // other player collide with other player
    Game.engine.physics.arcade.collide(
        Game.players.others,
        Game.players.others
    );

    for(let monsterType in Game.monsters)
    {
        let monsterGroup = Game.monsters[monsterType];
        // monster collide with solid layer
        Game.engine.physics.arcade.collide(
            monsterGroup,
            Game.map.solid
        );
        // monster collide with character
        Game.engine.physics.arcade.overlap(
            Game.players.current,
            monsterGroup,
            Monster[monsterType].overlap
        );
        let mycharacter=Game.players.current;
        if(mycharacter.dieyet==true&&mycharacter.ispressed.die==false)
        {
            mycharacter.ispressed.die=true;
            socket.emit('someOneDie',{
                name:Config.currentUserName
            });
        }
        if(mycharacter.dieyet==false&&mycharacter.ispressed.die==true)
        {
            mycharacter.ispressed.die=false;
        }
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
            Items[itemType].overlap
        );
    }


    // player movement update
    let all_players = Game.players.others.children.concat(Game.players.current); 
    for(let player in all_players)
    {
        // set each players' title on head
        let name = all_players[player].name;
        name.x = Math.floor(all_players[player].position.x);
        name.y = Math.floor(all_players[player].position.y - all_players[player].height / 3);
        // detect character walk through world bond
        Map.detectPlayerWorldBound(all_players[player]);
        Map.detectFinished(all_players[player]);

        let character = all_players[player];
        let cursor = all_players[player].cursor;
        let velocity = character.body.velocity;
        let currentType = character.currentType;

        // stop moving to left or right
        velocity.x = currentType.velocity.idle;
        if (cursor.up.isDown)
        {
            if(character.body.onFloor()) velocity.y = currentType.velocity.up;
        }
        if(!character.body.onFloor()) velocity.y += currentType.gravity;
        if(cursor.left.isDown)
        {
            if(!character.dieyet)
            {
                velocity.x = currentType.velocity.left;
                character.animations.play('left');
            }
        }
        else if (cursor.right.isDown)
        {
            if(!character.dieyet)
            {
                velocity.x = currentType.velocity.right;
                character.animations.play('right');
            }
        }
        else if (cursor.down.isDown)
        {
            /*temperary unusable */
        }
        else
        {
            if(!character.dieyet) character.animations.play('idle');
        }
    }

    // current player key press and release event
    let currentPlayerCursor = Game.players.current.cursor;
    let currentPlayerIspressed = Game.players.current.ispressed;

    if(currentPlayerCursor.up.isDown &&  currentPlayerIspressed.up == false)
    {
        socket.emit('move',{
            name: Config.currentUserName,
            move:'up'
        });
        currentPlayerIspressed.up = true;
    }
    // release up
    if(!currentPlayerCursor.up.isDown &&  currentPlayerIspressed.up == true)
    {
        socket.emit('stop',{
            name: Config.currentUserName,
            move:'up'
        });
        currentPlayerIspressed.up = false;
    }
    // press left
    if(currentPlayerCursor.left.isDown &&  currentPlayerIspressed.left == false)
    {
        socket.emit('move',{
            name: Config.currentUserName,
            move:'left'
        });
        currentPlayerIspressed.left = true;
    }
    // release left
    if(!currentPlayerCursor.left.isDown &&  currentPlayerIspressed.left == true)
    {
        socket.emit('stop',{
            name: Config.currentUserName,
            move:'left'
        });
        currentPlayerIspressed.left = false;
    }
    // press right
    if(currentPlayerCursor.right.isDown &&  currentPlayerIspressed.right == false)
    {
        socket.emit('move',{
            name: Config.currentUserName,
            move:'right'
        });
        currentPlayerIspressed.right = true;
    }
    // release right
    if(!currentPlayerCursor.right.isDown &&  currentPlayerIspressed.right == true)
    {
        socket.emit('stop',{
            name: Config.currentUserName,
            move:'right'
        });
        currentPlayerIspressed.right = false;
    }
}

function render(){}
