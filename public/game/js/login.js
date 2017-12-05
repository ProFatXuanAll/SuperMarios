$(document).ready(function(){
    $("form").submit(function(e){
        if($("#account").val() == "" && $("#password").val() == ""){
            e.preventDefault();
            window.alert("Please enter your user name and password.");
            return false;
        }
        else if($("#password").val() == ""){
            e.preventDefault();
            window.alert("Please enter your password.");
            return false;
        }
        else if($("#account").val() == ""){
            e.preventDefault();
            window.alert("Please enter your user name.");
            return false;
        };
    });

})