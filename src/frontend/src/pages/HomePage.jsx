import React, { useState } from "react";
import GenAIBox from "../components/GenAIBox";
import Disclaimer from "../components/Disclaimer";
import { Slider } from "../components/Slider";
import { useTranslation } from "react-i18next";
import Grid from "../components/Grid";

function HomePage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { t } = useTranslation();

  return (
    <div className="flex justify-center flex-col">
      <div className="flex gap-16 px-32">
        <GenAIBox
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
        <Slider />
      </div>

      <div className="border-t-2 border-secondary mt-10">
        <h1 className="text-secondary py-8">
          {t("nav_bar.Whalprogramm")} 2025
        </h1>
      </div>
      <div>
        <Grid />
      </div>

      {/* <div className='border-t-4 border-secondary my-10'>
                    <h1 className='text-secondary m-5'>Anfrage an die KI</h1>
                </div> */}
      {/* <PromptDescription></PromptDescription> */}
      <div className="max-w-3xl self-center">
        <Disclaimer></Disclaimer>
      </div>
    </div>
  );
}

export default HomePage;
