'use strict'

import Board from './board.js';
import Shape from './shape.js';
import { hexHelper } from './hex-helper.js';
import _, { values } from './underscore.js'
import { width } from './hex.js'
import { height } from './hex.js'



const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');
// export let width = canvas.width = 850;// ширина задется в модуле Hex
// let height = canvas.height = 800;

// пропорции положения боковых фигур относительно размера канваса
let firstHexX = width * 0.25; //0.76
let firstHexY = height * 0.875; //0.18
let secondHexX = width * 0.5; //0.82
let secondHexY = height * 0.875; //0.35
let thirdHexX = width * 0.75; // 0.76
let thirdHexY = height * 0.875; //0.53
let proportion = width * 0.1 // 

var score = 0;

var isMouseDown = false;
// var isTouch = false;
var board = new Board(ctx);

var shapeInHand = false;
var shapeFrom = "zero";

var mouseCoords = {};
// var touchCoords = {};

var shapesInWaiting = {
  first: new Shape(ctx),
  second: new Shape(ctx),
  third: new Shape(ctx)
}


// размеры контейнера когда срабатывает событие мыши при клике на фигуру
const shapesInWaitingBoxes = [
  {key: "first", bounds: [firstHexX - proportion, firstHexX + proportion, firstHexY - proportion, firstHexY + proportion]}, //600, 700, 100, 200
  {key: "second", bounds: [secondHexX - proportion, secondHexX + proportion, secondHexY - proportion, secondHexY + proportion]}, //600, 700, 250, 350
  {key: "third", bounds: [thirdHexX - proportion, thirdHexX + proportion, thirdHexY - proportion, thirdHexY + proportion]}, //600, 700, 400, 500
]

function drawShapesInWaiting() {
  shapesInWaiting.first.draw(firstHexX, firstHexY, .5); // координаты и размер для ожидающих фигур 650,150
  shapesInWaiting.second.draw(secondHexX, secondHexY, .5); // 700, 300
  shapesInWaiting.third.draw(thirdHexX, thirdHexY, .5); // 650, 450
}

function drawShapeInHand(){
  if(isMouseDown && shapeInHand) {
    shapeInHand.draw(mouseCoords.x, mouseCoords.y);
  }
}

function whichShapeDidYouPick() {
  return shapesInWaitingBoxes.reduce(function(shape, box) {
    var bounds = box.bounds;
    if(mouseCoords.x > bounds[0] && mouseCoords.x < bounds[1] && mouseCoords.y > bounds[2] && mouseCoords.y < bounds[3]){
      shape = shapesInWaiting[box.key];
      shapeFrom = box.key;
    }
    return shape;
  }, false)
}


// board.addRandomTiles();

requestAnimationFrame(function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.draw();
  board.drawPotentialSlots(mouseCoords, shapeInHand);
  drawShapesInWaiting();
  drawShapeInHand();
  requestAnimationFrame(gameLoop);
});


document.addEventListener('mousedown', function(eo) {
  mouseCoords = getMousePos(canvas, eo);
  isMouseDown = true;
  shapeInHand = whichShapeDidYouPick();
})

document.addEventListener('touchstart', function (eo) {
  // eo = eo || window.event;
  mouseCoords = getTouchPos(canvas, eo);
  isMouseDown = true;
  shapeInHand = whichShapeDidYouPick();
})

document.addEventListener('mouseup', mouseAndTouchEnd);
document.addEventListener('touchend', mouseAndTouchEnd);

function mouseAndTouchEnd(eo) {
  let pixels = hexHelper.subVector2(mouseCoords, hexHelper.boardOffset);
  if(shapeInHand && board.validDrop(pixels, shapeInHand)){
    board.addTilesFromShape(pixels, shapeInHand);
    shapesInWaiting[shapeFrom] = new Shape(ctx);
    score += board.removeFullLines();
    console.log("score:", score);
    document.getElementById("score-value").innerText = score;
    if(!board.movesRemaining(_.values(shapesInWaiting)))
      alert("Игра окончена! Ходов больше нет!");
  }
  isMouseDown = false;
  shapeInHand = false;
  // isTouch = false;
  // console.log(shapeInHand);
}

document.addEventListener('mousemove', function (eo) {
  if(isMouseDown){
    mouseCoords = getMousePos(canvas, eo);
  }
})

document.addEventListener('touchmove', function (eo) {
  if (isMouseDown) {
    mouseCoords = getTouchPos(canvas, eo);
  }
})
  

// window.addEventListener('resize', resize); // для изменения размера



function getMousePos(canvas, eo) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: eo.clientX - rect.left,
    y: eo.clientY - rect.top
  };
}

function getTouchPos(canvas, eo) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: eo.touches[0].clientX - rect.left,
    y: eo.touches[0].clientY - rect.top
  };
}

// не перерисовывает доску с фигурами
// window.addEventListener('resize', function (eo) {
//   if (window.innerWidth < 800) {
//     canvas.width = window.innerWidth;
//     let firstHexX = canvas.width * 0.25; //0.76
//     let firstHexY = canvas.height * 0.875; //0.18
//     let secondHexX = canvas.width * 0.5; //0.82
//     let secondHexY = canvas.height * 0.875; //0.35
//     let thirdHexX = canvas.width * 0.75; // 0.76
//     let thirdHexY = canvas.height * 0.875; //0.53
//     let proportion = canvas.width * 0.1 // 
//         // canvas.height = window.innerHeight;
//         shapesInWaiting.first.draw(firstHexX, firstHexY, .5); // координаты и размер для ожидающих фигур 650,150
//         shapesInWaiting.second.draw(secondHexX, secondHexY, .5); // 700, 300
//         shapesInWaiting.third.draw(thirdHexX, thirdHexY, .5); // 650, 450
//         const shapesInWaitingBoxes = [
//           {key: "first", bounds: [firstHexX - proportion, firstHexX + proportion, firstHexY - proportion, firstHexY + proportion]}, //600, 700, 100, 200
//           {key: "second", bounds: [secondHexX - proportion, secondHexX + proportion, secondHexY - proportion, secondHexY + proportion]}, //600, 700, 250, 350
//           {key: "third", bounds: [thirdHexX - proportion, thirdHexX + proportion, thirdHexY - proportion, thirdHexY + proportion]}, //600, 700, 400, 500
//     ]
//     whichShapeDidYouPick();
    
    
//   }
// })

