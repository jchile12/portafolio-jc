import { useState, useEffect } from "react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-card py-4' : 'py-6'
      }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-center">
        <span className="font-display font-bold text-2xl text-gradient">
          Portafolio Joaquin Calderon
        </span>
      </nav>
    </header>
  );
};

export default Navigation;
