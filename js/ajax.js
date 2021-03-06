'use strict';
// чтение и занесение в таблицу новых рекордов

import { nameText } from './main.js';
import { score } from './game.js';


let ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
let updatePassword;
let stringName = 'DAVLIUD_HEXAGONGAME_RECORDS';
let recordsTable;

// чтение таблицы рекордов с сервера
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

function readReady(callresult) { 
    if ( callresult.error!=undefined )
        alert(callresult.error);
    else {
        recordsTable=[];
        if ( callresult.result!="" ) { 
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



// обновление таблицы в конце игры, если рекорд устаовлен
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
            if (callresult.result != '') {
                recordsTable = JSON.parse(callresult.result);
                console.log('callresult', callresult);
                console.log('recordsTable', recordsTable);
            }
    
            let lastRecord = recordsTable[recordsTable.length - 1];
            let lastHighScore = lastRecord.scores;
            if (score > lastHighScore || recordsTable.length < 10) {
            
                recordsTable.push({ name: nameText, scores: score });
                function compare(x, y) {
                    return y.scores - x.scores
                }
                recordsTable.sort(compare);
                if (recordsTable.length > 10) {
                    recordsTable = recordsTable.slice(0, 10);
                }
            }
            
            $.ajax({
                url: ajaxHandlerScript, type: 'POST', cache: false, dataType: 'json',
                data: { f: 'UPDATE', n: stringName, v: JSON.stringify(recordsTable), p: updatePassword },
                success: updateReady, error: errorHandler
            }
            );
        }

        function updateReady(callresult) {
            if ( callresult.error!=undefined )
                alert(callresult.error);
        }
        function errorHandler(jqXHR,statusStr,errorStr) {
            alert(statusStr+' '+errorStr);
        }
    }
}









