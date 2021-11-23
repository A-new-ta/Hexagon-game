'use strict'

import './game.js';

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
// playButton.addEventListener('click', play);
// playButton.addEventListener('tap', play, { passive: false });
// кнопка Rules
rulesButton.addEventListener('click', showRules);
// кнопка Records
recordsButton.addEventListener('click', showRecords);
// кнопка вкл/выкл звук
soundButton.addEventListener('click', sound);
// кнопка закрытия модального окна
closeButton.addEventListener('click', closeModal);
// свайп окна
// window.addEventListener('touchstart', windowTouchStart, {passive: false});
// window.addEventListener('touchend', windowTouchEnd, {passive: false});
// window.addEventListener('touchmove', windowMove, { passive: false });

// function beforeUnload(eo) {

//     eo.returnValue = 'Несохраненные данные будут утеряны'
// }

function switchToStateFromURLHash() {     //Переключение на УРЛ из Хэша
    let URLHash = window.location.hash,
        stateStr = URLHash.substr(1)    // убираем из закладки УРЛа решётку
    if (stateStr != "") {
        var parts=stateStr.split("_") // если закладка непустая, читаем из неё состояние и отображаем
        spaState = {pagename: stateStr} // первая часть закладки - номер страницы
    } else {
        spaState = {pagename: ''}  // иначе показываем главную страницу
    }
    spaStateChanged();
}

switchToState = function (newState) {   //Изменение хэша страницы
    let stateStr = newState.pagename;
    location.hash = stateStr;
}

function showRules () {                  //Переключение на страницы SPA
    switchToState({pagename: 'Rules'});
}

showMain = function () {
    switchToState({pagename: ''});
}

showHighScore = function () {
    switchToState({pagename: 'Records'});
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



