import { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import MoreInfoButton from "./MoreInfoButton";
import { useTranslation } from "react-i18next";

function Card({ card, paths, partyKey, gridKey }) {
  const [isHovered, setIsHovered] = useState(false);
  const [randomIndex] = useState(() => Math.floor(Math.random() * 5));
  const [visualPoints, setVisualPoints] = useState([]);
  const [reasoningData, setReasoningData] = useState([]);

  const { i18n } = useTranslation();
  const langKey = i18n.language || "de";

  // Load points and reasoning from .txt files asynchronously
  useEffect(() => {
    const fetchData = async () => {
      if (!paths || !partyKey || !paths.base || !gridKey || !langKey) {
        setVisualPoints([]);
        setReasoningData([]);
        return;
      }
      // gridKey: 'kommunalomat' or 'program', langKey: 'de' or 'en'
      if (!paths[gridKey] || !paths[langKey] || !paths[langKey].prompt || !paths[langKey].reasoning) {
        setVisualPoints([]);
        setReasoningData([]);
        return;
      }
      const point_fname = `${paths.base}/${partyKey}/${paths[gridKey]}/${paths[langKey].prompt}`;
      const reasoning_fname = `${paths.base}/${partyKey}/${paths[gridKey]}/${paths[langKey].reasoning}`;
      // Fetch points
      try {
        const response = await fetch(point_fname);
        if (!response.ok) throw new Error('File not found');
        const text = await response.text();
        if (text.trim().startsWith('<!doctype html>') || text.trim().startsWith('<html')) {
          setVisualPoints(['No data for selected party.']);
        } else {
          const points = text.split(',').map(s => s.trim()).filter(Boolean);
          setVisualPoints(points.length ? points : ['No data for selected party.']);
        }
      } catch (e) {
        setVisualPoints(['No data for selected party.']);
      }
      // Fetch reasoning
      try {
        const response = await fetch(reasoning_fname);
        if (!response.ok) throw new Error('File not found');
        const text = await response.text();
        if (text.trim().startsWith('<!doctype html>') || text.trim().startsWith('<html')) {
          setReasoningData(['No reasoning data for selected party.']);
        } else {
          // Split by comma, trim whitespace, filter out empty strings
          const reasonings = [text]; // text.split(',').map(s => s.trim()).filter(Boolean);
          setReasoningData(reasonings.length ? reasonings : ['No reasoning data for selected party.']);
        }
      } catch (e) {
        setReasoningData(['No reasoning data for selected party.']);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths, partyKey, gridKey, langKey]);

  const partyName = (card && card.name) || "Unknown";
  const images_dir = `${paths.base}/${partyKey}/${paths[gridKey]}/${paths.images}`;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative"
    >
      <div className="p-2">
        <div className="relative w-full h-72">
          <img
            src={`${images_dir}/0_${randomIndex}.png`}
            alt={partyName}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "public/placeholder.jpg";
            }}
          />
          <div
            className={`flex flex-col py-4 px-3 justify-between absolute inset-0 bg-white bg-opacity-90 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="space-y-2">
              {visualPoints.map((bullet, index) => (
                <div key={index} className="flex items-start">
                  <FaCheckCircle className=" text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{bullet}</span>
                </div>
              ))}
            </div>
            <MoreInfoButton card={card} images_dir={images_dir} reasoningData={reasoningData} visualPoints={visualPoints} setIsHovered={setIsHovered} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mt-3 text-center">
          {partyName}
        </h3>
      </div>
    </div>
  );
}

function Grid({ parties_metadata, gridKey }) {
  const paths = parties_metadata.paths
  const parties = parties_metadata.parties
  const cards = Object.entries(parties);

  return (
    <div className="container mx-auto px-12 min-h-screen ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cards.map(([partyKey, partyData]) => (
          <Card key={partyKey} card={partyData} paths={paths} partyKey={partyKey} gridKey={gridKey} />
        ))}
      </div>
    </div>
  );
}

export default Grid;
