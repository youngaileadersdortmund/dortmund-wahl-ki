import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import FeaturedCard from "./FeaturedCard";

export function Slider({ parties, selectedImageIndex }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {parties.map((party, index) => (
          <CarouselItem
            key={party.name || index}
            className="pl-1 md:pl-2 lg:pl-4"
          >
            <div className="p-1">
              <FeaturedCard
                party={party}
                align={index % 2 === 0 ? "left" : "right"}
                selectedImageIndex={selectedImageIndex}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-secondary" />
      <CarouselNext className="bg-secondary" />
    </Carousel>
  );
}
