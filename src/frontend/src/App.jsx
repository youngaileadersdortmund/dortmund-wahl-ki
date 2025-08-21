import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import ImpressumPage from "./pages/ImpressumPage";
import InfoPage from "./pages/InfoPage";

function App() {
  return (
    <Router basename="/ai-for-political-education/">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="impressum" element={<ImpressumPage />} />
          <Route path="about-the-project" element={<InfoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
