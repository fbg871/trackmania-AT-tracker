import { Grid } from "@mui/material";
import { ISeasonData } from "../services/trackmaniaApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import MapCard from "./MapCard";

function SeasonMapsGrid({ seasons }: { seasons: ISeasonData[] }) {
  const [season, setSeason] = useState<ISeasonData>();
  const { seasonName } = useParams();

  useEffect(() => {
    if (season) return;
    if (!seasonName) return;
    const seasonNameFormatted = seasonName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setSeason(seasons.find((s) => s.name === seasonNameFormatted));
  }, []);

  if (!season) {
    return <p>Loading...</p>;
  }

  return (
    <Grid container spacing={2}>
      {season.maps.map((map, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <MapCard mapData={map} />
        </Grid>
      ))}
    </Grid>
  );
}

export default SeasonMapsGrid;
