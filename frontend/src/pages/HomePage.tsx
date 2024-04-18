import Layout from "./Layout";
import LoginForm from "../components/LoginForm";
import AccountHistoryList from "../components/AccountHistoryList";
import { Grid } from "@mui/material";

function HomePage() {
  return (
    <Layout>
      <Grid
        container
        sx={{
          mt: "50px",
          border: "1px solid #ccc",
          padding: "50px",
          maxWidth: 700,
        }}
      >
        <LoginForm />
        <AccountHistoryList />
      </Grid>
    </Layout>
  );
}

export default HomePage;
