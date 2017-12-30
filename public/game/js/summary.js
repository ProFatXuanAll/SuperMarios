$(document).ready(function(){

    function displayTable(e, tagName){
        let i,tables,tabs;

        tables = document.getElementsByTagName("table");
        for (i = 0; i < tables.length; i++) {
            tables[i].style.display = "none";
        }

        tabs = document.getElementsByClassName("tab");
        for (i = 0; i < tables.length; i++) {
            tabs[i].className = tabs[i].className.replace(" currentTag", "");
        }

        document.getElementById(tagName).style.display = "block";
        e.currentTarget.className += " currentTag";
    }

});
