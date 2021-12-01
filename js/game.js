'use strict'

import Board from './board.js';
import Shape from './shape.js';
import { hexHelperF } from './hexhelper.js';
import _, { values } from './underscore.js'
import { finishSound, showGameOverWindow } from './index.js';


let canvas;
let ctx;
let width;
let height;
let firstHexX;
let firstHexY;
let secondHexX;
let secondHexY;
let thirdHexX;
let thirdHexY;
let proportion1;
let proportion2;
let board;
let mouseCoords;
let score;
let isMouseDown;
let shapeInHand;
let shapeFrom;
let shapesInWaiting;
let shapesInWaitingBoxes;

export function getCanvasSize() {
  canvas = document.getElementById("game");
  ctx = canvas.getContext('2d')
width = canvas.width;
height = canvas.height;
if (window.innerWidth < 800) {
  width = canvas.width = window.innerWidth - 20;
} else {
  width = canvas.width = 800;
}
if (window.innerHeight < 800) {
    height = canvas.height = window.innerHeight - 300;
} else {
  height = canvas.height = 800;
}
// пропорции положения боковых фигур относительно размера канваса
firstHexX = width * 0.25; //0.76
firstHexY = height * 0.9 //0.18
secondHexX = width * 0.5; //0.82
secondHexY = height * 0.9; //0.35
thirdHexX = width * 0.75; // 0.76
thirdHexY = height * 0.9; //0.53
proportion1 = width * 0.05 // 
proportion2 = width * 0.1 // 
score = 0;
isMouseDown = false;
// var isTouch = false;
board = new Board(ctx);
shapeInHand = false;
shapeFrom = "zero";
mouseCoords = {};
// var touchCoords = {};
shapesInWaiting = {
  first: new Shape(ctx),
  second: new Shape(ctx),
  third: new Shape(ctx)
  }
  
shapesInWaitingBoxes = [
  {key: "first", bounds: [firstHexX - proportion2, firstHexX + proportion1, firstHexY - proportion2, firstHexY + proportion1]}, //600, 700, 100, 200
  {key: "second", bounds: [secondHexX - proportion2, secondHexX + proportion1, secondHexY - proportion2, secondHexY + proportion1]}, //600, 700, 250, 350
  {key: "third", bounds: [thirdHexX - proportion2, thirdHexX + proportion1, thirdHexY - proportion2, thirdHexY + proportion1]}, //600, 700, 400, 500
  ]
}



function drawShapesInWaiting() {
  shapesInWaiting.first.draw(firstHexX, firstHexY, .5); // координаты и размер для ожидающих фигур 650,150
  shapesInWaiting.second.draw(secondHexX, secondHexY, .5); // 700, 300
  shapesInWaiting.third.draw(thirdHexX, thirdHexY, .5); // 650, 450
}

// увеличение фигур при нажатии мышью или тачем
function drawShapeInHand(){
  if(isMouseDown && shapeInHand) {
    shapeInHand.drawScale(mouseCoords.x, mouseCoords.y);
  }
}


// проверяем какая фигура взята
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
export function start (){
requestAnimationFrame(function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.draw();
  board.drawPotentialSlots(mouseCoords, shapeInHand);
  drawShapesInWaiting();
  drawShapeInHand();
  requestAnimationFrame(gameLoop);
});
}
// start();

export function listeners() {

    document.addEventListener('mousedown', function (eo) {
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
  
}


function mouseAndTouchEnd(eo) {
  let helper = hexHelperF();
  let pixels = helper.subVector2(mouseCoords, helper.boardOffset);
  if(shapeInHand && board.validDrop(pixels, shapeInHand)){
    board.addTilesFromShape(pixels, shapeInHand);
    shapesInWaiting[shapeFrom] = new Shape(ctx);
    score += board.removeFullLines();
     
    document.getElementById("score-value").innerText = score;
    
    if (!board.movesRemaining(_.values(shapesInWaiting))) {
      finishSound();
      showGameOverWindow();
      console.log(score);
    }
    
  }
  isMouseDown = false;
  shapeInHand = false;
  // isTouch = false;
  // console.log(shapeInHand);
}

// document.addEventListener('mousemove', function (eo) {
//   if(isMouseDown){
//     mouseCoords = getMousePos(canvas, eo);
//   }
// })

// document.addEventListener('touchmove', function (eo) {
//   if (isMouseDown) {
//     mouseCoords = getTouchPos(canvas, eo);
//   }
// })
  

// window.addEventListener('resize', resize); // для изменения размера

function getMousePos(canvas, eo) {
  var rect = canvas.getBoundingClientRect();
  // console.log(canvas);
  return {
    x: eo.clientX - rect.left,
    y: eo.clientY - rect.top
  };
}

// сделала по Y меньше чтобы при таче была видна фигура 
function getTouchPos(canvas, eo) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: eo.touches[0].clientX - rect.left,
    y: eo.touches[0].clientY - rect.top - 50,
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

export { width };
export { height };