import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GatitoPlushie from '@/components/GatitoPlushie';

const ThreeD = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-24 pb-12 container mx-auto px-6">
        <div className="mb-12 text-center">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-gradient mb-4">
            3D Playground
            </h1>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Exploraciones interactivas, modelos y experimentos en 3D.
            </p>
        </div>

        {/* Gatito Plushie Section */}
        <section className="mb-20">
            <div className="flex items-center justify-between mb-6 border-b border-primary/20 pb-2">
                <h2 className="font-display font-bold text-2xl">Gatito Plushie</h2>
                <span className="text-xs font-mono text-muted-foreground">INTERACTIVE / RIGGED</span>
            </div>
            
            <div className="w-full h-[500px] bg-secondary/10 rounded-xl overflow-hidden relative border border-white/10 glass-card">
                <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white/80">
                    Mueve el mouse para que te siga con la mirada
                </div>
                
                <Canvas camera={{ position: [0, 1, 4], fov: 45 }}>
                    <Suspense fallback={
                        <mesh visible={true}>
                             <boxGeometry />
                             <meshStandardMaterial color="purple" wireframe />
                        </mesh>
                    }>
                        <Environment preset="city" />
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                        <pointLight position={[-10, -10, -10]} />
                        
                        <GatitoPlushie position={[0, -1, 0]} scale={2} />
                        
                        <ContactShadows resolution={1024} scale={10} blur={1} opacity={0.5} far={10} color="#8a2be2" />
                        <OrbitControls enableZoom={true} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
                    </Suspense>
                </Canvas>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
                Modelo rigged en Blender, exportado a glTF y animado proceduralmente con React Three Fiber.
            </p>
        </section>

        {/* Placeholder for future projects */}
        <section>
             <div className="flex items-center justify-between mb-6 border-b border-primary/20 pb-2">
                <h2 className="font-display font-bold text-2xl">Más Proyectos</h2>
                <span className="text-xs font-mono text-muted-foreground">COMING SOON</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video bg-secondary/5 rounded-lg border border-dashed border-muted flex items-center justify-center text-muted-foreground">
                    Project Placeholder 1
                </div>
                <div className="aspect-video bg-secondary/5 rounded-lg border border-dashed border-muted flex items-center justify-center text-muted-foreground">
                    Project Placeholder 2
                </div>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ThreeD;
