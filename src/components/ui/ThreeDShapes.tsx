import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Shape = ({ color, position, speed, factor, distort }: any) => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    mesh.current.rotation.x += speed * 0.1;
    mesh.current.rotation.y += speed * 0.1;
  });

  return (
    <Float rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={mesh} position={position} args={[1, 64, 64]}>
        {distort ? (
          <MeshDistortMaterial
            color={color}
            speed={speed * 2}
            distort={factor}
            roughness={0.1}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={0.2}
          />
        ) : (
          <MeshWobbleMaterial
            color={color}
            speed={speed * 2}
            factor={factor}
            roughness={0.1}
            metalness={0.8}
            emissive={color}
            emissiveIntensity={0.2}
          />
        )}
      </Sphere>
    </Float>
  );
};

const MouseFollowCamera = () => {
  const { camera, mouse } = useThree();
  useFrame(() => {
    // Smoothed camera follow
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 5, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
};

export const ThreeDShapes = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        
        <MouseFollowCamera />
        
        <group position={[0, 0, -5]}>
          <Shape color="#4ECDC4" position={[-4, 2, 0]} speed={0.01} factor={0.4} distort={true} />
          <Shape color="#5B9CF6" position={[5, -3, -2]} speed={0.005} factor={0.6} distort={false} />
          <Shape color="#c084fc" position={[2, 4, -4]} speed={0.008} factor={0.3} distort={true} />
        </group>
      </Canvas>
    </div>
  );
};
