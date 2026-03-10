import { useRef, useState, useEffect, useMemo } from 'react';
import { useVideoTexture, RoundedBox, Text, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TVModelProps {
  videoSrc: string;
  poster: string;
  isPoweredOn: boolean;
  volume: number;
  isMuted: boolean;
  channel: number;
  showVolumeOSD: boolean;
  onPowerToggle: () => void;
  onVolumeChange: (dir: number) => void;
  onChannelChange: (dir: number) => void;
  showChannelOSD: boolean;
  onScreenClick?: () => void;
  playerOpen?: boolean;
  osdMarginX?: number;
  osdMarginY?: number;
  underscan?: number;
}

export function TVModel({
  videoSrc,
  poster,
  isPoweredOn,
  volume,
  isMuted,
  channel,
  showVolumeOSD,
  onPowerToggle,
  onVolumeChange,
  onChannelChange,
  showChannelOSD,
  onScreenClick,
  playerOpen = false,
  osdMarginX = 58,
  osdMarginY = 99,
  underscan = 0.80,
}: TVModelProps) {
  // Manual Video Texture to avoid Suspense locking

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);
  const [videoAspect, setVideoAspect] = useState(4/3);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const isLoadingRef = useRef(true);
  const screenMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Static noise canvas texture
  const staticTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    const video = document.createElement('video');
    video.crossOrigin = "Anonymous";
    video.loop = true;
    video.muted = true; // Always mute during loading/static
    video.volume = volume / 100;
    video.playsInline = true;

    setIsVideoLoading(true);
    isLoadingRef.current = true;

    const startTime = Date.now();
    const STATIC_DURATION = 500; // ms

    const finishLoading = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, STATIC_DURATION - elapsed);
      setTimeout(() => {
        setIsVideoLoading(false);
        isLoadingRef.current = false;
        // Unmute only after static ends (stay muted if player overlay is open)
        video.muted = isMuted || volume === 0 || !isPoweredOn || playerOpen;
      }, remaining);
    };

    video.onloadedmetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        setVideoAspect(video.videoWidth / video.videoHeight);
      }
    };

    video.oncanplay = finishLoading;

    video.src = videoSrc;

    if (isPoweredOn && !playerOpen) {
      video.play().catch(e => console.warn("Video play failed", e));
    }

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    setVideoTexture(texture);
    videoRef.current = video;

    return () => {
      video.pause();
      video.src = "";
      video.remove();
      texture.dispose();
    };
  }, [videoSrc]);

  // Handle Power/Volume updates + player overlay pause
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = isMuted || volume === 0 || !isPoweredOn || playerOpen;
      if (isPoweredOn && !playerOpen) {
         videoRef.current.play().catch(() => {});
      } else {
         videoRef.current.pause();
      }
    }
  }, [volume, isMuted, isPoweredOn, playerOpen]);

  // --- Channel Number Texture Logic ---
  const [numberTexture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    return new THREE.CanvasTexture(canvas);
  });

  // Animate static noise in useFrame when loading
  const staticFrameRef = useRef(0);
  useFrame(() => {
    if (!isLoadingRef.current || !isPoweredOn) return;
    staticFrameRef.current++;
    if (staticFrameRef.current % 2 !== 0) return; // update every 2 frames
    const canvas = staticTexture.image as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() > 0.5 ? 200 + Math.random() * 55 : Math.random() * 60;
      imageData.data[i]     = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    staticTexture.needsUpdate = true;
    if (screenMaterialRef.current) {
      screenMaterialRef.current.uniforms.uTexture.value = staticTexture;
      screenMaterialRef.current.needsUpdate = true;
    }
  });

  // Switch texture when loading state changes
  useEffect(() => {
    if (!screenMaterialRef.current) return;
    screenMaterialRef.current.uniforms.uTexture.value = isVideoLoading ? staticTexture : videoTexture;
    screenMaterialRef.current.uniforms.uIsStatic.value = isVideoLoading ? 1.0 : 0.0;
    screenMaterialRef.current.needsUpdate = true;
  }, [isVideoLoading, videoTexture, staticTexture]);

  // Update video aspect and underscan when they change
  useEffect(() => {
    if (!screenMaterialRef.current) return;
    screenMaterialRef.current.uniforms.uVideoAspect.value = videoAspect;
    screenMaterialRef.current.uniforms.uUnderscan.value = underscan;
    screenMaterialRef.current.needsUpdate = true;
  }, [videoAspect, underscan]);

  const osdOpacityRef = useRef(0);
  const volOsdOpacityRef = useRef(0);
  const lastOsdOpacityRef = useRef(0);
  const lastVolOsdOpacityRef = useRef(0);
  const lastChannelRef = useRef(channel);
  const lastMutedRef = useRef(isMuted);
  const lastVolumeRef = useRef(volume);

  useFrame((state, delta) => {
    const targetCh  = (isPoweredOn && showChannelOSD) ? 1 : 0;
    const targetVol = (isPoweredOn && showVolumeOSD)  ? 1 : 0;
    const lerpSpeed = 5.0;
    osdOpacityRef.current    = THREE.MathUtils.lerp(osdOpacityRef.current,    targetCh,  delta * lerpSpeed);
    volOsdOpacityRef.current = THREE.MathUtils.lerp(volOsdOpacityRef.current, targetVol, delta * lerpSpeed);

    const chDiff  = Math.abs(osdOpacityRef.current    - lastOsdOpacityRef.current);
    const volDiff = Math.abs(volOsdOpacityRef.current  - lastVolOsdOpacityRef.current);
    const channelChanged = channel !== lastChannelRef.current;
    const mutedChanged   = isMuted  !== lastMutedRef.current;
    const volumeChanged  = volume   !== lastVolumeRef.current;

    if (chDiff > 0.001 || volDiff > 0.001 || channelChanged || mutedChanged || volumeChanged) {
      const canvas = numberTexture.image;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const green     = '#4ade80';
        const greenGlow = 'rgba(74,222,128,0.9)';
        const greenDim  = 'rgba(74,222,128,0.18)';

        // ─────────────────────────────────────────────
        // SAFE FRAME — ajusta estos márgenes a mano
        // El shader usa underscan=0.80, entonces el
        // contenido visible ocupa el 80% central del canvas.
        // Los márgenes definen el padding interno del frame.
        // ─────────────────────────────────────────────
        const W = canvas.width;   // 512
        const H = canvas.height;  // 512

        const marginX = osdMarginX;
        const marginY = osdMarginY;

        // Esquinas del safe frame
        const sf = {
          left:   marginX,
          right:  W - marginX,
          top:    marginY,
          bottom: H - marginY,
          cx:     W / 2,         // centro X
          cy:     H / 2,         // centro Y
        };
        // ─────────────────────────────────────────────

        // ── Channel OSD (esquina top-right del safe frame) ──
        if (osdOpacityRef.current > 0.01) {
          ctx.globalAlpha  = osdOpacityRef.current;
          ctx.fillStyle    = green;
          ctx.font         = 'bold 36px monospace';
          ctx.shadowColor  = `rgba(74,222,128,${osdOpacityRef.current * 0.9})`;
          ctx.shadowBlur   = 14;
          ctx.textAlign    = 'right';
          ctx.textBaseline = 'top';
          const ch = String(channel + 1).padStart(2, '0');
          ctx.fillText(`CH ${ch}`, sf.right, sf.top);
        }

        // ── Mute OSD (esquina top-left del safe frame) ──
        if (isPoweredOn && isMuted) {
          ctx.globalAlpha  = 1;
          ctx.fillStyle    = green;
          ctx.font         = 'bold 36px monospace';
          ctx.shadowColor  = greenGlow;
          ctx.shadowBlur   = 14;
          ctx.textAlign    = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText('MUTED', sf.left, sf.top);
        }

        // ── Volume OSD (centrado, anclado al bottom del safe frame) ──
        if (volOsdOpacityRef.current > 0.01) {
          ctx.globalAlpha = volOsdOpacityRef.current;
          ctx.shadowBlur  = 0;

          const totalBars = 20;
          const filled    = Math.round((volume / 100) * totalBars);
          const barW      = 9;
          const barH      = 14;
          const barGap    = 3;
          const stripW    = totalBars * (barW + barGap) - barGap;

          // Posición Y: las barras terminan en sf.bottom
          const barsTop   = sf.bottom - barH;
          const labelY    = barsTop - 6;       // label encima de las barras
          const numY      = sf.bottom + 4;     // número debajo de las barras

          const startX    = sf.cx - stripW / 2;

          // "VOLUME" label
          ctx.fillStyle    = green;
          ctx.font         = 'bold 13px monospace';
          ctx.shadowColor  = greenGlow;
          ctx.shadowBlur   = 8;
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText('VOLUME', sf.cx, labelY);

          // Segmented bars
          ctx.shadowBlur = 6;
          for (let i = 0; i < totalBars; i++) {
            const x = startX + i * (barW + barGap);
            if (i < filled) {
              ctx.fillStyle   = green;
              ctx.shadowColor = greenGlow;
            } else {
              ctx.fillStyle   = greenDim;
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur  = 0;
            }
            ctx.fillRect(x, barsTop, barW, barH);
          }

          // Volume number
          ctx.fillStyle    = green;
          ctx.font         = 'bold 14px monospace';
          ctx.shadowColor  = greenGlow;
          ctx.shadowBlur   = 8;
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(volume.toString(), sf.cx, numY);
        }
      }
      numberTexture.needsUpdate = true;

      lastOsdOpacityRef.current    = osdOpacityRef.current;
      lastVolOsdOpacityRef.current = volOsdOpacityRef.current;
      lastChannelRef.current       = channel;
      lastMutedRef.current         = isMuted;
      lastVolumeRef.current        = volume;
    }
  });



  // --- Custom Blur Shader Material ---
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform sampler2D uNumberTexture;
    uniform float uIsPoweredOn;
    uniform float uIsStatic;
    uniform float uVideoAspect;
    uniform float uScreenAspect;
    uniform float uUnderscan;
    varying vec2 vUv;

    vec3 blurSample(sampler2D tex, vec2 uv) {
      float r = 0.06;
      vec3 c  = texture2D(tex, clamp(uv, 0.0, 1.0)).rgb;
      c += texture2D(tex, clamp(uv + vec2( r,  0.0), 0.0, 1.0)).rgb;
      c += texture2D(tex, clamp(uv + vec2(-r,  0.0), 0.0, 1.0)).rgb;
      c += texture2D(tex, clamp(uv + vec2( 0.0,  r), 0.0, 1.0)).rgb;
      c += texture2D(tex, clamp(uv + vec2( 0.0, -r), 0.0, 1.0)).rgb;
      c += texture2D(tex, clamp(uv + vec2( r,  r), 0.0, 1.0)).rgb;
      c += texture2D(tex, clamp(uv + vec2(-r,  r), 0.0, 1.0)).rgb;
      c += texture2D(tex, clamp(uv + vec2( r, -r), 0.0, 1.0)).rgb;
      c += texture2D(tex, clamp(uv + vec2(-r, -r), 0.0, 1.0)).rgb;
      return c / 9.0;
    }

    void main() {
      if (uIsPoweredOn < 0.5) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      vec4 videoColor;

      if (uIsStatic > 0.5) {
        // Static fills full screen
        videoColor = texture2D(uTexture, vUv);
      } else {
        // Contain: maintain video aspect ratio with underscan
        vec2 center = vec2(0.5, 0.5);
        vec2 scaled = (vUv - center) / uUnderscan + center;

        vec2 videoUv = scaled;
        if (uVideoAspect > uScreenAspect) {
          float scaleY = uScreenAspect / uVideoAspect;
          videoUv.y = (scaled.y - 0.5) / scaleY + 0.5;
        } else {
          float scaleX = uVideoAspect / uScreenAspect;
          videoUv.x = (scaled.x - 0.5) / scaleX + 0.5;
        }

        bool outOfBounds = videoUv.x < 0.0 || videoUv.x > 1.0 || videoUv.y < 0.0 || videoUv.y > 1.0;
        if (outOfBounds) {
          videoColor = vec4(blurSample(uTexture, videoUv) * 0.5, 1.0);
        } else {
          videoColor = texture2D(uTexture, videoUv);
        }
      }

      // OSD Overlay
      vec4 osdColor = texture2D(uNumberTexture, vUv);
      gl_FragColor = mix(videoColor, osdColor, osdColor.a);
    }
  `;

  // Initialize shader material once
  const screenMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture:       { value: null },
        uNumberTexture: { value: numberTexture },
        uIsPoweredOn:   { value: 1.0 },
        uIsStatic:      { value: 1.0 },
        uVideoAspect:   { value: 4/3 },
        uScreenAspect:  { value: 500/375 },
        uUnderscan:     { value: 0.80 },
      },
      side: THREE.DoubleSide,
      transparent: true
    });
    screenMaterialRef.current = mat;
    return mat;
  }, [numberTexture]);

  // Update uniforms
  useEffect(() => {
    if (screenMaterial) {
      screenMaterial.uniforms.uIsPoweredOn.value = isPoweredOn ? 1.0 : 0.0;
      screenMaterial.needsUpdate = true;
    }
  }, [screenMaterial, isPoweredOn]);

  // Load the GLB model (Restored)
  const { scene } = useGLTF('/models/crt_tv.glb');
  const tvRef = useRef<THREE.Group>(null);
  
  // Clone scene to allow multiple instances with different materials/states
  const [modelScene] = useState(() => scene.clone());

  // Apply materials (Restored)
  useEffect(() => {
    if (!modelScene) return;
    
    // Traverse the model to find the screen
    modelScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const meshName = mesh.name.toLowerCase();
        let matName = '';
        if ((mesh.material as THREE.Material).name) {
           matName = (mesh.material as THREE.Material).name.toLowerCase();
        }
        
        if (
          meshName.includes('screen') || 
          matName.includes('default material 3') || 
          matName.includes('defaultmaterial3') ||
          matName.includes('defaultmaterial_3') ||
          matName.includes('default_material_3') ||
          meshName.includes('default material 3') ||
          meshName.includes('defaultmaterial_3') || 
          meshName.includes('defaultmaterial3') ||
          mesh.name === 'defaultMaterial_3'
        ) {
           console.log("Configuring screen mesh:", mesh.name);
           mesh.material = screenMaterial;
        }
      }
    });
  }, [modelScene, screenMaterial]);


  // Animation: Slide in from right on mount
  useEffect(() => {
    if (tvRef.current) {
       tvRef.current.position.x = 2000; // Start off-screen to the right
    }
  }, []);

  useFrame((state, delta) => {
    if (tvRef.current) {
       // Smoothly slide to position 0 (since the primitive inside has the offset -250)
       tvRef.current.position.x = THREE.MathUtils.lerp(tvRef.current.position.x, 0, delta * 2.5);
    }
  });

  return (
    <group ref={tvRef} rotation={[0, Math.PI - THREE.MathUtils.degToRad(15), 0]}>
      <primitive
        object={modelScene}
        scale={[1100, 1100, 1100]}
        position={[-250, -220, 0]}
        onClick={(e: any) => {
          if (onScreenClick && isPoweredOn) {
            e.stopPropagation();
            onScreenClick();
          }
        }}
        onPointerOver={() => { if (isPoweredOn) document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      />
    </group>
  );
}
