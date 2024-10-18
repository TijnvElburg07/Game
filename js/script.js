function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


// Functie om een cookie te zetten
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function register(){
    let username = document.getElementById('name').value;
    let password = document.getElementById('password').value;


    // Gegevens opslaan in cookies
    setCookie('username', username, 7); // Bewaar 7 dagen
    setCookie('password', password, 7); // Bewaar 7 dagen
    setCookie('level', 1, 7);
    

    alert("Registratiegegevens opgeslagen in cookies!");
}

function login(){
    let username = document.getElementById('name').value;
    let password = document.getElementById('password').value;

    // Gegevens ophalen uit cookies
    let storedUsername = getCookie('username');
    let storedPassword = getCookie('password');
    

    if (username === storedUsername && password === storedPassword) {
        alert("Login succesvol!");
        // Verstuur de gebruikersnaam naar de volgende pagina
        window.location.href = "levels.html"
    } else {
        alert("Ongeldige gebruikersnaam of wachtwoord!");
    }
}
