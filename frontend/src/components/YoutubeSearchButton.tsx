import { Button } from "@mui/material";

function YoutubeSearchButton({ searchQuery }: { searchQuery: string }) {
  function formatSearchQuery(searchQuery: string): string {
    return searchQuery.split(" ").join("+");
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        window.open(
          `https://www.youtube.com/results?search_query=${formatSearchQuery(
            searchQuery,
          )}+author+medal`,
          "_blank",
        );
      }}
    >
      Search on Youtube
    </Button>
  );
}

export default YoutubeSearchButton;
