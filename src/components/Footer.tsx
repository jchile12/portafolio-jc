import { Instagram, Linkedin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 md:py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8 mb-6">
          <a
            href="https://www.instagram.com/portafoliojoacoc/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <Instagram className="w-4 h-4 group-hover:text-pink-400 transition-colors" />
            <span className="text-sm">@portafoliojoacoc</span>
          </a>

          <a
            href="https://www.linkedin.com/in/joaquin-ignacio-calderon-contreras-36144539b/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <Linkedin className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
            <span className="text-sm">Joaquín Calderón</span>
          </a>

          <a
            href="tel:+56977790672"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">+56 9 7779 0672</span>
          </a>

          <a
            href="mailto:joacalderonc@gmail.com"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">joacalderonc@gmail.com</span>
          </a>
        </div>

        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Joaquín Calderón
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
