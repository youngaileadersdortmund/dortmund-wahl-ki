import React from "react";
import CustomBox from "./CustomBox";

const GenAIBox = ({ selectedImageIndex, setSelectedImageIndex }) => {
  const images = ['/orig1.jpg', '/orig2.jpg', '/orig3.jpg'];

  return (
    <CustomBox title="Was ist GenAI" align="left">
      <div className="text-center text-black space-y-3">
        <p>
          In unserem Projekt geht es darum, die Wahlprogramme zu Dortmunder Kommunalwahl am{" "}
          <span className="font-bold text-black">14.09.2025</span> durch eine KI aufzubereiten.
        </p>
        <p>
          Die Wahlprogramme wurden einem generativen Sprachmodell (Unserer KI) gegeben und es sollten
          Gemeinsamkeiten und Unterschiede der Programme herausgestellt werden. Diese wurden dann einer
          KI zu Bildgenerierung übergeben mit dem Ziel die Kernpunkte der Wahlprogramme anhand Bilder aus Dortmund zu verdeutlichen.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-center">
        <img src="/pipeline.png" className="w-full rounded" />
      </div>

      <div className="text-black">Wähle ein Bild aus um die Ergebnisse zu sehen:</div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-full">
        {images.map((src, index) => (
          <div
            key={index}
            className={`relative w-full pt-[75%] rounded overflow-hidden border-4 transition-all duration-300 cursor-pointer ${
              selectedImageIndex === index ? 'border-primary scale-[1.03]' : 'border-transparent'
            }`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <img
              src={src}
              alt={`Original ${index + 1}`}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </CustomBox>
  );
};

export default GenAIBox;