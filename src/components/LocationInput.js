import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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

const LocationInput = ({ updateLocation }) => {
  const [portrait, setPortrait] = useState(
    !window.matchMedia("(orientation:landscape)").matches
  );

  //For MUI themes
  const orientation = window.matchMedia("(orientation:landscape)");
  orientation.addEventListener("change", () => {
    setPortrait(!portrait);
  });

  return (
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
  );
};

export default LocationInput;
