import { Grid } from "@mui/material";
import Header from "./Header";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      container
      sx={{
        padding: "0px",
        justifyContent: "center",
      }}
    >
      <Header />
      {children}
    </Grid>
  );
}

export default Layout;
