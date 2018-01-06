$(document).ready(function(){
    let state = 0;
    let totalState = 2;

    $("form").submit(function(e){
        if($("#account").val() == ""){
        e.preventDefault();
            window.alert("Please enter your user name.");
            return false;
        }
        else
        {
            var name = htmlEntities($("#account").val());
            $("#account").val(name);
            return true;
        }
    });

    document.getElementById("previous-btn").addEventListener("click", () => { changeState(false) });
    document.getElementById("next-btn").addEventListener('click', () => { changeState(true) });

	function htmlEntities(str) {
    	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

    function changeState(toRight){
        if( toRight == true && state < totalState-1 ) ++state;
        if( toRight == false && state > 0 ) --state;
        setStateTitle();
    }

    function setStateTitle(){
        let stateTitle = document.getElementsByTagName("h1")[0];
        if( state === 0 ) stateTitle.innerHTML = "What's your name?";
        else if( state === 1 ) stateTitle.innerHTML = "Choose a character";
    }

    function setForm(){
        let formContent = document.getElementsByTagName("form")[0].getElementsByTagName("section");
        for(let i = 0; i < formContent.length; ++i){
            formContent[i].style.display = "none";
        }
        formContent[state].style.display = "block";
    }
});
