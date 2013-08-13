$(function(){
  init();
});

var katieAndJamieSpreadsheet = 'https://docs.google.com/spreadsheet/pub?key=0AmhWglGO45rldGNoYy12ZDk2bU1EWTRZTWFtVEpJd2c&output=html';
var happenings;
var theMap;
var theMarkerLayer;
var playIt;

// Read the spreadsheet first, then execute the callback
function init() {
  Tabletop.init({
   key: katieAndJamieSpreadsheet,
   callback: showInfo,
   simpleSheet: true });
}

// Spreadsheet callback
function showInfo(data, tabletop) {
  console.log('Successfully processed!');
  console.log(data);

  // Create a map... with yet another callback
  mapbox.auto('map', 'examples.map-20v6611k', function(map) {
    theMap = map;

    // Create an empty markers layer
    theMarkerLayer = mapbox.markers.layer();

    // Add interaction to this marker layer. This
    // binds tooltips to each marker that has title
    // and description defined.
    mapbox.markers.interaction(theMarkerLayer).hideOnMove(true);
    var interaction = mapbox.markers.interaction(theMarkerLayer);

    theMap.addLayer(theMarkerLayer);

    // Set a custom formatter for tooltips
    // Provide a function that returns html to be used in tooltip
    interaction.formatter(function(feature) {
      var o;

      o = '<h3>' + feature.properties.title + '</h3>';
      o = o + '<p>';

      if (feature.properties.description !== '') {
        o = o + feature.properties.description + '<br>';
      }

      if (feature.properties.image !== undefined) {
        o = o + '<img src="' + feature.properties.image + '">';
      }

      o = o + '<i>' + feature.properties.date.format('MMMM Do YYYY') + '</i>';
      o = o + '</p>';

      return o;
    });

    // Convert the times to moment
    data.forEach(function(datum) {
      datum.date = moment(datum.date);
    });

    // Convert the data from the spreadsheet into features for insertion as markers
    happenings = data.map(function(happyHappening) {
      var lat = parseFloat(happyHappening.latitude);
      var lng = parseFloat(happyHappening.longitude);

      // Set defaults if i can't parse it
      if ( isNaN(lat) || isNaN(lng) ) {
        lat = 43.14;
        lng = -77.58;
      }

      return {
        'geometry' : { "coordinates": [lng, lat]},
        'properties' : {
          'marker-color': '#000',
          'marker-symbol': happyHappening.marker,
          title: happyHappening.title,
          description: happyHappening.description,
          date: happyHappening.date,
          image: happyHappening.image
        }
      };
    });

    console.log('Happenings!');
    console.log(happenings);

    // Add the markers into the map!
    theMarkerLayer.features(happenings);
    var markers = theMarkerLayer.markers().sort(function(a, b) {
      return a.data.properties.date.unix() - b.data.properties.date.unix();
    });

    // Ease to and show the initial marker
    theMap.ease.location(markers[0].location).zoom(13).optimal();
    markers[0].showTooltip();

    // Set an interval to ease between markers
    var currentMarkerIndex = 1; // we'll start looping on the second marker and display the first
    var totalMarkers = happenings.length;
    var playIt = function() {
      var timerId = setInterval(function() {
        // Find the current marker
        var currentMarker = markers[currentMarkerIndex];

        // Ease to the marker
        theMap.ease.location(currentMarker.location).zoom(15).optimal();

        // Show the marker's popup
        currentMarker.showTooltip();

        // Increment the marker or start over again
        if  (currentMarkerIndex == totalMarkers - 1) {
          currentMarkerIndex = 0;
        }
        else {
          currentMarkerIndex++;
        }
      }, 12000);

      return timerId;
    };

    // Start it off
    var id = playIt();
    var playing = true;

    // Set the start and stop handler
    $('#play').click(function() {
      if (playing) {
        // Then stop it
        clearInterval(id);
        playing = false;
        $(this).text('Play!');
      }
      else {
        id = playIt();
        playing = true;
        $(this).text('Stop!');
      }
    });
  });
}
