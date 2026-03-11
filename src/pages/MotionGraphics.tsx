import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import Footer from "@/components/Footer";
import VideoCarousel from "@/components/VideoCarousel";
import BarcodeDivider from "@/components/BarcodeDivider";

const useVideoThumbnail = (videoSrc: string, seekTime = 2) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.preload = "metadata";

    video.onloadeddata = () => {
      video.currentTime = Math.min(seekTime, video.duration * 0.5);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      const maxW = 640;
      const scale = video.videoWidth > maxW ? maxW / video.videoWidth : 1;
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/jpeg", 0.75));
      }
      video.pause();
      video.src = "";
      video.remove();
    };

    video.src = videoSrc;

    return () => {
      video.pause();
      video.src = "";
      video.remove();
    };
  }, [videoSrc, seekTime]);

  return thumbnail;
};

type Software = "after-effects" | "blender" | "touchdesigner" | "premiere";

const SOFTWARE_CONFIG: Record<Software, { label: string; color: string }> = {
  "after-effects": { label: "After Effects", color: "bg-[#9999FF]/20 text-[#9999FF] border-[#9999FF]/30" },
  "blender": { label: "Blender", color: "bg-[#F5792A]/20 text-[#F5792A] border-[#F5792A]/30" },
  "touchdesigner": { label: "TouchDesigner", color: "bg-[#00B4D8]/20 text-[#00B4D8] border-[#00B4D8]/30" },
  "premiere": { label: "Premiere", color: "bg-[#9999FF]/20 text-[#EA77FF] border-[#EA77FF]/30" },
};

interface Video {
  id: string;
  title: string;
  category: string;
  src: string;
  poster: string;
  description: string;
  underscan: number;
  section: "motion" | "edicion" | "videomapping" | "3d";
  software: Software[];
  seekTime?: number;
}

const VIDEO_BASE = import.meta.env.VITE_VIDEO_BASE_URL || "";

