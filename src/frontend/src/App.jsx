import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import ImpressumPage from "./pages/ImpressumPage";
import PrivacyPage from "./pages/PrivacyPage";
import TeamPage from "./pages/TeamPage";
import TechPage from "./pages/TechPage";

function App() {
  return (
    <Router basename="dortmund-wahl-ki.de/">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="impressum" element={<ImpressumPage />} />
          <Route path="datenschutz" element={<PrivacyPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="tech" element={<TechPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
