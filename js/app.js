$(function(){
  init();
});

var katieAndJamieSpreadsheet = 'https://docs.google.com/spreadsheet/pub?key=0AmhWglGO45rldGNoYy12ZDk2bU1EWTRZTWFtVEpJd2c&output=html';
var happenings;

function init() {
  Tabletop.init( { key: katieAndJamieSpreadsheet,
                   callback: showInfo,
                   simpleSheet: true } )
}

function showInfo(data, tabletop) {
  console.log('Successfully processed!')
  console.log(data);

  // Create a map
  mapbox.auto('map', 'jugglingnutcase.map-rxoo73qt', function(map) {
    // Create an empty markers layer
    var markerLayer = mapbox.markers.layer();

    // Add interaction to this marker layer. This
    // binds tooltips to each marker that has title
    // and description defined.
    mapbox.markers.interaction(markerLayer);
    map.addLayer(markerLayer);

    // Convert the data from the spreadsheet into features for insertion as markers
    happenings = data.map(function(happyHappening) {
      var lat = parseFloat(happyHappening.latitude);
      var lng = parseFloat(happyHappening.longitude);

      if ( !isNaN(lat) && !isNaN(lng) ) {
        return { 'geometry' : {"coordinates": [lng, lat]},
                 'properties' : {
                   'marker-color': '#000',
                   'marker-symbol': 'star-stroked',
                   title: 'Yay!',
                   description: happyHappening.Description
                 }
               }
      }
      else {
        // All the ones that don't have good locations i just locate at our home :)
        return { 'geometry' : {"type": "Point", "coordinates": [43.14, -77.58]},
                 'properties' : 'i  love you Katie!'}
      }
    })
    console.log('Happenings!');
    console.log(happenings);

    // Add the markers into the map!
    markerLayer.features(happenings);
  });
}

