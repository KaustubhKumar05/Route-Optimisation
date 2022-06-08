import LocationInput from "./LocationInput";
import RouteDuration from "./RouteDuration";
const Dashboard = ({ routeDuration, updateLocation }) => {
  return (
    <div className="dashboard">
      <LocationInput updateLocation={updateLocation} />
      <RouteDuration duration={routeDuration} />
    </div>
  );
};

export default Dashboard;
