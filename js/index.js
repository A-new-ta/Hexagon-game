'use strict'

import './game.js';





// предупреждение о потере данных
// function beforeUnload(EO) {
//     EO=EO||window.event;
//     if ( myModel.choiseArr.length != 0 ) // прописать какое то условие
//       EO.returnValue='При смене страницы данные не будут сохранены!';
//   };

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
    let addtoHTML = '';
    switch (spaState.pagename) {
        case 'Main':
            addtoHTML = `<div class="main__window">
            <div class="menu__option">
              <ul>
                <li class="menu__rules-button"><a href="#Rules">Rules</a></li>
                <li class="menu__records-button"><a href="#Records">Records</a></li>
              </ul>
            </div>
           <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              width="87.59px" height="99.306px" viewBox="0 0 87.59 99.306"  xml:space="preserve">
            <g>
              <path stroke="#777" stroke-miterlimit="10" d="M45.377,98.392c-0.953,0.55-2.513,0.552-3.467,0.005l-39.68-22.75c-0.954-0.547-1.732-1.895-1.729-2.995l0.139-45.739c0.003-1.1,0.785-2.45,1.738-3l39.837-23c0.953-0.55,2.513-0.552,3.467-0.005l39.68,22.75c0.954,0.547,1.732,1.895,1.729,2.995l-0.139,45.739c-0.003,1.1-0.785,2.45-1.738,3L45.377,98.392z"/>
            </g>
            </svg>
            <div class="menu__hexagon">HEXAGON</div>
            <div class="menu__entername">Enter your name</div>
            <input type="text" class="menu__name-input">
            <button class="menu__play-button"><a href="#Game">Play</a></button>
            <div class="menu__icons">
              <div class="github__icon"><a target="_blank" href="https://github.com/A-new-ta/"><img src="/images/github_icon.svg" alt="github"></a></div>
              <div class="sound__button"><img class="sound" src="/images/sound_on_icon.svg" alt="sound_on"><img class="sound hidden" src="/images/sound_off_icon.svg" alt=""></a></div>
            </div>
          </div>`;
            break;
        case 'Game':
            addtoHTML = `<div class="game__start">
            <div class="score"><h2>Score: <span id="score-value">0</span></h2></div>
            <canvas id='c'></canvas>
            <canvas id="game"></canvas>
            </div>`;
            break;
        case 'Rules':
            addtoHTML = `<div class="menu__rules">
            <div class="menu__rules-content">
              <p>The player can choose one of three pieces to add onto an empty board at a time, made up of several small tiles. Linking tiles in a line from one edge of the board to another will remove all the tiles in the completed line. The game ends when the player can no longer place anymore tiles.</p>
              <div class="menu__close-button"><a href="#">Close</a></div>
            </div>
          </div>`;
            break;
        case 'Records':
            addtoHTML = `<div class="menu__rules">
            <div class="menu__records-content">
              <p>1</p>
              <p>2</p>
              <p>3</p>
              <p>4</p>
              <p>5</p>
            <div class="menu__close-button"><a href="#">Close</a></div>
            </div>
          </div>`;
            break;
    }
    document.body.innerHTML = addtoHTML;
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
function switchToGamePage(photoId) {
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



const playButton = document.querySelector('.menu__play-button');
const soundButton = document.querySelector('.sound__button');
const rulesButton = document.querySelector('.menu__rules-button');
const recordsButton = document.querySelector('.menu__records-button');
const closeButton = document.querySelector('.menu__close-button');
const toogle = document.querySelector('.menu__mobile-toogle'); // для меню бургер
// слушатели всех событий
// для ресайзинга самой игры, написать когда-нибудь
// window.addEventListener('resize', resizeCanvas);
// изменение хэша урла
window.addEventListener('hashchange', switchToStateFromURLHash);  
// перезагрузка или закрытие страницы
// window.addEventListener('beforeunload', beforeUnload);
// для меню бургер
// toggle.addEventListener('click', mobileMenu);
// кнопка Play
playButton.addEventListener('click', switchToGamePage);
// playButton.addEventListener('tap', play, { passive: false });
// кнопка Rules
rulesButton.addEventListener('click', switchToRulesPage);
// кнопка Records
recordsButton.addEventListener('click', switchToRecordPage);
// кнопка вкл/выкл звук
// soundButton.addEventListener('click', sound);
// кнопка закрытия модального окна
closeButton.addEventListener('click', switchToMainPage);
// свайп окна
// window.addEventListener('touchstart', windowTouchStart, {passive: false});
// window.addEventListener('touchend', windowTouchEnd, {passive: false});
// window.addEventListener('touchmove', windowMove, { passive: false });



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



