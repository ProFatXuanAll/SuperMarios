$(function () {
    var socket = io();
    var playerlist={};
    $('.loginclick').on('click',function(){
        radomname=Math.random().toString();
        x= Math.floor(Math.random() * (150 - 90 + 1)) + 90; 
        socket.emit('login',
        {
            name:radomname,
            x:x
            time: new Date()
        });
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
                playerlist[p]
                );
        }
        console.log(playerlist);

    });
    socket.on('return', function(data){
        console.log(data.time);
    });
});
