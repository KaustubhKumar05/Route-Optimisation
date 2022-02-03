import "./App.css";
const RouteDuration = ({ routeDuration }) => {
	console.log("RouteDuration rendered", routeDuration);

	const formatDuration = (routeDuration) => {
		const sec = parseInt(routeDuration, 10);
		let hours = Math.floor(sec / 3600);
		let minutes = Math.floor((sec - hours * 3600) / 60);
		let seconds = sec - hours * 3600 - minutes * 60;
		
		if (hours < 10) hours = "0" + hours;
		if (minutes < 10) minutes = "0" + minutes;
		if (seconds < 10) seconds = "0" + seconds;

		return `${hours}:${minutes}:${seconds}s`;
	};
	return (
		<div className="right-panel">
			{routeDuration > 0 ? (
				<div className="right-panel-text">
					Estimated time for route completion is {formatDuration(routeDuration)}
				</div>
			) : (
				<div className="right-panel-text"> Scroll over the map to adjust the zoom. Add destination points to
					calculate the driving time.
				</div>
			)}
		</div>
	);
};

export default RouteDuration;
