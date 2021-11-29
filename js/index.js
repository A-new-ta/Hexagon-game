'use strict'

import { getCanvasSize,  listeners, start } from './game.js'

// предупреждение о потере данных
// function beforeUnload(EO) {
//     EO=EO||window.event;
//     if ( myModel.choiseArr.length != 0 ) // прописать какое то условие
//       EO.returnValue='При смене страницы данные не будут сохранены!';
//   };
let windowStartMoveY;
let windowEndMoveY;
let spaState = {};
//изменение состояния в зависимости от хэша

// Переключение на УРЛ из Хэша
function switchToStateFromURLHash() {
    let URLHash = window.location.hash;
    // убираем из закладки УРЛа решётку
    let stateStr = URLHash.substr(1);
    if (stateStr != "") { // если закладка непустая, читаем из неё состояние и отображаем
        spaState = { pagename: stateStr } // первая часть закладки - номер страницы
    } else {
        spaState = { pagename: 'Main' }  // иначе показываем главную страницу
    }
    console.log('Новое состояние приложения:');
    console.log(spaState);
    
    // обновляем вариабельную часть страницы под текущее состояние
    // let addtoHTML = '';
    switch (spaState.pagename) {
        case 'Main':
            hideInfo();
            hideGame();
            break;
        case 'Game':
            startGame();
            break;
        case 'Rules':
            showInfo('Rules');
            break;
        case 'Records':
            showInfo('Records');
            break;
    }
    if (document.querySelector('.menu__close-button')) {
        let closeButton = document.querySelector('.menu__close-button');
        closeButton.addEventListener('click', switchToMainPage);
    }
}

function showInfo(infoType) {
    
    if (!document.querySelector('.menu__rules')) {

        let mainWindow = document.body;
        let overlay = document.createElement('div');
        overlay.className = 'overlay';
        mainWindow.appendChild(overlay);
        let menuRules = document.createElement('div');
        menuRules.className = 'menu__rules';
        menuRules.style.animationName = 'info-show';
        menuRules.style.animationDuration = '0.5s';
        // menuRules.style.transform = 'translate(-50%, 0)';
        overlay.appendChild(menuRules);
        let menuContent = document.createElement('div');
        menuContent.className = 'menu__rules-content';
        menuRules.appendChild(menuContent);
        let infoContent = document.createElement('p');
        infoContent.className = 'info__content';
        menuContent.appendChild(infoContent);
        let closeButton = document.createElement('div');
        closeButton.className = 'menu__close-button';
        menuContent.appendChild(closeButton);
        let a = document.createElement('a');
        a.textContent = 'Close';
        closeButton.appendChild(a);
    }
    
// в зависимости нажатой кнопки, будем менять содержимое
    switch (infoType) {
        case 'Rules':
            let infoRules = document.querySelector('.info__content');
            infoRules.textContent = 'The player can choose one of three pieces to add onto an empty board at a time, made up of several small tiles. Linking tiles in a line from one edge of the board to another will remove all the tiles in the completed line. The game ends when the player can no longer place anymore tiles.';
            break;
        
        case 'Records':
            let infoRecords = document.querySelector('.info__content');
            infoRecords.textContent = 'таблица рекордов подгруженная из AJAX';
            break;
    }
}

function hideInfo() {
    if (document.querySelector('.menu__rules')) {
        let menuRules = document.querySelector('.menu__rules');
        menuRules.style.animationName='info-hide';
        menuRules.style.animationDuration='0.5s';
        menuRules.style.animationTimingFunction='linear';
        menuRules.style.animationFillMode='forwards';
        setTimeout(removeInfo, 500);
      }
      function removeInfo() {    
        let overlay = document.querySelector('.overlay');
        let mainWindow = document.body;
        mainWindow.removeChild(overlay);
      }
}

function hideGame() {
    if (document.querySelector('.game__start')) {
        let gameStart = document.querySelector('.game__start');
        let mainWindow = document.body;
        mainWindow.removeChild(gameStart);
        let startPage = document.querySelector('.main__window');
        startPage.classList.remove('hidden');
    }
}

function startGame() {
    let mainWindow = document.body;
    let gameStart = document.createElement('div');
    gameStart.className = 'game__start';
    mainWindow.appendChild(gameStart);
    let score = document.createElement('div');
    score.className = 'score';
    gameStart.appendChild(score);
    let text = document.createElement('h2');
    text.textContent = 'Score';
    score.appendChild(text);
    let value = document.createElement('span');
    value.setAttribute('id', 'score-value');
    value.textContent = '0';
    text.appendChild(value);
    let background = document.createElement('canvas');
    background.setAttribute('id', 'c');
    gameStart.appendChild(background);
    let mainGame = document.createElement('canvas');
    mainGame.setAttribute('id', 'game');
    gameStart.appendChild(mainGame);
    let startPage = document.querySelector('.main__window');
    startPage.classList.add('hidden');
    console.log(startPage.className);
    getCanvasSize();
    start();
    listeners();
}





