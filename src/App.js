import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./App.css";
import { useEffect, useState, useRef } from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import * as tts from "@tomtom-international/web-sdk-services";
import RouteDuration from "./RouteDuration";

const KEY = "dExniraENWHwB9aLHajmRBj9i21eFbO8";

const App = () => {
	const [map, setMap] = useState({});
	const mapElement = useRef();
	const [latitude, setLatitude] = useState(22.3072);
	const [longitude, setLongitude] = useState(73.1812);
	const totalTime = useRef(0);
	const [routeDuration, setRouteDuration] = useState(0);

	const formatAsPoint = (lngLat) => {
		return {
			point: {
				latitude: lngLat.lat,
				longitude: lngLat.lng,
			},
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
				data: formattedRouteData,
			},
			paint: {
				"line-color": "red",
				"line-width": 3,
			},
		});
	};

	const updateLocation = () => {
		const latBar = document.getElementById("latitudeInput");
		const lngBar = document.getElementById("longitudeInput");
		setLatitude(latBar.value);
		setLongitude(lngBar.value);
	};

	const addDestinationMarker = (lngLat, map) => {
		const element = document.createElement("div");
		element.className = "destination-marker";
		new tt.Marker({
			element: element,
		})
			.setLngLat(lngLat)
			.addTo(map);
	};

	useEffect(() => {
		const origin = {
			lng: longitude,
			lat: latitude,
		};

		let map = tt.map({
			key: KEY,
			container: mapElement.current,
			style: {
				map: "basic_main",
				poi: "poi_main",
				trafficIncidents: "incidents_day",
				trafficFlow: "flow_relative",
			},
			center: [longitude, latitude],
			zoom: 15,
		});

		setMap(map);

		const addMarker = () => {
			const popUp = new tt.Popup({
				closeButton: false,
				offset: {
					bottom: [0, -25],
				},
			}).setHTML("Current location");
			const element = document.createElement("div");

			element.className = "marker";
			const marker = new tt.Marker({
				element: element,
				draggable: true,
			})
				.setLngLat([longitude, latitude])
				.addTo(map);

			marker.on("dragend", () => {
				const pos = marker.getLngLat();
				setLongitude(pos.lng);
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
				key: KEY,
				destinations: formattedDestinations,
				origins: [formatAsPoint(origin)],
			};
			return new Promise((resolve, reject) => {
				tts.services.matrixRouting(callParams).then((callResult) => {
					const results = callResult.matrix[0];
					const resultsArray = results.map((result, index) => {
						return {
							location: destinations[index],
							drivingTime: result.response.routeSummary.travelTimeInSeconds,
						};
					});
					resultsArray.sort((a, b) => a.drivingTime - b.drivingTime);
					const sortedLocations = resultsArray.map((result) => {
						totalTime.current += result.drivingTime;
						return result.location;
					});
					resolve(sortedLocations);
				});
			});
		};

		const updateRoute = () => {
			sortDestinations(destinations).then((sorted) => {
				sorted.unshift(origin);
				tts.services
					.calculateRoute({
						key: KEY,
						locations: sorted,
					})
					.then((routeData) => {
						const formattedRouteData = routeData.toGeoJson();
						setRouteDuration(totalTime.current);
						drawRoute(map, formattedRouteData);
					});
			});
		};

		return () => map.remove();
	}, [longitude, latitude]);

	return (
		<div className="App">
			<div ref={mapElement} className="map" id="main-display" />
			<div className="user-input">
				<h1>Set current location</h1>
				<div className="input-bars">
					<input type="text" id="latitudeInput" placeholder="Enter latitude" />
					<input
						type="text"
						id="longitudeInput"
						placeholder="Enter longitude"
					/>
				</div>
				<button onClick={updateLocation}>Update current location</button>
				<button onClick={() => window.location.reload()}>Reset map</button>
				{routeDuration > 0 && <RouteDuration routeDuration={routeDuration}/>}
			</div>
		</div>
	);
};

export default App;
