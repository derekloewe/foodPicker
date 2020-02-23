/***
 * Open API Request to google to get the json back
 * Once back put in a variable to be run by the funciton
 * 
 */

//Global Variables for pagination
let cPage = 1;
let recordsPerPage = 10;
//
let pageURL = window.location.href;
let requestURL;
let pageType;
//test to not hit limits
let dev = false;
//console.log(pageURL);

requestURLRest = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_KEY + '/values/' + REST_RANGE + '?key=' + API_KEY;
requestURLFood = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_KEY + '/values/' + SINGLE_MEAL_RANGE + '?key=' + API_KEY;
//get different list based on page url
//let requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/'+SPREADSHEET_KEY+'/values/'+RANGE+'?key='+API_KEY;
if (pageURL.search('index.html') > -1) {
  //requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_KEY + '/values/' + REST_RANGE + '?key=' + API_KEY;
  pageType = "index";
} else if (pageURL.search('single.html') > -1) {
  requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_KEY + '/values/' + SINGLE_MEAL_RANGE + '?key=' + API_KEY;
  pageType = "single";
} else if (pageURL.search('weekly.html') > -1) {
  requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_KEY + '/values/' + SINGLE_MEAL_RANGE + '?key=' + API_KEY;
  pageType = "weekly";
}

//test to not hit limits
if (dev) {
  requestURL = 'http://localhost/food.json';
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


let gh;
let gh2;
let dataR;
let dataR2;


function callRequestData(requestURL, callback){
  let request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      callback(this.response);
    }
  }
  request.open("GET", requestURL);
  request.responseType = 'json';
  request.send();
}


function foodDataFunction(request){
  console.log(request.values)
  buildList(request.values,foodData.food)
  if(pageType == "single"){
    changePage(1,request.values);
  }
}

function resturantsDataFunction(request){
  //console.log(request.values)
  buildList(request.values,resturantsData.resturants);
  if(pageType == "index"){
    changePage(1,request.values);
  }
}


function callRequestData2(requestURL){
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
// variable to debug response in console;



/*   request.onload = function () {
    const ja = request.response;
    //Show the response in teh console to check object;
    //console.log(ja)
    //Show the response in teh console to check object;
    gh = ja;
    //Get the values section of the JSON response
    //buildResults(ja.values, resturantsData.resturants);
    dataR = ja.values;
    if (pageType == "index") {
      buildList(dataR, resturantsData.resturants);
      setSelect(createDistinctValue(resturantsData.resturants, "Cost"), "costFilterSelect", "costFilter");
      setSelect(createDistinctValue(resturantsData.resturants, "Type"), "typeFilterSelect", "typeFilter");
      changePage(1, dataR);
    } else if (pageType == "single") {
      buildList(dataR, foodData.food);
      setSelect(createDistinctValue(foodData.food, "Type"), "typeFilterSelect", "typeFilter");
      setSelect(createDistinctValue(foodData.food, "Side"), "sideFilterSelect", "sideFilter");
      changePage(1, dataR);
    } else if (pageType == "weekly") {
      buildList(dataR, foodData.food);
      buildList(dataR2, resturantsData.resturants);
      console.log(dataR2)
    }
  }; */

  request.onload = function () {
    const ja = request.response;
    //Show the response in teh console to check object;
    //console.log(ja)
    //Show the response in teh console to check object;
    gh = ja;
    //Get the values section of the JSON response
    //buildResults(ja.values, resturantsData.resturants);
    dataR = ja.values;
    console.log(ja.values)
    return ja.values;
}

}
//Pagination seciton
function prevPage() {
  if (cPage > 1) {
    cPage--;
    changePage(cPage, dataR);
  }
}

function nextPage() {
  if (cPage < numPages()) {
    cPage++;
    changePage(cPage, dataR);
  }
}

function numPages(data) {
  return Math.ceil(data.length / recordsPerPage);
}


