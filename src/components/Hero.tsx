import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Scene3D from "./Scene3D";

const Hero = () => {
  const barcodeText = "27/03/2001 ".repeat(30);
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const triggerTransition = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/motion-graphics");
    }, 900);
  }, [isTransitioning, navigate]);

  const handleScroll = useCallback((e: WheelEvent) => {
    if (e.deltaY > 0) triggerTransition();
  }, [triggerTransition]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    // Swipe up (finger moves up = positive delta) with 50px threshold
    if (deltaY > 50) triggerTransition();
  }, [triggerTransition]);

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleScroll, handleTouchStart, handleTouchEnd]);

  return (
    <motion.section
      className="relative h-screen w-full overflow-hidden bg-black"
      animate={isTransitioning ? {
        scale: 1.3,
        opacity: 0,
      } : {
        scale: 1,
        opacity: 1,
      }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >

      {/* Loading placeholder */}
      <AnimatePresence>
        {!sceneReady && (
          <motion.div
            className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center gap-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="text-white/90 text-8xl lg:text-9xl"
              style={{ fontFamily: "'Bonheur Royale', cursive" }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              JC
            </motion.span>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              <span
                className="text-white/40 text-xs uppercase tracking-widest"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Cargando
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Scene - Full width background */}
      <div className="absolute inset-0">
        <Scene3D onReady={() => setSceneReady(true)} />
      </div>

      {/* Barcode ribbon - top left corner at 45 degrees */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{
          top: "80px",
          left: "-200px",
          transform: "rotate(-35deg)",
          width: "700px",
        }}
      >
        <div className="overflow-hidden bg-black/70 py-1">
          <div
            className="whitespace-nowrap text-8xl text-white/80 animate-barcode-scroll"
            style={{ fontFamily: "'Libre Barcode 39 Text', cursive" }}
          >
            {barcodeText}
            {barcodeText}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <AnimatePresence>
        {showHint && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-28 md:bottom-32 left-0 right-0 z-20 flex flex-col items-center gap-2"
          >
            <span
              className="text-white/50 text-xs uppercase tracking-widest"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Scroll para continuar
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-white/50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-black/85 backdrop-blur-sm px-4 py-5 md:px-6 md:py-8">
            <p
              className="text-[10px] md:text-sm uppercase tracking-widest mb-0.5 text-white italic leading-none"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Joaquín Calderón
            </p>
            <h1
              className="font-bold text-xl md:text-4xl lg:text-5xl leading-none text-white"
              style={{ fontFamily: "'BBH Bartle', sans-serif" }}
            >
              Portafolio Audiovisual
            </h1>
            <p
              className="text-white/60 text-xs md:text-lg mt-0.5 leading-tight"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Edición de Videos, Motion Graphics, Animación 3D y Diseño Gráfico
            </p>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
