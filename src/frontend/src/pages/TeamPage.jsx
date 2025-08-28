import Disclaimer from "../components/Disclaimer";
import { useTranslation } from "react-i18next";

const base = import.meta.env.BASE_URL;

export default function TeamPage() {
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
    // general project goal and yail info
    <div className="flex flex-col items-center justify-center px-4 md:px-0">
      <div
        className="w-full lg:max-w-[50%] my-2"
        dangerouslySetInnerHTML={{ __html: t("about.text_top1") }}
      />
      <div
        className="w-full lg:max-w-[50%] my-2"
        dangerouslySetInnerHTML={{ __html: t("about.text_top2") }}
      />
      <div className="w-full max-w-[40%] my-8 flex flex-row justify-between items-center gap-4 mx-auto">
        <a href="https://youngaileadersdortmund.github.io/" target="_blank">
          <img
            src={`${base}logo.png`}
            className="h-24 object-contain"
            alt="logo"
          />
        </a>
        <a href="https://www.un.org/sustainabledevelopment/" target="_blank">
          <img
            src={`${base}E_SDG_logo_without_UN_emblem_horizontal_Transparent_WEB.png`}
            className="h-20 object-contain"
            alt="sdg"
          />
        </a>
        <a href="https://www.un.org/sustainabledevelopment/education/" target="_blank">
          <img
            src={`${base}E-WEB-Goal-04.png`}
            className="h-20 object-contain"
            alt="goal"
          />
        </a>
      </div>

      {/* partner info */}
      <div
        className="w-full lg:max-w-[50%] my-2"
        dangerouslySetInnerHTML={{ __html: t("about.text_top3") }}
      />
      <div className="w-full max-w-[45%] my-8 flex flex-row justify-between items-center gap-4 mx-auto">
        <a href="https://lamarr-institute.org/" target="_blank">
          <img
            src={`${base}lamarr_logo.png`}
            alt="Lamarr Logo"
            className="h-16 object-contain"
          />
        </a>
        <a href="https://www.jrdo.de/" target="_blank">
          <img
            src={`${base}logo-jugendring-do.svg`}
            alt="Jugendring Logo"
            className="h-20 object-contain"
          />
        </a>
        <a href="https://bundestagswahl.ai/" target="_blank">
          <img
            src={`${base}btwai.png`}
            alt="bundestagswahl.ai Logo"
            className="h-10 object-contain"
          />
        </a>
      </div>

      {/* team info */}
      <h1 className="justify-self-center text-secondary py-6 md:py-8 text-center whitespace-nowrap">
        {t("about.heading_team")}
      </h1>
      <div
        className="w-full lg:max-w-[50%]"
        dangerouslySetInnerHTML={{ __html: t("about.text_team1") }}
      />
      <div
        className="w-full
                    lg:max-w-[50%]
                    my-6
                    grid grid-cols-2 gap-6 justify-items-center
                    sm:grid-cols-3
                    md:flex md:flex-row md:justify-center md:items-center md:gap-6"
      >
        {members.map((member) => (
          <a
            key={member.name}
            href={member.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center mx-1"
          >
            <div className="w-20 sm:w-24 md:w-28 lg:w-32 aspect-square rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
              <img
                src={base + member.img}
                alt={member.name}
                className="w-full h-full object-cover block"
              />
            </div>
            <span className="mt-2 text-sm text-center">{member.name}</span>
          </a>
        ))}
      </div>

      <div
        className="w-full lg:max-w-[50%]"
        dangerouslySetInnerHTML={{ __html: t("about.text_team2") }}
      />

      <h1 className="justify-self-center text-secondary py-6 md:py-8 text-center whitespace-nowrap">
        {t("about.heading_next")}
      </h1>
      <div
        className="w-full lg:max-w-[50%] my-2"
        dangerouslySetInnerHTML={{ __html: t("about.text_next1") }}
      />
      <div
        className="w-full lg:max-w-[50%] my-2"
        dangerouslySetInnerHTML={{ __html: t("about.text_next2") }}
      />
      <div
        className="w-full lg:max-w-[50%] my-2"
        dangerouslySetInnerHTML={{ __html: t("about.text_next3") }}
      />
      <div
        className="w-full lg:max-w-[50%] my-2"
        dangerouslySetInnerHTML={{ __html: t("about.text_next4") }}
      />

      <div className="max-w-3xl w-full self-center px-2 md:px-0">
        <Disclaimer />
      </div>
    </div>
  );
}
