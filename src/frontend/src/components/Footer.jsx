import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white rounded-lg shadow-sm m-4 w-full">
      <div className="w-full p-4 md:py-8" style={{ paddingLeft: "10%", paddingRight: "10%" }}>
        <div className="sm:flex sm:items-center sm:justify-between">
          <a href="https://youngaileadersdortmund.github.io/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img src="public/logo.png" className="h-8" alt="Young AI Leaders Logo" />
            <span className="text-black self-center text-xl whitespace-nowrap dark:text-white">Young AI Leaders - Dortmund Hub</span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link to="/impressum" className="text-primary hover:underline me-4 md:me-6">{t("impr.name")}</Link>
            </li>
            <li>
              <Link to="/datenschutz" className="text-primary hover:underline me-4 md:me-6">{t("priv.name")}</Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025{" "}
          <a href="https://youngaileadersdortmund.github.io/" className="text-primary hover:underline hover:text-black">
            Young AI Leaders - Dortmund Hub
          </a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