// устанавливает в закладке УРЛа новое состояние приложения
// и затем устанавливает+отображает это состояние
function switchToState(newState) {
// устанавливаем закладку УРЛа
// нужно для правильной работы кнопок навигации браузера
// (т.к. записывается новый элемент истории просмотренных страниц)
// и для возможности передачи УРЛа другим лицам
let stateStr=newState.pagename;
location.hash = stateStr;
// АВТОМАТИЧЕСКИ вызовется switchToStateFromURLHash()
// т.к. закладка УРЛа изменилась (ЕСЛИ она действительно изменилась)
};

function switchToMainPage() {
    switchToState({ pagename: 'Main' });
}
function switchToGamePage() {
    switchToState({ pagename: 'Game' });
}
function switchToRulesPage() {
    switchToState({ pagename: 'Rules' });
}
function switchToRecordPage() {
    switchToState({ pagename: 'Records' });
}

// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
switchToStateFromURLHash();


let menuRulesBlock = document.querySelector('.menu__rules');
let playButton = document.querySelector('.menu__play-button');
let soundButton = document.querySelector('.sound__button');
let rulesButton = document.querySelector('.menu__rules-button');
let recordsButton = document.querySelector('.menu__records-button');
let closeButton = document.querySelector('.menu__close-button');
let rulesButtonBurger = document.querySelector('.menu__rules-burger');
let recordsButtonBurger = document.querySelector('.menu__records-burger');
// слушатели всех событий
// для ресайзинга самой игры, написать когда-нибудь
// window.addEventListener('resize', resizeCanvas);
// изменение хэша урла
window.addEventListener('hashchange', switchToStateFromURLHash);
// перезагрузка или закрытие страницы
// window.addEventListener('beforeunload', beforeUnload);

// для меню бургер
let menuMobile = document.querySelector('.menu__mobile');
let overlay = document.querySelector('.menu__burger');
menuMobile.addEventListener('click',function(){
  menuMobile.classList.toggle("close"); // this
  overlay.classList.toggle("overlayM");
});

// кнопка Play
playButton.addEventListener('click', switchToGamePage);
// playButton.addEventListener('tap', play, { passive: false });
// кнопка Rules
rulesButton.addEventListener('click', switchToRulesPage);
rulesButtonBurger.addEventListener('click', switchToRulesPage);
// кнопка Records
recordsButton.addEventListener('click', switchToRecordPage);
recordsButtonBurger.addEventListener('click', switchToRecordPage);
// кнопка вкл/выкл звук
// soundButton.addEventListener('click', sound);
// кнопка закрытия модального окна

// свайп окна дописать чтобы работал только выпадающем меню
window.addEventListener('touchstart', windowTouchStart, {passive: false});
window.addEventListener('touchend', windowTouchEnd, {passive: false});
window.addEventListener('touchmove', windowMove, { passive: false });

function windowTouchStart(eo) {
    if (spaState.pagename == 'Rules' || spaState.pagename == 'Records') {
        let touches = eo.changedTouches;
        windowStartMoveY = touches[0].pageY;
    }
}

function windowTouchEnd(eo) {
    let touches = eo.changedTouches;
    windowEndMoveY = touches[0].pageY;
    if ((windowStartMoveY - windowEndMoveY) > 150 ) {
        switchToMainPage();
    }
}
       
function windowMove(eo) {
    eo = eo || window.event
    eo.preventDefault();
}


// let button = document.querySelector('.play__game-button');
// button.addEventListener('click', start);

// function start() {
//   let playerName = document.querySelector('.text__input');
//   if (playerName) {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     canvas.id = 'game';
//     }
//     requestAnimationFrame(function gameLoop() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         board.draw();
//         board.drawPotentialSlots(mouseCoords, shapeInHand);
//         drawShapesInWaiting();
//         drawShapeInHand();
//         requestAnimationFrame(gameLoop);
//       });
// }

// let width = canvas.width;
// let height = canvas.height;

// if (window.innerWidth < 1000) {
//   width = canvas.width = window.innerWidth - 20;
// } else {
//   width = canvas.width = 1000;
// }
// if (window.innerHeight < 1080) {
//     height = canvas.height = window.innerHeight - 300;
// } else {
//   height = canvas.height = 1080;
// }

// export { width };
// export { height };

// const canvas = document.getElementById("game");


