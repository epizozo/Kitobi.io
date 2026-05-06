import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { LordIcon } from './ui/LordIcon';

// Mock Lottie animation data (simple sphere pulse)
const pulseAnimation = {
  v: "5.5.7",
  fr: 60,
  ip: 0,
  op: 120,
  w: 500,
  h: 500,
  nm: "Pulse",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [30], e: [100] }, { t: 60, s: [100], e: [30] }, { t: 120, s: [30] }] },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [250, 250, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [80, 80], e: [120, 120] }, { t: 60, s: [120, 120], e: [80, 80] }, { t: 120, s: [80, 80] }] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { d: 1, ty: "el", s: { a: 0, k: [200, 200] }, p: { a: 0, k: [0, 0] }, nm: "Circle" },
            { ty: "fl", c: { a: 0, k: [0.97, 0.45, 0.08, 1] }, o: { a: 0, k: 100 }, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ]
    }
  ]
};

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#f97316"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0a0b" roughness={0.5} metalness={0.5} />
      </mesh>
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

export const Hero3D: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Three.js Canvas */}
      <div className="absolute top-0 right-0 w-full h-[800px] opacity-40">
        <Canvas>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating LordIcons */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[20%] w-20 h-20 opacity-30 select-none"
      >
        <LordIcon src="https://cdn.lordicon.com/qhgwauhg.json" size={80} trigger="loop" />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[30%] left-[15%] w-24 h-24 opacity-20 select-none"
      >
        <LordIcon src="https://cdn.lordicon.com/fpipqvgu.json" size={96} trigger="loop" />
      </motion.div>

      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[5%] w-32 h-32 select-none"
      >
        <LordIcon src="https://cdn.lordicon.com/lsfccmly.json" size={128} trigger="loop" />
      </motion.div>

      {/* Lottie Decorations */}
      <div className="absolute top-20 right-[15%] w-64 h-64 opacity-20 blur-2xl">
        <Lottie animationData={pulseAnimation} loop={true} />
      </div>
      <div className="absolute bottom-40 left-[10%] w-96 h-96 opacity-10 blur-[100px]">
        <Lottie animationData={pulseAnimation} loop={true} />
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] rounded-full" />
    </div>
  );
};
