'use strict';

import { nameText } from './index.js';
import {score} from './game.js'

// чтение таблицы рекордов с сервера
// function loadRecords() {
//     $.ajax({
//         url: ajaxHandlerScript,
//         type: 'POST', dataType: 'json',
//         data: {f: 'READ', n: stringName},
//         cache: false,
//         success: readReady,
//         error: errorHandler 
//     })
// }
// // даные загружены и готовы к показу
// function readReady(callresult) {
//     if (callresult.error !== undefined) {
//         alert(callresult.error);
//     } else {
//         dataRecords = JSON.parse(callresult.result);
//         showRecords(dataRecords);
//     }
// }
// // отображение таблицы рекордов
// function showRecords(dataRecords) {
//     let str = '';
//     let infoContent = document.querySelector('.info__content');
//     str += '<ol>';
//     for (let i = 0; i < dataRecords.length; i++) {
//         let dataRec = dataRecords[i];
//         str += '<li>' + dataRec.name + ': ' + dataRec.score + '<li/><br>';
//     }
//     str += '</ol>';
//     infoContent.innerHTML = str;
//     }

// function errorHandler(statusStr, errorStr) {
//     alert(statusStr + ' ' + errorStr);
// }



// обновление таблицы рекордов в конце игры
// export function saveRecords() {
//     let ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
//     let updatePassword;
//     let stringName='DAVLIUD_HEXAGONGAME_RECORDS';
//     updatePassword = Math.random();
//     $.ajax({
//         url: ajaxHandlerScript,
//         type: 'POST', dataType: 'json',
//         data: { f: 'LOCKGET', n: stringName, p: updatePassword },
//         cache: false,
//         success: lockGetReady,
//         error: errorHandler
//         })
    
// // добавление нового рекорда, если он больше существующих
// function lockGetReady(callresult) {
//     if ( callresult.error!=undefined ) {
//         alert(callresult.error);
//     }
//     else {
//       var recordsTable=JSON.parse(callresult.result);
//       recordsTable.sort(function(a, b) {
//         return b[1] - a[1];
//       })
//       if (recordsTable.length>=20) {
//         for (var i=0; i<recordsTable.length; i++) {
//           if (recordsTable[i][1]<score) {
//             var name=prompt('Поздравляем! Вы попали в таблицу рекордов! Введите ваше имя');
//             recordsTable.push([nameText, score]);
//             recordsTable.sort(function(a, b) {
//               return b[1] - a[1];
//             })
//             recordsTable=recordsTable.slice(0,20);
//             break;
//           }
//           if (i===recordsTable.length-1) {
//             alert('Игра окончена! К сожалению вы не попали в таблицу рекордов');
//           }     
//         }
//       }
//       else {
//         var name=prompt('Поздравляем! Вы попали в таблицу рекордов! Введите ваше имя');
//         recordsTable.push([nameText, score]);
//         recordsTable.sort(function(a, b) {
//           return b[1] - a[1];
//         })
//       }
//       $.ajax( {
//         url : ajaxHandlerScript, type: 'POST', cache: false, dataType:'json',
//         data : { f: 'UPDATE', n: stringName, v: JSON.stringify(recordsTable), p: updatePassword },
//         success : updateReady, error : errorHandler
//       }
//       );
//     }

//   }

//   function updateReady(callresult) {
//     if ( callresult.error!=undefined )
//         alert(callresult.error);
//   }

//   function errorHandler(jqXHR,statusStr,errorStr) {
//     alert(statusStr+' '+errorStr);
//   }

// }
    


var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
var updatePassword;
var stringName='DAVLIUD_HEXAGONGAME_RECORDS';

export function storeInfo() {
    updatePassword=Math.random();
    $.ajax( {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'LOCKGET', n : stringName, p : updatePassword },
            success : lockGetReady, error : errorHandler
        }
    );
}

function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        // нам всё равно, что было прочитано -
        // всё равно перезаписываем
        var info={
            name : nameText,
            scores : score
        };
        $.ajax( {
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'UPDATE', n : stringName, v : JSON.stringify(info), p : updatePassword },
                success : updateReady, error : errorHandler
            }
        );
    }
}

function updateReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
}

function restoreInfo() {
    $.ajax(
        {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'READ', n : stringName },
            success : readReady, error : errorHandler
        }
    );
}

function readReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else if ( callresult.result!="" ) {
        var info=JSON.parse(callresult.result);
        nameText=info.name;
        score=info.scores;
    }
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}

restoreInfo();







// export function pushRecordsToTable(nameText, score) {
//     dataRecords.push({ 'name': nameText, 'scores': score });
//     function compare(x, y) {
//         return y.scores - x.scores;
//     }
//     dataRecords.sort(compare);
//     if (dataRecords.length > 10) {
//         dataRecords = dataRecords.slice(0, 10);
//     }
//     $.ajax({
//         url: ajaxHandlerScript,
//         type: 'POST', dataType: 'json',
//         data: {
//             f: 'UPDATE', n: stringName,
//             v: JSON.stringify(dataRecords), p: updatePassword
//         },
//         cache: false,
//         success: updateReady,
//         error: errorHandler
//     }
//     )
// }

// function updateReady(callresult) {
//     if (callresult.error != undefined)
//         alert(callresult.error);
// }

// function errorHandler(statusStr, errorStr) {
//     alert(statusStr + ' ' + errorStr);
// }
