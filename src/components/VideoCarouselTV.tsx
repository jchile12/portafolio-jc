import { useState, useRef, useEffect } from "react";
import { Power, Volume2, VolumeX, ChevronUp, ChevronDown, Menu } from "lucide-react";

interface Video {
  id: string;
  title: string;
  category: string;
  src: string;
  poster: string;
}

interface VideoCarouselTVProps {
  videos: Video[];
}

const VideoCarouselTV = ({ videos }: VideoCarouselTVProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showVolumeOSD, setShowVolumeOSD] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentVideo = videos[currentIndex];

  useEffect(() => {
    // Reset state when video changes
    setIsPlaying(false);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      videoRef.current.volume = volume / 100; // Apply initial volume
      if (isPoweredOn) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [currentIndex, isPoweredOn]);

  const handlePower = () => {
    setIsPoweredOn(!isPoweredOn);
    setIsPlaying(false);
    setShowVolumeOSD(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handlePlayPause = () => {
    if (!isPoweredOn) return;
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (change: number) => {
    if (!isPoweredOn || !videoRef.current) return;
    
    const newVolume = Math.min(100, Math.max(0, volume + change));
    setVolume(newVolume);
    videoRef.current.volume = newVolume / 100;
    
    // Show OSD
    setShowVolumeOSD(true);
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = setTimeout(() => setShowVolumeOSD(false), 2000);
  };

  const handleChannelUp = () => {
    if (!isPoweredOn) return;
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  const handleChannelDown = () => {
    if (!isPoweredOn) return;
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress || 0);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  if (!currentVideo) return null;

  return (
    // Removed outer wrapper perspective/py-20 since this will live inside the Canvas
    <div className="w-[800px] h-auto select-none">
      {/* Trinitron Style Body */}
      <div 
        className="relative bg-[#202020] rounded-xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.1)] border-t border-white/10"
        // Removed 3D transforms here, the Camera will handle perspective
      >
        
        {/* Top Section: Screen & Bezel */}
        <div className="relative p-6 md:p-8 pb-12 bg-[#252525]">
          {/* Screen Bezel Inset */}
          <div className="relative bg-[#151515] rounded-tl-[2rem] rounded-tr-[2rem] rounded-bl-[1rem] rounded-br-[1rem] p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border-b border-white/5">
            
            {/* The CRT Screen */}
            <div className="relative overflow-hidden rounded-[2rem] bg-black aspect-[4/3] shadow-[inset_0_0_40px_rgba(0,0,0,1)]">
              {/* Video Container */}
              <div className={`w-full h-full transition-opacity duration-300 ${isPoweredOn ? 'opacity-100' : 'opacity-0'}`}>
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain scale-[1.02]" // Letterboxed 16:9 in 4:3
                  poster={currentVideo.poster}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnd}
                  playsInline
                  onClick={handlePlayPause}
                >
                  <source src={currentVideo.src} type="video/mp4" />
                </video>
              </div>

              {/* CRT Effects Layer */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* RGB Scanlines - tighter pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,3px_100%]" />
                {/* Vignette - Stronger & Darker */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_80%,rgba(0,0,0,0.95)_100%)] mix-blend-multiply" />
                
                {/* Camera Lens Reflection / Gloss */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 pointer-events-none rounded-[2rem]" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 20%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%)' }} />
                
                {/* Turn-off animation */}
                {!isPoweredOn && (
                   <div className="absolute inset-0 bg-black z-20 flex items-center justify-center">
                      <div className="w-full h-[1px] bg-white animate-collapse duration-200 opacity-0" />
                   </div>
                )}
              </div>

              {/* OSD Layer */}
              {isPoweredOn && (
                <div className="absolute inset-0 z-20 pointer-events-none p-6 md:p-10 flex flex-col justify-between">
                   {/* Channel & Input Label (Top Right) */}
                   <div className="self-end text-green-400 font-mono text-shadow-glow opacity-80 text-xl md:text-2xl">
                     {currentIndex + 1}
                   </div>

                   {/* Volume Bar (Bottom Center - Retro Style) */}
                   <div className={`transition-opacity duration-200 ${showVolumeOSD ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="flex items-end gap-2 text-green-400 font-mono text-shadow-glow">
                         <span className="text-sm md:text-base font-bold tracking-widest mb-1">VOLUME</span>
                         {/* Bars */}
                         <div className="flex gap-[2px] h-4 mb-1">
                            {[...Array(20)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-1.5 md:w-2 ${i < (volume / 5) ? 'bg-green-400' : 'bg-green-900/40'}`}
                              />
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Logo on the bottom bezel (part of screen section) */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <div className="inline-block transform scale-x-[1.4] scale-y-[0.8]">
              <span className="font-regular text-[#888] tracking-[0.3em] pl-[0.3em] text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" style={{ fontFamily: "'Besley', serif" }}>
                SONY
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Control Strip (Trinitron Style) */}
        <div className="bg-[#1a1a1a] border-t border-[#333] p-4 md:px-8 md:py-5 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Speaker Grille */}
          <div className="w-full md:w-1/3 flex items-center gap-1 opacity-60">
             <div className="grid grid-cols-12 gap-1 w-full h-8 md:h-10">
               {[...Array(36)].map((_, i) => (
                 <div key={i} className="bg-black/80 rounded-full w-full h-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]" />
               ))}
             </div>
          </div>

          {/* Center/Right: Controls */}
          <div className="flex items-center gap-8">
            
            {/* Input / Menu Buttons */}
            <div className="hidden md:flex gap-4">
              <button className="flex flex-col items-center gap-1 group">
                 <div className="w-8 h-3 bg-[#333] rounded-[1px] shadow-[0_1px_0_rgba(255,255,255,0.1)] active:translate-y-[1px] transition-all" />
                 <span className="text-[8px] text-[#555] font-bold tracking-wider group-hover:text-primary transition-colors">MENU</span>
              </button>
              <button className="flex flex-col items-center gap-1 group">
                 <div className="w-8 h-3 bg-[#333] rounded-[1px] shadow-[0_1px_0_rgba(255,255,255,0.1)] active:translate-y-[1px] transition-all" />
                 <span className="text-[8px] text-[#555] font-bold tracking-wider group-hover:text-primary transition-colors">INPUT</span>
              </button>
            </div>

            {/* Volume & Channel Rockers */}
            <div className="flex gap-6 bg-[#111] px-4 py-2 rounded-lg border border-white/5 shadow-inner">
               <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center bg-[#222] rounded overflow-hidden shadow-[0_1px_0_rgba(255,255,255,0.1)]">
                     <button onClick={() => handleVolumeChange(-5)} className="px-3 py-1.5 hover:bg-[#333] active:bg-[#111] transition-colors border-r border-black">
                        <span className="text-xs text-[#777] font-bold">-</span>
                     </button>
                     <span className="px-2 text-[8px] text-[#555] font-bold">VOL</span>
                     <button onClick={() => handleVolumeChange(5)} className="px-3 py-1.5 hover:bg-[#333] active:bg-[#111] transition-colors border-l border-black">
                        <span className="text-xs text-[#777] font-bold">+</span>
                     </button>
                  </div>
               </div>

               <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center bg-[#222] rounded overflow-hidden shadow-[0_1px_0_rgba(255,255,255,0.1)]">
                     <button onClick={handleChannelDown} className="px-3 py-1.5 hover:bg-[#333] active:bg-[#111] transition-colors border-r border-black">
                        <ChevronDown className="w-3 h-3 text-[#777]" />
                     </button>
                     <span className="px-2 text-[8px] text-[#555] font-bold container">CH</span>
                     <button onClick={handleChannelUp} className="px-3 py-1.5 hover:bg-[#333] active:bg-[#111] transition-colors border-l border-black">
                        <ChevronUp className="w-3 h-3 text-[#777]" />
                     </button>
                  </div>
               </div>
            </div>

            {/* Power Button */}
            <div className="flex flex-col items-center gap-1 ml-4">
               <button 
                onClick={handlePower}
                className="w-12 h-4 bg-[#222] rounded-sm relative shadow-[0_2px_0_rgba(255,255,255,0.1),inset_0_1px_5px_rgba(0,0,0,0.5)] active:translate-y-[1px] active:shadow-none transition-all"
               >
                 <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 transition-colors ${isPoweredOn ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-red-900'}`} />
               </button>
               <span className="text-[8px] text-[#555] font-bold tracking-wider">POWER</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoCarouselTV;
