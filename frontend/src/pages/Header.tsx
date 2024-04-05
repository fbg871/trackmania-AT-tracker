import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { getAccount } from "../services/localStorageService";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Trackmania Season Records</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="h6">{getAccount()?.username ?? ""}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
