import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
} from "@mui/material";
import { ISeasonInfo } from "../services/trackmaniaApi";

interface ISeasonCardProps {
  index: number;
  season: ISeasonInfo;
  onClick: () => void; // Add a click handler
}

function SeasonCard({ season, onClick, index }: ISeasonCardProps) {
  return (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card sx={{ minWidth: 275, margin: 2 }} onClick={onClick}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" component="div">
              {season.name}
            </Typography>
            {/* Placeholder for additional number, can be updated later */}
            <Typography color="text.secondary">
              Missing ATs: {25 - season.authorMedalCount}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default SeasonCard;
