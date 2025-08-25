import { useMemo } from "react";

export const usePartyImages = (lang = "de", shuffle = true, metadata = {}) => {

  const allImages = useMemo(() => {
    const images = [];

    for (const partyKey in metadata.parties) {
      // TODO: replace the following with asynch fetch
      // const partyData = slider_info.kommu[partyKey];

      // const points =
      //   (lang === "de" && partyData.de && partyData.de.visual_impact_points) ||
      //   (lang === "en" && partyData.en && partyData.en.visual_impact_points) ||
      //   (partyData.de && partyData.de.visual_impact_points) ||
      //   (partyData.en && partyData.en.visual_impact_points) ||
      //   [];

      for (let i = 0; i < 5; i++) {
        images.push({
          id: `${partyKey}-${i}`,
          partyKey,
          partyName: partyData.name,
          index: i,
          src: `${metadata.paths.base}/${String(
            partyData.name
          ).toLowerCase()}/${metadata.paths.program}/${metadata.paths.images}/0_${i}.png`,
          alt: `${partyData.name} - ${partyKey || "Image " + (i + 1)}`,
          visualImpactPoints: partyKey,
          pointForImage: partyKey || null,
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
