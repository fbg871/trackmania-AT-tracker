import Layout from "./Layout";
import LoginForm from "../components/LoginForm";
import AccountHistoryList from "../components/AccountHistoryList";
import { Box } from "@mui/material";

function HomePage() {
  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <LoginForm />
        <AccountHistoryList />
      </Box>
    </Layout>
  );
}

export default HomePage;
