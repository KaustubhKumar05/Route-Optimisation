import "./App.css";
const RouteDuration = ({ routeDuration }) => {
	if ({ routeDuration } > 0)
		return (
			<div className="right-panel">
				<p>Estimated time for route completion : {routeDuration}</p>
			</div>
		);
	else
		return (
			<div className="right-panel">
				<p>
					Scroll over the map to adjust zoom. Add destination points to
					calculate estimated trip duration.
				</p>
			</div>
		);
};

export default RouteDuration;
