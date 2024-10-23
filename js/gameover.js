function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


function backToLevels(){
    window.location.href = "levels.html";
}


function tryAgain(){
    const level = getCookie('level');
    
    switch (level) {
        case '1':
            window.location.href = "first.html";
            break;
        case '2':
            window.location.href = "second.html";
            break;
        case '3':
            window.location.href = "third.html";
            break;
    }
}
