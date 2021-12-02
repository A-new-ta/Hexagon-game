'use strict';

import { nameText } from './index.js';
import {score} from './game.js'


let ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
let updatePassword;
let stringName = 'DAVLIUD_HEXAGONGAME_RECORDS';
let recordsTable;

// обновление таблицы рекордов в конце игры
export function refreshRecords() {
    $.ajax( {
        url : ajaxHandlerScript,
        type : 'POST', dataType:'json',
        data : { f : 'READ', n : stringName },
        cache : false,
        success : readReady,
        error : errorHandler
    }
);

}

function readReady(callresult) { // сообщения получены - показывает
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        recordsTable=[];
        if ( callresult.result!="" ) { // либо строка пустая - сообщений нет
            // либо в строке - JSON-представление массива сообщений
            recordsTable = JSON.parse(callresult.result);
            showRecords(recordsTable);
        }
    }
}

// отображение таблицы рекордов
function showRecords(recordsTable) {
    let str = '';
    let infoContent = document.querySelector('.info__content');
    str += '<ul>';
    for (let i = 0; i < recordsTable.length; i++) {
        let dataRecords = recordsTable[i];
        str += '<li>' + dataRecords.name + ': ' + dataRecords.scores + '<li/>';
    }
    str += '</ul>';
    infoContent.innerHTML = str;
    }
    function errorHandler(statusStr, errorStr) {
        alert(statusStr + ' ' + errorStr);
}

export function saveRecords() {
    
    updatePassword = Math.random();
    $.ajax({
        url: ajaxHandlerScript,
        type: 'POST', dataType: 'json',
        data: { f: 'LOCKGET', n: stringName, p: updatePassword },
        cache: false,
        success: lockGetReady,
        error: errorHandler
    })

    // добавление нового рекорда, если он больше существующих
    function lockGetReady(callresult) {
        if (callresult.error != undefined) {
            alert(callresult.error);
        }
        else {
            var recordsTable = [];
            console.log(callresult);
            if (callresult.result != '') {

                recordsTable = JSON.parse(callresult.result);
                console.log('callresult', callresult);
                
                console.log('recordsTable', recordsTable);
            }
    

            recordsTable.push({ name: nameText, scores: score });
            if (recordsTable.length > 10)
                recordsTable = recordsTable.slice(recordsTable.length - 10);
    
            // showRecords();
        
            $.ajax({
                url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
                data: { f: 'UPDATE', n: stringName, v: JSON.stringify(recordsTable), p: updatePassword },
                success: updateReady, error: errorHandler
            }
            );
            function updateReady(callresult) {
                if ( callresult.error!=undefined )
                    alert(callresult.error);
              }
            
              function errorHandler(jqXHR,statusStr,errorStr) {
                alert(statusStr+' '+errorStr);
              }
        }
    }
}


// function updateReady(callresult) {
//     if ( callresult.error!=undefined )
//         alert(callresult.error);
//   }

//   function errorHandler(jqXHR,statusStr,errorStr) {
//     alert(statusStr+' '+errorStr);
//   }

// refreshRecords();




