const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const messageElement = document.getElementById('gameMessage');
const restartButton = document.getElementById('restartButton');

const tileSize = 24;
const tileCount = canvas.width / tileSize;
const tickMs = 120;

let snake;
let food;
let direction;
let nextDirection;
let score;
let gameTimer;
let gameRunning;
let gameOver;

function resetGame() {
  snake = [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  gameRunning = false;
  gameOver = false;
  scoreElement.textContent = score;
  messageElement.textContent = 'Press an arrow key to start';
  messageElement.classList.remove('hidden');
  placeFood();
  stopTimer();
  draw();
}

function startGame() {
  if (gameRunning || gameOver) {
    return;
  }

  gameRunning = true;
  messageElement.classList.add('hidden');
  gameTimer = window.setInterval(update, tickMs);
}

function stopTimer() {
  if (gameTimer) {
    window.clearInterval(gameTimer);
    gameTimer = null;
  }
}

function update() {
  direction = nextDirection;

  const head = snake[0];
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y
  };

  if (hasCollision(newHead)) {
    endGame();
    return;
  }

  snake.unshift(newHead);

  if (newHead.x === food.x && newHead.y === food.y) {
    score += 1;
    scoreElement.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function hasCollision(position) {
  const outsideBoard =
    position.x < 0 ||
    position.x >= tileCount ||
    position.y < 0 ||
    position.y >= tileCount;

  return outsideBoard || snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function endGame() {
  gameOver = true;
  gameRunning = false;
  stopTimer();
  messageElement.textContent = `Game over! Final score: ${score}`;
  messageElement.classList.remove('hidden');
  draw();
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function draw() {
  drawMapBackground();
  drawFood();
  drawSnake();
}

function drawMapBackground() {
  ctx.fillStyle = '#dfe8d6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawDistrict(20, 28, 180, 150, 'rgba(82, 135, 72, 0.18)');
  drawDistrict(236, 56, 180, 130, 'rgba(235, 204, 122, 0.2)');
  drawDistrict(64, 270, 176, 145, 'rgba(59, 119, 83, 0.18)');
  drawDistrict(270, 280, 150, 130, 'rgba(173, 126, 77, 0.14)');

  drawPath([
    [0, 78], [82, 98], [154, 128], [236, 116], [338, 156], [480, 138]
  ], 'rgba(85, 156, 184, 0.34)', 28);
  drawPath([
    [28, 430], [98, 356], [188, 318], [262, 242], [336, 210], [456, 184]
  ], 'rgba(255, 255, 255, 0.62)', 12);
  drawPath([
    [244, 0], [226, 92], [244, 182], [224, 284], [238, 480]
  ], 'rgba(255, 255, 255, 0.62)', 10);
  drawPath([
    [0, 248], [98, 226], [182, 238], [276, 224], [480, 254]
  ], 'rgba(255, 255, 255, 0.5)', 8);

  ctx.fillStyle = 'rgba(29, 89, 55, 0.55)';
  ctx.font = '700 15px Arial';
  ctx.fillText('Château', 274, 104);
  ctx.fillText('Forêt', 76, 352);
  ctx.fillStyle = 'rgba(24, 48, 40, 0.2)';
  ctx.font = '12px Arial';
  ctx.fillText('Saint-Germain-en-Laye', 164, 220);

  ctx.strokeStyle = 'rgba(24, 48, 40, 0.05)';
  ctx.lineWidth = 1;
  for (let line = tileSize; line < canvas.width; line += tileSize) {
    ctx.beginPath();
    ctx.moveTo(line, 0);
    ctx.lineTo(line, canvas.height);
    ctx.moveTo(0, line);
    ctx.lineTo(canvas.width, line);
    ctx.stroke();
  }
}

function drawDistrict(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 28);
  ctx.fill();
}

function drawPath(points, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const inset = index === 0 ? 3 : 4;
    ctx.fillStyle = index === 0 ? '#1d5937' : '#2f7d4c';
    ctx.beginPath();
    ctx.roundRect(
      segment.x * tileSize + inset,
      segment.y * tileSize + inset,
      tileSize - inset * 2,
      tileSize - inset * 2,
      7
    );
    ctx.fill();
  });
}

function drawFood() {
  const centerX = food.x * tileSize + tileSize / 2;
  const centerY = food.y * tileSize + tileSize / 2;

  ctx.fillStyle = '#d54d3f';
  ctx.beginPath();
  ctx.arc(centerX, centerY, tileSize * 0.34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(centerX - 3, centerY - 3, 3, 0, Math.PI * 2);
  ctx.fill();
}

function setDirection(newDirection) {
  const reversing =
    newDirection.x + direction.x === 0 &&
    newDirection.y + direction.y === 0;

  if (!reversing) {
    nextDirection = newDirection;
  }
}

document.addEventListener('keydown', event => {
  const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  };

  if (!directions[event.key]) {
    return;
  }

  event.preventDefault();
  setDirection(directions[event.key]);
  startGame();
});

restartButton.addEventListener('click', resetGame);

resetGame();
