 

 //board dates

let board; //lienzo
const BOARD_HEIGHT = 700;
const BOARD_WIDTH = 700;
let context;
let move_direction; //direccion de movimiento


//snake arrat

let big_snake = [];

//snake dates

const SNAKE_HEIGHT = 20;
const SNAKE_WIDTH = 20;

let snake_pos_x =  (BOARD_WIDTH - SNAKE_WIDTH) / 2;
let snake_pos_y =  (BOARD_HEIGHT - SNAKE_WIDTH) / 2;


//apple dates

const APPLE_HEIGHT = 20;
const APPLE_WIDTH = 20;

let apple_pos_x = Math.floor(Math.random() * (BOARD_WIDTH / APPLE_WIDTH)) * APPLE_WIDTH;
let apple_pos_y = Math.floor(Math.random() * (BOARD_HEIGHT / APPLE_HEIGHT)) * APPLE_HEIGHT;

//physics

let velosity = 4;


//score

let score = 0;
let gameOver = false;

//snake object

let snake = {

    x : snake_pos_x,
    y : snake_pos_y,
    height : SNAKE_HEIGHT,
    width : SNAKE_WIDTH,
    move_direction : "top"
}


//apple object

let apple = {

    x : apple_pos_x,
    y : apple_pos_y,
    height : APPLE_HEIGHT,
    width : APPLE_WIDTH
}

function comenzar(){

    board = document.getElementById("board"); // lienzo
    board.height = BOARD_HEIGHT; 
    board.width = BOARD_WIDTH;
  
    context = board.getContext("2d");

    big_snake.push(snake);


    context.fillStyle = "green"; // Cambié el color de la serpiente a verde
    context.fillRect(snake.x, snake.y, snake.width, snake.height);

    context.fillStyle = "red"; // Cambié el color de la manzana a rojo
    context.fillRect(apple.x, apple.y, apple.width, apple.height);
    

    document.addEventListener('keydown', function(event) {
        let new_direction;
        switch(event.key) {
            case 'ArrowUp':
                new_direction = "top";
                break;
            case 'ArrowDown':
                new_direction = "bottom";
                break;
            case 'ArrowLeft':
                new_direction = "left";
                break;
            case 'ArrowRight':
                new_direction = "right";
                break;
            default:
                return; // Si la tecla no es una flecha, salimos de la función
        }
    
        // Comprobamos si la nueva dirección es opuesta a la dirección actual
        if ((new_direction === "top" && big_snake[0].move_direction === "bottom") ||
            (new_direction === "bottom" && big_snake[0].move_direction === "top") ||
            (new_direction === "left" && big_snake[0].move_direction === "right") ||
            (new_direction === "right" && big_snake[0].move_direction === "left")) {
            return; // No hacemos nada si la dirección es opuesta
        }
    
        // Actualizamos la dirección de movimiento de todas las partes de la serpiente
        for(let i = 0; i < big_snake.length; i++) {
            big_snake[i].move_direction = new_direction;
        }
    });


    requestAnimationFrame(update);

}


function update(){
    requestAnimationFrame(update);

    if (gameOver) {
        var text = "GAME OVER";
        var textWidth = context.measureText(text).width;
        context.fillText(text, (BOARD_WIDTH - textWidth) / 2, 110);
        return;
      }

    context.clearRect(0, 0, board.width, board.height);

    // Mover la cola de la serpiente a la posición del segmento anterior
    for (let i = big_snake.length - 1; i > 0; i--) {
        big_snake[i].x = big_snake[i - 1].x;
        big_snake[i].y = big_snake[i - 1].y;
    }

    // Mover la cabeza de la serpiente en la dirección deseada
    switch (big_snake[0].move_direction) {
        case 'top':
            big_snake[0].y -= velosity;
            break;
        case 'bottom':
            big_snake[0].y += velosity;
            break;
        case 'left':
            big_snake[0].x -= velosity;
            break;
        case 'right':
            big_snake[0].x += velosity;
            break;
        default:
    }

    border_collision(big_snake[0]);

    context.fillStyle = "red";
    context.fillRect(apple.x, apple.y, apple.width, apple.height);

    context.fillStyle = "green";
    for (let i = 0; i < big_snake.length; i++) {
        context.fillRect(big_snake[i].x, big_snake[i].y, big_snake[i].width, big_snake[i].height);
    }

    if (detectCollision(big_snake[0], apple)) {
        score += 1;
        apple.x = Math.floor(Math.random() * (BOARD_WIDTH / APPLE_WIDTH)) * APPLE_WIDTH;
        apple.y = Math.floor(Math.random() * (BOARD_HEIGHT / APPLE_HEIGHT)) * APPLE_HEIGHT;

        // Crecer la serpiente al comer la manzana
        let tail = big_snake[big_snake.length - 1];
        let new_part = {
            x: tail.x,
            y: tail.y,
            height: tail.height,
            width: tail.width,
            move_direction: tail.move_direction
        };
        big_snake.push(new_part);
    }

      // Comprobar colisión con la cola
      for (let i = 10; i < big_snake.length; i++) {
        if (detectCollisionSnake(big_snake[0], big_snake[i])) {
            gameOver = true;
            break;
        }
    }
 

    // Score
    context.fillStyle = "black";
    context.font = "45px sans-serif";
    var text = score.toString(); // convert score to string
    context.fillText(text, 10, 45);
}




function border_collision(snake){

    if (snake.y + snake.height >= BOARD_HEIGHT) {
        snake.y = 0;
    } else if (snake.y < 0) {
        snake.y = BOARD_HEIGHT - snake.height;
    }

    if (snake.x + snake.width >= BOARD_WIDTH) {
        snake.x = 0;
    } else if (snake.x < 0) {
        snake.x = BOARD_WIDTH - snake.width;
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

  function detectCollisionSnake(head, segment) {
    // Solo consideramos la parte inferior de la cabeza para la colisión
    // Si la parte inferior de la cabeza colisiona con un segmento de la cola,
    // entonces consideramos que hay colisión
    return (
      head.x < segment.x + segment.width &&
      head.x + head.width > segment.x &&
      head.y + head.height > segment.y && // Solo la parte inferior de la cabeza
      head.y + (head.height / 2) < segment.y
    );
}





window.addEventListener("load",comenzar,false);