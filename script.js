var words = document.querySelector(".words");
var health = document.querySelector(".health");
var myhealth = document.querySelector(".myhealth");
var mainmenu = document.getElementById("mainmenu");
var preload = document.getElementById("preload");
var level = document.getElementById("level");
var statusmode = document.getElementById("statusmode");
var startdelay = document.getElementById("startdelay");
var game = document.getElementById("game");
var gamewin = document.getElementById("gamewin");
var gameover = document.getElementById("gameover");
var gamebox = document.getElementById("gamebox");
var monster_start = document.getElementById("monster_start");
var monster_die = document.getElementById("monster_die");
var myword = document.getElementById("myword");
var timestatus = document.getElementById("timestatus");
var spans;
var bossHp;
var myHp;
var time;
var mode;
var timemode;
var totaltime;
var damage;
var hit;

function rightChange() {
    mode = statusmode.getAttribute('mode');
    if(mode == 'easy') {
        statusmode.setAttribute('mode','medium');
        statusmode.innerHTML = "Medium";
    }
    if(mode == 'medium') {
        statusmode.setAttribute('mode','hard');
        statusmode.innerHTML = "Hard";
    }
    if(mode == 'hard') {
        statusmode.setAttribute('mode','expert');
        statusmode.innerHTML = "Expert";
    }
    if(mode == 'expert') {
        statusmode.setAttribute('mode','easy');
        statusmode.innerHTML = "Easy";
    }
}

function setGame() {
    mymonster = Math.floor(Math.random()*100)%4;
    bossHp = 100;
    health.style.width = 100 + "%";
    myHp = 100;
    myhealth.style.width = 100 + "%";
    hit = 0;
    monster_start.src = "./img/Mons" + mymonster + ".gif";
    monster_die.src = "./img/Mons" + mymonster + "-die.gif";
    monster_start.style.display = "block";
    myword.style.display = "block";
    timestatus.style.display = "block";
    monster_die.style.display = "none";
}

function setMode(mode) {
    console.log(mode);
    mode = (mode == undefined) ? "easy": (mode == "easy") ? "medium": (mode == "medium") ? "hard": (mode == "hard") ? "expert": "easy";
    console.log(mode);
    if(mode == "easy") {
        timemode = 4;
        damage = 10;
    }
    else if(mode == "medium") {
        timemode = 3;
        damage = 15;
    }
    else if(mode == "hard") {
        timemode = 2;
        damage = 20;
    }
    else if(mode == "expert") {
        timemode = 1;
        damage = 25;
    }
    totaltime = timemode;
    delaystart();
}

function random() {
    words.innerHTML = ""
    var random = Math.floor(Math.random()*10000)%1943;
    var wordArray = wordlist[random].split("");
    for (var i = 0; i < wordArray.length; i++) {
        var span = document.createElement("span");
        span.classList.add("span");
        span.innerHTML = wordArray[i];
        words.appendChild(span);
    }
    spans = document.querySelectorAll(".span");
    totaltime = timemode*Math.floor(wordArray.length/3);
    if(totaltime == 0) {
        totaltime = timemode;
    }
}

function typing(e) {
    typed = String.fromCharCode(e.which);
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].innerHTML === typed) { // if typed letter is the one from the word
            if (spans[i].classList.contains("bg")) { // if it already has class with the bacground color then check the next one
                continue;
            } else if (spans[i].classList.contains("bg") === false && spans[i-1] === undefined || spans[i-1].classList.contains("bg") !== false ) { // if it dont have class, if it is not first letter or if the letter before it dont have class (this is done to avoid marking the letters who are not in order for being checked, for example if you have two "A"s so to avoid marking both of them if the first one is at the index 0 and second at index 5 for example)
                spans[i].classList.add("bg");
                break;
            }
        }
    }
    var checker = 0;
    for (var j = 0; j < spans.length; j++) { //checking if all the letters are typed
        if (spans[j].className === "span bg") {
            checker++;
        }
        if (checker === spans.length) {
            hit = 1;
            document.removeEventListener("keydown", typing, false);
                    setTimeout(function(){
                        words.className = "words"; // restart the classes
                        random(); // give another word
                        time = totaltime+1;
                        hit = 0;
                        document.addEventListener("keydown", typing, false);
                    }, 400);
            bossHp -= 10;
            health.style.width = bossHp + "%";
        }
    }
}

function check() {
    if (bossHp <= 0) {
        monster_start.style.display = "none";
        myword.style.display = "none";
        timestatus.style.display = "none";
        monster_die.style.display = "block";
        clearInterval(cd);
        setTimeout(function() {
            game.style.display = "none";
            gamewin.style.display = "block";
        }, 4000);
        bossHp = 100;
    }
    else if (myHp <= 0) {
        game.style.display = "none";
        gameover.style.display = "block";
        clearInterval(cd);
        myHp = 100;
    }
    requestAnimationFrame(check);
}

function countdown() {
    time = totaltime;
    cd = setInterval(
        function(){
            if (time >= 0) {
                time--;
                updateTime();
            }
            else{
                clearInterval(cd);
            }
        }
        ,1000);
}

function updateTime() {
    theTime.innerText = time;
    if (time <= 0 && hit == 0) {
        myHp -= damage;
        myhealth.style.width = myHp + "%";
        random();
        time = totaltime+1;
    }
}

function levelselect() {
    mainmenu.style.display = "none";
    game.style.display = "none";
    gamebox.style.display = "none";
    startdelay.style.display = "none";
    gamewin.style.display = "none";
    gameover.style.display = "none";
    level.style.display = "block";
}

function delaystart() {
    var firstdelay = 2;
    level.style.display = "none";
    mainmenu.style.display = "none";
    gamebox.style.display = "none";
    gamewin.style.display = "none";
    gameover.style.display = "none";
    game.style.display = "block";
    startdelay.style.display = "block";
    ds = setInterval(
        function(){
            if (firstdelay <= 0) {
                clearInterval(ds);
                startgame();
                startdelay.style.display = "none";
                gamebox.style.display = "block";
                startdelay.innerText = 3;
            }
            else{
                startdelay.innerText = firstdelay;
                firstdelay -= 1;
            }
        }
        ,1000);
}

function startgame() {
    setGame();
    random();
    check();
    countdown();
    updateTime();
}

function menugame() {
    game.style.display = "none";
    gamewin.style.display = "none";
    gameover.style.display = "none";
    mainmenu.style.display = "block";
}

document.addEventListener("keydown", typing, false);
