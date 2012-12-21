$(function(){
  init();
});

var katieAndJamieSpreadsheet = 'https://docs.google.com/spreadsheet/pub?key=0AmhWglGO45rldGNoYy12ZDk2bU1EWTRZTWFtVEpJd2c&output=html';
var happenings;

// Read the spreadsheet first, then execute the callback
function init() {
  Tabletop.init( { key: katieAndJamieSpreadsheet,
                   callback: showInfo,
                   simpleSheet: true } )
}

// Spreadsheet callback
function showInfo(data, tabletop) {
  console.log('Successfully processed!')
  console.log(data);

  // Create a map... with yet another callback
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

      // Set defaults if i can't parse it
      if ( isNaN(lat) || isNaN(lng) ) {
        lat = 43.14
        lng = -77.58
      }

      return { 'geometry' : {"coordinates": [lng, lat]},
               'properties' : {
                 'marker-color': '#000',
                 'marker-symbol': 'star-stroked',
                 title: happyHappening.title,
                 description: happyHappening.description
               }
      }
    })
    console.log('Happenings!');
    console.log(happenings);

    // Add the markers into the map!
    markerLayer.features(happenings);
  });
}

