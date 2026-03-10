import { Instagram, Linkedin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Instagram */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
          >
            <Instagram className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
            <span className="text-sm">Instagram</span>
          </a>

          {/* LinkedIn */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
          >
            <Linkedin className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            <span className="text-sm">LinkedIn</span>
          </a>

          {/* Teléfono y Mail */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-white/60">
              <Phone className="w-5 h-5" />
              <span className="text-sm">+56 9 XXXX XXXX</span>
            </div>
            <a
              href="mailto:correo@ejemplo.com"
              className="flex items-center gap-3 text-white/60 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">correo@ejemplo.com</span>
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Joaquín Calderón
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
