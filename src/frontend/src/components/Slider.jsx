import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { usePartyImages } from "../../hooks/usePartyImages";
import { FaCheckCircle } from "react-icons/fa";
import FadeLoader from "react-spinners/FadeLoader";

export function Slider({ lang = "de", metadata = {} }) {
  const { images, isLoading } = usePartyImages(lang, true, metadata);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <FadeLoader color="#52B49B" />
      </div>
    );

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
        {images.map((image) => (
          <CarouselItem key={image.id}>
            <div className="flex xs:flex-col sm:flex-row p-5 gap-24 items-center justify-center">
              <div className="max-w-[400px] text-left">
                <h2 className="text-2xl font-bold mb-5">{image.partyName}</h2>
                {image.visualImpactPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start content-center">
                    <FaCheckCircle className="text-secondary text-lg self-center mr-2 my-4" />
                    <span className="text-gray-700 text-xl self-center">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg max-w-[390px] aspect-square">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
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
