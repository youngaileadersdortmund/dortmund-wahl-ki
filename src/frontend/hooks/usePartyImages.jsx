import { useMemo } from "react";
import parties_metadata from "../public/parties_metadata.json";

export const usePartyImages = (lang = "de", shuffle = true) => {
  const allImages = useMemo(() => {
    const images = [];

    for (const partyKey in parties_metadata.kommu) {
      const partyData = parties_metadata.kommu[partyKey];

      const points =
        (lang === "de" && partyData.de && partyData.de.visual_impact_points) ||
        (lang === "en" && partyData.en && partyData.en.visual_impact_points) ||
        (partyData.de && partyData.de.visual_impact_points) ||
        (partyData.en && partyData.en.visual_impact_points) ||
        [];

      for (let i = 0; i < 5; i++) {
        images.push({
          id: `${partyKey}-${i}`,
          partyKey,
          partyName: partyData.name,
          index: i,
          src: `public/2025/${String(partyData.name).toLowerCase()}/0_${i}.png`,
          alt: `${partyData.name} - ${points[i] || "Image " + (i + 1)}`,
          visualImpactPoints: points,
          pointForImage: points[i] || null,
        });
      }
    }

    if (shuffle) {
      for (let i = images.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]];
      }
    }

    return images;
  }, [lang, shuffle]);

  return allImages;
};
