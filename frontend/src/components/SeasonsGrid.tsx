import React from "react";
import { Grid } from "@mui/material";
import { ISeasonData } from "../services/trackmaniaApi";
import SeasonCard from "./SeasonCard";
import { useNavigate } from "react-router";

const SeasonsGrid: React.FC<{ seasons: ISeasonData[] }> = ({ seasons }) => {
  const navigate = useNavigate();

  const handleCardClick = (seasonName: string) => {
    const path = seasonName.toLowerCase().replace(" ", "-");
    navigate(`/${path}`);
  };

  const groupSeasonsByYear = (seasons: ISeasonData[]) => {
    const grouped = {};
    seasons.forEach((season) => {
      const [seasonName, year] = season.name.split(" ");
      if (!grouped[year]) {
        grouped[year] = {
          year,
          seasons: { Winter: null, Spring: null, Summer: null, Fall: null },
        };
      }
      grouped[year].seasons[seasonName] = season;
    });
    return Object.values(grouped).sort((a, b) => b.year - a.year); // Sort by year descending
  };

  console.log("groupSeasonsByYear(seasons)", groupSeasonsByYear(seasons));
  const groupedSeasons = groupSeasonsByYear(seasons);

  return (
    <Grid container spacing={2}>
      {groupedSeasons.map((yearGroup, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12}>
            <h2>{yearGroup.year}</h2>
          </Grid>
          {Object.entries(yearGroup.seasons).map(([seasonName, seasonData]) => (
            <Grid item xs={12} sm={6} md={3} key={seasonName}>
              {seasonData && (
                <SeasonCard
                  season={seasonData}
                  onClick={() => handleCardClick(seasonData.name)}
                />
              )}
            </Grid>
          ))}
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default SeasonsGrid;
