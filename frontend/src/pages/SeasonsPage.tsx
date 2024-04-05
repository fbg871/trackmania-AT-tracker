import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@mui/material";
import SeasonsGrid from "../components/SeasonsGrid";
import Layout from "./Layout";
import { useEffect, useState } from "react";
import { ISeasonInfo, getSeasons } from "../services/trackmaniaApi";
import { getAccount } from "../services/localStorageService";
import { useNavigate } from "react-router-dom";

function SeasonsPage() {
  const [seasons, setSeasons] = useState<ISeasonInfo[]>();
  const [totalAuthorMedals, setTotalAuthorMedals] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!getAccount()) navigate("/");

    if (seasons) return;

    fetchSeasons();
  }, []);

  async function fetchSeasons() {
    const data = await getSeasons();
    if (!data) return;
    setSeasons(data);

    let total = 0;
    for (const season of data) {
      total += season.authorMedalCount;
    }

    console.log("total", total, "possible", data.length * 25);
    setTotalAuthorMedals(total);
  }

  function getPercentage() {
    if (!seasons) return 0;
    return (totalAuthorMedals / (seasons.length * 25)) * 100;
  }

  if (!seasons) return null;

  return (
    <Layout>
      <LinearProgressWithLabel value={getPercentage()} />
      <SeasonsGrid seasons={seasons} />
    </Layout>
  );
}

export default SeasonsPage;

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number },
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
