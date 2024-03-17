import { Box, Card, CardContent, Typography } from "@mui/material";
import { IMapData } from "../services/trackmaniaApi";

interface MapCardProps {
  mapData: IMapData;
}

const medalName = ["None", "Bronze", "Silver", "Gold", "Author"];

const MapCard: React.FC<MapCardProps> = ({ mapData }) => {
  function formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(3);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  }

  function formatDelta(ms: number): string {
    if (ms < 0) return `+${formatTime(-ms)}`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(3);
    return `-${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  }

  function getTimeDelta(authorScore: number, personalBest: number) {
    return formatDelta(authorScore - personalBest);
  }
  // authomedal image is located at src/assets/authormedal.png

  return (
    <>
      <Card
        sx={{
          minWidth: 275,
          margin: 2,
          backgroundImage: `url(${mapData.thumbnailUrl})`,
          backgroundSize: "cover",
        }}
      >
        {mapData.medal === 4 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              backgroundImage: `url(src/assets/authormedal.png)`,
              backgroundSize: "cover",
              position: "absolute",
              width: "30px",
              height: "30px",
            }}
          />
        )}
        <CardContent>
          <Typography variant="h5" component="div">
            {mapData.name}
          </Typography>
          <Typography color="text.secondary">
            Author Time: {formatTime(mapData.authorScore)}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Personal Best: {formatTime(mapData.personalBest)}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Delta: {getTimeDelta(mapData.authorScore, mapData.personalBest)}
          </Typography>
          <Typography variant="body2">
            Medal: {medalName[mapData.medal]}
            <br />
            Personal Best: {formatTime(mapData.personalBest)}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default MapCard;
