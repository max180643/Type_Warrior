var spans, bossHp, myHp, time, mode, timemode, totaltime, damage, hit, correct, combo, score;
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
var mytranslate = document.getElementById("mytranslate");
var timestatus = document.getElementById("timestatus");
var updatecombo = document.getElementById("updatecombo");
var updatescore = document.getElementById("updatescore");
var scoreboard = document.getElementById("score");
var s_click = new Audio("./sound/1.click.wav");
var s_countdown = new Audio("./sound/2.countdown.wav");
var s_press = new Audio("./sound/3.press.wav");
var s_damage = new Audio("./sound/4.damage.mp3");
var s_hurt = new Audio("./sound/5.hurt.wav");
var s_die = new Audio("./sound/6.die.wav");
var s_win = new Audio("./sound/7.win.mp3");
var s_gameover = new Audio("./sound/8.gameover.wav");
var s_miss = new Audio("./sound/9.missed.wav");

//Change mode
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
    soundClick();
}

//Set Game
function setGame() {
    mymonster = Math.floor(Math.random()*1000)%6;
    bossHp = 100;
    health.style.width = 100 + "%";
    myHp = 100;
    myhealth.style.width = 100 + "%";
    hit = 0;
    combo = 0;
    score = 0;
    gameend = false;
    updatecombo.style.color = "white";
    updatecombo.innerHTML = 0;
    updatescore.innerHTML = 0;
    monster_start.src = "./img/Mons" + mymonster + ".gif";
    monster_die.src = "./img/Mons" + mymonster + "-die.gif";
    monster_die.style.display = "none";
    monster_start.style.display = "block";
    myword.style.display = "block";
    timestatus.style.display = "block";
    mytranslate.style.display = "block";
}

//Set Mode Game
function setMode(mode) {
    mode = (mode == undefined) ? "easy": (mode == "easy") ? "medium": (mode == "medium") ? "hard": (mode == "hard") ? "expert": "easy";
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
    soundCountdown();
    delayStart();
}

//Random Word
function random() {
    words.innerHTML = "";
    correct = 0;
    var random = Math.floor(Math.random()*10000)%1943;
    var wordArray = wordlist[random].split("");
    for (var i = 0; i < wordArray.length; i++) {
        var span = document.createElement("span");
        span.classList.add("span");
        span.innerHTML = wordArray[i];
        words.appendChild(span);
    }
    spans = document.querySelectorAll(".span");
    mytranslate.innerHTML = thailist[random];
    totaltime = timemode*Math.floor(wordArray.length/3);
    if(totaltime == 0) {
        totaltime = timemode;
    }
}

//My typing
function typing(e) {
    typed = String.fromCharCode(e.which);
    if (gameend) {
        return;
    }
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].innerHTML === typed) { // if typed letter is the one from the word
            if (spans[i].classList.contains("bg")) { // if it already has class with the bacground color then check the next one
                continue;
            } else if (spans[i].classList.contains("bg") === false && spans[i-1] === undefined || spans[i-1].classList.contains("bg") !== false ) { // if it dont have class, if it is not first letter or if the letter before it dont have class (this is done to avoid marking the letters who are not in order for being checked, for example if you have two "A"s so to avoid marking both of them if the first one is at the index 0 and second at index 5 for example)
                spans[i].classList.add("bg");
                soundPress();
                game.style.borderColor = "#8fff86";
                game.style.boxShadow = "0px 0px 40px #42f403";
                combo += 1;
                correct += 1;
                updatecombo.innerHTML = combo;
                setTimeout(function() {
                    game.style.borderColor = "#86d9ff";
                    game.style.boxShadow = "0px 0px 20px #03A9F4";
                }, 1000);
                break;
            }
        }
        else if (spans[i].innerHTML !== typed) {
            if (spans[i].classList.contains("bg")) { // if it already has class with the bacground color then check the next one
                continue;
            } else if (spans[i].classList.contains("bg") === false && spans[i-1] === undefined || spans[i-1].classList.contains("bg") !== false ) { // if it dont have class, if it is not first letter or if the letter before it dont have class (this is done to avoid marking the letters who are not in order for being checked, for example if you have two "A"s so to avoid marking both of them if the first one is at the index 0 and second at index 5 for example)
                soundMiss();
                game.style.borderColor = "#ff8686";
                game.style.boxShadow = "0px 0px 40px #f40303";
                combo = 0;
                setTimeout(function() {
                    game.style.borderColor = "#86d9ff";
                    game.style.boxShadow = "0px 0px 20px #03A9F4";
                }, 1000);
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
            score += Math.floor(correct*(Math.floor(combo/10)*0.5 + 1));
            updatescore.innerHTML = score;
            document.removeEventListener("keydown", typing, false);
                    setTimeout(function(){
                        words.className = "words"; // restart the classes
                        soundDamage();
                        random(); // give another word
                        time = totaltime + 1;
                        hit = 0;
                        document.addEventListener("keydown", typing, false);
                    }, 400);
            bossHp -= 10;
            health.style.width = bossHp + "%";
        }
    }
    hue = Math.floor(combo/10)*30;
    if (hue == 0) {
        updatecombo.style.color = "white";
    }
    else {
        updatecombo.style.color = "hsl("+hue+", 100%, 50%)";
    }
    updatecombo.innerHTML = combo;
}

