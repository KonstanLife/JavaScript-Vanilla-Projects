// Board Dates

let board;
const BOARD_HEIGHT = 640;
const BOARD_WIDTH = 360;
let context;

//Bird Dates

let BIRD_WIDHT = 34;
let BIRD_HEIGHT = 24;

let bird_pos_x = BOARD_WIDTH / 8;
let bird_pos_y = BOARD_HEIGHT / 2;
let birdImg;

//Pipes Dates

let pipeArray = [];
let PIPE_WIDHT = 64;
let PIPE_HEIGHT = 512;
let pipe_pos_x = BOARD_WIDTH;
let pipe_pos_y = 0;

let top_pipe_img;
let bottom_pipe_img;

//Physics

let velocityX = -2; //pipes moving speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

//Bird Object

let bird = {
  x: bird_pos_x,
  y: bird_pos_y,
  width: BIRD_WIDHT,
  height: BIRD_HEIGHT,
};

function comenzar() {
  board = document.getElementById("board");
  board.height = BOARD_HEIGHT;
  board.width = BOARD_WIDTH;

  context = board.getContext("2d");

  board.addEventListener("click", moveBird, false);

  //Load Bird Image

  birdImg = new Image();
  birdImg.src = "/images/flappybird.png";

  //Loas Pipes Images

  top_pipe_img = new Image();
  top_pipe_img.src = "/images/toppipe.png";

  bottom_pipe_img = new Image();
  bottom_pipe_img.src = "/images/bottompipe.png";

  //Draw Bird

  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  requestAnimationFrame(update);
  setInterval(placePiepes, 1500); // every 1.5 seconds
}

//Game cicle

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    var text = "GAME OVER";
    var textWidth = context.measureText(text).width;
    context.fillText(text, (BOARD_WIDTH - textWidth) / 2, 110);
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  //bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);


  if (bird.y + bird.height >= BOARD_HEIGHT) {
    gameOver = true;
  }

  //pipes

  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //2 tubes
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -PIPE_WIDHT) {
      pipeArray.shift(); //remove 1st element
    }
  }

    // Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    var text = score.toString(); // convert score to string
    var textWidth = context.measureText(text).width;
    context.fillText(text, (BOARD_WIDTH - textWidth) / 2, 45);
}

function placePiepes() {
  if (gameOver) {
    return;
  }

  let random_pipe_pos_y =
    pipe_pos_y - PIPE_HEIGHT / 4 - Math.random() * (PIPE_HEIGHT / 2);
  let openSpace = board.height / 4;

  let top_pipe = {
    img: top_pipe_img,
    x: pipe_pos_x,
    y: random_pipe_pos_y,
    width: PIPE_WIDHT,
    height: PIPE_HEIGHT,
    passed: false,
  };

  pipeArray.push(top_pipe);

  let bottom_pipe = {
    img: bottom_pipe_img,
    x: pipe_pos_x,
    y: random_pipe_pos_y + PIPE_HEIGHT + openSpace,
    width: PIPE_WIDHT,
    height: PIPE_HEIGHT,
    passed: false,
  };

  pipeArray.push(bottom_pipe);
}

function moveBird() {
  velocityY = -7;

  if (gameOver) {
    bird.y = bird_pos_y;
    pipeArray = [];
    score = 0;
    gameOver = false;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function stopGame() {
  gameOver = true;
}

window.addEventListener("load", comenzar, false);
window.addEventListener("blur", stopGame, false);