function changePage(page, data) {
  let btn_next = document.getElementById("btn_next");
  let btn_prev = document.getElementById("btn_prev");
  let page_span = document.getElementById("page")

  //validate the page
  if (page < 1) page = 1;
  if (page > numPages(data)) page = numPages(data);

  let table = document.getElementById("resultsList")
  table.className = "table";
  let thead = document.createElement("thead");
  thead.id = "resultHead";
  let tbody = document.createElement("tbody");
  tbody.id = "resultList";
  let tcheck = document.getElementById("resultList");

  if (tcheck != null) {
    tcheck.remove();
  }


  for (let i = (page - 1) * recordsPerPage; i < (page * recordsPerPage) && i < data.length; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < data[i].length; j += data[i].length) {
      let jcount = data[i].length;
      let item = {};
      //Create dynamic key value's
      for (q = 0; q < jcount; q++) {
        let kname = data[0][j + q];
        item[kname] = data[i][j + q];
        //console.log(item[kname] = data[i][j + q])
        //Create Table cell
        let td = document.createElement('td');
        td.innerHTML = data[i][j + q];
        tr.appendChild(td);
      }
    }


    if (i == 0 && document.getElementById("resultHead") == null) {
      thead.appendChild(tr);
      table.appendChild(thead);
    } else {
      tbody.appendChild(tr);
    }

  }

  table.appendChild(tbody);
  document.getElementById("results").appendChild(table);
  page_span.innerHTML = page + "/" + numPages();

  if (page == 1) {
    btn_prev.style.visibility = "hidden";
  } else {
    btn_prev.style.visibility = "visible";
  }

  if (page == numPages()) {
    btn_next.style.visibility = "hidden";
  } else {
    btn_next.style.visibility = "visible";
  }

}


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
        //console.log(item[kname] = data[i][j + q])
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
  document.getElementById("results").appendChild(table);

}


/**
 * Build table with all of the data from google sheets.
 * @param {JSON} data  [JSON data from the response from Google Sheets]
 */
/**
 * @todo make reusable
 */
function buildList(data, dataArray) {
  //Check to make sure the data is coming across the same as the response
  //console.log(data);

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j += data[i].length) {
      let jcount = data[i].length;
      let item = {};
      //Create dynamic key value's
      for (q = 0; q < jcount; q++) {
        let kname = data[0][j + q];
        item[kname] = data[i][j + q];
        //console.log(item[kname] = data[i][j + q])
      }
      dataArray.push(item);
    }

  }
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
 * @param {object} []
 * @return {string} [returns the random resturant by sending the object length to not go over index]
 */
function getRandomPlace(dataObject) {
  //console.log(dataObject)
  return dataObject[getRandom(dataObject.length)];
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
  let dollarsign = "";
  selectEl.id = selectID;
  selectEl.options[0] = new Option("", '0', false, false);
  data.forEach(function (o) {
    //console.log(typeof o);
    if (o != "undefined") {
      //takes number from json and converts to $ due to regex bug with filtering
      if (!isNaN(o)) {
        for (let c = 0; c < parseInt(o); c++) dollarsign += "$";
        selectEl.options[selectEl.options.length] = new Option(dollarsign, o, false, false);
      } else {
        selectEl.options[selectEl.options.length] = new Option(o, o, false, false);
      }
      dollarsign = "";
    }
  });
  document.getElementById(placeToLocate).appendChild(selectEl);
}

let grp2;
let filterTest = true;
let filterCount = 0;
/**
 * Get the random resturants with filters.
 * @param {dataObject} dataObject []
 * @param {string} filterName1 []
 * @param {string} filterValue1 []
 * @param {string} filterName2 []
 * @param {string} filterValue2 []
 */
function randomResult(dataObject, filterName1, filterValue1, filterName2, filterValue2) {
  let grp;
  //Run filters if one is not empty
  if (filterValue1 != 0 || filterValue2 != 0) {
    try {
      do {
        grp = getRandomPlace(dataObject);
        if (filterValue1 != 0 && filterValue2 != 0) {
          if ((grp[filterName1].search(filterValue1) == 0 && grp[filterName2].search(filterValue2) == 0)) {
            filterTest = false;
          }
        } else if (filterValue1 != 0 && filterValue2 == 0) {
          if ((grp[filterName1].search(filterValue1) == 0 && grp[filterName2].search(filterValue2) == -1)) {
            filterTest = false;
          }
        } else if (filterValue1 == 0 && filterValue2 != 0) {
          if ((grp[filterName1].search(filterValue1) == -1 && grp[filterName2].search(filterValue2) == 0)) {
            filterTest = false;
          }
        } else {
          filterTest = false;
        }
        filterCount++;
        if (filterCount > 200) {
          filterTest = false;
          console.error("Non matching filters selected");
          grp = {};
        }
      } while (filterTest);
    } catch (err) {
      console.log(err);
    }


  } else {
    // Run if filters are empty
    grp = getRandomPlace(dataObject);
  }
  //debug variable
  grp2 = grp;
  filterCount = 0;
  filterTest = true;
  return grp;

}

