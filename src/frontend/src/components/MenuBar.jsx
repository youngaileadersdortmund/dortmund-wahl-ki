import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";

const LanguageSelector = ({ languages, selectedLanguage, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangObj =
    languages.find((lang) => lang.code === selectedLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageClick = (langCode) => {
    onSelect(langCode);
    setIsOpen(false);
  };

  return (
    <div
      className="relative w-full max-w-xs mx-auto my-8 font-sans"
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className={`
          w-36
          rounded-full
          font-semibold
          text-md
          flex items-center justify-between
          bg-secondary text-white
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50
        `}
      >
        {currentLangObj.name}
        <IoIosArrowDown
          className={`w-5 h-5 ml-2 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`
            absolute top-full left-0 right-0
            mt-2 p-2
            bg-white rounded-xl shadow-lg
            z-10
            origin-top duration-300 ease-out
            ${isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}
          `}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageClick(lang.code)}
              className={`
                block w-full text-left
                px-6 py-2 h-10
                gap-2
                bg-white
                text-gray-800 hover:bg-gray-100
                font-medium
                transition-colors duration-200
                ${
                  selectedLanguage === lang.code
                    ? "bg-gray-100 text-secondary"
                    : ""
                }
              `}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function MenuBar() {
  const { t, i18n } = useTranslation();

  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { name: "Deutsch", code: "de" },
    { name: "English", code: "en" },
  ];

  return (
    <div className="w-full flex flex-col justify-between items-center mb-4 p-2 rounded">
      <div className="flex w-full items-center justify-between">
        <div className="flex">
          <img src="/logo.png" alt="Logo" className="h-28 w-28 mr-4 ml-8" />
          <img
            src="/lamarr-logo-2023.svg"
            alt="Logo"
            className="h-28 w-28 mr-4 ml-8"
          />
        </div>

        <h1 className="cursor-pointer absolute left-1/2 -translate-x-1/2 text-5xl font-bold text-secondary">
          <a
            href="/"
            className="text-inherit no-underline hover:no-underline focus:outline-none hover:text-secondary"
          >
            {t("title")}
          </a>
        </h1>
        <div className="flex mr-8 gap-2">
          <LanguageSelector
            languages={languages}
            selectedLanguage={i18n.language}
            onSelect={switchLanguage}
          />
        </div>
      </div>
      <nav className="flex gap-5 text-black justify-center w-full h-3">
        <div className="cursor-pointer font-bold decoration-primary underline decoration-2 decoration-offset-2 hover:text-secondary">
          <a
            style={{ color: "inherit", textDecoration: "none" }}
            href="/about-the-project"
          >
            {t("nav_bar.about_project")}
          </a>
        </div>
      </nav>
    </div>
  );
}
