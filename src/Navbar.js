import "./App.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import HelpIcon from "@mui/icons-material/Help";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import BrushIcon from "@mui/icons-material/Brush";
import Tooltip from "@mui/material/Tooltip";

const Navbar = ({ handleSetModalView }) => {
	return (
		<div className="navbar">
			<div className="project-name navbar-left">
				<MyLocationIcon fontSize="large" />
				<p>Route optimisation</p>
			</div>
			<div className="navbar-right">
				<div className="tomtom icon">
					<Tooltip title="TomTom API" placement="bottom">
						<a href="https://developer.tomtom.com/" target="_blank">
							<SyncAltIcon />
						</a>
					</Tooltip>
				</div>
				<div className="material icon">
					<Tooltip title="Material UI" placement="bottom">
						<a href="https://mui.com//" target="_blank">
							<BrushIcon />
						</a>
					</Tooltip>
				</div>

				<div className="project-repo icon">
					<Tooltip title="Project repo" placement="bottom">
						<a
							href="https://github.com/KaustubhKumar05/Route-Optimisation"
							target="_blank"
						>
							<GitHubIcon fontSize="large" />
						</a>
					</Tooltip>
				</div>
				<div className="icon">
					<Tooltip title="Help" placement="bottom">
						<HelpIcon fontSize="large" onClick={handleSetModalView} />
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
