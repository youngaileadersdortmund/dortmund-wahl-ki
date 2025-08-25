import { useState, useEffect, useMemo } from "react";
import slider_info from "../public/slider_info.json";

export const usePartyImages = (lang = "de", shuffle = true, metadata = {}) => {
  const base = import.meta.env.BASE_URL || "/ai-for-political-education/";
  const programPath = "kommunalomat";
  const imagesDir = "img_FLUX.1-schnell_guid0.0_nsteps5";

  const [fetchedInfo, setFetchedInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${base}slider_info.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setFetchedInfo(json);
      } catch (e) {
        console.warn(
          "Could not fetch /slider_info.json, using imported data.",
          e
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [base]);

  const data = fetchedInfo ?? slider_info;

  const allImages = useMemo(() => {
    const images = [];

    if (!data) return images;

    const parties = Array.isArray(metadata.parties)
      ? metadata.parties
      : Object.keys(data.kommu || {});

    for (const partyKey of parties) {
      const partyData = (data.kommu && data.kommu[partyKey]) || {};
      if (!partyData) continue;

      const points =
        (lang === "de" && partyData.de && partyData.de.visual_impact_points) ||
        (lang === "en" && partyData.en && partyData.en.visual_impact_points) ||
        (partyData.de && partyData.de.visual_impact_points) ||
        (partyData.en && partyData.en.visual_impact_points) ||
        [];

      const name = partyData.name ?? partyKey;
      const slug = String(name).toLowerCase().replace(/\s+/g, "-");

      for (let i = 0; i < 5; i++) {
        images.push({
          id: `${partyKey}-${i}`,
          partyKey,
          partyName: name,
          index: i,
          src: `${base}political_content_dortmund_2025/${slug}/results_p5_Qwen_Qwen3-30B-A3B_${programPath}/${imagesDir}/0_${i}.png`,
          alt: `${name} - Image ${i + 1}`,
          visualImpactPoints: points,
          pointForImage: points[i] ?? null,
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
  }, [lang, shuffle, data, programPath, imagesDir, base]);

  return { images: allImages, isLoading };
};
