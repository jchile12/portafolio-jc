import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment, OrbitControls, ContactShadows, Html, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { TVModel } from "./TVModel";
import CRTControls from "./CRTControls";
// import { useControls } from "leva";

import { Object3D } from "three";
import { Suspense, useState, useRef, useCallback, useEffect } from "react";

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.matchMedia('(pointer: coarse)').matches;
const isSmallScreen = !isMobile && window.innerHeight < 900;

interface Video {
  id: string;
  title: string;
  category: string;
  src: string;
  poster: string;
  description?: string;
  underscan?: number;
  software?: string[];
}


interface VideoCarouselProps {
  videos: Video[];
  currentVideoIndex: number;
  onIndexChange: (index: number) => void;
}

const Scene = ({
  currentVideo,
  isPoweredOn,
  volume,
  isMuted,
  showVolumeOSD,
  currentIndex,
  onPowerToggle,
  onVolumeChange,
  onChannelChange,
  showChannelOSD,
  onScreenClick,
  playerOpen,
}: {
  currentVideo: Video;
  isPoweredOn: boolean;
  volume: number;
  isMuted: boolean;
  showVolumeOSD: boolean;
  currentIndex: number;
  onPowerToggle: () => void;
  onVolumeChange: (change: number) => void;
  onChannelChange: (dir: number) => void;
  showChannelOSD: boolean;
  onScreenClick: () => void;
  playerOpen: boolean;
}) => {
  const purpleSpotLightRef = useRef<any>(null);

  const [target] = useState(() => new Object3D());
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 900]} fov={isMobile ? 55 : isSmallScreen ? 48 : 40} />
      
      {/* Enhanced Lighting for dark TV visibility */}
      <ambientLight intensity={0.4} /> {/* Reduced ambient slightly more */} 
      {/*<pointLight position={[-200, 100, 200]} intensity={300} color="#4ade80" distance={600} /> {/* Green accent */}


      {/* Purple Ambient - Controlled by Leva (Now Hardcoded) */}
      <spotLight 
        ref={purpleSpotLightRef}
        position={[200, -90, 350]} 
        target={target}
        angle={1.25} 
        penumbra={0.5} 
        intensity={200000} 
        color="#a855f7" 
        distance={1590}
      >
        <primitive object={target} position={[125, 388, -758]} />
      </spotLight>
      
      {/* Direct Spotlight on TV - Added per user request */}
      <spotLight 
        position={[400, 400, 400]} 
        angle={0.8} 
        penumbra={0.8} 
        intensity={400000} 
        castShadow 
        color="#ffffff" 
      />
      
      {/*<EffectComposer>
       <Bloom 
          luminanceThreshold={0.85} 
          mipmapBlur 
          intensity={0.4} 
          radius={0.4}
        /> 
      </EffectComposer>*/}

      <group rotation={isMobile ? [0, 0, 0] : [0, -0.1, 0]} position={isMobile ? [-250, 100, 0] : [0, 0, 0]}>
        <TVModel
          videoSrc={currentVideo?.src || ''}
          poster={currentVideo?.poster || ''}
          isPoweredOn={isPoweredOn}
          volume={volume}
          isMuted={isMuted}
          channel={currentIndex}
          showVolumeOSD={showVolumeOSD}
          onPowerToggle={onPowerToggle}
          onVolumeChange={onVolumeChange}
          onChannelChange={onChannelChange}
          showChannelOSD={showChannelOSD}
          underscan={currentVideo?.underscan ?? 0.80}
          onScreenClick={onScreenClick}
          playerOpen={playerOpen}
        />
        
        {/* Dynamic Screen Light Reflection on Floor */}
        {isPoweredOn && (
           <pointLight position={[0, -80, 50]} intensity={100} distance={400} color="#ffffff" />
        )}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </>
  );
};

