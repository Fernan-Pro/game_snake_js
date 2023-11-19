// Variables globales
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cellSize = 20; // Tamaño de cada celda del tablero
var boardSize = 20; // Tamaño del tablero en celdas
var snake = [{ x: 10, y: 10 }]; // Posición inicial de la serpiente
var direction = "right"; // Dirección inicial de la serpiente
var food = null; // Posición de la comida
var score = 0; // Puntuación del juego
var speed = 200; // Velocidad del juego en milisegundos
var interval = null; // Intervalo de tiempo para actualizar el juego

// Función para generar un número aleatorio entre min y max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para generar una posición aleatoria para la comida
function generateFood() {
  var x = random(0, boardSize - 1);
  var y = random(0, boardSize - 1);
  // Comprobar que la posición no esté ocupada por la serpiente
  for (var i = 0; i < snake.length; i++) {
    if (snake[i].x == x && snake[i].y == y) {
      // Si está ocupada, generar otra posición
      return generateFood();
    }
  }
  // Si no está ocupada, devolver la posición
  return { x: x, y: y };
}

// Función para dibujar el tablero
function drawBoard() {
  // Dibujar el fondo de color blanco
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Dibujar la cuadrícula de color gris
  ctx.strokeStyle = "lightgray";
  for (var i = 0; i < boardSize; i++) {
    for (var j = 0; j < boardSize; j++) {
      ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

// Función para dibujar la serpiente
function drawSnake() {
  // Dibujar cada segmento de la serpiente de color verde
  ctx.fillStyle = "green";
  for (var i = 0; i < snake.length; i++) {
    ctx.fillRect(
      snake[i].x * cellSize,
      snake[i].y * cellSize,
      cellSize,
      cellSize
    );
  }
}

// Función para dibujar la comida
function drawFood() {
  // Dibujar la comida de color rojo
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

// Función para dibujar el marcador
function drawScore() {
  // Dibujar el texto con la puntuación en la esquina superior izquierda
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// Función para actualizar el estado del juego
function updateGame() {
  // Obtener la posición de la cabeza de la serpiente
  var head = snake[0];
  // Calcular la nueva posición de la cabeza según la dirección
  var newX = head.x;
  var newY = head.y;
  if (direction == "right") {
    newX++;
  } else if (direction == "left") {
    newX--;
  } else if (direction == "up") {
    newY--;
  } else if (direction == "down") {
    newY++;
  }
  // Comprobar si la nueva posición está fuera del tablero
  if (newX < 0 || newX >= boardSize || newY < 0 || newY >= boardSize) {
    // Si está fuera, terminar el juego
    gameOver();
    return;
  }
  // Comprobar si la nueva posición está ocupada por la serpiente
  for (var i = 0; i < snake.length; i++) {
    if (snake[i].x == newX && snake[i].y == newY) {
      // Si está ocupada, terminar el juego
      gameOver();
      return;
    }
  }
  // Añadir la nueva posición al principio de la serpiente
  snake.unshift({ x: newX, y: newY });
  // Comprobar si la nueva posición coincide con la comida
  if (newX == food.x && newY == food.y) {
    // Si coincide, aumentar la puntuación
    score++;
    // Generar una nueva posición para la comida
    food = generateFood();
    // Aumentar la velocidad del juego
    speed -= 10;
    // Reiniciar el intervalo de tiempo con la nueva velocidad
    clearInterval(interval);
    interval = setInterval(updateGame, speed);
  } else {
    // Si no coincide, eliminar la última posición de la serpiente
    snake.pop();
  }
  // Dibujar el juego
  drawGame();
}

// Función para dibujar el juego
function drawGame() {
  // Dibujar el tablero
  drawBoard();
  // Dibujar la serpiente
  drawSnake();
  // Dibujar la comida
  drawFood();
  // Dibujar el marcador
  drawScore();
}

// Función para terminar el juego
function gameOver() {
  // Detener el intervalo de tiempo
  clearInterval(interval);
  // Mostrar un mensaje de fin de juego
  alert("Game Over! Your score is " + score);
}

// Función para manejar el evento de presionar una tecla
function handleKeyDown(event) {
  // Obtener el código de la tecla presionada
  var keyCode = event.keyCode;
  // Cambiar la dirección de la serpiente según la tecla
  if (keyCode == 37 && direction != "right") {
    // Flecha izquierda
    direction = "left";
  } else if (keyCode == 38 && direction != "down") {
    // Flecha arriba
    direction = "up";
  } else if (keyCode == 39 && direction != "left") {
    // Flecha derecha
    direction = "right";
  } else if (keyCode == 40 && direction != "up") {
    // Flecha abajo
    direction = "down";
  }
}

// Función principal del juego
function main() {
  // Generar una posición inicial para la comida
  food = generateFood();
  // Dibujar el juego
  drawGame();
  // Iniciar el intervalo de tiempo para actualizar el juego
  interval = setInterval(updateGame, speed);
  // Añadir un listener para el evento de presionar una tecla
  window.addEventListener("keydown", handleKeyDown);
}

// Llamar a la función principal cuando se cargue la página
window.onload = main;
