$(document).ready(function(){
    $("form").submit(function(e){
        if($("#account").val() == ""){
        e.preventDefault();
            window.alert("Please enter your user name.");
            return false;
        }
        else
        {
            var name = escape($("#account").val());
            $("#account").val(name);
            return true;
        }
    });
})
