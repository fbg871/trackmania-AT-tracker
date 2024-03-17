import { useEffect, useState } from "react";
import "./App.css";
import { ISeasonData, getMyOfficialRecords } from "./services/trackmaniaApi";
import { Button, Grid } from "@mui/material";
import SeasonMapsGrid from "./components/SeasonMapsGrid";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";
import SeasonsGrid from "./components/SeasonsGrid";

function App() {
  const [data, setData] = useState<ISeasonData[]>();

  async function fetchRecords() {
    const data = localStorage.getItem("officialRecords");
    if (data) {
      setData(JSON.parse(data));
    } else {
      getMyOfficialRecords().then((data) => {
        localStorage.setItem("officialRecords", JSON.stringify(data));
        setData(data);
      });
    }
  }

  useEffect(() => {
    if (data) return;
    fetchRecords();
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/:seasonName"
          element={<SeasonMapsGrid seasons={data} />}
        />
        <Route path="/" element={<SeasonsGrid seasons={data} />} />
      </Routes>
    </Router>
  );

  return (
    <Grid container spacing={2}>
      <Button
        onClick={() => {
          getMyOfficialRecords().then((data) => {
            localStorage.setItem("officialRecords", JSON.stringify(data));
            setData(data);
          });
        }}
      >
        Refetch
      </Button>
      {data.map((season, index) => (
        <SeasonMapsGrid season={season} key={index} />
      ))}
    </Grid>
  );
}

export default App;
