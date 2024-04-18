import { Button, Grid, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccountId } from "../services/trackmaniaApi";
import StartIcon from "@mui/icons-material/Start";
function LoginForm() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    fetchAccountId();
    navigate("/seasons");
  };

  const handleChange = (e: any) => {
    setUsername(e.target.value);
  };

  async function fetchAccountId() {
    await getAccountId(username);
  }
  return (
    <Grid container item sx={{ mb: "40px" }}>
      <form
        onSubmit={handleSubmit}
        style={{ width: "100%", display: "flex", alignItems: "center" }}
      >
        <Grid item xs={11}>
          <TextField
            label="Ubisoft username"
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            aria-label="upload picture"
            type="submit"
            sx={{ height: "100%", width: "100%", borderRadius: 0 }}
          >
            <StartIcon />
          </IconButton>
        </Grid>
      </form>
    </Grid>
  );
}

export default LoginForm;
