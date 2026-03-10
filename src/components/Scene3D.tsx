import { useRef, useMemo, useEffect, useState, Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Icosahedron, Octahedron, Torus, TorusKnot, Environment, Text3D, Center, MeshTransmissionMaterial, Grid, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const isMobileDevice = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.matchMedia('(pointer: coarse)').matches;

// Detect weak GPUs (integrated Intel/AMD, low-end, etc.)
const detectWeakGPU = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase();
      const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL).toLowerCase();
      console.log('[Scene3D] GPU:', renderer, '| Vendor:', vendor);
      // Intel integrated, AMD integrated (Vega, Radeon Graphics), Mali, Adreno, SwiftShader
      if (
        renderer.includes('intel') ||
        renderer.includes('swiftshader') ||
        renderer.includes('mali') ||
        renderer.includes('adreno') ||
        (renderer.includes('radeon') && renderer.includes('graphics') && !renderer.includes('rx'))
      ) {
        return true;
      }
    }
    canvas.remove();
  } catch {
    // If detection fails, assume capable
  }
  return false;
};

const isWeakGPU = detectWeakGPU();

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  componentDidCatch(e: Error) { console.error('[Scene3D crash]', e); }
  render() {
    if (this.state.error) {
      // Muestra el error visible en pantalla para debug mobile
      return (
        <div style={{ position: 'absolute', inset: 0, color: 'red', fontSize: 12, padding: 8, background: 'rgba(0,0,0,0.8)', zIndex: 99, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
          [3D Error] {this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}

const chromaticOffset = new THREE.Vector2(0.0015, 0.0015);

const Effects = () => (
  <EffectComposer>
    <ChromaticAberration
      blendFunction={BlendFunction.NORMAL}
      offset={chromaticOffset}
    />
  </EffectComposer>
);

// Shared gyroscope input for mobile — normalized -1 to 1
const gyroInput = { x: 0, y: 0 };
let gyroListenerAdded = false;

const addGyroListener = () => {
  if (gyroListenerAdded) return;
  gyroListenerAdded = true;

  const handler = (e: DeviceOrientationEvent) => {
    // gamma = left/right tilt (-90 to 90), beta = front/back tilt (-180 to 180)
    const gamma = e.gamma ?? 0; // horizontal
    const beta  = e.beta  ?? 0; // vertical (clamp around neutral 45°)
    gyroInput.x = THREE.MathUtils.clamp(-gamma / 10, -1, 1);
    gyroInput.y = THREE.MathUtils.clamp(-(beta - 45) / 10, -1, 1);
  };

  if (typeof DeviceOrientationEvent === 'undefined') return;

  // iOS 13+ requires permission
  if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
    (DeviceOrientationEvent as any).requestPermission()
      .then((state: string) => {
        if (state === 'granted') window.addEventListener('deviceorientation', handler);
      })
      .catch(() => {});
  } else {
    window.addEventListener('deviceorientation', handler);
  }
};

const Rig = () => {
  const { camera, pointer } = useThree();
  const vec = new THREE.Vector3();
  const isMobile = isMobileDevice || window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    if (isMobile) addGyroListener();
  }, [isMobile]);

  useFrame(() => {
    const x = isMobile ? gyroInput.x : pointer.x;
    const y = isMobile ? -gyroInput.y : pointer.y;
    camera.position.lerp(vec.set(x, y, 4), 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const FloatingShape = ({
  position,
  geometry,
  color,
  speed = 1,
  distort = 0.3,
  scale = 1,
}: {
  position: [number, number, number];
  geometry: 'icosahedron' | 'octahedron' | 'torus' | 'torusKnot';
  color: string;
  speed?: number;
  distort?: number;
  scale?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Subtle rotation
    meshRef.current.rotation.x += 0.003 * speed;
    meshRef.current.rotation.y += 0.005 * speed;
    
    // React to mouse position
    const targetX = position[0] + pointer.x * 0.5;
    const targetY = position[1] + pointer.y * 0.5;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.02);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.02);
  });

  const renderGeometry = () => {
    switch (geometry) {
      case 'icosahedron':
        return <Icosahedron args={[1, 1]} />;
      case 'octahedron':
        return <Octahedron args={[1, 0]} />;
      case 'torus':
        return <Torus args={[1, 0.4, 16, 32]} />;
      case 'torusKnot':
        return <TorusKnot args={[0.8, 0.3, 100, 16]} />;
      default:
        return <Icosahedron args={[1, 1]} />;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {renderGeometry()}
        <MeshDistortMaterial
          color={color}
          attach="material"
          roughness={0.1}
          metalness={1}
          transparent={false}
          opacity={1}
        />
      </mesh>
    </Float>
  );
};

const WireframeShape = ({ 
  position, 
  scale = 1,
  color
}: { 
  position: [number, number, number];
  scale?: number;
  color: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.z += 0.003;
    
    // Subtle mouse reactivity
    meshRef.current.rotation.y = pointer.x * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.15} />
    </mesh>
  );
};

const ParticleField = () => {
  const points = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  
  const particleCount = 500;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.02 + pointer.x * 0.1;
    points.current.rotation.x = pointer.y * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

const InteractiveGroup = ({ children }: { children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Rotate slowly
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.15) * 0.1;
    
    // React to mouse
    groupRef.current.rotation.z = pointer.x * 0.05;
    groupRef.current.position.x = pointer.x * 0.5;
    groupRef.current.position.y = pointer.y * 0.5;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
      <group ref={groupRef}>
        {children}
      </group>
    </Float>
  );
};

const JCText = () => {
  return (
    <Center position={isMobileDevice ? [0, 0, 0] : [2.5, 0, 0]}>
      <Text3D
        font="/fonts/Bonheur Royale_Regular.json"
        size={isMobileDevice ? 1.8 : 2.5}
        height={0.5}
        curveSegments={32}
        bevelEnabled
        bevelThickness={0.15}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={16}
      >
        JC
        {isWeakGPU ? (
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={1}
            roughness={0.15}
            envMapIntensity={1.5}
          />
        ) : (
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.5}
            thickness={0.5}
            chromaticAberration={1}
            anisotropicBlur={0.5}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            transmission={1}
            roughness={0}
            ior={1.5}
            color="#ffffff"
          />
        )}
      </Text3D>
    </Center>
  );
};

const SwirlParticles = () => {
  const points = useRef<THREE.Points>(null);
  const trailPoints = useRef<THREE.Points[]>([]);
  const { pointer, viewport } = useThree();

  const particleCount = 2000;
  const trailLength = 5;
  const mouseInfluence = 2.5;
  const pushStrength = 1.2;
  
  // Store previous positions for trails
  const prevPositions = useRef<Float32Array[]>([]);
  
  const { positions, colors, initialAngles, radii, heights } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const rads = new Float32Array(particleCount);
    const hts = new Float32Array(particleCount);
    
    const purple1 = new THREE.Color('#8B5CF6');
    const purple2 = new THREE.Color('#A855F7');
    const purple3 = new THREE.Color('#C084FC');
    const white = new THREE.Color('#FFFFFF');
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 12 + Math.random() * 0.5;
      const radius = 0.5 + (i / particleCount) * 4 + Math.random() * 0.3;
      const height = (Math.random() - 0.5) * 6;
      
      angles[i] = angle;
      rads[i] = radius;
      hts[i] = height;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      
      const t = i / particleCount;
      let color: THREE.Color;
      if (t < 0.33) {
        color = purple1.clone().lerp(purple2, t * 3);
      } else if (t < 0.66) {
        color = purple2.clone().lerp(purple3, (t - 0.33) * 3);
      } else {
        color = purple3.clone().lerp(white, (t - 0.66) * 3);
      }
      
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    
    // Initialize previous positions for trails
    prevPositions.current = [];
    for (let t = 0; t < trailLength; t++) {
      prevPositions.current[t] = new Float32Array(pos);
    }

    return { positions: pos, colors: col, initialAngles: angles, radii: rads, heights: hts };
  }, [particleCount, trailLength]);

  useFrame((state) => {
    if (!points.current) return;
    
    const time = state.clock.elapsedTime;
    const posArray = points.current.geometry.attributes.position.array as Float32Array;
    
    // Shift trail positions
    if (trailLength > 0) {
      for (let t = trailLength - 1; t > 0; t--) {
        prevPositions.current[t].set(prevPositions.current[t - 1]);
      }
      prevPositions.current[0].set(posArray);
    }
    
    const mouseX = pointer.x * viewport.width / 2;
    const mouseY = pointer.y * viewport.height / 2;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = initialAngles[i] + time * (0.2 + (i / particleCount) * 0.3);
      const baseRadius = radii[i] + Math.sin(time * 0.5 + i * 0.01) * 0.2;
      const heightOffset = Math.sin(time * 0.3 + initialAngles[i]) * 0.5;
      
      let x = Math.cos(angle) * baseRadius;
      let y = heights[i] + heightOffset;
      let z = Math.sin(angle) * baseRadius;
      
      const dx = x - mouseX;
      const dy = y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseInfluence) {
        const force = (1 - distance / mouseInfluence) * pushStrength;
        const normalX = dx / (distance + 0.001);
        const normalY = dy / (distance + 0.001);
        
        x += normalX * force;
        y += normalY * force;
        z += force * 0.3;
      }
      
      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    
    // Update trail geometries
    trailPoints.current.forEach((trail, idx) => {
      if (trail && trail.geometry.attributes.position) {
        const trailArray = trail.geometry.attributes.position.array as Float32Array;
        trailArray.set(prevPositions.current[idx]);
        trail.geometry.attributes.position.needsUpdate = true;
      }
    });
    
    points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, pointer.y * 0.15, 0.05);
    points.current.rotation.z = THREE.MathUtils.lerp(points.current.rotation.z, pointer.x * 0.08, 0.05);
  });

  const trailColors = useMemo(() => {
    const cols: Float32Array[] = [];
    for (let t = 0; t < trailLength; t++) {
      const col = new Float32Array(particleCount * 3);
      const fade = 1 - (t + 1) / (trailLength + 1);
      for (let i = 0; i < particleCount; i++) {
        col[i * 3] = colors[i * 3] * fade;
        col[i * 3 + 1] = colors[i * 3 + 1] * fade;
        col[i * 3 + 2] = colors[i * 3 + 2] * fade;
      }
      cols.push(col);
    }
    return cols;
  }, [colors]);

  return (
    <group>
      {/* Trail particles */}
      {Array.from({ length: trailLength }).map((_, idx) => (
        <points 
          key={idx} 
          ref={(el) => { if (el) trailPoints.current[idx] = el!; }}
          rotation={points.current?.rotation}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={prevPositions.current[idx] || positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={particleCount}
              array={trailColors[idx]}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.01 * (1 - idx / trailLength)}
            vertexColors
            transparent
            opacity={0.5 * (1 - idx / trailLength)}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      ))}
      
      {/* Main particles */}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <Rig />
      <Environment preset="city" blur={1} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
      <spotLight position={[0, 10, 5]} intensity={0.8} color="#ffffff" angle={0.3} />

      <InteractiveGroup>
        <Suspense fallback={null}>
          <JCText />
        </Suspense>
        {!isMobileDevice && (
          <Grid
            position={[0, -1.8, 0]}
            args={[30, 30]}
            cellSize={1}
            cellThickness={1}
            cellColor="#6f6f6f"
            sectionSize={5}
            sectionThickness={1.5}
            sectionColor="#A855F7"
            fadeDistance={20}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid
          />
        )}
      </InteractiveGroup>

      <SwirlParticles />

      {isMobileDevice ? (
        <WireframeShape position={[0, 0, -3]} scale={2.5} color="#ffffff" />
      ) : (
        <>
          <FloatingShape position={[-4, 2, -3]} geometry="icosahedron" color="#ffffff" scale={0.8} speed={1.2} distort={0.5} />
          <FloatingShape position={[4, -1, -4]} geometry="octahedron" color="#ffffff" scale={1} speed={0.8} distort={0.4} />
          <FloatingShape position={[-3, -2, -2]} geometry="torus" color="#ffffff" scale={0.6} speed={1.5} distort={0.3} />
          <FloatingShape position={[3, 2.5, -5]} geometry="torusKnot" color="#ffffff" scale={0.5} speed={1} distort={0.6} />
          <WireframeShape position={[-16, 3, -10]} scale={6} color="#ffffff" />
          <WireframeShape position={[0, -4, -6]} scale={2} color="#ffffff" />
          {!isWeakGPU && <Effects />}
        </>
      )}
    </>
  );
};

const Scene3D = () => {
  return (
    <div className="absolute inset-0 z-0" style={isMobileDevice ? { pointerEvents: 'none' } : undefined}>
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 90 }}
          dpr={isMobileDevice ? 1 : [1, 2]}
          gl={{ antialias: !isMobileDevice, alpha: true }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1;
          }}
        >
          <AdaptiveDpr pixelated />
          <Scene />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

export default Scene3D;
