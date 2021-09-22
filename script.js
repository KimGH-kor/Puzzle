const containar = document.querySelector(".image-container");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const playTime = document.querySelector(".play-time");

const tileCount = 16;

let tiles = [];
const dragged = {
  el: null,
  class: null,
  index: null
}
let isPlaying = false;
let timeInterval = null;
let time = 0


//function
function checkStatus() {
  const currentList = [...containar.children];
  const unMatchedList = currentList.filter((child, index) =>
    Number(child.getAttribute("data-index")) !== index)
  if (unMatchedList.length === 0) {
    gameText.style.display = "block";
    isPlaying = false;
    clearInterval(timeInterval);
  }
}
function set() {
  tiles = createImageTiles();
  tiles.forEach(tile => containar.appendChild(tile))
}
set();
function setGame() {
  isPlaying = true;
  time = 0;
  containar.innerHTML = "";
  gameText.style.display = "none";
  clearInterval(timeInterval);
  timeInterval = setInterval(() => {
    playTime.innerText = time;
    time++
  }, 1000)

  tiles = createImageTiles();
  tiles.forEach(tile => containar.appendChild(tile))

  // 2초뒤에 시작하게 만들기( 이부분을 스타트 누르면 바뀌게)
  setTimeout(() => {
    containar.innerHTML = "";
    shuffle(tiles).forEach(tile => containar.appendChild(tile))
  })
}

// 배열 16개 만들기
function createImageTiles() {
  const tempArray = [];
  Array(tileCount).fill().forEach((_, i) => {
    const li = document.createElement("li");
    li.setAttribute('data-index', i);
    li.setAttribute('draggable', 'true');
    li.classList.add('list' + i);
    tempArray.push(li);
  })
  return tempArray;
}


function shuffle(array) {
  let index = array.length - 1;
  while (index > 0) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]]
    index--;
  }
  return array;
}


//events
containar.addEventListener('dragstart', (e) => {
  if (!isPlaying) return;
  const obj = e.target;
  dragged.el = obj;
  dragged.class = obj.className;
  dragged.index = [...obj.parentNode.children].indexOf(e.target)

})

containar.addEventListener('dragover', (e) => {
  e.preventDefault()
})

containar.addEventListener('drop', (e) => {
  if (!isPlaying) return;
  const obj = e.target;

  let originPlace;
  let isLast = false;

  if (obj.className !== dragged.class) {

    if (dragged.el.nextSibling) {
      originPlace = dragged.el.nextSibling;
    } else {
      originPlace = dragged.el.previousSibling;
      isLast = true;
    }
    const droppedIndex = [...obj.parentNode.children].indexOf(obj);
    dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el);
    isLast ? originPlace.after(obj) : originPlace.before(obj);
  }
  checkStatus();
})

startButton.addEventListener('click', () => {
  setGame();
})