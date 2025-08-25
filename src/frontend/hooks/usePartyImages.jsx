import { useMemo } from "react";
import slider_info from "../public/slider_info.json";

export const usePartyImages = (lang = "de", shuffle = true) => {
  const base = import.meta.env.BASE_URL || "/ai-for-political-education/";

  const allImages = useMemo(() => {
    const images = [];

    for (const partyKey in slider_info.kommu) {
      const partyData = slider_info.kommu[partyKey];

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
          src: `${base}political_content_dortmund_2025/${String(
            partyData.name
          ).toLowerCase()}/results_p5_Qwen3-30B-A3B_kommunalomat/img_FLUX.1-schnell_guid0.0_nsteps5/0_${i}.png`,
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
