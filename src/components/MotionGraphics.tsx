import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VHSCard from "./VHSCard";

const videos = [
  {
    id: "1",
    title: "Neural Interface",
    category: "3D / Motion Design",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    id: "2",
    title: "Kinetic Typography",
    category: "Motion Graphics",
    src: "https://www.w3schools.com/html/movie.mp4",
    poster: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
  },
  {
    id: "3",
    title: "Brand Animation",
    category: "Logo Animation",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1558002038-bb0413e05cb0?w=600&q=80",
  },
  {
    id: "4",
    title: "Generative Art",
    category: "Creative Coding",
    src: "https://www.w3schools.com/html/movie.mp4",
    poster: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
  {
    id: "5",
    title: "UI Transitions",
    category: "Micro-interactions",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  },
];

const MotionGraphics = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videos[currentIndex];

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
    }
  }, [currentIndex]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const prog = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(prog || 0);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="motion" className="py-32 relative overflow-hidden" style={isMobile ? undefined : { perspective: '1200px' }}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* VHS scan lines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      <div 
        className="container mx-auto px-6 relative z-10"
        style={isMobile ? undefined : {
          transformStyle: 'preserve-3d',
          transform: 'rotateX(2deg) translateZ(50px)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <p className="text-primary text-sm uppercase tracking-widest mb-3 font-body">
            Motion & Animation
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Motion <span className="text-gradient-accent">Graphics</span>
          </h2>
        </div>

        {/* Main Video Player - TV/Monitor Style */}
        <div 
          className="flex justify-center mb-12"
          style={isMobile ? undefined : {
            transformStyle: 'preserve-3d',
            transform: 'translateZ(80px)',
          }}
        >
          <div className="relative w-full max-w-4xl">
            {/* TV Frame */}
            <div className="relative bg-gradient-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#0a0a0a] rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]">
              
              {/* Screen bezel */}
              <div className="relative bg-black rounded-xl overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
                {/* Video container */}
                <div className="relative aspect-video">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        poster={currentVideo.poster}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleVideoEnd}
                        playsInline
                        muted={isMuted}
                      >
                        <source src={currentVideo.src} type="video/mp4" />
                      </video>
                    </motion.div>
                  </AnimatePresence>

                  {/* VHS overlay effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Scan lines */}
                    <div 
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
                      }}
                    />
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    {/* Screen glare */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                  </div>

                  {/* Play button overlay */}
                  {!isPlaying && (
                    <button
                      onClick={handlePlayPause}
                      className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center transition-transform group-hover/play:scale-110">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </button>
                  )}

                  {/* Now Playing info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-primary'}`} />
                          <span className="text-red-400 text-xs uppercase tracking-widest font-body">
                            {isPlaying ? '● REC' : 'PAUSED'}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-2xl text-white mb-1">
                          {currentVideo.title}
                        </h3>
                        <p className="text-muted-foreground font-body text-sm">
                          {currentVideo.category}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handlePlayPause}
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white fill-white" />
                          )}
                        </button>
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Video counter */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white/80 text-xs font-mono">
                      {currentIndex + 1} / {videos.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* TV bottom controls bar */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="w-3 h-3 rounded-full bg-[#333] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
                <div className="w-2 h-2 rounded-full bg-red-900/50" />
                <div className="h-1 w-20 bg-[#222] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* VHS Cards Selector */}
        <div 
          className="mb-16"
          style={isMobile ? undefined : {
            transformStyle: 'preserve-3d',
            transform: 'translateZ(40px) rotateX(-2deg)',
          }}
        >
          <p className="text-center text-muted-foreground text-sm mb-6 font-body">
            Selecciona un casete VHS para reproducir
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {videos.map((video, idx) => (
              <VHSCard
                key={video.id}
                title={video.title}
                category={video.category}
                poster={video.poster}
                isActive={idx === currentIndex}
                onClick={() => setCurrentIndex(idx)}
                index={idx}
              />
            ))}
          </div>
        </div>

        {/* Info cards below */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          style={isMobile ? undefined : {
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-30px) rotateX(-1deg)',
          }}
        >
          <div className="glass-card p-6 rounded-2xl text-center" style={isMobile ? undefined : { transform: 'translateZ(20px)' }}>
            <p className="font-display font-bold text-3xl text-gradient mb-2">50+</p>
            <p className="text-muted-foreground font-body text-sm">
              Proyectos Animados
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl text-center" style={isMobile ? undefined : { transform: 'translateZ(40px)' }}>
            <p className="font-display font-bold text-3xl text-gradient-accent mb-2">3D</p>
            <p className="text-muted-foreground font-body text-sm">
              Cinema 4D & Blender
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl text-center" style={isMobile ? undefined : { transform: 'translateZ(20px)' }}>
            <p className="font-display font-bold text-3xl text-gradient mb-2">AE</p>
            <p className="text-muted-foreground font-body text-sm">
              After Effects Expert
            </p>
          </div>
        </div>
      </div>

      {/* Fish eye curved edges overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 50%, transparent 50%, hsl(var(--background) / 0.3) 80%, hsl(var(--background) / 0.8) 100%)',
        }}
      />
    </section>
  );
};

export default MotionGraphics;
