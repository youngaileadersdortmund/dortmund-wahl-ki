
import React from "react";

const Footer = () => {

  return (
    <footer class="bg-white rounded-lg shadow-sm m-4 w-2/3 ">
        <div class="w-full p-4 md:py-8">
            <div class="sm:flex sm:items-center sm:justify-between">
                
                <a href="https://youngaileadersdortmund.github.io/" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                    <img src="/logo.png" class="h-8" alt="Flowbite Logo" />
                    <span class="text-black self-center text-xl whitespace-nowrap dark:text-white">Young Leaders of AI Dortmund</span>
                </a>


                <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <a href="/impressum" class="text-primary  hover:underline me-4 md:me-6">Impressum</a>
                    </li>
                    <li>
                        <a href="#" class="text-primary hover:underline me-4 md:me-6">Datenschutz</a>
                    </li>
                </ul>

            </div>
            <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2025 {" "}
              <a href="https://youngaileadersdortmund.github.io/" class="text-primary hover:underline hover:text-black">
                Young Leaders of AI Dortmund
              </a>. All Rights Reserved.</span>
        </div>
    </footer>
  )
};

export default Footer;
