function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


function loadPage() {
    const level = getCookie("level");
    const btn = document.getElementById("btn");

    console.log(level);
    btn.innerHTML = level;
}

function goTo(){
    const level = getCookie("level");

    if (level == 1){
        window.location.href = "first.html";
    } else if (level == 2){
        window.location.href = "second.html";
    } else if (level ==3){
        window.location.href = "third.html";
    }
}