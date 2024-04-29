const GAME_NODE = document.querySelector("#game_board");
const VICTORY_TEXT = document.querySelector("#victory_message");
const START_GAME_BUTTON = document.querySelector("#new_game_button");

const VISIBLE_CARD_CLASSNAME = "visible";

const CARD_FLIP_TIMEOUT_MS = 500;

// Rutas de las imágenes de las cartas
const naruto = "/img/naruto.png";
const itachi = "/img/itachi.png";
const kakashi = "/img/kakashi.png";
const pain = "/img/pain.png";
const sasuke = "/img/sasuke.png";
const shikamaru = "/img/shikamaru.png"; // Corregido el nombre de la variable

// Array de rutas de las imágenes de las cartas
const CARD_ELEMENTS = [naruto, itachi, kakashi, pain, sasuke, shikamaru];

//Cantidad de cartas
const CARD_AMOUNT = 12;

//cartas visibles
let VISIBLE_CARDS = [];

//Evento de incio
START_GAME_BUTTON.addEventListener("click", startGame);

//Metodo para iniciar partida
function startGame() {
  
  //A cada elemento se asigna cadena vacia  
  [GAME_NODE, VICTORY_TEXT].forEach((node) => (node.innerHTML = ""));

  //Generar cartas
  const CARD_VALUES = generateArray(CARD_ELEMENTS, CARD_AMOUNT);
  console.log(CARD_VALUES);
  
  //Pintar cartas
  CARD_VALUES.forEach(renderCard);

  //Celeccionar todas cartas
  const renderedCards = document.querySelectorAll(".card");

  //mostrar cada carta
  renderedCards.forEach(card => card.classList.add(VISIBLE_CARD_CLASSNAME));

  //ocultar cada carta tras 2 segundos
  setTimeout(()=>{
    renderedCards.forEach(card => card.classList.remove(VISIBLE_CARD_CLASSNAME));
  },2000);

}

//Metodo para generar cartas
//Recibe conedio de las cartas y candidad que debe tener array
function generateArray(contents, cardAmount) {

    //array relleno
  const randomArray = [];
  const elementCounts = {};

  for (const content of contents) {
    elementCounts[content] = 0;
  }

  //Hasta que array se rellene
  while (randomArray.length < cardAmount) {
    //generar index aleatorio para array de imagenes
    const randomIndex = Math.floor(Math.random() * contents.length);
    //asignar imagen con index aleatorio  a una variable
    const randomElement = contents[randomIndex];

    //si hay NO hay 2 iamgenes iguales subir esta imagen a array relleno
    if (elementCounts[randomElement] < 2) {
      randomArray.push(randomElement);
      elementCounts[randomElement]++;
    }
  }
  return randomArray;
}

//Pintar cartas
function renderCard(content) {

  //Crear contenedores para cartas  
  const card = document.createElement("div");
  card.classList.add("card");

  const cardInner = document.createElement("div");
  cardInner.classList.add("card_inner");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card_front");

  const cardBack = document.createElement("div");
  cardBack.classList.add("card_back");

  //contenido de contenedores
  cardFront.textContent = "?";
  cardBack.style.backgroundImage = `url('${content}')`;
  cardBack.style.backgroundSize = "cover";

  //Asignar elementos hijos a elementos padre
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);

  card.appendChild(cardInner);

  //A cada elemento añador evento click
  card.addEventListener("click", () => {
    handleCardClick(card);
  });

  GAME_NODE.appendChild(card);
}


//Funcion de click
function handleCardClick(card) {

    //Si la carta esta visible no se realiza ningun calculo
  if (card.classList.contains(VISIBLE_CARD_CLASSNAME)) {
    return;
  }

   //Comprobar victoria   
   //Si cada carta esta visible se gano
  const checkVictory = ()=>{
    const visibleCardNodes = document.querySelectorAll(`.visible`);
    const isVictory = visibleCardNodes.length === CARD_AMOUNT; 

    const victoryMessage = "¡Has ganado!";

    if(isVictory){

        VICTORY_TEXT.textContent = victoryMessage;
    }
  }

  //Cuando acaba la transicion CSS se invoca la funcion checkVIctory
  card.querySelector(".card_inner").addEventListener("transitionend",checkVictory);

  card.classList.add(VISIBLE_CARD_CLASSNAME);

  VISIBLE_CARDS.push(card);

  if (VISIBLE_CARDS.length % 2 !== 0) {
    return;
  }

  const [prelastCard, lastCard] = VISIBLE_CARDS.slice(-2);

  const prelastCardImage =
    prelastCard.querySelector(".card_back").style.backgroundImage;
  const lastCardImage =
    lastCard.querySelector(".card_back").style.backgroundImage;

  if (lastCardImage !== prelastCardImage) {
    VISIBLE_CARDS = VISIBLE_CARDS.slice(0, VISIBLE_CARDS.length - 2);

    setTimeout(() => {
      lastCard.classList.remove(VISIBLE_CARD_CLASSNAME);
      prelastCard.classList.remove(VISIBLE_CARD_CLASSNAME);
    }, CARD_FLIP_TIMEOUT_MS);
  }
}

startGame();
