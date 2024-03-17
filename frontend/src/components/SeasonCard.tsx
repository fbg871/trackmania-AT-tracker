import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CardActionArea } from "@mui/material";
import { ISeasonData } from "../services/trackmaniaApi";

interface SeasonCardProps {
  season: ISeasonData;
  onClick: () => void; // Add a click handler
}

const SeasonCard: React.FC<SeasonCardProps> = ({ season, onClick }) => {
  const [missingAuthorMedals, setMissingAuthorMedals] = useState<number>(0);

  useEffect(() => {
    if (season.maps) {
      const missingMedals = season.maps.filter((map) => map.medal !== 4).length;
      setMissingAuthorMedals(missingMedals);
    }
  }, []);

  return (
    <Card sx={{ minWidth: 275, margin: 2 }} onClick={onClick}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h5" component="div">
            {season.name}
          </Typography>
          {/* Placeholder for additional number, can be updated later */}
          <Typography color="text.secondary">
            Missing ATs: {missingAuthorMedals}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SeasonCard;
