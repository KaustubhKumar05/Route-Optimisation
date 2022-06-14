const drawRoute = (map, formattedRouteData) => {
  if (map.getLayer("route")) {
    map.removeLayer("route");
    map.removeSource("route");
  }
  map.addLayer({
    id: "route",
    type: "line",
    source: {
      type: "geojson",
      data: formattedRouteData
    },
    paint: {
      "line-color": "red",
      "line-width": 3
    }
  });
};

export default drawRoute;
