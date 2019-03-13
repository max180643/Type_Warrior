var buttonStart = document.querySelector("#buttonStart");
var buttonHowto = document.querySelector("#buttonHowto");
var words = document.querySelector(".words");
var health = document.querySelector(".health");
var healthBar = document.querySelector(".healthBar");
var wordsWrap = document.querySelector(".wordsWrap");
var game = document.querySelector(".gamebox")
var menuLogo = document.querySelector(".menuLogo");
var logo = document.querySelector(".logo");
var spans;
var bossHp = 100;

function random() {
    words.innerHTML = ""
    var random = Math.floor(Math.random() * 1943 - 0 + 1);
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
            health.style.width = bossHp + "%";
        }
    }
}

function check() {
    if (bossHp <= 0) {
        bossHp -= 10;
        health.style.width = bossHp + "%";
        healthBar.style.display = "none";
        wordsWrap.style.display = "none";
        alert("You win!");
        bossHp = 100;
    }
    buttonStart.disabled = false;
    requestAnimationFrame(check);
}

function gameload() {
    menuLogo.style.display = "none";
    buttonHowto.style.display = "none";
    buttonStart.setAttribute('id','buttonGame');
    game.style.display = "block";
    logo.style.display = "block";
}

buttonStart.addEventListener("click", function(e){
    gameload();
    random();
    check();
    buttonStart.disabled = true;
});

buttonHowto.addEventListener("click", function(e){
    alert("How to play?\n\t1. Press START button.\n\t2. Type word that show on screen.\n\t3. If you type correctly word your will give damage to boss.");
});

document.addEventListener("keydown", typing, false);