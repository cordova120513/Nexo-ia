'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image as ThreeImage, Float, OrbitControls } from '@react-three/drei';

const empresas = [
  { id: 1, url: '/empresas/empresa1.jpg', position: [-2.5, 0.8, 0] },
  { id: 2, url: '/empresas/empresa2.jpg', position: [2.5, 0.5, -0.6] },
  { id: 3, url: '/empresas/empresa3.jpg', position: [0, -1.2, 0.8] },
];

function TarjetaEdificio({ url, position }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = hovered ? 1.12 : 1;
    meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * delta * 8;
    meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * delta * 8;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <ThreeImage
          url={url}
          scale={[3.2, 1.8]}
          radius={0.06}
        />
      </mesh>
    </Float>
  );
}

export default function Empresas3D() {
  return (
    <section className="relative w-full h-[85vh] bg-neutral-950 overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center text-center px-6">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
          Portafolio Corporativo
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          Sedes & Infraestructura
        </h2>
        <p className="text-neutral-400 mt-3 text-sm md:text-base max-w-lg">
          Arrastra o mueve el ratón para explorar las ubicaciones corporativas en nuestro espacio tridimensional.
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
        <ambientLight intensity={1.5} />
        
        {empresas.map((item) => (
          <TarjetaEdificio
            key={item.id}
            url={item.url}
            position={item.position}
          />
        ))}

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </section>
  );
}
