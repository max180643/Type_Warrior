var buttonStart = document.querySelector("#buttonStart");
var buttonHowto = document.querySelector("#buttonHowto");
var words = document.querySelector(".words");
var health = document.querySelector(".health");
var myhealth = document.querySelector(".myhealth");
var healthBar = document.querySelector(".healthBar");
var wordsWrap = document.querySelector(".wordsWrap");
var game = document.querySelector(".gamebox");
var gamewin = document.querySelector(".gamewin");
var menuLogo = document.querySelector(".menuLogo");
var logo = document.querySelector(".logo");
var spans;
var bossHp;
var myHp;
var time = 3;
var cd;

function setGame() {
    bossHp = 100;
    health.style.width = 100 + "%";
    myHp = 100;
    myhealth.style.width = 100 + "%";
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
            document.removeEventListener("keydown", typing, false);
                    setTimeout(function(){
                        words.className = "words"; // restart the classes
                        random(); // give another word
                        document.addEventListener("keydown", typing, false);
                    }, 400);
            bossHp -= 10;
            time = 4;
            health.style.width = bossHp + "%";
        }
    }
}

function check() {
    if (bossHp <= 0) {
        document.getElementById("game").style.display = "none";
        document.getElementById("gamewin").style.display = "block";
        clearInterval(cd);
        bossHp = 100;
    }
    else if (myHp <= 0) {
        document.getElementById("game").style.display = "none";
        document.getElementById("gameover").style.display = "block";
        clearInterval(cd);
        myHp = 100;
    }
    requestAnimationFrame(check);
}

function countdown(){
    cd = setInterval(
        function(){
            if (time > 0) {
                time--;
                updateTime();
            }
            else{
                clearInterval(cd);
            }
        }
        ,1000)
}

function updateTime(){
    theTime.innerText = time;
    if (time == 0) {
        myHp -= 10;
        myhealth.style.width = myHp + "%";
        time = 4;
        random();
    }
}

function delaystart() {
    var firstdelay = 2;
    document.getElementById("mainmenu").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("gamebox").style.display = "none";
    document.getElementById("startdelay").style.display = "block";
    document.getElementById("gamewin").style.display = "none";
    document.getElementById("gameover").style.display = "none";
    ds = setInterval(
        function(){
            if (firstdelay <= 0) {
                clearInterval(ds);
                startgame();
                document.getElementById("gamebox").style.display = "block";
                document.getElementById("startdelay").style.display = "none";
                startdelay.innerText = 3;
            }
            else{
                startdelay.innerText = firstdelay;
                firstdelay -= 1;
            }
        }
        ,1000)
}

function startgame() {
    document.getElementById("mainmenu").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("gamewin").style.display = "none";
    document.getElementById("gameover").style.display = "none";
    setGame();
    random();
    check();
    countdown();
    updateTime();
}

function menugame(){
    document.getElementById("mainmenu").style.display = "block";
    document.getElementById("game").style.display = "none";
    document.getElementById("gamewin").style.display = "none";
    document.getElementById("gameover").style.display = "none";
}

document.addEventListener("keydown", typing, false);
