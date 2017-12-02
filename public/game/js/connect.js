/*$(function () {
    var socket = io();
    var playerlist={};

    radomname=Math.random().toString();
    x= Math.floor(Math.random() * (150 - 90 + 1)) + 90;
    $('.loginclick').on('click',function(){
        socket.emit('login',
                {
                    name:radomname,
                    x:x,
                    time: new Date()
                });
        Game.players[radomname]=new PlayerSetup(
                Game.engine,
                radomname,
                Player.mario,
                x,
                20,
                true
                );
        
    //Game.engine.camera.follow(Game.players[radomname].character);
    });
    socket.on('newplayer',function(data){
        playerlist[data.name]={};
        Game.players[data.name]=new PlayerSetup(
                Game.engine,
                data.name,
                Player.mario,
                120,
                20
                );
    });

    socket.on('login',function(data){
        playerlist=JSON.parse(data.listdata);
        for(let p in playerlist)
        {
            Game.players[playerlist[p].name]=new PlayerSetup(
                    Game.engine,
                    playerlist[p].name,
                    Player.mario,
                    playerlist[p].x,
                    playerlist[p].y
                    );
        }
        console.log(playerlist);

    });
    socket.on('return', function(data){
        console.log(data.time);
    });
});*/
