import React from 'react'
import { useTranslation } from "react-i18next";

function ImpressumPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-0">
      <h1 className="text-primary py-8 md:p-6 text-2xl md:text-3xl font-bold text-center">
        {t("impr.second_headline")}
      </h1>
      <div
        dangerouslySetInnerHTML={{ __html: t("impr.content") }}
      />
    </div>
  );
}

export default ImpressumPage