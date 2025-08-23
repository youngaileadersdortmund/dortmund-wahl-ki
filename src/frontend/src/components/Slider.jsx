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
  const paths = parties_metadata.paths;
  const allImages = React.useMemo(() => {
    const images = [];
    for (const partyKey in parties_metadata.parties) {
      const partyData = parties_metadata.parties[partyKey];
      images.push({
        id: `${partyKey}`,
        src: `${paths.base}/${partyKey}/${paths.kommunalomat}/${paths.images}/0_0.png`,
        alt: `${partyData.name}`
      });
      // for (let i = 0; i < 5; i++) {
      //   images.push({
      //     id: `${partyKey}-${i}`,
      //     src: `./2025/${partyData.name.toLowerCase()}/0_${i}.png`,
      //     alt: `${partyData.name} - ${
      //       partyData.en.visual_impact_points[i] || "Image " + (i + 1)
      //     }`,
      //   });
      // }
    }
    return images;
  }, []);

  return (
    <Carousel
      className="w-full"
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
            <div className="flex p-5 gap-24 items-center">
              <div className="text-4xl text-red-800">
                <span className="text-center py-6 px-4 md:px-8">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    <p>... der Grünen?</p>
                    <p>“mehr Grün in der Stadt, mehr bla, mehr blub”</p>
                  </h1>
                </span>
              </div>

              <div className="rounded-lg overflow-hidden shadow-lg">
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
