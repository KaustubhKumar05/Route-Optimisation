import "./App.css";
const RouteDuration = ({ routeDuration }) => {
	console.log("RouteDuration rendered", routeDuration)

	// const formatDuration = routeDuration => {
		
	// }
		return (
			<div className="right-panel">
				<p>Estimated time for route completion : {routeDuration}</p>
			</div>
		);
	// else
	// 	return (
	// 		<div className="right-panel">
	// 			<p>
	// 				Scroll over the map to adjust zoom. Add destination points to
	// 				calculate estimated trip duration.
	// 			</p>
	// 		</div>
	// 	);
};

export default RouteDuration;
