const gameArea = document.getElementById("gameArea");
const scoreBoard = document.getElementById("scoreBoard");
const startBtn = document.getElementById("startBtn");
const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const challengeModeBtn = document.getElementById("challengeModeBtn");
const clickSound = document.getElementById("clickSound");
const gameOverSound = document.getElementById("gameOverSound");

let score = 0;
let timeLeft = 30;
let level = 1;
let boxSize = 50;
let gameInterval;
let timerInterval;
let highScore = localStorage.getItem("highScore") || 0;
let isDarkTheme = false;
let challengeMode = false;
let challengeClicks = 0;
const challengeTarget = 10;
let challengeStartTime = 0;

function updateScoreBoard() {
  scoreBoard.innerText = `Score: ${score} | Time left: ${timeLeft} | Level: ${level} | High Score: ${highScore}`;
}

function randomPosition(max) {
  return Math.floor(Math.random() * (max - boxSize));
}

function createBox() {
  const box = document.createElement("div");
  box.className = "box";
  box.style.width = boxSize + "px";
  box.style.height = boxSize + "px";
  box.style.top = randomPosition(gameArea.clientHeight) + "px";
  box.style.left = randomPosition(gameArea.clientWidth) + "px";

  box.onclick = function () {
    score++;
    playSound(clickSound);
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    if (challengeMode) {
      challengeClicks++;
      if (challengeClicks >= challengeTarget) {
        const timeUsed = 30 - timeLeft;
        alert(`Challenge complete! You clicked ${challengeTarget} boxes in ${timeUsed} seconds.`);
        stopGame();
        return;
      }
    }

    updateScoreBoard();
    box.remove();
    createBox();
  };

  gameArea.appendChild(box);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function startGame() {
  score = 0;
  timeLeft = 30;
  level = 1;
  boxSize = 50;
  challengeClicks = 0;
  challengeStartTime = Date.now();
  updateScoreBoard();
  gameArea.innerHTML = "";
  createBox();

  clearInterval(gameInterval);
  clearInterval(timerInterval);

  gameInterval = setInterval(() => {
    // Tingkatkan level tiap 10 poin
    if (score > 0 && score % 10 === 0) {
      level = Math.floor(score / 10) + 1;
      boxSize = Math.max(20, 50 - (level - 1) * 5); // Kotak makin kecil
    }
    gameArea.innerHTML = "";
    createBox();
  }, Math.max(400 - level * 30, 150));

  timerInterval = setInterval(() => {
    timeLeft--;
    updateScoreBoard();
    if (timeLeft <= 0) {
      playSound(gameOverSound);
      alert(`Waktu habis! Skormu: ${score}`);
      stopGame();
    }
  }, 1000);
}

function stopGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  gameArea.innerHTML = "";
  score = 0;
  timeLeft = 0;
  updateScoreBoard();
}

startBtn.onclick = () => {
  challengeMode = false;
  startGame();
};

toggleThemeBtn.onclick = () => {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle("dark", isDarkTheme);
};

challengeModeBtn.onclick = () => {
  challengeMode = true;
  startGame();
};
