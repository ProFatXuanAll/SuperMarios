let Game = {};

var socket=io();
var playerlist={};

var radomname=Math.random().toString();
var radomx=Math.floor(Math.random()*(150-90+1))+90;
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
        console.log(Player[playerType]);
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

    // start loop map music
    Game.map.music.loopFull();

    // create monster
    Game.monsters = new MonsterSetup(
        Game.map,
        Map.structure[0]
    );

    // create item
    Game.items = new ItemSetup(
        Game.map,
        Map.structure[0]
    );

    //create players' container
    Game.players = {};
    //$('.loginclick').on('click',function(){
    socket.emit('login',
            {
                name:radomname,
                //x:radomx
                x:0
            });

    Game.players['self'] = new PlayerSetup(
            radomname,
            Player.mario,
            0,
            0,
            true
            );

    Game.engine.camera.follow(Game.players.self.character);
    //});
    socket.on('newplayer',function(data){
        playerlist[data.name]={};
        Game.players[data.name]=new PlayerSetup(
                radomname,
                Player.mario,
                data.x,
                20
                );
    });
    socket.on('login',function(data){
        playerlist=JSON.parse(data.listdata);
        for(let cyclep in playerlist)
        {
            if(radomname!=playerlist[cyclep].name)
            {
                Game.players[playerlist[cyclep].name]=new PlayerSetup(
                        playerlist[cyclep].name,
                        Player.mario,
                        playerlist[cyclep].x,
                        playerlist[cyclep].y
                        )
            }
        }
    });
    /*------------------ debug */
    Game.engine.time.events.loop(Phaser.Timer.SECOND*0.5,playerplaceupdate,this);
    deathsound=Game.engine.add.audio(Player.mario.music.die.name);
    /*------------------ debug */

}


function update()
{
    for(let player in Game.players)
    {
        let character = Game.players[player].character;

        //player vs solidlayer
        Game.engine.physics.arcade.collide(character, Game.map.solid);
        
        //player vs other players        
        for(let other in Game.players)
        {
            if(player==other) continue;
            let otherCharacter = Game.players[other].character;
            Game.engine.physics.arcade.collide(character, otherCharacter);
        }
        
        //player vs monsters
        for(let monsterType in Game.monsters)
        {
            Game.engine.physics.arcade.collide(Game.monsters[monsterType], Game.map.solid);
            Game.engine.physics.arcade.overlap(
                character,
                Game.monsters[monsterType],
                Monster[monsterType].overlap
            );
            for(let i=0;i<Game.monsters[monsterType].length;i++)
            {
                Map.detectMonsterWorldBound(Game.monsters[monsterType].children[i],Game.map);
            }
        }

        //player vs items
        for(let itemType in Game.items)
        {
            Game.engine.physics.arcade.collide(Game.items[itemType], Game.map.solid);
            
            Game.engine.physics.arcade.overlap(
                character,
                Game.items[itemType],
                Items[itemType].overlap(Game.players[player].currentType)
            );
        }

        //set each players' title on head
        let text=Game.players[player].text;
        text.x = Math.floor(character.x);
        text.y = Math.floor(character.y-character.height/3);
        Map.detectPlayerWorldBound(character,Game.map);
        Map.detectFinished(character,Game.map);
    }

    //player movement setting
    for(let player in Game.players)
    {
        let character = Game.players[player].character;
        let cursor = Game.players[player].cursor;
        let action = Game.players[player].action;
        let velocity = character.body.velocity;
        let currentType = Game.players[player].currentType;

        // stop moving to left or right
        velocity.x = currentType.velocity.idle;
        if (cursor.up.isDown)
        {
            if (character.body.onFloor()) velocity.y = currentType.velocity.up;
        }
        if(!character.body.onFloor()) velocity.y += currentType.gravity;
        if(cursor.left.isDown)
        {
            velocity.x = currentType.velocity.left;
            character.animations.play('left');
            action.facing = 'left';
        }
        else if (cursor.right.isDown)
        {
            velocity.x = currentType.velocity.right;
            character.animations.play('right');
            action.facing = 'right';
        }
        else if (cursor.down.isDown)
        {
            /*temperary unusable */
        }
        else
        {
            character.animations.play('idle');
            action.facing = 'idle';
        }
    }
    if(Game.players.self.cursor.up.isDown && Game.players.self.ispressed.up == false)
    {
        socket.emit('move',{
            name:radomname,
            move:'up'
        });
        Game.players.self.ispressed.up = true;
    }
    if(!Game.players.self.cursor.up.isDown && Game.players.self.ispressed.up == true)
    {
        socket.emit('stop',{
            name:radomname,
            move:'up'
        });
        Game.players.self.ispressed.up = false;
    }
    if(Game.players.self.cursor.left.isDown && Game.players.self.ispressed.left == false)
    {
        socket.emit('move',{
            name:radomname,
            move:'left'
        });
        Game.players.self.ispressed.left = true;
    }
    if(!Game.players.self.cursor.left.isDown && Game.players.self.ispressed.left == true)
    {
        socket.emit('stop',{
            name:radomname,
            move:'left'
        });
        Game.players.self.ispressed.left = false;
    }
    if(Game.players.self.cursor.right.isDown && Game.players.self.ispressed.right == false)
    {
        socket.emit('move',{
            name:radomname,
            move:'right'
        });
        Game.players.self.ispressed.right = true;
    }
    if(!Game.players.self.cursor.right.isDown && Game.players.self.ispressed.right == true)
    {
        socket.emit('stop',{
            name:radomname,
            move:'right'
        });
        Game.players.self.ispressed.right = false;
    }
}
    socket.on('move',function(datamove){
        Game.players[datamove.name].cursor[datamove.move].isDown=true;
        console.log(Game.players[datamove.name].cursor[datamove.move].isDown,datamove.move);
    });
    socket.on('stop',function(datamove){
        Game.players[datamove.name].cursor[datamove.move].isDown=false;
        console.log(Game.players[datamove.name].cursor[datamove.move].isDown,datamove.move);
    });
function render(){}

function playerplaceupdate()
{
    socket.emit('playerupdate',
            {
                name:radomname,
                x:Game.players.self.character.x,
                y:Game.players.self.character.y
            });

    socket.on('playerupdate',function(updata){
        if(Game.players[updata.name].character.x!=updata.x)
            Game.players[updata.name].character.x=updata.x;

        if(Game.players[updata.name].character.y!=updata.y)
            Game.players[updata.name].character.y=updata.y;
    });
}
