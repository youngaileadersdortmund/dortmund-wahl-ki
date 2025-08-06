import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ImpressumPage from "./pages/ImpressumPage";
import InfoPage from "./pages/InfoPage";

function App() {
  return (
    <Router>
      <div className="w-full flex justify-center items-center flex-col overflow-x-hidden">
        <MenuBar />
        <ScrollToTopButton />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/about-the-project" element={<InfoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
