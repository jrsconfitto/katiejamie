window.onload = function() { init() };

var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?key=0AmhWglGO45rldGNoYy12ZDk2bU1EWTRZTWFtVEpJd2c&output=html';

function init() {
  Tabletop.init( { key: public_spreadsheet_url,
                   callback: showInfo,
                   simpleSheet: true } )
}

function showInfo(data, tabletop) {
  alert("Successfully processed!")
  console.log(data);
}

