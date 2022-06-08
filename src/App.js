import "./App.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { useEffect, useState, useRef } from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import * as tts from "@tomtom-international/web-sdk-services";

import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import TTMap from "./components/TTMap";
import Dashboard from "./components/Dashboard";

import keyString from "./assets/Key";

const App = () => {
  const mapElement = useRef();
  const totalTime = useRef(0);
  const [modalView, setModalView] = useState(true);
  const [latitude, setLatitude] = useState(22.3072);
  const [longitude, setLongitude] = useState(73.1812);
  const [routeDuration, setRouteDuration] = useState(0);

  const handleSetModalView = () => {
    setModalView(!modalView);
  };

  const formatAsPoint = (lngLat) => {
    return {
      point: {
        latitude: lngLat.lat,
        longitude: lngLat.lng
      }
    };
  };

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

  const updateLocation = () => {
    const latBar = document.getElementById("latitudeInput");
    const lngBar = document.getElementById("longitudeInput");
    setLatitude(latBar.value);
    setLongitude(lngBar.value);
    setRouteDuration(0);
  };

  const addDestinationMarker = (lngLat, map) => {
    const element = document.createElement("div");
    element.className = "destination-marker";
    new tt.Marker({
      element: element
    })
      .setLngLat(lngLat)
      .addTo(map);
  };

  useEffect(() => {
    const origin = {
      lng: longitude,
      lat: latitude
    };

    let map = tt.map({
      key: keyString,
      container: mapElement.current,
      style: {
        map: "basic_main",
        poi: "poi_main",
        trafficIncidents: "incidents_day",
        trafficFlow: "flow_relative"
      },
      center: [longitude, latitude],
      zoom: 15
    });

    const addMarker = () => {
      const popUp = new tt.Popup({
        closeButton: false,
        offset: {
          bottom: [0, -25]
        }
      }).setHTML("Current location");

      const element = document.createElement("div");
      element.className = "marker";
      const marker = new tt.Marker({
        element: element,
        draggable: true
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLngLat();
        setLongitude(pos.lng);
        totalTime.current = 0;
        setRouteDuration(0);
        setLatitude(pos.lat);
      });
      marker.setPopup(popUp).togglePopup();
    };

    addMarker();

    const destinations = [];

    map.on("click", (e) => {
      destinations.push(e.lngLat);
      addDestinationMarker(e.lngLat, map);
      updateRoute();
    });

    const sortDestinations = (destinations) => {
      const formattedDestinations = destinations.map((destination) => {
        return formatAsPoint(destination);
      });
      const callParams = {
        key: keyString,
        destinations: formattedDestinations,
        origins: [formatAsPoint(origin)]
      };

      return new Promise((resolve, reject) => {
        tts.services.matrixRouting(callParams).then((callResult) => {
          const results = callResult.matrix[0];
          const resultsArray = results.map((result, index) => {
            return {
              location: destinations[index],
              drivingTime: result.response.routeSummary.travelTimeInSeconds
            };
          });
          resultsArray.sort((a, b) => a.drivingTime - b.drivingTime);
          const sortedLocations = resultsArray.map((result) => {
            totalTime.current += result.drivingTime;
            return result.location;
          });
          resolve(sortedLocations);
          setRouteDuration(totalTime.current);
        });
      });
    };

    const updateRoute = () => {
      sortDestinations(destinations).then((sorted) => {
        sorted.unshift(origin);
        tts.services
          .calculateRoute({
            key: keyString,
            locations: sorted
          })
          .then((routeData) => {
            const formattedRouteData = routeData.toGeoJson();
            drawRoute(map, formattedRouteData);
          });
      });
    };
    return () => map.remove();
  }, [longitude, latitude]);

  return (
    <div className="App">
      {modalView === true && <Modal handleSetModalView={handleSetModalView} />}
      <Navbar handleSetModalView={handleSetModalView} />
      <TTMap mapElement={mapElement} />
      <Dashboard
        routeDuration={routeDuration}
        updateLocation={updateLocation}
      />
    </div>
  );
};

export default App;
