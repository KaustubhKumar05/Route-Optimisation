import { useEffect } from "react";
import formatDuration from "../assets/formatDuration";

const RouteDuration = ({ duration }) => {
  useEffect(() => {
    console.log(duration);
  }, [duration]);

  return (
    <div className="route-duration">
      <div className="right-panel">
        {duration > 0 ? (
          <div className="right-panel-text">
            Estimated time for route completion is {formatDuration(duration)}
          </div>
        ) : (
          <div className="right-panel-text">
            {" "}
            Scroll over the map to adjust the zoom. Add destination points to
            calculate the driving time.
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteDuration;
