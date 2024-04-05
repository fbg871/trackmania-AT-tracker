import { Card, CardContent, IconButton, Typography } from "@mui/material";
import { IMapData } from "../services/trackmaniaApi";
import { Star, StarBorderOutlined } from "@mui/icons-material";
import {
  addOrRemoveFavorite,
  getFavorites,
} from "../services/localStorageService";

interface MapCardProps {
  mapData: IMapData;
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  setSelectedMap: (map: IMapData) => void;
  setModalOpen: (open: boolean) => void;
}

function MapCard({
  mapData,
  favorites,
  setFavorites,
  setSelectedMap,
  setModalOpen,
}: MapCardProps) {
  function formatTime(ms: number, symbol?: "+" | "-"): string {
    if (ms === 0) return "-: - -.- - -  ";

    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(3);
    return `${symbol ?? ""}${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  }

  function formatDelta(ms: number): string {
    return formatTime(Math.abs(ms), ms > 0 ? "+" : "-");
  }

  function toggleFavorite() {
    addOrRemoveFavorite(mapData.name);
    setFavorites(getFavorites());
  }

  return (
    <Card
      sx={{
        // minWidth: 150,
        backgroundImage: `url(${mapData.thumbnailUrl})`,
        backgroundSize: "cover",
        border: mapData.medal === 4 ? "10px solid green" : "10px solid red",
      }}
      onClick={() => {
        setModalOpen(true);
        setSelectedMap(mapData);
      }}
    >
      <CardContent sx={{ color: "white" }}>
        <img src={"../assets/authormedal.png"} alt="authormedal" />
        {/* star button icon for favoriting maps */}
        <IconButton onClick={toggleFavorite}>
          {favorites.includes(mapData.name) ? <Star /> : <StarBorderOutlined />}
        </IconButton>

        <Typography sx={{ mb: 6 }}></Typography>
        <Typography
          variant="h5"
          component="div"
          color="white"
          textAlign="right"
        >
          {"#" + mapData.num + " " + mapData.name}
        </Typography>
        <Typography
          variant="body2"
          textAlign="right"
          sx={{
            backgroundColor: "grey",
            opacity: 0.75,
            padding: 1,
          }}
        >
          Author Time: {formatTime(mapData.authorScore)}
          <br />
          Personal Best: {formatTime(mapData.personalBest)}
        </Typography>
        {mapData.delta && (
          <Typography
            variant="h6"
            textAlign="right"
            sx={{
              opacity: 0.75,
              backgroundColor: "grey",
            }}
            color={mapData.delta < 0 ? "blue" : "red"}
          >
            {formatDelta(mapData.delta)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default MapCard;
