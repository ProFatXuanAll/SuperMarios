let socket = io();

// server tell current player info of new player
socket.on('join', function(newPlayerData){
    // create new player
    Game.players[newPlayerData.name] = new PlayerSetup(
        newPlayerData.name,
        Player[newPlayerData.typeName],
        newPlayerData.x,
        newPlayerData.y
    )
});

// server tell new player info of exist player(s)
socket.on('join-succeeded', function(playerData){
    // need to decode because server encode to speed up
    let playerList = JSON.parse(playerData.playerList);
    // create existed player(s)
    for(playerName in playerList){
        Game.players[playerName] = new PlayerSetup(
            playerName,
            Player[playerList[playerName].typeName],
            playerList[playerName].x,
            playerList[playerName].y
        );
    }
});

socket.on('move',function(datamove){
    Game.players[datamove.name].cursor[datamove.move].isDown=true;
    console.log(Game.players[datamove.name].cursor[datamove.move].isDown,datamove.move);
});

socket.on('stop',function(datamove){
    Game.players[datamove.name].cursor[datamove.move].isDown=false;
    console.log(Game.players[datamove.name].cursor[datamove.move].isDown,datamove.move);
});

socket.on('playerupdate',function(updata){
    if(Game.players[updata.name].character.x!=updata.x)
        Game.players[updata.name].character.x=updata.x;

    if(Game.players[updata.name].character.y!=updata.y)
        Game.players[updata.name].character.y=updata.y;
});
