/***
 * Open API Request to google to get the json back
 * Once back put in a variable to be run by the funciton
 * 
 */
//let requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/'+SPREADSHEET_KEY+'/values/'+RANGE+'?key='+API_KEY;

let requestURL = 'http://localhost/test.json';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
// variable to debug response in console;
let gh;
request.onload = function () {
  const ja = request.response;
  //Show the response in teh console to check object;
  console.log(ja)
  //Show the response in teh console to check object;
  gh = ja;
  buildResults(ja.values);
};
let rName = [];
let resturantsData = {
  resturants: []
};

function buildResults(data) {
  //Check to make sure the data is coming across the same as the response
  //console.log(data);
  let table = document.createElement("table");
  table.className = "test";
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  let headrow = document.createElement("tr");
  let x = 0;
  let t = false;

  /*   for (let i = 0; i < data.length; i++) {
      let tr = document.createElement('tr');
      let jList = [];
      for (let j = 0; j < data[i].length; j++) {
        //console.log(data[i][j]);
        jList.push(data[i][j]);
        let td = document.createElement('td');
        td.innerHTML = data[i][j];
        //console.log(td);
        tr.appendChild(td);
      }
      rName.push(jList);
      jList = []
      tbody.appendChild(tr);
    } */

  for (let i = 0; i < data.length; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < data[i].length; j+=data[i].length) {
      //console.log(data[i][j]);
      //console.log(restNames[data[0][j] = data[i][j]]);
      /* let td = document.createElement('td');
      td.innerHTML = data[i][j] */
      let jcount = data[i].length;
      let resturant ={};
      
      //console.log(kname);
      //console.log(td);
      //Back up just in case
      /* let resturant = {
        name: data[i][j],
        cost: data[i][j+1],
        kname: 'test'
      }; */
      //tr.appendChild(td);
      //Create dynamic key value's
      for(q = 0; q < jcount; q++){
        let kname = data[0][j+q];
        resturant[kname]=  data[i][j+q];
        let td = document.createElement('td');
      td.innerHTML = data[i][j+q]
      tr.appendChild(td);
      }
      resturantsData.resturants.push(resturant);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
document.getElementById("RestaurantResults").appendChild(table);
}


function getRandom(length) {
  return Math.floor(Math.random() * length);
}

function getRandomPlace() {
  return rName[getRandom(rName.length)]
}


function checkJNow(ranFilter) {
  let grp;
  if (ranFilter == "cost") {
    do {
      grp = getRandomPlace();
    } while (grp[1] != "$$");
  } else {
    grp = getRandomPlace();
  }
  //console.log(grp);
  return grp;

}

//buildResults(ja);
window.onload = function () {

};