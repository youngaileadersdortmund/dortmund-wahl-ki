import Disclaimer from "../components/Disclaimer";
import { Slider } from "../components/Slider";
import { useTranslation } from "react-i18next";
import Grid from "../components/Grid";

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-0">
      <h1 className="text-primary py-8 md:p-6 text-2xl md:text-3xl font-bold text-center">
        {t("home.second_headline")} 2025
      </h1>

      <div className="max-w-5xl w-full self-center px-2 md:px-0">
        <Slider />
      </div>

      <div className="border-t-2 border-secondary mt-8 md:mt-10 w-full">
        <h1 className="text-secondary py-6 md:py-8 text-center">
          {t("home.programs")}
        </h1>
      </div>

      <Grid />

      <div className="max-w-3xl w-full self-center px-2 md:px-0">
        <Disclaimer />
      </div>
    </div>
  );
}

export default HomePage;
