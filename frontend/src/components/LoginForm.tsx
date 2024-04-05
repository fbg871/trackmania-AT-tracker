import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccountId } from "../services/trackmaniaApi";

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
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            label="Ubisoft username"
            variant="outlined"
            onChange={handleChange}
          />
        </form>
      </Grid>
      <Button type="submit">Go!</Button>
    </Grid>
  );
}

export default LoginForm;
