    //var username=prompt("請輸入使用者姓名")
    $(function () {
        var socket = io();

        $('.sendmessage').on('click',function(e){
            //e.preventDefault();
            var d2 = new Date();
            var showday=d2.toDateString();
            var showhour=d2.getHours();
            var showmin=d2.getMinutes();
            socket.emit('chat message',
            {
                name: $('#name').val(),
                word: $('#m').val(),
                time: showmin
            });
            $('#m').val('');
            //return false;
        });
        socket.on('chat message',function(msg){
            $('#messages').append($('<li>').text(msg.name));
            $('#messages').append($('<li>').text(msg.word));
            $('#messages').append($('<li>').text(msg.time));
        });
        socket.on('login',function(msg){
            $('#messages').append($('<li>').text("some one login~~"));
            $('#messages').append($('<li>').text(msg.name));
        });

        $('.click').on('click',function(){
            console.log('run');
            socket.emit('login',
            {
                name:$('#name').val()
            });
            $('.loginplace').fadeOut();
            $('.chatplace').show();
            //$('.loginplace').off('click');
        });
});
