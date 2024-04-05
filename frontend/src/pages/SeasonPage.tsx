import { useEffect, useState } from "react";
import { ISeasonData, getSeasonRecords } from "../services/trackmaniaApi";
import { useParams } from "react-router";
import Layout from "./Layout";
import SeasonMaps from "../components/SeasonMaps";
import { Button } from "@mui/material";

function SeasonPage() {
  const [season, setSeason] = useState<ISeasonData>();
  const [isFetching, setIsFetching] = useState(false);
  const { seasonNumber } = useParams();

  useEffect(() => {
    if (season || !seasonNumber || isFetching) return;

    setIsFetching(true);
    fetchSeason(seasonNumber);
  }, []);

  async function fetchSeason(seasonNumber: string) {
    const data = await getSeasonRecords(parseInt(seasonNumber));
    if (!data) return;
    setSeason(data);
    setIsFetching(false);
  }

  if (!season) return null;

  function sortByDelta() {
    if (!season) return;
    const sortedSeason = { ...season };
    sortedSeason.maps = [...season.maps].sort((a, b) => {
      return b.delta - a.delta;
    });
    setSeason(sortedSeason);
  }

  return (
    <Layout>
      <Button onClick={sortByDelta}>Sort by delta</Button>
      <SeasonMaps season={season} />;
    </Layout>
  );
}

export default SeasonPage;
