import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./App.css";
import { useEffect, useState, useRef } from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import * as tts from "@tomtom-international/web-sdk-services";
import RouteDuration from "./RouteDuration";
import Navbar from "./Navbar";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Modal from "./Modal";
import Button from "@mui/material/Button";

const KEY = "dExniraENWHwB9aLHajmRBj9i21eFbO8";

const theme = createTheme({
	palette: {
		primary: {
			main: "#FFFFFF",
		},
		secondary: {
			main: "#11cb5f",
		},
	},
});

const App = () => {
	const [map, setMap] = useState({});
	const mapElement = useRef();
	const [modalView, setModalView] = useState(true);
	const [latitude, setLatitude] = useState(22.3072);
	const [longitude, setLongitude] = useState(73.1812);
	const totalTime = useRef(0);
	const [portrait, setPortrait] = useState(
		!window.matchMedia("(orientation:landscape)").matches
	);
	const [routeDuration, setRouteDuration] = useState(0);

	const handleSetModalView = () => {
		setModalView(!modalView);
	};

	const orientation = window.matchMedia("(orientation:landscape)");
	orientation.addEventListener("change", () => {
		setPortrait(!portrait);
	});

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
		setRouteDuration(0);
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
				totalTime.current = 0;
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
					setRouteDuration(totalTime.current);
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
			<div ref={mapElement} className="map" id="main-display" />
			<div className="dashboard">
				<div className="user-input">
					<div className="input-bars">
						<ThemeProvider theme={theme}>
							<TextField
								id="longitudeInput"
								color="primary"
								sx={{ input: { color: "white" } }}
								size="small"
								margin="normal"
								focused
								inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
								label="Enter longitude"
								variant="outlined"
							/>
							<TextField
								id="latitudeInput"
								color="primary"
								sx={{ input: { color: "red" } }}
								focused
								size="small"
								margin="normal"
								inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
								label="Enter latitude"
								variant="outlined"
							/>
						</ThemeProvider>
						<div className="buttons">
							<ThemeProvider theme={theme}>
								{portrait === true ? (
									<Button size="medium" variant="text" onClick={updateLocation}>
										Update
									</Button>
								) : (
									<Button
										size="medium"
										variant="contained"
										onClick={updateLocation}
									>
										Update
									</Button>
								)}
								{portrait === true ? (
									<Button
										variant="text"
										size="medium"
										onClick={() => window.location.reload()}
									>
										Reset
									</Button>
								) : (
									<Button
										variant="contained"
										size="medium"
										onClick={() => window.location.reload()}
									>
										Reset
									</Button>
								)}
							</ThemeProvider>
						</div>
					</div>
				</div>
				<div className="route-duration">
					<RouteDuration routeDuration={totalTime.current} />
				</div>
			</div>
		</div>
	);
};

export default App;
