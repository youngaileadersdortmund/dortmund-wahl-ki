import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";

export default function MoreInfoButton({ card, setIsHovered }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const imageIndexes = [0, 1, 2, 3, 4];
  const cardName = card.name.toLowerCase();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white">
          More info
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="sm:max-w-4xl md:max-w-[63rem] text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl">{card.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4 items-start">
          {/* Left Column: Description */}
          <div>
            <h3 className="font-semibold mb-2 text-lg">Description</h3>
            <DialogDescription className="text-gray-300">
              This is a detailed description for {card.name}.
            </DialogDescription>
          </div>

          {/* Right Column: Main Image + Thumbnails */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-video w-full">
              <img
                className="h-full w-full object-contain rounded-lg shadow-lg"
                src={`./2025/${cardName}/0_${selectedImageIndex}.png`}
                alt={`${card.name} - Image ${selectedImageIndex + 1}`}
                key={selectedImageIndex}
              />
            </div>
            <div className="flex gap-2 justify-center md:justify-start">
              {imageIndexes.map((index) => (
                <div
                  key={index}
                  className={`relative aspect-square w-16 h-16 md:w-24 md:h-24 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-secondary scale-105"
                      : "border-transparent hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    className="h-full w-full object-cover"
                    src={`./2025/${cardName}/0_${index}.png`}
                    alt={`${card.name} thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-4">
          <DialogClose asChild>
            <Button onClick={() => setIsHovered(false)} className="bg-secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
