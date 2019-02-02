// Creating map object
var map = L.map("map", {
    center: [33.00, -95.00],
    zoom: 4,
  });
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFjYXJsc29uNTMiLCJhIjoiY2pwcHBkYmZxMGFuOTQzbnZ0OWxjOHVvdyJ9.LQFKmr2ZXQHvFUJ0T0MQeg").addTo(map);
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  // Grabbing our GeoJSON data
  d3.json(link, function(feature, data) {
    var features = data["features"];
    for (var i = 0; i < features.length; i++) {
      var geometry = features[i]["geometry"]["coordinates"];
      var magnitude = features[i]["properties"]["mag"];
      var title = features[i]["properties"]["title"];
      var coords = {
        longitude: geometry["0"],
        latitude: geometry["1"]
      };

      //   var city = cities[i];
       // Giving each feature a pop-up with information pertinent to it
      var latlng = L.latLng(coords.latitude, coords.longitude);
      var circle = L.circle(latlng, {
        fillColor: getColor(feature.properties.magnitude),
        fillOpacity: 0.5,
        weight: 1.5,
        radius: magnitude * 25000
      }).addTo(map);
      L.circle(latlng)
        .bindPopup("<h1>" + title + "</h1> <hr> <h3>Magnitude: " + feature.properties.magnitude + "</h3><h3>Latitude: " + coords.latitude + "</h3><h3>Longitude: " + coords.longitude + "</h3>")
        .addTo(map);
    }
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
           grades = [0,1,2,3,4,5];
        div.innerHTML = '<h3>Earthquakes</h3>'
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i +1] ? '&ndash;' + grades[i+1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
  });
  //Create color range for the circle diameter 
  var colors = ["green", "olive", "yellow", "orange", "red","maroon"]
  function getColor(mag) {
    if (mag <= 1) {
      color = colors[0];
    } else if (mag > 1 && mag <= 2) {
      color = colors[1];
    } else if (mag > 2 && mag <= 3) {
      color = colors[2];
    } else if (mag > 3) {
      color = colors[4];
    }
    return color;
  }
