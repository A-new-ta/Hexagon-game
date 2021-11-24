'use strict'

// import './game.js';





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
    // let addtoHTML = '';
    switch (spaState.pagename) {
        case 'Main':
            hideInfo();
            break;
        // case 'Game':
        //     startGame();
        //     break;
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
        let wrapper = document.createElement('div');
        wrapper.className = 'wrapper';
        mainWindow.appendChild(wrapper);
        let menuRules = document.createElement('div');
        menuRules.className = 'menu__rules';
        // menuRules.style.position = 'absolute';
        // menuRules.style.top = '-1100px';
        // menuRules.style.left = '50%';
        // menuRules.style.width = 'auto';
        // menuRules.style.height = 'auto';
        // menuRules.style.maxWidth = '600px';
        // menuRules.style.maxHeight = '600px';
        // menuRules.style.backgroundColor = '#daddca';
        // menuRules.style.padding = '20px';
        // menuRules.style.zIndex = 10;

        menuRules.style.animationName = 'info-show';
        menuRules.style.animationDuration = '0.5s';
        
        // menuRules.style.animationTimingFunction = 'linear';
        // menuRules.style.animationFillMode = 'forwards';
        // menuRules.style.boxShadow = '0px 0px 30px #dbdada';
        // menuRules.style.borderRadius = '4vh';
        // menuRules.style.backgroundColor = 'rgb(97, 97, 97)';
        wrapper.appendChild(menuRules);
        let menuContent = document.createElement('div');
        menuContent.className = 'menu__rules-content';
        menuRules.appendChild(menuContent);
        let infoContent = document.createElement('p');
        infoContent.className = 'info__content';
        // infoContent.style.padding = '30px';
        // infoContent.style.textAlign = 'center';
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
        let menuRules = document.querySelector('.menu__rules');
        let mainWindow = document.body;
        mainWindow.removeChild(menuRules);
      }
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



