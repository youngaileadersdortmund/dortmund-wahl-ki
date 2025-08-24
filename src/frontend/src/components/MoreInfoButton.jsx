import { useState } from "react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
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

export default function MoreInfoButton({ card, images_dir, reasoningData, visualPoints, setIsHovered }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const turnOff = visualPoints == "No data for selected party." ? true : false;

  const imageIndexes = [0, 1, 2, 3, 4];
  const { t } = useTranslation();

  return (
    <Dialog className="overflow-y-auto">
      <DialogTrigger asChild>
        <Button onClick={() => setIsHovered(false)} className="bg-primary text-white" disabled={turnOff}>
          Details
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="sm:max-w-4xl md:max-w-[63rem] text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl">{card.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4 items-start">
          {/* Left Column: Description */}
          <div className="max-h-[32rem] overflow-y-auto pr-2">
            <h3 className="font-semibold mb-2 text-lg">{t("details.title")}</h3>
            <DialogDescription className="text-gray-300 mb-4">
              {t("details.text")}
            </DialogDescription>
            <DialogDescription className="text-gray-300 mb-4">
              {reasoningData}
            </DialogDescription>
            <DialogDescription className="text-gray-300 mb-4">
              {t("details.closing")}
            </DialogDescription>
          </div>

          {/* Right Column: Main Image + Thumbnails */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-video w-full">
              <img
                className="h-full w-full object-contain rounded-lg shadow-lg"
                src={`${images_dir}/0_${selectedImageIndex}.png`}
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
                    src={`${images_dir}/0_${index}.png`}
                    alt={`${images_dir} thumbnail ${index + 1}`}
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
