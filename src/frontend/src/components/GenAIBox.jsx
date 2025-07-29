import React from "react";
import CustomBox from "./CustomBox";
import { useTranslation } from "react-i18next";

const GenAIBox = ({ selectedImageIndex, setSelectedImageIndex }) => {
  const images = ["/orig1.jpg", "/orig2.jpg", "/orig3.jpg"];
  const { t } = useTranslation();

  return (
    <CustomBox title={t("gen_ai_box.title")} align="left">
      <div className="text-center text-black space-y-3">
        <p>
          {t("gen_ai_box.text_p1")}{" "}
          <span className="font-bold text-black">14.09.2025 </span>
          {t("gen_ai_box.text_p2")}
        </p>
        <p>{t("gen_ai_box.text_p3")}</p>
      </div>

      <div className="flex flex-wrap flex-col items-center justify-center gap-4 text-sm text-center">
        <img src="/pipeline1.png" className="w-full rounded" />
        <div className="flex gap-10 text-black font-bold content-center items-center align-middle">
          <div className="min-w-[100px] text-center">
            {t("gen_ai_box.pipeline.1")}
          </div>
          <div className="min-w-[100px] flex text-center">
            <div className="h-3 w-10" ></div>
            {t("gen_ai_box.pipeline.2")}
          </div>
          <div className="min-w-[100px] text-center">
            {t("gen_ai_box.pipeline.3")}
          </div>
          <div className="min-w-[100px] text-center">
            {t("gen_ai_box.pipeline.4")}
          </div>
          <div className="min-w-[100px] text-center">
            {t("gen_ai_box.pipeline.5")}
          </div>
        </div>
      </div>

      <div className="text-black text-xl">{t("gen_ai_box.image_select")}</div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 w-full">
        {images.map((src, index) => (
          <div
            key={index}
            className={`relative w-full pt-[75%] rounded overflow-hidden border-4 transition-all duration-300 cursor-pointer ${
              selectedImageIndex === index
                ? "border-primary scale-[1.03]"
                : "border-transparent"
            }`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <img
              src={src}
              alt={`Original ${index + 1}`}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </CustomBox>
  );
};

export default GenAIBox;