/**
 * Function to grab the selectors and then get their data and pass to get the randomResturant
 * then proceed to display the result or show an error for the filters
 */
function getRandomResultResturant() {
  let costFilterValue = document.getElementById("costFilterSelect").options[document.getElementById("costFilterSelect").options.selectedIndex].value;
  let typeFilterValue = document.getElementById("typeFilterSelect").options[document.getElementById("typeFilterSelect").options.selectedIndex].value;
  let result = randomResult(resturantsData.resturants, "Cost", costFilterValue, "Type", typeFilterValue);
  if (result.hasOwnProperty("Name")) {
    document.getElementById("errorMessageBox").innerHTML = "";
    document.getElementById("nameResult").innerHTML = result.Name;
    document.getElementById("costResult").innerHTML = result.Cost;
    document.getElementById("typeResult").innerHTML = result.Type;
  } else {
    document.getElementById("errorMessageBox").innerHTML = "No results that match, please select different filter";
    document.getElementById("nameResult").innerHTML = "";
    document.getElementById("costResult").innerHTML = "";
    document.getElementById("typeResult").innerHTML = "";
  }
}


/**
 * Function to grab the selectors and then get their data and pass to get the randomResturant
 * then proceed to display the result or show an error for the filters
 */
function getRandomFood() {
  let typeFilterValue = document.getElementById("typeFilterSelect").options[document.getElementById("typeFilterSelect").options.selectedIndex].value;
  let sideFilterValue = document.getElementById("sideFilterSelect").options[document.getElementById("sideFilterSelect").options.selectedIndex].value;
  let result = randomResult(foodData.food, "Type", typeFilterValue, "Side", sideFilterValue);
  if (result.hasOwnProperty("Food")) {
    document.getElementById("errorMessageBox").innerHTML = "";
    document.getElementById("foodResult").innerHTML = result.Food;
    document.getElementById("typeResult").innerHTML = result.Type;
    document.getElementById("sideResult").innerHTML = result.Side;
  } else {
    document.getElementById("errorMessageBox").innerHTML = "No results that match, please select different filter";
    document.getElementById("nameResult").innerHTML = "";
    document.getElementById("costResult").innerHTML = "";
    document.getElementById("typeResult").innerHTML = "";
  }
}

/**
 * Function to grab the selectors and then get their data and pass to get the randomResturant
 * then proceed to display the result or show an error for the filters
 */
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getRandomFoodWeekly() {

  for (x = 0; x < 7; x++) {
    if (!document.getElementById(days[x]).checked) {
      let result = getRandomPlace(foodData.food);
      console.log(result)
      document.getElementById("foodResult" + days[x]).innerHTML = result.Food;
      document.getElementById("typeResult" + days[x]).innerHTML = result.Type;
    }else{
      let result2 = getRandomPlace(resturantsData.resturants);
      console.log(result2)
      document.getElementById("foodResult" + days[x]).innerHTML = result2.Name;
      document.getElementById("typeResult" + days[x]).innerHTML = result2.Type;
    }
  }
}

/// Make filter like cost - high to low , cost - low  to high, name, ect like ecmmerce categories.
//buildResults(ja);




if (pageType == "index") {
  window.onload = function () {
    this.document.getElementById("buttonRandom").addEventListener("click", getRandomResultResturant);
    //buildList(dataR, resturantsData.resturants);
    callRequestData(requestURLRest,resturantsDataFunction)
      setSelect(createDistinctValue(resturantsData.resturants, "Cost"), "costFilterSelect", "costFilter");
      setSelect(createDistinctValue(resturantsData.resturants, "Type"), "typeFilterSelect", "typeFilter");
      //changePage(1, resturantsData.resturants);
  };
} else if (pageType == "single") {
  window.onload = function () {
    this.document.getElementById("buttonRandom").addEventListener("click", getRandomFood);
    //buildList(dataR, foodData.food);
    callRequestData(requestURLFood, foodDataFunction)
    //changePage(1,resturantsData.resturants);
    setSelect(createDistinctValue(resturantsData.resturants, "Type"), "typeFilterSelect", "typeFilter");
    setSelect(createDistinctValue(resturantsData.resturants, "Side"), "sideFilterSelect", "sideFilter");
  };
} else if (pageType == "weekly") {
  window.onload = function () {
    this.document.getElementById("buttonRandom").addEventListener("click", getRandomFoodWeekly);
    callRequestData(requestURLFood, foodDataFunction)
    callRequestData(requestURLRest,resturantsDataFunction)
  };
}