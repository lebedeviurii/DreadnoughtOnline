var audio;
var ai;
var button = document.createElement('button');
button.className = 'btn';
button.setAttribute('id', 'sound');
var soundOff = true;
button.innerHTML = '<img src="./images/sound-off-btn.svg">';
var screenFlag = soundOff;
audio = new Audio('./music/bg_music.mp3');
audio.loop = true;
var soundMenu = document.querySelector('#gameBoardContainer').appendChild(document.createElement('div'))
soundMenu.setAttribute('id', 'soundMenu');
soundMenu.appendChild(button);
button.addEventListener('click', function() {
  if ( soundOff ) {
    button.innerHTML = '<img src="./images/sound-on-btn.svg">';
    audio.volume = 0.05;
    audio.play();
  } else {
    button.innerHTML = '<img src="./images/sound-off-btn.svg">';
    audio.pause();
  }
  soundOff = !soundOff;
});
document.addEventListener("visibilitychange", function() { 
  if (!screenFlag || !soundOff){
    if (document.hidden) { 
      console.log("BG")
      audio.pause();
      screenFlag = !screenFlag;
    } else { 
      console.log("FG")
      audio.play();
      screenFlag = !screenFlag;
    } 
  }
});

window.addEventListener('offline', (event) => {
  alert("You are OFFLINE, check your Internet connection commander!")
});

window.addEventListener('pageshow', (event) =>{
  const menu = document.getElementById('mainMenu');
  for (let i = 0; i < GameSettings.button.length; i++){
    let btn = document.createElement('div');
    btn.setAttribute('class', 'btn');
    btn.setAttribute('id', GameSettings.button[i].id);
    btn.innerText = GameSettings.button[i].name + " game";
    ai = new Robot();
    if (i == 0){
      btn.addEventListener('click', (event) =>{
        gameStart();
      });
    } else {
      btn.addEventListener('click', (event) =>{
        loadGame();
      });
    }
    menu.appendChild(btn);
  }
});

function loadGame(){
  let disable = document.getElementById('mainMenu');
  disable.style.display = 'none';
  audio.src = './music/honor-and-sword-main-11222.mp3';
  if (localStorage.getItem("intellegence")){
    ai.load(localStorage.getItem("intellegence"),localStorage.getItem("player"),localStorage.getItem("robot"),localStorage.getItem("gameState"))
  } else {
    alert("Save something first!")
  }
}

function robotGame(){
  ai.robotGame()
}

function choosedDifficulty(){
  const difficulty = GameModes.modeText.length;
  let difMenu = document.createElement('ul');
  for (let i =  0; i < difficulty; i++){
    let mode = document.createElement('li');
    mode.innerText = GameModes.modeText[i];
    mode.addEventListener('click', (event) => {
      let dif = document.getElementById('difficulty');
      dif.style.display = "none";
      ai.choosedDifficulty(mode.innerText)
      robotGame();
    });
    difMenu.appendChild(mode);
  }
  return difMenu;
}

function gameStart(){
  let disable = document.getElementById('mainMenu');
  let enable = choosedDifficulty();
  let content = document.getElementsByClassName('content')[0];
  content.style.background = 'rgba(74,74,74, 0.5)';
  disable.style.display = 'none';
  document.getElementById('difficulty').appendChild(enable);
  enable.style.display = 'flex';
  audio.src = './music/honor-and-sword-main-11222.mp3';
}

var startTime;
var timerInterval;

function startTimer() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  document.getElementById("timer").textContent = "00:00:00";
}

function updateTimer() {
  var currentTime = new Date().getTime();
  var timeDifference = currentTime - startTime;
  
  var hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  var minutes = Math.floor((timeDifference / 1000 / 60) % 60);
  var seconds = Math.floor((timeDifference / 1000) % 60);

  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");

  var timerDisplay = hours + ":" + minutes + ":" + seconds;
  document.getElementById("timer").textContent = timerDisplay;
}
