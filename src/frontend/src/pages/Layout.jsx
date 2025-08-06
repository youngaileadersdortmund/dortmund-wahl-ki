// components/Layout.js
import { Outlet } from "react-router-dom";
import MenuBar from "../components/MenuBar";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";

function Layout() {
  return (
    <div className="w-full flex flex-col min-h-screen overflow-x-hidden">
      <MenuBar />
      <ScrollToTopButton />
      <main className="flex-grow w-full flex justify-center items-center">
        <Outlet /> {/* This is where pages will render */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
