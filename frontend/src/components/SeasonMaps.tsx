import { Box, Button, Grid, Modal } from "@mui/material";
import { IMapData, ISeasonData, getMapRecord } from "../services/trackmaniaApi";
import { useEffect, useState } from "react";
import MapCard from "./MapCard";
import { getFavorites } from "../services/localStorageService";

function SeasonMaps({ season }: { season: ISeasonData }) {
  if (!season) {
    return <p>Loading...</p>;
  }
  const [favorites, setFavorites] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMap, setSelectedMap] = useState<IMapData>();

  useEffect(() => {
    const storedFavorites = getFavorites();
    setFavorites(storedFavorites);
  }, []);

  function handleCloseModal() {
    setModalOpen(false);
  }

  async function refreshMap() {
    if (!selectedMap || !modalOpen) return;

    const map = await getMapRecord(selectedMap.mapId);
    if (!map) return;
    const newDelta = map.personalBest - selectedMap.authorScore;
    setSelectedMap((prev) =>
      prev ? { ...prev, ...map, delta: newDelta } : prev,
    );
  }
  function formatTime(ms: number, symbol?: "+" | "-"): string {
    if (ms === 0) return "-: - -.- - -  ";

    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(3);
    return `${symbol ?? ""}${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  }

  function formatDelta(ms: number): string {
    return formatTime(Math.abs(ms), ms > 0 ? "+" : "-");
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (modalOpen && (event.key === "r" || event.key === "R")) {
        console.log("R key pressed");
        refreshMap();
      }
    };

    if (modalOpen) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [modalOpen]);

  return (
    <>
      <Grid container spacing={2} columns={15}>
        {season.maps.map((map, index) => (
          <Grid item md={5} lg={3} key={index}>
            <MapCard
              mapData={map}
              favorites={favorites}
              setFavorites={setFavorites}
              setSelectedMap={setSelectedMap}
              setModalOpen={setModalOpen}
            />
          </Grid>
        ))}
      </Grid>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="map-modal-title"
        aria-describedby="map-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            p: 4,
          }}
        >
          {selectedMap && (
            <MapCard
              mapData={selectedMap}
              favorites={favorites}
              setFavorites={setFavorites}
              setSelectedMap={setSelectedMap}
              setModalOpen={setModalOpen}
            />
          )}
          <Button
            onClick={() => {
              setSelectedMap((prev) =>
                prev ? { ...prev, personalBest: 0 } : prev,
              );
            }}
          >
            Reset PB
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default SeasonMaps;
