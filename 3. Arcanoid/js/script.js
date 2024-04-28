//Board dates

let board;
const BOARD_WIDTH = 700;
const BOARD_HEIGHT = 700;
let context;

//pallete dates

const PALLETE_WIDTH = 100;
const PALLETE_HEIGHT = 15;
let pallete_pos_x = (BOARD_WIDTH - PALLETE_WIDTH) / 2;
let pallete_pos_y = BOARD_HEIGHT - 40;

//brick dates

const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 15;
let brick_pos_y;
let brick_pos_x;

//número de filas y columnas de ladrillos
const NUM_ROWS = 5;
const NUM_COLS = 9;

//brick object

let brick = {
  width: BRICK_WIDTH,
  height: BRICK_HEIGHT,
  x: brick_pos_x,
  y: brick_pos_y,
  deleted: false,
};

//bricks array

let bricks = [];

//pallete object

let pallete = {
  width: PALLETE_WIDTH,
  height: PALLETE_HEIGHT,
  x: pallete_pos_x,
  y: pallete_pos_y,
  moveRight: false,
  moveLeft: false,
};

//ball dates

let ball_pos_x = BOARD_WIDTH / 2;
let ball_pos_y = BOARD_HEIGHT - 60;
const BALL_RADIUS = 5;

//ball

let ball = {
  x: ball_pos_x,
  y: ball_pos_y,
  radius: BALL_RADIUS,
  speed_x: -5,
  speed_y: -5,
};

//physics
let palleteMoveSpeed = 5;

function comenzar() {
  board = document.getElementById("board");

  board.height = BOARD_HEIGHT;
  board.width = BOARD_WIDTH;

  initializeBricks();

  context = board.getContext("2d");

  drawBall();
  drawPallete();

  requestAnimationFrame(update);
}

// Inicializa el array de ladrillos
function initializeBricks() {
  // Calcular el espacio horizontal disponible para los ladrillos
  let availableSpace = BOARD_WIDTH - NUM_COLS * BRICK_WIDTH;
  // Calcular el espaciado entre cada ladrillo
  let spacing = availableSpace / (NUM_COLS + 1);

  for (let i = 0; i < NUM_ROWS; i++) {
    bricks[i] = []; // Crea una nueva fila en cada iteración
    for (let j = 0; j < NUM_COLS; j++) {
      // Calcula las coordenadas x e y del ladrillo
      let x = spacing + j * (BRICK_WIDTH + spacing);
      let y = i * (BRICK_HEIGHT + 5) + 10;
      // Crea el objeto ladrillo y añádelo al array de ladrillos
      bricks[i][j] = { x: x, y: y, width: BRICK_WIDTH, height: BRICK_HEIGHT };
    }
  }
}

//Pintar paleta
function drawPallete() {
  context.fillStyle = "#FFFFFF";
  context.fillRect(pallete.x, pallete.y, pallete.width, pallete.height);
}

//Pintar la pelota
function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); // Dibuja un arco de círculo
  context.fillStyle = "#FFFFFF"; // Color blanco
  context.fill(); // Rellena el círculo
}

function drawBricks() {
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      let brick = bricks[i][j];

      // Solo dibuja el ladrillo si no está marcado como eliminado
      if (!brick.deleted) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    }
  }
}

function moveBall(ball_speed_x, ball_speed_y) {
  ball.x += ball_speed_x;
  ball.y += ball_speed_y;
}

function wallCollision() {
  if (ball.x + ball.radius >= BOARD_WIDTH) {
    // Verifica si el borde derecho de la pelota toca la pared derecha
    ball.speed_x *= -1; // Cambia la dirección horizontal de la pelota
  }

  if (ball.x - ball.radius <= 0) {
    // Verifica si el borde izquierdo de la pelota toca la pared izquierda
    ball.speed_x *= -1; // Cambia la dirección horizontal de la pelota
  }

  if (ball.y - ball.radius <= 0) {
    ball.speed_y *= -1;
  }

  if (ball.y - ball.radius >= BOARD_HEIGHT) {
    document.location.reload();
  }
}

function eventsListener() {
  window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      // Cuando se presiona la flecha derecha
      pallete.moveRight = true;
    }
  });

  window.addEventListener("keyup", function (event) {
    if (event.key === "ArrowRight") {
      // Cuando se suelta la flecha derecha
      pallete.moveRight = false;
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      // Cuando se presiona la flecha derecha
      pallete.moveLeft = true;
    }
  });

  window.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
      // Cuando se suelta la flecha derecha
      pallete.moveLeft = false;
    }
  });
}

function movePallete() {
  if (pallete.x <= BOARD_WIDTH - pallete.width) {
    if (pallete.moveRight == true) {
      pallete.x += palleteMoveSpeed;
    }
  }

  if (pallete.x >= 0) {
    if (pallete.moveLeft == true) {
      pallete.x -= palleteMoveSpeed;
    }
  }
}

function palleteCollision() {
  // Comprueba si la pelota está dentro del rango vertical de la paleta
  if (
    ball.y + ball.radius >= pallete.y &&
    ball.y - ball.radius <= pallete.y + pallete.height
  ) {
    // Comprueba si la pelota está dentro del rango horizontal de la paleta
    if (
      ball.x + ball.radius >= pallete.x &&
      ball.x - ball.radius <= pallete.x + pallete.width
    ) {
      // Cambia la dirección vertical de la pelota
      ball.speed_y *= -1;
    }
  }
}

function brickCollision() {
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      let brick = bricks[i][j];

      // Si el ladrillo está marcado como eliminado, pasa al siguiente ladrillo
      if (brick.deleted) {
        continue;
      }

      if (
        ball.y + ball.radius >= brick.y &&
        ball.y - ball.radius <= brick.y + brick.height
      ) {
        // Comprueba si la pelota está dentro del rango horizontal de ladrillo
        if (
          ball.x + ball.radius >= brick.x &&
          ball.x - ball.radius <= brick.x + brick.width
        ) {
          // Cambia la dirección vertical de la pelota
          ball.speed_y *= -1;
          brick.deleted = true;
        }
      }
    }
  }
}

function update() {
  requestAnimationFrame(update);

  context.clearRect(0, 0, board.width, board.height);

  drawPallete();
  drawBricks();
  eventsListener();
  movePallete();
  moveBall(ball.speed_x, ball.speed_y);
  wallCollision();
  palleteCollision();
  brickCollision();
  drawBall();
}

window.addEventListener("load", comenzar, false);
