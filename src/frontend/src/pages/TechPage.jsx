import Disclaimer from "../components/Disclaimer";
import { useTranslation } from "react-i18next";

const base = import.meta.env.BASE_URL || "/ai-for-political-education/";

export default function TechPage() {
  const { t } = useTranslation();
  const members = [
    {
      name: "Raphael Fischer",
      img: "members/raphael.jpg",
      link: "https://www.linkedin.com/in/raphael-fischer-3b1046208/",
    },
    {
      name: "Nico Koltermann",
      img: "members/nico.jpg",
      link: "https://www.linkedin.com/in/nico-koltermann/",
    },
    {
      name: "Jan Krawiec",
      img: "members/jan.jpg",
      link: "https://www.linkedin.com/in/jan-krawiec-707515296/",
    },
    {
      name: "Louisa von Essen",
      img: "members/louisa.jpg",
      link: "https://www.linkedin.com/in/louisa-von-essen-a44b1a192/",
    },
    {
      name: "Youssef Abdelrahim",
      img: "members/youssef.jpg",
      link: "https://www.linkedin.com/in/youssef-abdelrahim-de/",
    },
    {
      name: "Tareq Khouja",
      img: "members/tareq.jpg",
      link: "https://www.linkedin.com/in/tareq-khouja/",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-0">
      <h1 className="justify-self-center text-secondary py-6 md:py-8 text-center whitespace-nowrap">
        {t("about.heading_tech")}
      </h1>
      <div
        className="w-full lg:max-w-[50%]"
        dangerouslySetInnerHTML={{ __html: t("about.text_tech1") }}
      />
      <div className="w-full lg:max-w-[50%] my-8">
        <img
          src={`${base}pipeline.png`}
          className="w-full rounded"
          alt="pipeline"
        />
      </div>
      <div
        className="w-full lg:max-w-[50%]"
        dangerouslySetInnerHTML={{ __html: t("about.text_tech2") }}
      />
      <div className="max-w-3xl w-full self-center px-2 md:px-0">
        <Disclaimer />
      </div>
    </div>
  );
}
