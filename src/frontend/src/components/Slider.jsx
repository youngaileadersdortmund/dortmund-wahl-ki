import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import parties_metadata from "../../public/parties_metadata.json";
import React from "react";

export function Slider() {
  const allImages = React.useMemo(() => {
    const images = [];
    for (const partyKey in parties_metadata) {
      const partyData = parties_metadata[partyKey];
      for (let i = 0; i < 5; i++) {
        images.push({
          id: `${partyKey}-${i}`,
          src: `./2025/${partyData.name.toLowerCase()}/0_${i}.png`,
          alt: `${partyData.name} - ${
            partyData.en.visual_impact_points[i] || "Image " + (i + 1)
          }`,
        });
      }
    }
    return images;
  }, []);

  
  return (
    <Carousel
      className="w-full max-w-lg mx-auto"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
    >
      <CarouselContent>
        {allImages.map((image) => (
          <CarouselItem key={image.id}>
            <div className="p-1">
              <div className="rounded-lg w-fit overflow-hidden shadow-lg">
                <img src={image.src} alt={image.alt} />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-secondary" />
      <CarouselNext className="bg-secondary" />
    </Carousel>
  );
}
