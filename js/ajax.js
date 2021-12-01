'use strict'

// let ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";

// function read() {

//   // отдельно создаём набор POST-параметров запроса
//   let sp = new URLSearchParams();
//   sp.append('f', 'READ');
//   sp.append('n', 'DANKOV_GAME');

//   // когда получим данные, вызовем функцию addArrScore 
//   fetch(ajaxHandlerScript, { method: 'post', body: sp })
//     .then(response => response.json())
//     .then(data => { addArrScore(data); })
//     .catch(error => { console.error(error); });
// }


// function addArrScore(arr) {

//   // находим контейнер для таблицы
//   let arrWrapper = document.querySelector(".tableWrapper");

//   if (arrWrapper.children.length > 1) {
//     while (arrWrapper.children.length !== 1) {
//       arrWrapper.removeChild(arrWrapper.lastChild);
//     }
//   }

//   // если строка не пустая создаем таблицу и заполняем ее
//   if (arr.result !== "") {

//     let newArr = JSON.parse(arr.result);

//     let table = document.createElement("table");
//     table.style.margin = "auto";
//     table.style.borderSpacing = "1vh 1vw";

//     let tableBody = document.createElement("tbody");
//     table.appendChild(tableBody);

//     for (let i = 0; i < newArr.length; i++) {

//       let tr = document.createElement("tr");
//       tableBody.appendChild(tr);

//       let tdNumber = document.createElement("td");
//       tdNumber.innerText = i + 1;
//       tr.appendChild(tdNumber);
//       let tdName = document.createElement("td");
//       tdName.innerText = newArr[i].name;
//       tr.appendChild(tdName);
//       let tdScore = document.createElement("td");
//       tdScore.innerText = newArr[i].score;
//       tr.appendChild(tdScore);
//     }
//     arrWrapper.appendChild(table);
//   }

//   // если пустая, выдаем текст
//   else {

//     arrWrapper.append(document.createTextNode("В таблице рекордоа, нет результатов"));
//   }
// }

// //получаем данные и подписываемся на изменения
// function lockGet(pass) {

//    scoreData = {name: nicktext, score: newscore};

//   let sp = new URLSearchParams();
//   sp.append('f', 'LOCKGET');
//   sp.append('n', 'DANKOV_GAME');
//   sp.append('p', pass);

//   fetch(ajaxHandlerScript, { method: 'post', body: sp })
//     .then(response => response.json())
//     .then(data => { newArr(data); })
//     .catch(error => { console.error(error); });
// }

// function newArr(data) {

//   let newArr = data.result;
//   arrScore = newArr;
//   update(randPass)

// }

// function update(pass) {

//   let newArray = JSON.parse(arrScore);

 
// //Если счет больше чем в рекордах, меняем рекорды
//   for (let i = 0; i < newArray.length; i++) {

//     if (parseInt(scoreData.score) > parseInt(newArray[i].score)) {

//       if (i === 0) {

//         newArray[i + 2].name = newArray[i + 1].name;
//         newArray[i + 2].score = newArray[i + 1].score;
//         newArray[i + 1].name = newArray[i].name;
//         newArray[i + 1].score = newArray[i].score;

//         newArray[i].name = scoreData.name;
//         newArray[i].score = scoreData.score;
//         break;
//       }

//       else if (i === 1) {

//         newArray[i + 1].name = newArray[i].name;
//         newArray[i + 1].score = newArray[i].score;

//         newArray[i].name = scoreData.name;
//         newArray[i].score = scoreData.score;
//         break;
//       }

//       else {

//         newArray[i].name = scoreData.name;
//         newArray[i].score = scoreData.score;
//         break;
//       }
//     }
//   }

  

//   scoreData = null;

//   // для обнуления результатов
//  /*



//    for(let i=0; i < newArray.length; i++){
   
//     newArray[i].name = scoreData.name;
//     newArray[i].score = scoreData.score;
  
//    }
//   scoreData = null;
 
//   */

//   let arrJson = JSON.stringify(newArray);

//   let sp = new URLSearchParams();
//   sp.append('f', 'UPDATE');
//   sp.append('n', 'DANKOV_GAME');
//   sp.append('p', pass);
//   sp.append('v', arrJson);

//   fetch(ajaxHandlerScript, { method: 'post', body: sp })
//     .then(response => response.json())
//     .then(data => { console.log(data); })
//     .catch(error => { console.error(error); });
// }

