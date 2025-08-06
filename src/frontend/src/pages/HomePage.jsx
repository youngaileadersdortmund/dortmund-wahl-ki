import { useState } from "react";
import Disclaimer from "../components/Disclaimer";
import { Slider } from "../components/Slider";
import { useTranslation } from "react-i18next";
import Grid from "../components/Grid";

function HomePage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-0">
      <h1 className="text-primary py-8 md:p-12 text-2xl md:text-3xl font-bold text-center">
        {t("home.second_headline")} 2025
      </h1>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full md:px-32">
        <div
          className="flex items-center justify-center rounded-lg w-full md:w-2/5"
        >
          <span className="text-center w-full py-6 px-4 md:px-8">
            <h1 className="text-2xl md:text-3xl font-bold">
              <p>... der Grünen?</p>
              <p>“mehr Grün in der Stadt,
              mehr bla, mehr blub”</p>
            </h1>
          </span>
        </div>
        <div className="w-full md:w-3/5 flex justify-center">
          <div className="w-64 md:w-full"> {/* Make slider smaller on mobile */}
            <Slider />
          </div>
        </div>
      </div>

      <div className="border-t-2 border-secondary mt-8 md:mt-10 w-full">
        <h1 className="text-secondary py-6 md:py-8 text-center">
          {t("home.programs")}
        </h1>
      </div>
      <div className="w-full">
        <Grid />
      </div>

      <div className="max-w-3xl w-full self-center px-2 md:px-0">
        <Disclaimer />
      </div>
    </div>
  );
}

export default HomePage;