const VideoCarousel = ({ videos, currentVideoIndex, onIndexChange }: VideoCarouselProps) => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(true);
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [showVolumeOSD, setShowVolumeOSD] = useState(false);
  const [showChannelOSD, setShowChannelOSD] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playerVideoRef = useRef<HTMLVideoElement | null>(null);

  // Initial auto-hide: controls after 5s, hint after 7s
  useEffect(() => {
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 5000);
    const hintTimeout = setTimeout(() => setShowHint(false), 7000);
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      clearTimeout(hintTimeout);
    };
  }, []);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    setShowHint(false);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 5000);
  }, []);

  const handleOpenPlayer = useCallback(() => {
    setIsPlayerOpen(true);
  }, []);

  const handleClosePlayer = useCallback(() => {
    setIsPlayerOpen(false);
    if (playerVideoRef.current) {
      playerVideoRef.current.pause();
    }
  }, []);

  // Close player on Escape
  useEffect(() => {
    if (!isPlayerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClosePlayer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPlayerOpen, handleClosePlayer]);

  const currentVideo = videos[currentVideoIndex];

  const handlePowerToggle = () => {
    setIsPoweredOn(!isPoweredOn);
  };

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
  };

  const handleVolumeChange = (change: number) => {
    if (!isPoweredOn) return;
    const newVolume = Math.min(100, Math.max(0, volume + change));
    setVolume(newVolume);

    setShowVolumeOSD(true);
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = setTimeout(() => setShowVolumeOSD(false), 2000);
  };

  const handleChannelChange = (dir: number) => {
    if (!isPoweredOn) return;
    let newIndex;
    if (dir > 0) {
       newIndex = currentVideoIndex === videos.length - 1 ? 0 : currentVideoIndex + 1;
    } else {
       newIndex = currentVideoIndex === 0 ? videos.length - 1 : currentVideoIndex - 1;
    }
    onIndexChange(newIndex); // Call prop

    setShowChannelOSD(true);
    if (channelTimeoutRef.current) clearTimeout(channelTimeoutRef.current);
    channelTimeoutRef.current = setTimeout(() => setShowChannelOSD(false), 2000);
  };


  return (
    <div className={`w-full ${isMobile ? 'h-[600px]' : 'h-[min(100vh,1000px)]'} relative`} onMouseMove={resetControlsTimer}>
      {/* Title & Description Overlay - Standard Container Alignment */}
      <div className="absolute top-0 left-0 w-full h-full z-40 pointer-events-none flex flex-col justify-end pb-16 md:pb-24 lg:pb-48">
         <div className="mx-6 ml-[180px] lg:ml-[200px]">
            <div className="max-w-md">
               <div key={currentVideoIndex} className="transform translate-y-0 opacity-0 animate-slide-up">
                  <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-4 uppercase tracking-tighter leading-none drop-shadow-lg">
                    {currentVideo.title}
                  </h2>
                  <div className="w-12 h-1 bg-white mb-3 md:mb-6" />
                  <p className="text-white/80 text-sm md:text-base lg:text-lg font-light leading-relaxed drop-shadow-md">
                    {currentVideo.description}
                  </p>
                  {currentVideo.software && currentVideo.software.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {currentVideo.software.map((sw) => (
                        <span
                          key={sw}
                          className="text-xs px-3 py-1 rounded-full border font-medium backdrop-blur-sm"
                          style={{
                            background: "rgba(255,255,255,0.08)",
                            borderColor: "rgba(255,255,255,0.15)",
                            color: "rgba(255,255,255,0.8)",
                          }}
                        >
                          {sw.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>





      {/* Hint alert */}
      <div
        className={`absolute inset-x-0 top-8 z-[51] flex justify-center pointer-events-none transition-all duration-700
                    ${showHint ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div
          className="px-5 py-3 rounded-xl flex items-center gap-3 animate-hint-blink"
          style={{
            background: "rgba(0,0,0,0.75)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-white/80 text-sm font-mono">
            Usa el control remoto para navegar entre videos
          </span>
        </div>
      </div>

      <CRTControls
        currentIndex={currentVideoIndex}
        totalChannels={videos.length}
        volume={volume}
        isPoweredOn={isPoweredOn}
        isMuted={isMuted}
        onChannelChange={handleChannelChange}
        onVolumeChange={handleVolumeChange}
        onPowerToggle={handlePowerToggle}
        onMuteToggle={handleMuteToggle}
        visible={showControls}
        onInteraction={resetControlsTimer}
      />

      <Canvas className="w-full h-full" shadows style={{ background: 'transparent' }} gl={{ alpha: true }}>
        <Suspense fallback={<Html center>Loading 3D TV...</Html>}>
          <Scene
            currentVideo={currentVideo}
            isPoweredOn={isPoweredOn}
            volume={volume}
            isMuted={isMuted}
            showVolumeOSD={showVolumeOSD}
            currentIndex={currentVideoIndex}
            onPowerToggle={handlePowerToggle}
            onVolumeChange={handleVolumeChange}
            onChannelChange={handleChannelChange}
            showChannelOSD={showChannelOSD}
            onScreenClick={handleOpenPlayer}
            playerOpen={isPlayerOpen}
           />

        </Suspense>
      </Canvas>

      {/* Fullscreen Video Player Overlay */}
      {isPlayerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={handleClosePlayer}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            onClick={handleClosePlayer}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Title */}
          <div className="absolute top-6 left-6 z-10" onClick={(e) => e.stopPropagation()}>
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
              {currentVideoIndex + 1} / {videos.length}
            </p>
            <h3 className="text-white text-lg font-bold mt-1">{currentVideo.title}</h3>
            <p className="text-white/50 text-sm">{currentVideo.category}</p>
          </div>

          {/* Prev button */}
          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              const newIndex = currentVideoIndex === 0 ? videos.length - 1 : currentVideoIndex - 1;
              onIndexChange(newIndex);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next button */}
          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              const newIndex = currentVideoIndex === videos.length - 1 ? 0 : currentVideoIndex + 1;
              onIndexChange(newIndex);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Video Player */}
          <div
            className="w-[90vw] max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              key={currentVideo?.src}
              ref={playerVideoRef}
              src={currentVideo?.src || ''}
              className="w-full h-full rounded-lg"
              controls
              autoPlay
              crossOrigin="anonymous"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;
