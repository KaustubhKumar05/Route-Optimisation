import "./App.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import HelpIcon from "@mui/icons-material/Help";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const Navbar = () => {
	return (
		<div className="navbar">
			<div className="project-name navbar-left">
				<MyLocationIcon fontSize="large" />
				<p>Route optimisation</p>
			</div>
			<div className="navbar-right">
				<div className="project-repo icon">
					<GitHubIcon fontSize="large" />
				</div>
				<div className="modal icon">
					<HelpIcon fontSize="large" />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
