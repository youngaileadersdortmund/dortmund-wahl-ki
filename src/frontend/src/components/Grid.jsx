import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import MoreInfoButton from "./MoreInfoButton";
import { useTranslation } from "react-i18next";

function Card({ card }) {
  const [isHovered, setIsHovered] = useState(false);
  const [randomIndex] = useState(() => Math.floor(Math.random() * 5));

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || "de";

  const getPointsForCard = (cardObj, lang) => {
    if (!cardObj || typeof cardObj !== "object") return [];

    const tryLang = (l) => {
      const langObj = cardObj[l];
      if (!langObj || typeof langObj !== "object") return null;
      if (Array.isArray(langObj.visual_impact_points))
        return langObj.visual_impact_points;
      if (Array.isArray(langObj.visual_points)) return langObj.visual_points;
      return null;
    };

    let pts = tryLang(lang);
    if (!pts) pts = tryLang("de");
    if (!pts) pts = tryLang("en");
    if (!pts) {
      if (Array.isArray(cardObj.visual_impact_points))
        pts = cardObj.visual_impact_points;
      else if (Array.isArray(cardObj.visual_points))
        pts = cardObj.visual_points;
    }
    return Array.isArray(pts) ? pts : [];
  };

  const visualImpactPoints = getPointsForCard(card, currentLanguage);

  const partyName = (card && card.name) || "Unknown";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative"
    >
      <div className="p-2">
        <div className="relative w-full h-72">
          <img
            src={`./2025/${partyName.toLowerCase()}/0_${randomIndex}.png`}
            alt={partyName}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              // graceful fallback if image missing
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.png";
            }}
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
          {partyName}
        </h3>
      </div>
    </div>
  );
}

function Grid({ parties_metadata }) {
  const cards = Object.entries(parties_metadata);

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      <div
        className="grid
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-5
                  gap-4 sm:gap-6 lg:gap-8"
      >
        {cards.map(([partyKey, partyData]) => (
          <div key={partyKey} className="w-full min-w-0">
            <Card card={partyData} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Grid;
