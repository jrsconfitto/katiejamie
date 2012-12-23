$(function(){
  init();
});

var katieAndJamieSpreadsheet = 'https://docs.google.com/spreadsheet/pub?key=0AmhWglGO45rldGNoYy12ZDk2bU1EWTRZTWFtVEpJd2c&output=html';
var happenings;
var theMap;
var theMarkerLayer;

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
    theMap = map;

    // Create an empty markers layer
    theMarkerLayer = mapbox.markers.layer();

    // Add interaction to this marker layer. This
    // binds tooltips to each marker that has title
    // and description defined.
    mapbox.markers.interaction(theMarkerLayer);
    theMap.addLayer(theMarkerLayer);

    // Convert the times to moment
    data.forEach(function(datum) {
      datum.date = moment(datum.date);
    })

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
                 description: happyHappening.description,
                 time: happyHappening.date
               }
      }
    })
    console.log('Happenings!');
    console.log(happenings);

    // Add the markers into the map!
    theMarkerLayer.features(happenings);

    // Set an interval to ease between markers
    var currentMarkerIndex = 0;
    var totalMarkers = happenings.length;

    var markers = theMarkerLayer.markers().sort(function(a, b) {
      return a.data.properties.time.unix() - b.data.properties.time.unix()
    })

    setInterval(function() {
      // Find the current marker
      var currentMarker = markers[currentMarkerIndex]

      // Ease to the marker
      theMap.ease.location(currentMarker.location).zoom(15).optimal();

      // Show the marker's popup
      //currentMarker.showTooltip();

      // Increment the marker or start over again
      if  (currentMarkerIndex = totalMarkers - 1) {
        currentMarkerIndex = 0; 
      }
      else {
        currentMarkerIndex++;
      }
    }, 10000);
  });
}

