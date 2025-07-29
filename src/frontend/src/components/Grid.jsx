import { useState } from "react";
import cards_info from "../../public/cards_info.json";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "./ui/button";

function Card({ card }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative"
    >
      <div className="p-2">
        <div className="relative w-full h-72">
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-cover rounded-md"
          />
          <div
            className={`flex flex-col py-4 px-3 justify-between absolute inset-0 bg-white bg-opacity-90 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="space-y-2">
              {card.bullets.map((bullet, index) => (
                <div key={index} className="flex items-start">
                  <FaCheckCircle className=" text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{bullet}</span>
                </div>
              ))}
            </div>
            <Button className="active:scale-95 transition duration-100 bg-pink-600 hover:bg-pink-700 w-full">
              More info
            </Button>
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
  const cards = cards_info;

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default Grid;
