let socket = io();

socket.on('newplayer',function(data){
    playerlist[data.name]={};
    Game.players[data.name]=new PlayerSetup(
            playername,
            Player.mario,
            data.x,
            20
            );
});

socket.on('join',function(data){
    playerlist=JSON.parse(data.listdata);
    for(let cyclep in playerlist)
    {
        if(playername!=playerlist[cyclep].name)
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
