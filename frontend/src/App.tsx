import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import FavouritesPage from "./pages/FavouritesPage";
import SeasonsPage from "./pages/SeasonsPage";
import SeasonPage from "./pages/SeasonPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/seasons" replace />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/seasons" element={<SeasonsPage />} />
        <Route path="/seasons/:seasonNumber" element={<SeasonPage />} />
      </Routes>
    </Router>
  );
}

export default App;
