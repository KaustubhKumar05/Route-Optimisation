import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF"
    },
    secondary: {
      main: "#11cb5f"
    }
  }
});

const Modal = ({ handleSetModalView }) => {
  return (
    <div className="modal-bg">
      <div className="modal">
        <h2>Matrix routing using TomTom API</h2>
        <div className="text">
          <p>Drag and drop the pointer to change your location. </p>
          <p>The location can also be updated by entering coordinates.</p>
          <p>
            Click on the map to add destination markers to generate the optimal
            route.
          </p>
        </div>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            size="medium"
            onClick={handleSetModalView}
          >
            Close
          </Button>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Modal;
