import { useState } from "react";
import Disclaimer from "../components/Disclaimer";
import { Slider } from "../components/Slider";
import { useTranslation } from "react-i18next";
import parties_metadata from "../../public/parties_metadata.json";
import Grid from "../components/Grid";
import GridSelector from "../components/GridSelector";

function HomePage() {
  const { t } = useTranslation();
  // default to "kommu" (kommunalomat view). Use "program" to show program view.
  const [grid, setGrid] = useState("kommunalomat");

  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-0">
      <h1 className="text-primary py-8 md:p-6 text-2xl md:text-3xl font-bold text-center">
        {t("home.second_headline")}
      </h1>

      <div className="max-w-5xl w-full self-center px-2 md:px-0">
        <Slider />
      </div>

      <div className="grid grid-cols-3 items-center border-t-2 border-secondary mt-8 md:mt-10 w-full">
        <div /> {/* left spacer */}
        <h1 className="justify-self-center text-secondary py-6 md:py-8 text-center whitespace-nowrap">
          {t("home.programs")}
        </h1>
        <div className="justify-self-end">
          <GridSelector selected={grid} onSelect={setGrid} />
        </div>
      </div>

      <Grid parties_metadata={parties_metadata} gridKey={grid} />

      <div className="max-w-3xl w-full self-center px-2 md:px-0">
        <Disclaimer />
      </div>
    </div>
  );
}

export default HomePage;
