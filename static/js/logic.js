var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Function to determine marker size
function markerSize(magnitude) {
  return magnitude * 200;
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    
    var features = data.features;
    console.log("features/states:", features);

    var earthquakeCoords = [];
    
    for (var i = 0; i < features.length; i++) {
      
      var intensity = "";
      
      if (features[i].properties.mag >= 5) {
        intensity = "Red";
      }
      else if (features[i].properties.mag >= 4) {
        intensity = "Lightsalmon";
      }  
      else if (features[i].properties.mag >= 3) {
        intensity = "Orange";
      }
      else if (features[i].properties.mag >= 2) {
        intensity = "Yellow";
      }
      else if (features[i].properties.mag > 1) {
        intensity = "Chartreuse";
      }
      else {
        intensity = "LimeGreen";
      }


      // Push earthquake coords and make circles + popups
      earthquakeCoords.push(
        L.circle([features[i].geometry.coordinates[1],
          features[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "white",
            fillColor: intensity,
            weight: 1,
            radius: markerSize(features[i].properties.mag * 200)
          }).bindPopup("<p>" + "<b>LOCATION:</b> " + features[i].properties.place + "<br>" 
                    + "<b>MAGNITUDE:</b> " + features[i].properties.mag + "<br>"
                    + "<b>LONGITUDE:</b> " + features[i].geometry.coordinates[0] + "<br>"
                    + "<b>LATITUDE:</b> " + features[i].geometry.coordinates[1] + "<br>"
                    + "<b>RECORDED TIME:</b> " + new Date(features[i].properties.time) + "<br>"
                    + "<b>LAST UPDATED:</b> " + new Date(features[i].properties.updated) + "</p>")
      );
    } 


    // Define variables for our tile layers
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });

    var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
 
    var earthquakeLayer = L.layerGroup(earthquakeCoords);



    // Create overlays

    var baseMaps = {
      Satellite: satellite,
      Dark: dark,
      Light: light
    };


    var overlayMaps = {
      "Earthquakes": earthquakeLayer
    }; 


    // Create our map
    var myMap = L.map("map", {
      center: [38, -97],
      zoom: 5,
      layers: [light, earthquakeLayer]
    });
   
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);


    // Set up the legend

    var legend = L.control({ position: "bottomright"});
    legend.onAdd = function(){
    var div = L.DomUtil.create('div', 'legend');
    ranges = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    colors = ["LimeGreen", "Chartreuse", "yellow", "orange", "lightsalmon", "red"];
    labels = [];
    ranges.forEach(function(ranges, i){
      labels.push("<li style=\"background-color: " + colors[i] + "\">"+ranges+"</li>");
     });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;
    };

    legend.addTo(myMap);
    });

