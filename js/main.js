'use strict'
// controller

import { getCanvasSize, start, resize } from './game.js'
import { refreshRecords } from './ajax.js';
import {addGameListeners, deleteGameListeners} from './game.js'


let startFlag = false;
let windowStartMoveY;
let windowEndMoveY;
let spaState = {};
let backGroundMusic;
let gameSound;
let gameOverSound;
let playerName = document.querySelector('.menu__name-input');
let nameText;
let soundFlag = false;
// location.hash = 'Main';
//изменение состояния в зависимости от хэша

// Переключение на УРЛ из Хэша
function switchToStateFromURLHash() {
    let toClose;
    let URLHash = window.location.hash;
    // убираем из закладки УРЛа решётку
    let stateStr = URLHash.substr(1);
    if (stateStr != "") { 
        spaState = { pagename: stateStr } // первая часть закладки - номер страницы
    } else {
        spaState = { pagename: 'Main' }  // иначе показываем главную страницу
    }
    console.log('Новое состояние приложения:');
    console.log(spaState);
    
    // обновляем вариабельную часть страницы под текущее состояние
    
    switch (spaState.pagename) {
        case 'Main':
            hideInfo();
            hideGame();
            let storName=window.localStorage.getItem('isName');
            if ( storName )
            playerName.value = storName;
            break;
        case 'Game':
            if (!startFlag) {
                startGame();
            }
            break;
        case 'Rules':
            showInfo('Rules');
            swipe();
            break;
        case 'Records':
            showInfo('Records');
            swipe();
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
        menuRules.style.animationDuration = '1.0s';
        menuRules.style.animationTimingFunction = 'ease-in-out';
        overlay.appendChild(menuRules);
        let menuContent = document.createElement('div');
        menuContent.className = 'menu__rules-content';
        menuRules.appendChild(menuContent);
        let infoContent = document.createElement('div');
        infoContent.className = 'info__content';
        menuContent.appendChild(infoContent);
        let closeButton = document.createElement('div');
        closeButton.className = 'menu__close-button';
        menuContent.appendChild(closeButton);
        let a = document.createElement('a');
        a.textContent = 'Close';
        closeButton.appendChild(a);
    }
    
// в зависимости нажатой кнопки, меняется содержимое
    switch (infoType) {
        case 'Rules':
            let infoRules = document.querySelector('.info__content');
            infoRules.textContent = 'The player can choose one of three pieces to add onto an empty board at a time, made up of several small tiles. Linking tiles in a line from one edge of the board to another will remove all the tiles in the completed line. The game ends when the player can no longer place anymore tiles.';
            break;
        
        case 'Records':
            refreshRecords();
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
        startFlag = false;
        deleteGameListeners();
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
    nameText = playerName.value;
    if (nameText == '') {
        nameText = 'player1';
    } 
    let text = document.createElement('h2');
    text.textContent = 'Score: ';
    score.appendChild(text);
    let value = document.createElement('span');
    value.setAttribute('id', 'score-value');
    value.textContent = '0';
    text.appendChild(value);
    let mainGame = document.createElement('canvas');
    mainGame.setAttribute('id', 'game');
    gameStart.appendChild(mainGame);
    let startPage = document.querySelector('.main__window');
    startPage.classList.add('hidden');
    startFlag = true;
    getCanvasSize();
    start();
    resize();
    addGameListeners();
    window.removeEventListener('touchstart', windowTouchStart, {passive: false});
    window.removeEventListener('touchend', windowTouchEnd, {passive: false});
    window.removeEventListener('touchmove', windowMove, { passive: false });

}


// устанавливает в закладке УРЛа новое состояние приложения, затем устанавливаем и отображаем это состояние

function switchToState(newState) {

let stateStr=newState.pagename;
location.hash = stateStr;
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

// слушатели всех событий
let menuRulesBlock = document.querySelector('.menu__rules');
let playButton = document.querySelector('.menu__play-button');
let soundButton = document.querySelector('.sound__button');
let rulesButton = document.querySelector('.menu__rules-button');
let recordsButton = document.querySelector('.menu__records-button');
let closeButton = document.querySelector('.menu__close-button');
let rulesButtonBurger = document.querySelector('.menu__rules-burger');
let recordsButtonBurger = document.querySelector('.menu__records-burger');


// изменение хэша урла
window.addEventListener('hashchange', switchToStateFromURLHash);

// для меню бургер
let menuMobile = document.querySelector('.menu__mobile');
let overlay = document.querySelector('.menu__burger');
menuMobile.addEventListener('click',function(){
  menuMobile.classList.toggle("close"); // this
  overlay.classList.toggle("overlayM");
});

// кнопка Play
playButton.addEventListener('click', switchToGamePage);
// кнопка Rules
rulesButton.addEventListener('click', switchToRulesPage);
rulesButtonBurger.addEventListener('click', switchToRulesPage);
// кнопка Records
recordsButton.addEventListener('click', switchToRecordPage);
recordsButtonBurger.addEventListener('click', switchToRecordPage);
// кнопка вкл/выкл звук
soundButton.addEventListener('click', soundOnOff);

// свайп окна, работает только на страницах rules и records
function swipe() {
window.addEventListener('touchstart', windowTouchStart, {passive: false});
window.addEventListener('touchend', windowTouchEnd, {passive: false});
window.addEventListener('touchmove', windowMove, { passive: false });
}

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
    if (spaState.pagename == 'Rules' || spaState.pagename == 'Records') {
        eo = eo || window.event
        eo.preventDefault();
    }
}

// фоновый звук
function loadMusic() {
    backGroundMusic = new Audio('sound/backsound.mp3');
    gameSound = new Audio('sound/sound.mp3');
    gameOverSound = new Audio('sound/gameover.mp3');
}
loadMusic();

export function clickSound() {
    gameSound.currentTime = 0;
    gameSound.play();
}
export function finishSound() {
    gameOverSound.currentTime = 0;
    gameOverSound.play();
}

function soundOnOff() {
    let soundCheck = document.querySelector('.sound').src;
    if (soundCheck === 'https://a-new-ta.github.io/Hexagon-game/images/sound_on_icon.svg') {
    // if (soundCheck === 'https://a-new-ta.github.io/Hexagon-game/images/sound_on_icon.svg') {
        document.querySelector('.sound').src = 'https://a-new-ta.github.io/Hexagon-game/images/sound_off_icon.svg';
        soundFlag = false;
        backGroundMusic.pause();
    }
    if (soundCheck === 'https://a-new-ta.github.io/Hexagon-game/images/sound_off_icon.svg') {
        document.querySelector('.sound').src = 'https://a-new-ta.github.io/Hexagon-game/images/sound_on_icon.svg';
        soundFlag = true;
        backGroundMusic.currentTime = 0;
        backGroundMusic.play();
    }
}

// реакция на закрытие и перезагрузку окна и уход со страницы
window.addEventListener('beforeunload', goodbye);
function goodbye(eo) {
    eo = eo || window.event;
    if (startFlag) {
        eo.returnValue = 'Game progress will be lost!';
    }
}

window.addEventListener('popstate', backspace);
function backspace(eo) {
    eo = eo || window.event;
    if (location.hash === '#Main' && startFlag) {
        console.log(startFlag);
        let conf = confirm('Game progress will be lost!');
        if (conf) {
            location.hash = '#Main';
        } else {
           location.hash = '#Game';
        }
    }
}

// всплывающее окно, когда игра заканчивается
export function showGameOverWindow() {
        startFlag = false;
        let mainWindow = document.body;
        let overlay = document.createElement('div');
        overlay.className = 'overlay';
        mainWindow.appendChild(overlay);
        let menuRules = document.createElement('div');
        menuRules.className = 'menu__rules';
        menuRules.style.animationName = 'info-show';
        menuRules.style.animationDuration = '1.0s';
        menuRules.style.animationTimingFunction = 'ease-in-out';
        overlay.appendChild(menuRules);
        let menuContent = document.createElement('div');
        menuContent.className = 'menu__rules-content';
        menuRules.appendChild(menuContent);
        let infoContent = document.createElement('div');
        infoContent.className = 'info__content_over';
        infoContent.textContent = 'Game over! No more moves!'
        menuContent.appendChild(infoContent);
        let closeButton = document.createElement('div');
        closeButton.className = 'menu__close-button';
        menuContent.appendChild(closeButton);
        let a = document.createElement('a');
        a.textContent = 'Main page';
        closeButton.appendChild(a);
        closeButton.addEventListener('click', switchToMainPage);
        // сохранения имени игрока в localstprage
        window.localStorage.setItem('isName', playerName.value);
        
}

export { nameText };
export { soundFlag };
