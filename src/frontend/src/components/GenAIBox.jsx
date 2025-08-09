import CustomBox from "./CustomBox";
import { useTranslation } from "react-i18next";

const GenAIBox = () => {
  const { t } = useTranslation();

  return (
    <CustomBox title={t("gen_ai_box.title")} align="left">
      <div className="text-start text-black space-y-3">
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
    </CustomBox>
  );
};

export default GenAIBox;