//Check Hp
function check() {
    if (bossHp <= 0) {
        soundDie();
        monster_start.style.display = "none";
        myword.style.display = "none";
        timestatus.style.display = "none";
        monster_die.style.display = "block";
        gameend = true;
        clearInterval(cd);
        setTimeout(function() {
            soundWin();
            game.style.display = "none";
            mytranslate.style.display = "none";
            gamewin.style.display = "block";
        }, 4000);
        bossHp = 100;
    }
    else if (myHp <= 0) {
        soundGameover();
        game.style.display = "none";
        mytranslate.style.display = "none";
        gameover.style.display = "block";
        gameend = true;
        clearInterval(cd);
        myHp = 100;
    }
    requestAnimationFrame(check);
}

//Time
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

//Show time and check time = 0 to random new word
function updateTime() {
    theTime.innerText = time;
    if (time <= 0 && hit == 0) {
        myHp -= damage;
        myhealth.style.width = myHp + "%";
        combo = 0;
        updatecombo.innerHTML = combo;
        updatecombo.style.color = "white";
        soundHurt();
        random();
        time = totaltime+1;
    }
}

//Set to levelselect
function levelSelect() {
    mainmenu.style.display = "none";
    game.style.display = "none";
    gamebox.style.display = "none";
    startdelay.style.display = "none";
    gamewin.style.display = "none";
    gameover.style.display = "none";
    scoreboard.style.display = "none";
    level.style.display = "block";
    soundClick();
}

//Delay before start
function delayStart() {
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
                startGame();
                startdelay.style.display = "none";
                gamebox.style.display = "block";
                startdelay.innerText = 3;
            }
            else{
                soundCountdown();
                startdelay.innerText = firstdelay;
                firstdelay -= 1;
            }
        }
        ,1000);
}

//StartGame
function startGame() {
    scoreboard.style.display = "block";
    setGame();
    random();
    check();
    countdown();
    updateTime();
}

//Set to Menu
function menuGame() {
    soundClick();
    game.style.display = "none";
    gamewin.style.display = "none";
    gameover.style.display = "none";
    scoreboard.style.display = "none";
    mainmenu.style.display = "block";
}

//Sound
function soundClick() {
    s_click.pause();
    s_click.currentTime = 0;
    s_click.play();
}

function soundCountdown() {
    s_countdown.pause();
    s_countdown.currentTime = 0;
    s_countdown.play();
}

function soundPress() {
    if (gameend) {
        return;
    }
    s_press.pause();
    s_press.currentTime = 0;
    s_press.play();
}

function soundDamage() {
    s_damage.pause();
    s_damage.currentTime = 0;
    s_damage.play();
}

function soundHurt() {
    s_hurt.pause();
    s_hurt.currentTime = 0;
    s_hurt.play();
}

function soundDie() {
    s_die.pause();
    s_die.currentTime = 0;
    s_die.play();
}

function soundWin() {
    s_win.pause();
    s_win.currentTime = 0;
    s_win.play();
}

function soundGameover() {
    s_gameover.pause();
    s_gameover.currentTime = 0;
    s_gameover.play();
}

function soundMiss() {
    s_miss.pause();
    s_miss.currentTime = 0;
    s_miss.play();
}

document.addEventListener("keydown", typing, false);
