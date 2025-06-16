import React, { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setShowButton(scrolled > 0.1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-secondary transition-all duration-300 transform ${
        showButton ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      }`}
      title="Nach oben scrollen"
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
