import * as tt from "@tomtom-international/web-sdk-maps";

const addDestinationMarker = (lngLat, map) => {
  const element = document.createElement("div");
  element.className = "destination-marker";
  new tt.Marker({
    element: element
  })
    .setLngLat(lngLat)
    .addTo(map);
};

export default addDestinationMarker;
