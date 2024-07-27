import { Card,  Grid, IconButton, Typography } from "@mui/material";
import { IMapData } from "../services/trackmaniaApi";
import { Star, StarBorderOutlined } from "@mui/icons-material";
import {
  addOrRemoveFavorite,
  getFavorites,
} from "../services/localStorageService";
import YoutubeSearchButton from "./YoutubeSearchButton";
import authorMedal from '../assets/authormedal.png';

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
    <>
    <Grid item 
    onClick={() => setSelectedMap(mapData)}
    sx={{
      display: 'flex',
      bgcolor: "green",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 10,
      height: 'auto',
      mt: '5px',
      padding: '5px',
      paddingLeft: '10px',
      paddingRight: '10px',
      cursor: 'pointer',
      '&:hover': {
        bgcolor: 'darkgreen', // Change to your desired hover color
      },


    }}>
      <Typography variant="h4" textAlign="left" color="white">
        {mapData.num}
      </Typography>
      
      {mapData.medal === 4 && <img  src={authorMedal} alt="author medal" style={{
        width: '40px', 
        height: '40px', 
        transform: 'skewX(10deg)',
        marginLeft: 'auto'
        }} />}
    </Grid>
    </>
  );
}

export default MapCard;
