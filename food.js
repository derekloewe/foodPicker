/*
$(function(){
var sheetUrl = 'https://spreadsheets.google.com/feeds/cells/1MviYoiUxLAEXhP38AfrCwiNaRTsVJnL5c8UKJyRqVAU/1/public/full?alt=json';
$.getJSON(sheetUrl, function(data){
  var entry = data.feed.entry;
  console.log(entry);
})
});
*/
let gURL = 'https://spreadsheets.google.com/feeds/cells/1MviYoiUxLAEXhP38AfrCwiNaRTsVJnL5c8UKJyRqVAU/1/public/full?alt=json';

let ja;

fetch(gURL)
.then(res => res.json())
.then((out) => {
    console.log('Check out JSON', out);
    ja = out;
})
.catch(err => {throw err});
