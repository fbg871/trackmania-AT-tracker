import { Grid } from "@mui/material";
import SeasonCard from "./SeasonCard";
import { useNavigate } from "react-router";
import { ISeasonInfo } from "../services/trackmaniaApi";

function SeasonsGrid({ seasons }: { seasons: ISeasonInfo[] }) {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      {seasons.map((season, index) => (
        <SeasonCard
          index={index}
          season={season}
          onClick={() => navigate(`/seasons/${season.number}`)}
        />
      ))}
    </Grid>
  );
}

export default SeasonsGrid;
