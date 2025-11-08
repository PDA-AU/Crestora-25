import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particlesCount = 2000;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a sphere
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Colors (cyan, gold, violet)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Cyan
        colors[i3] = 0;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else if (colorChoice < 0.66) {
        // Gold
        colors[i3] = 1;
        colors[i3 + 1] = 0.84;
        colors[i3 + 2] = 0;
      } else {
        // Violet
        colors[i3] = 0.58;
        colors[i3 + 1] = 0.44;
        colors[i3 + 2] = 0.86;
      }
    }
    
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    
    // Animate particle positions
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Gentle floating motion
      positions[i3 + 1] = y + Math.sin(state.clock.elapsedTime + x) * 0.001;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export const ParticleField3D = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  );
};