const videos: Video[] = [
  {
    id: "6",
    title: "Gatito 3D",
    category: "3D / Motion Design",
    src: `${VIDEO_BASE}/El Gatito.mp4`,
    poster: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    description: "Animación 3D de un gato caminando, modelado y animado con un estilo cartoon y texturas suaves.",
    underscan: 0.68,
    section: "3d",
    software: ["blender"],
  },
  {
    id: "2",
    title: "Rediseño Evangelion",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/Evangelion Rediseño.mp4`,
    poster: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    description: "Animación realizada para un curso de segundo año en el que se nos pidió rediseñar un logotipo y crear una animación complementaria.",
    underscan: 0.68,
    section: "motion",
    software: ["after-effects"],
  },
  {
    id: "3",
    title: "Animación Ritmica - Tame Impala",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/Animacion Ritmica - Calderon Joaquin.mp4`,
    poster: "https://images.unsplash.com/photo-1558002038-bb0413e05cb0?w=600&q=80",
    description: "Animación rítmica de la canción The Less I Know The Better de Tame Impala, realizada para un ramo de segundo año de diseño.",
    underscan: 0.91,
    section: "motion",
    software: ["after-effects"],
  },
  {
    id: "4",
    title: "ASCII DID Awards",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/ASCII Fulls.mp4`,
    poster: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    description: "Visuales para los DID Awards 2025 que muestran los diferentes premios y el logo de DID mediante estilo ASCII.",
    underscan: 0.77,
    section: "motion",
    software: ["after-effects"],
  },
  {
    id: "5",
    title: "DID Awards Pixeles",
    category: "Micro-interactions",
    src: `${VIDEO_BASE}/Motions Pixels.mp4`,
    poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    description: "Animación de pixeles con efecto de olas para los DID Awards 2025.",
    underscan: 0.91,
    section: "motion",
    software: ["after-effects"],
  },
  {
    id: "1",
    title: "UDD Waves",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/UDD Waves.mp4`,
    poster: "",
    description: "Animación de ondas utilizando ceros y unos para la Tech Fair de Diseño de Interacción Digital en la UDD.",
    underscan: 0.68,
    section: "motion",
    software: ["blender", "after-effects"],
  },
  {
    id: "7",
    title: "Tech Fair Particles",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/Tech Fair Test Particles.mp4`,
    poster: "",
    description: "Partículas en rotación que, al alinearse, revelan el logo de la Tech Fair UDD.",
    underscan: 0.90,
    section: "motion",
    software: ["blender"],
  },
  {
    id: "8",
    title: "Trailer DID Awards",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/Trailer DID Awards.mp4`,
    poster: "",
    description: "Trailer para la primera edición de los DID Awards de Diseño de Interacción Digital en la UDD.",
    underscan: 0.68,
    section: "motion",
    software: ["after-effects", "blender", "premiere"],
  },
  {
    id: "9",
    title: "Examen Narrativa",
    category: "Edición de Video",
    src: `${VIDEO_BASE}/Examen Narrativa.mp4`,
    poster: "",
    description: "Proyecto de segundo año sobre el nacimiento del universo, compuesto por animaciones 3D que representan las distintas etapas que llevaron a la creación de la Tierra.",
    underscan: 0.91,
    section: "3d",
    software: ["blender", "after-effects", "premiere"],
    seekTime: 9880,
  },
  {
    id: "10",
    title: "Animación Página de TikTok",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/Animacion Menio TikTok.mp4`,
    poster: "",
    description: "Animación de cierre para el canal de TikTok de MenioTV.",
    underscan: 0.68,
    section: "motion",
    software: ["after-effects"],
  },
  {
    id: "11",
    title: "Animación Ojo",
    category: "3D / Motion Graphics",
    src: `${VIDEO_BASE}/Test Estilizado 2.mp4`,
    poster: "",
    description: "Animación realizada para un ramo de Diseño Crítico en el que presentamos la idea de ojos RGB en el futuro.",
    underscan: 0.68,
    section: "3d",
    software: ["blender", "after-effects"],
  },
  {
    id: "12",
    title: "DIALOGA Video Promocional",
    category: "Edición de Video / Motion Graphics / 3D",
    src: `${VIDEO_BASE}/DIALOGA Video Promocional.mp4`,
    poster: "",
    description: "Video promocional especulativo para el examen de un taller de cuarto año. El producto consistía en un dispositivo que permitía la comunicación entre clientes que se comunican con LSCh y empleados no capacitados para ello.",
    underscan: 0.68,
    section: "edicion",
    software: ["blender", "premiere", "after-effects"],
    seekTime: 5080,
  },
  {
    id: "13",
    title: "Lata Kem Xtreme",
    category: "3D",
    src: `${VIDEO_BASE}/Loop Kem Xtreme.mp4`,
    poster: "",
    description: "Modelado 3D y texturizado de una lata de Kem Xtreme en loop infinito. Proyecto de práctica personal.",
    underscan: 0.68,
    section: "3d",
    software: ["blender"],
  },
  {
    id: "14",
    title: "Santiago 2052",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/Santiago 2052 - Animacion (Texto Nuevo).mp4`,
    poster: "",
    description: "Showreel de segundo año de un brandbook de diseño especulativo de las Olimpiadas 2052.",
    underscan: 0.91,
    section: "motion",
    software: ["after-effects"],
  },
  {
    id: "15",
    title: "Teaser DID Awards",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/Teaser v4 fecha 7.mp4`,
    poster: "",
    description: "Teaser promocional para la primera edición de los DID Awards.",
    underscan: 0.68,
    section: "motion",
    software: ["blender", "after-effects"],
  },
  {
    id: "16",
    title: "Mercurio Trip",
    category: "Motion Graphics",
    src: `${VIDEO_BASE}/Test Mercury Gif 4.mp4`,
    poster: "",
    description: "Uno de los primeros ejercicios que hice para un curso de Domestika de animación psicodélica.",
    underscan: 0.68,
    section: "motion",
    software: ["after-effects"],
  },
];

const sections = [
  { key: "motion" as const, title: "Motion Graphics" },
  { key: "edicion" as const, title: "Edición de Video" },
  { key: "3d" as const, title: "3D" },
  { key: "videomapping" as const, title: "Videomapping" },
];

interface VideoCardProps {
  video: Video;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const VideoCard = ({ video, index, isActive, onClick }: VideoCardProps) => {
  const thumbnail = useVideoThumbnail(video.src, video.seekTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ${isActive ? "ring-2 ring-purple-500 scale-[1.02]" : "hover:scale-[1.02]"
        }`}
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden bg-black">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
        {isActive && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded px-2 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-white font-mono">PLAYING</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-card">
        <h3 className="text-sm font-semibold text-white truncate">{video.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{video.category}</p>
        {video.software.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {video.software.map((sw) => (
              <span
                key={sw}
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${SOFTWARE_CONFIG[sw].color}`}
              >
                {SOFTWARE_CONFIG[sw].label}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MotionGraphics = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const handleScrollBack = useCallback((e: WheelEvent) => {
    if (e.deltaY < 0 && window.scrollY === 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        navigate("/");
      }, 600);
    }
  }, [isTransitioning, navigate]);

  useEffect(() => {
    window.addEventListener("wheel", handleScrollBack);
    return () => window.removeEventListener("wheel", handleScrollBack);
  }, [handleScrollBack]);

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      <main>
        <section id="motion" className="pt-20 pb-12 relative overflow-hidden">
          {/* Hero Carousel - Full Width */}
          <div id="tv-player" className="w-full mb-0 relative z-20">
            {/* Subtle Purple Background Gradient for TV Model */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.08)_0%,_transparent_70%)] pointer-events-none transform scale-150" />
            <VideoCarousel
              videos={videos}
              currentVideoIndex={currentVideoIndex}
              onIndexChange={setCurrentVideoIndex}
            />

          </div>

          <div className="relative z-10">
            <BarcodeDivider />
          </div>


          <div className="relative z-10 mt-12 mx-6 md:ml-[180px] lg:ml-[200px]">
            {sections.map((section) => {
              const sectionVideos = videos.filter((v) => v.section === section.key);
              if (sectionVideos.length === 0) return null;
              return (
                <div key={section.key} className="mb-16">
                  <h2
                    className="font-bold text-2xl text-white mb-6 pb-3 border-b border-white/10"
                    style={{ fontFamily: "'BBH Hegarty', sans-serif" }}
                  >
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sectionVideos.map((video) => {
                      const globalIndex = videos.indexOf(video);
                      return (
                        <VideoCard
                          key={video.id}
                          video={video}
                          index={globalIndex}
                          isActive={globalIndex === currentVideoIndex}
                          onClick={() => {
                            setCurrentVideoIndex(globalIndex);
                            document.getElementById("tv-player")?.scrollIntoView({ behavior: "smooth" });
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default MotionGraphics;
