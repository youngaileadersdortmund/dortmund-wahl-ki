import { useState } from "react";
import parties_metadata from "../../public/parties_metadata.json";
import { FaCheckCircle } from "react-icons/fa";
import MoreInfoButton from "./MoreInfoButton";
import { useTranslation } from "react-i18next";

function Card({ card }) {
  const [isHovered, setIsHovered] = useState(false);
  const [randomIndex] = useState(() => Math.floor(Math.random() * 5));

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const visualImpactPoints =
    card[currentLanguage]?.visual_impact_points || card.de.visual_impact_points;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative"
    >
      <div className="p-2">
        <div className="relative w-full h-72">
          <img
            src={`./2025/${card.name.toLowerCase()}/0_${randomIndex}.png`}
            alt={card.name}
            className="w-full h-full object-cover rounded-md"
          />
          <div
            className={`flex flex-col py-4 px-3 justify-between absolute inset-0 bg-white bg-opacity-90 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="space-y-2">
              {visualImpactPoints.map((bullet, index) => (
                <div key={index} className="flex items-start">
                  <FaCheckCircle className=" text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{bullet}</span>
                </div>
              ))}
            </div>
            <MoreInfoButton card={card} setIsHovered={setIsHovered} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mt-3 text-center">
          {card.name}
        </h3>
      </div>
    </div>
  );
}

function Grid() {
  const cards = Object.entries(parties_metadata);

  return (
    <div className="container mx-auto px-12 min-h-screen ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cards.map(([partyKey, partyData]) => (
          <Card key={partyKey} card={partyData} />
        ))}
      </div>
    </div>
  );
}

export default Grid;
