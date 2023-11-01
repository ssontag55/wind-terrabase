function initDemoMap() {
  var Esri_WorldImagery = L.tileLayer(
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, " +
        "AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );

  var baseLayers = {
    Satellite: Esri_WorldImagery,
  };

  var map = L.map("map", {
    layers: [Esri_WorldImagery]
  });

  var layerControl = L.control.layers(baseLayers);
  layerControl.addTo(map);
  map.setView([-22, 150], 5);

  return {
    map: map,
    layerControl: layerControl
  };
}

// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;

// load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)
$.getJSON("https://terrabase-wind-453d3d169622.herokuapp.com/latest", function(data) {
  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Global Wind",
      position: "bottomleft",
      emptyString: "No wind data",
      showCardinal: true
    },
    data: data,
    maxVelocity: 10
  });

  layerControl.addOverlay(velocityLayer, "Wind - Global");
});

