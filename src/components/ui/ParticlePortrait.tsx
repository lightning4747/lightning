import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = () => {
  const mesh = useRef<THREE.Points>(null!);
  const texture = useLoader(THREE.TextureLoader, '/src/assets/hero.png');

  const count = 10000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 5;
        pos.set([x, y, z], i * 3);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = Math.sin(time / 2) * 0.1;
    mesh.current.position.y = Math.cos(time / 2) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        map={texture}
        transparent
        alphaTest={0.5}
        depthWrite={false}
        color="#4ECDC4"
      />
    </points>
  );
};

export const ParticlePortrait = () => {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Particles />
      </Canvas>
    </div>
  );
};
