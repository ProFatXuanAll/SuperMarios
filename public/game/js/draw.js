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

    // create item
    Game.items = new ItemSetup(
        Game.map,
        Map.structure[0]
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
            true
        ),
        others: Game.engine.add.group(),
        hash: {}
    };
    Game.players.hash[Config.currentUserName] = Game.players.current;

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

    // current player collide with other player
    Game.engine.physics.arcade.collide(
        Game.players.current,
        Game.players.others,
        Player.mario.collide
    );
    
    // other player collide with other player
    Game.engine.physics.arcade.collide(
        Game.players.others,
        Game.players.others,
    );

    // current player collide with solid layer
    Game.engine.physics.arcade.collide(
        Game.players.current,
        Game.map.solid,
        Map.overlap
    );
    
    // other player collide with solid layer
    Game.engine.physics.arcade.collide(
        Game.players.others,
        Game.map.solid,
        Map.overlap
    );

    for(let monsterType in Game.monsters)
    {
        let monsterGroup = Game.monsters[monsterType];
        // monster collide with solid layer
        Game.engine.physics.arcade.collide(
            monsterGroup,
            Game.map.solid
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

    Map.detectPlayerWorldBound(Game.players.current);
    Map.detectFinished(Game.players.current);

    // player movement update
    let all_players = Game.players.hash;
    for(let player in all_players)
    {
        // set each players' title on head
        let name = all_players[player].name;
        name.x = Math.floor(all_players[player].position.x);
        name.y = Math.floor(all_players[player].position.y - all_players[player].height / 3);
        // detect character walk through world bond
        

        let character = all_players[player];
        let cursor = all_players[player].cursor;
        let velocity = character.body.velocity;
        let playerTypeVelocity = Player[character.key].velocity;
        let item = all_players[player].item;
        let facing;
        
        // stop moving to left or right
        
        if(!character.body.onFloor())
            velocity.y += playerTypeVelocity.vertical.gravity;

        if (cursor.up.isDown)
        {
            if(character.body.onFloor())
                velocity.y = playerTypeVelocity.vertical.jump;
        }
        if(cursor.left.isDown)
        {
            if(!character.dieyet)
            {
                facing = Config.state.left;
                velocity.x = facing * (item.coin*50+playerTypeVelocity.horizontal.move);
                //if(character.body.blocked.left)
                //    velocity.x =  facing * playerTypeVelocity.horizontal.bounce;
                character.animations.play('left');
            }
        }
        else if (cursor.right.isDown)
        {
            if(!character.dieyet)
            {
                facing = Config.state.right;
                velocity.x = facing * (item.coin*50+playerTypeVelocity.horizontal.move);
                //if(character.body.blocked.right)
                //    velocity.x = facing * playerTypeVelocity.horizontal.bounce;
                character.animations.play('right');

            }
        }
        else if (cursor.down.isDown)
        {
            /*temperary unusable */
        }
        else
        {
            if(!character.dieyet)
            {
                if(velocity.x >= 0)
                {
                    facing = Config.state.right;
                    character.animations.play('rightIdle');
                }
                else
                {
                    facing = Config.state.left;
                    character.animations.play('leftIdle');
                }
                velocity.x = facing * playerTypeVelocity.horizontal.idle;
            }
        }
    }

    // current player key press and release event
    let currentCharacterCursor = Game.players.current.cursor;
    let currentCharacterIspressed = Game.players.current.ispressed;

    if(currentCharacterCursor.up.isDown &&  currentCharacterIspressed.up == false && currentCharacterIspressed.die == false)
    {
        socket.emit(
            'move',
            {
                name: Config.currentUserName,
                move:'up',
                x: Game.players.current.position.x,
                y: Game.players.current.position.y,
                vx: Game.players.current.body.velocity.x,
                vy: Game.players.current.body.velocity.y
            }
        );
        currentCharacterIspressed.up = true;
    }
    // release up
    if(!currentCharacterCursor.up.isDown &&  currentCharacterIspressed.up == true)
    {
        socket.emit(
            'stop',
            {
                name: Config.currentUserName,
                move:'up',
                x: Game.players.current.position.x,
                y: Game.players.current.position.y,
                vx: Game.players.current.body.velocity.x,
                vy: Game.players.current.body.velocity.y
            }
        );
        currentCharacterIspressed.up = false;
    }
    // press left
    if(currentCharacterCursor.left.isDown &&  currentCharacterIspressed.left == false && currentCharacterIspressed.die == false)
    {
        socket.emit(
            'move',
            {
                name: Config.currentUserName,
                move:'left',
                x: Game.players.current.position.x,
                y: Game.players.current.position.y,
                vx: Game.players.current.body.velocity.x,
                vy: Game.players.current.body.velocity.y
            }
        );
        currentCharacterIspressed.left = true;
    }
    // release left
    if(!currentCharacterCursor.left.isDown &&  currentCharacterIspressed.left == true)
    {
        socket.emit(
            'stop',
            {
                name: Config.currentUserName,
                move:'left',
                x: Game.players.current.position.x,
                y: Game.players.current.position.y,
                vx: Game.players.current.body.velocity.x,
                vy: Game.players.current.body.velocity.y
            }
        );
        currentCharacterIspressed.left = false;
    }
    // press right
    if(currentCharacterCursor.right.isDown &&  currentCharacterIspressed.right == false && currentCharacterIspressed.die == false)
    {
        socket.emit(
            'move',
            {
                name: Config.currentUserName,
                move:'right',
                x: Game.players.current.position.x,
                y: Game.players.current.position.y,
                vx: Game.players.current.body.velocity.x,
                vy: Game.players.current.body.velocity.y
            }
        );
        currentCharacterIspressed.right = true;
    }
    // release right
    if(!currentCharacterCursor.right.isDown &&  currentCharacterIspressed.right == true)
    {
        socket.emit(
            'stop',
            {
                name: Config.currentUserName,
                move:'right',
                x: Game.players.current.position.x,
                y: Game.players.current.position.y,
                vx: Game.players.current.body.velocity.x,
                vy: Game.players.current.body.velocity.y
            }
        );
        currentCharacterIspressed.right = false;
    }
}

function render(){}
