/***
 * Open API Request to google to get the json back
 * Once back put in a variable to be run by the funciton
 * 
 */
let pageURL = window.location.href;
let requestURL;
//test to not hit limits
let dev = true;
//console.log(pageURL);

//let requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/'+SPREADSHEET_KEY+'/values/'+RANGE+'?key='+API_KEY;
if (pageURL.search('index.html')) {
  requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_KEY + '/values/' + REST_RANGE + '?key=' + API_KEY;
} else if (pageURL.search('single.html')) {
  requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_KEY + '/values/' + SINGLE_MEAL_RANGE + '?key=' + API_KEY;
}

//test to not hit limits
if (dev) {
  requestURL = 'http://localhost/test.json';
}

/**
 * Create a request and get response from Google API or test json
 */

let resturantsData = {
  resturants: []
};

let foodData = {
  food: []
};


let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
// variable to debug response in console;
let gh;
request.onload = function () {
  const ja = request.response;
  //Show the response in teh console to check object;
  //console.log(ja)
  //Show the response in teh console to check object;
  gh = ja;
  //Get the values section of the JSON response
  buildResults(ja.values, resturantsData.resturants);
  setSelect(createDistinctValue(resturantsData.resturants, "Cost"), "costFilterSelect", "costFilter");
  setSelect(createDistinctValue(resturantsData.resturants, "Type"), "typeFilterSelect", "typeFilter");
};

/**
 * Build table with all of the data from google sheets.
 * @param {JSON} data  [JSON data from the response from Google Sheets]
 */
/**
 * @todo make reusable
 */
function buildResults(data, dataArray) {
  //Check to make sure the data is coming across the same as the response
  //console.log(data);
  let table = document.createElement("table");
  table.className = "table";
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");

  for (let i = 0; i < data.length; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < data[i].length; j += data[i].length) {
      let jcount = data[i].length;
      let item = {};
      //Back up just in case
      /* let resturant = {
        name: data[i][j],
        cost: data[i][j+1],
        kname: 'test'
      }; */
      //Create dynamic key value's
      for (q = 0; q < jcount; q++) {
        let kname = data[0][j + q];
        item[kname] = data[i][j + q];
        let td = document.createElement('td');
        td.innerHTML = data[i][j + q];
        tr.appendChild(td);
      }
      dataArray.push(item);
    }

    if (i == 0) {
      thead.appendChild(tr);
      table.appendChild(thead);
    } else {
      tbody.appendChild(tr);
    }
  }
  table.appendChild(tbody);
  document.getElementById("RestaurantResults").appendChild(table);

}


/**
 * Generate Random number from 0 to the length of the list
 * @param {Number} length  [Legnth of the list]
 * @return {number}        [return the number to use for the index of the list]
 */
function getRandom(length) {
  //Taking random number with ciel to round up and then length minus 1 so it doesn't go out of bounds and this way it doesn't get the header row at 0.
  return Math.ceil(Math.random() * (length - 1));
}

/**
 * Get random location
 */
function getRandomPlace() {
  return resturantsData.resturants[getRandom(resturantsData.resturants.length)];
}

/***
 *Filter out list for distinct values
 * @param {} data []
 * @param {} fname []
 */
function createDistinctValue(data, fname) {
  let x = {};
  data.forEach(function (i) {
    //console.log(i[fname])
    if (!x[i[fname]] && i[fname] != fname) {
      x[i[fname]] = true;
    }
  });
  return Object.keys(x);
}

/**
 * Create Dynamic list of a select down from 
 * @param {object} data   []
 * @param {string} selectID []
 * @param {string} placeToLocate []
 */
/**
 * @todo change to return information to be reusable
 */
function setSelect(data, selectID, placeToLocate) {
  let selectEl = document.createElement("select");
  selectEl.id = selectID;
  selectEl.options[0] = new Option("", '0', false, false);
  data.forEach(function (o) {
    //console.log(typeof o);
    if (o != "undefined") {
      selectEl.options[selectEl.options.length] = new Option(o, '0', false, false);
    }
  });
  document.getElementById(placeToLocate).appendChild(selectEl);
}

let grp2;

function randomRestaurant(filterName1, filterValue1, filterName2, filterValue2) {
  let grp;
  //Run filters if one is not empty
  if (filterValue1 != "" || filterValue2 != "") {
    //console.log(filterName1);
    //console.log(filterName2);
    do {
      grp = getRandomPlace();
    } while ((grp[filterName1] != filterValue1) && (grp[filterName2] != filterValue2));
  } else {
    // Run if filters are empty
    grp = getRandomPlace();
  }
  //debug variable
  grp2 = grp;
  return grp;

}

/**
 * 
 */
function getRandomResultResturant() {
  let costFilterValue = document.getElementById("costFilterSelect").options[document.getElementById("costFilterSelect").options.selectedIndex].text;
  let typeFilterValue = document.getElementById("typeFilterSelect").options[document.getElementById("typeFilterSelect").options.selectedIndex].text;
  let result = randomRestaurant("Cost", costFilterValue, "Type", typeFilterValue);
  document.getElementById("nameResult").innerHTML = result.Name;
  document.getElementById("costResult").innerHTML = result.Cost;
  document.getElementById("typeResult").innerHTML = result.Type;
}

/// Make filter like cost - high to low , cost - low  to high, name, ect like ecmmerce categories.

//buildResults(ja);
window.onload = function () {
  
  this.document.getElementById("buttonRandom").addEventListener("click", getRandomResultResturant);

};