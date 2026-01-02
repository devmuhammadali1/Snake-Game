let navigationsMobile = document.querySelector(".navigation");
const mediaQuery = window.matchMedia("(max-width:760px)");
screenChange();
let board = document.querySelector(".board");
let pauseResume = document.querySelector(".pause-resume");
let overlay = document.querySelector(".confirm-overlay");
let selectLevel = document.querySelector("#select-level");
let startGame = document.querySelector(".start-game");
let restartGame = document.querySelector(".restart");
restartGame.style.display = "none";
let score = document.querySelector("#score");
let mins = document.getElementById("mins");
let secs = document.getElementById("secs");
let highScore = localStorage.getItem("highScore") ?? 0;
document.querySelector("#high-score").innerText = highScore;
let intervalId;
let playTime;
let secsCounter = 0;
let minsCounter = 0;
let blockWidth = 18;
let blockHeight = 18;
let cols = Math.floor(board.clientWidth / blockWidth);
let rows = Math.floor(board.clientHeight / blockHeight);
let blocksArray = [];
let snakeDirection = "right";
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};
let speed = 300;
let foodCounter = 0;
let snake = [
  { x:Math.floor(rows/2) , y: Math.floor(cols/2-4) },
  { x:Math.floor(rows/2) , y: Math.floor(cols/2-4)+1 },
  { x:Math.floor(rows/2) , y: Math.floor(cols/2-4)+2 },

];
// Time
let Time=()=>{
  playTime = setInterval(() => {
    secsCounter += 1;
    if (secsCounter == 60) {
      minsCounter += 1;
      secsCounter = 0;
    }
    secs.innerText = secsCounter.toString().padStart(2, '0');
    mins.innerText = minsCounter.toString().padStart(2, '0')
  }, 1000);
}

// Media Query
function screenChange() {
  if (mediaQuery.matches) {
    navigationsMobile.style.display = "flex";
  } 
  navigationsMobile.addEventListener("click", (e) => {
    if (snakeDirection == "right" || snakeDirection == "left") {
      if (e.target.classList.contains("up")) {
        snakeDirection = "up";
      } else if (e.target.classList.contains("down")) {
        snakeDirection = "down";
      }
    } else if (snakeDirection == "up" || snakeDirection == "down") {
      if (e.target.classList.contains("right")) {
        snakeDirection = "right";
      } else if (e.target.classList.contains("left")) {
        snakeDirection = "left";
      }
    }
  });
}
mediaQuery.addEventListener("change", screenChange);
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    navigationsMobile.style.display = "none";
  }
});
// Media Query

for (let row = 0; row < rows; row++) {
  blocksArray[row] = [];
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.dataset.row = row; // Store data attributes
    block.dataset.col = col;
    board.appendChild(block);
    blocksArray[row][col] = block;
  }
}

selectLevel.addEventListener("click", (e) => {
  switch (e.target.value) {
    case "easy":
      speed = 300;
      break;
    case "medium":
      speed = 180;
      break;
    case "hard":
      speed = 100;
  }
});

function renderSnake() {
  blocksArray[food.x][food.y].classList.add("food-fill");
  let snakeHead = null;
  if (snakeDirection == "right") {
    snakeHead = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (snakeDirection == "left") {
    snakeHead = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (snakeDirection == "up") {
    snakeHead = { x: snake[0].x - 1, y: snake[0].y };
  } else if (snakeDirection == "down") {
    snakeHead = { x: snake[0].x + 1, y: snake[0].y };
  }
  
  for (let i = 0; i < snake.length-2; i++) {
    if (snake[i].x === snakeHead.x && snake[i].y === snakeHead.y) {
      startGame.style.display = "none";
      restartGame.style.display = "block";
      overlay.style.display = "flex";
      clearInterval(intervalId);
      clearInterval(playTime);
      return false;
    }
  }

  if (snakeHead.x == food.x && snakeHead.y == food.y) {
    blocksArray[food.x][food.y].classList.remove("food-fill");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocksArray[food.x][food.y].classList.add("food-fill");
    snake.push(snakeHead);
    foodCounter += 1;
  }

  if (
    snakeHead.y >= cols ||
    snakeHead.y < 0 ||
    snakeHead.x < 0 ||
    snakeHead.x >= rows
  ) {
    startGame.style.display = "none";
    restartGame.style.display = "block";
    overlay.style.display = "flex";
    clearInterval(intervalId);
    clearInterval(playTime);
    return;
  }

  snake.forEach((coordinate) => {
    blocksArray[coordinate.x][coordinate.y].classList.remove("fill");
  });
  snake.unshift(snakeHead);
  snake.pop();

  snake.forEach((coordinate) => {
    blocksArray[coordinate.x][coordinate.y].classList.add("fill");
  });

  score.textContent = foodCounter;
  if (foodCounter > highScore) {
    highScore = foodCounter;
    localStorage.setItem("highScore", highScore);
    document.querySelector("#high-score").innerText = highScore;
  }

}

addEventListener("keydown", (e) => {
  if (snakeDirection == "up" || snakeDirection == "down") {
    if (e.key == "ArrowRight") {
      snakeDirection = "right";
    } else if (e.key == "ArrowLeft") {
      snakeDirection = "left";
    }
  } else if (snakeDirection == "right" || snakeDirection == "left") {
    if (e.key == "ArrowUp") {
      snakeDirection = "up";
    } else if (e.key == "ArrowDown") {
      snakeDirection = "down";
    }
  }
});

overlay.addEventListener("click", (e) => {
  if (e.target.classList.contains("start-game")) {
    overlay.style.display = "none";
    secsCounter = 0;
    minsCounter = 0;
    Time()
    intervalId = setInterval(() => {
      renderSnake();
    }, speed);
  }
  if (e.target.classList.contains("restart")) {
    secsCounter = 0;
    minsCounter = 0;
    Time()
    foodCounter = 0;
    overlay.style.display = "none";
    blocksArray[food.x][food.y].classList.remove("food-fill");
    clearInterval(intervalId);
    snake.forEach((coordinate) => {
      blocksArray[coordinate.x][coordinate.y].classList.remove("fill");
    });
    snake = [
      { x:Math.floor(rows/2) , y: Math.floor(cols/2-6) },
      { x:Math.floor(rows/2) , y: Math.floor(cols/2-6)+1 },
      { x:Math.floor(rows/2) , y: Math.floor(cols/2-6)+2 },
    ];
    snakeDirection = "right";
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    intervalId = setInterval(() => {
      renderSnake();
    }, speed);
  }
});
pauseResume.addEventListener("click", () => {
  if (pauseResume.getAttribute("src") === "pause.png") {
    clearInterval(intervalId);
    clearInterval(playTime);
    pauseResume.src = "play-button.png";
  } else if (pauseResume.getAttribute("src") == "play-button.png") {
    pauseResume.src = "pause.png";
    Time()
    intervalId = setInterval(() => {
      renderSnake();
    }, speed);
  }
});
