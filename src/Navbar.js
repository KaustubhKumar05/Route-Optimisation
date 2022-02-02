import "./App.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import HelpIcon from "@mui/icons-material/Help";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const Navbar = () => {
	return (
		<div className="navbar">
			<div className="project-name navbar-left">
				<MyLocationIcon />
				Path optimisation
			</div>
			<div className="navbar-right">
				<div className="project-repo icon">
					<GitHubIcon />
				</div>
				<div className="modal icon">
					<HelpIcon />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
