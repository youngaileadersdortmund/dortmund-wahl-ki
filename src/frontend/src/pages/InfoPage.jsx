import Disclaimer from "../components/Disclaimer";
import { useTranslation } from "react-i18next"

export default function InfoPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-0">
      <div className="w-full max-w-[50%]"
        dangerouslySetInnerHTML={{ __html: t("about.text_top") }}
      />
      <div className="w-full max-w-[40%] my-8 flex flex-row justify-between items-center gap-4 mx-auto">
        <img src="public/logo.png" className="h-20 object-contain" />
        <img src="public/E_SDG_logo_without_UN_emblem_horizontal_Transparent_WEB.png" className="h-20 object-contain" />
        <img src="public/E-WEB-Goal-04.png" className="h-20 object-contain" />
      </div>
      <h1 className="justify-self-center text-secondary py-6 md:py-8 text-center whitespace-nowrap">
          {t("about.heading_tech")}
      </h1>
      <div className="w-full max-w-[50%]"
        dangerouslySetInnerHTML={{ __html: t("about.text_tech1") }}
      />
      <div className="w-full max-w-[50%] my-8">
        <img src="public/pipeline1.png" className="w-full rounded" />
      </div>
      <div className="w-full max-w-[50%]"
        dangerouslySetInnerHTML={{ __html: t("about.text_tech2") }}
      />
      <div className="max-w-3xl w-full self-center px-2 md:px-0">
        <Disclaimer />
      </div>
      <h1 className="justify-self-center text-secondary py-6 md:py-8 text-center whitespace-nowrap">
          {t("about.heading_team")}
      </h1>
      <div className="w-full max-w-[50%]"
        dangerouslySetInnerHTML={{ __html: t("about.text_team1") }}
      />
      <div className="w-full max-w-[50%] flex flex-row justify-center items-center my-6">
        {[
          { name: "Raphael Fischer", img: "public/members/raphael.jpg", link: "https://www.linkedin.com/in/raphael-fischer-3b1046208/"},
          { name: "Nico Koltermann", img: "public/members/nico.jpg", link: "https://www.linkedin.com/in/nico-koltermann/"},
          { name: "Jan Krawiec", img: "public/members/jan.jpg", link: "https://www.linkedin.com/in/jan-krawiec-707515296/"},
          { name: "Louisa von Essen", img: "public/members/louisa.jpg", link: "https://www.linkedin.com/in/louisa-von-essen-a44b1a192/"},
          { name: "Youssef Abdelrahim", img: "public/members/youssef.jpg", link: "https://www.linkedin.com/in/youssef-abdelrahim-de/"},
          { name: "Tareq Khouja", img: "public/members/tareq.jpg", link: "https://www.linkedin.com/in/tareq-khouja/"},
        ].map((member) => (
          <a href={member.link} target="_blank" key={member.name}>
            <div className="flex flex-col items-center mx-2">
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
              <span className="mt-2 text-sm text-center">{member.name}</span>
            </div>
          </a>
        ))}
      </div>
      <div className="w-full max-w-[50%]"
        dangerouslySetInnerHTML={{ __html: t("about.text_team2") }}
      />
    </div>
  );
}
