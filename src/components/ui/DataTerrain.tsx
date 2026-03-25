import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../hooks/useTheme';

const TerrainPlane = () => {
  const { theme } = useTheme();
  const meshRef = useRef<THREE.Mesh>(null!);

  const isDark = theme === 'dark';

  const width = 100;
  const height = 100;
  const segments = 60;

  // --- Geometry ---
  const { positions, indices } = useMemo(() => {
    const pos = new Float32Array((segments + 1) * (segments + 1) * 3);
    const ind = [];
    const noise = (x: number, y: number) =>
      Math.sin(x * 0.2) * Math.cos(y * 0.2) * 1.5 +
      Math.sin(x * 0.1) * 0.5;

    let i = 0;
    for (let row = 0; row <= segments; row++) {
      for (let col = 0; col <= segments; col++) {
        const vX = (col / segments - 0.5) * width;
        const vY = (row / segments - 0.5) * height;
        const vZ = noise(vX, vY);
        pos[i * 3]     = vX;
        pos[i * 3 + 1] = vY;
        pos[i * 3 + 2] = vZ;
        i++;
      }
    }

    for (let row = 0; row < segments; row++) {
      for (let col = 0; col < segments; col++) {
        const r1 = row * (segments + 1);
        const r2 = (row + 1) * (segments + 1);
        ind.push(r1 + col, r1 + col + 1, r2 + col);
        ind.push(r1 + col + 1, r2 + col + 1, r2 + col);
      }
    }

    return { positions: pos, indices: new Uint16Array(ind) };
  }, [segments, width, height]);

  // Brand Colors from ClickSpark palette
  const brandColors = useMemo(() => [
    new THREE.Color('#FF5C00'), // Orange
    new THREE.Color('#00E0FF'), // Cyan
    new THREE.Color('#70FF00'), // Green
    new THREE.Color('#BD00FF'), // Purple
    new THREE.Color('#FF005C'), // Pink
  ], []);

  // Uniforms
  const uniforms = useRef({
    u_mouse:    { value: new THREE.Vector2(0, 0) },
    u_time:     { value: 0 },
    u_isDark:   { value: isDark ? 1.0 : 0.0 },
    u_baseColor:{ value: new THREE.Color(isDark ? '#1A1D23' : '#E0E0E0') },
    u_col1:     { value: brandColors[0] },
    u_col2:     { value: brandColors[1] },
  });

  useEffect(() => {
    uniforms.current.u_isDark.value = isDark ? 1.0 : 0.0;
    uniforms.current.u_baseColor.value.set(isDark ? '#1A1D23' : '#F5F5F5');
  }, [isDark]);

  const vGlobalMouse = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Map to R3F mouse space [-1, 1]
      vGlobalMouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    uniforms.current.u_time.value = elapsed;
    
    // Track global mouse instead of R3F local canvas mouse
    uniforms.current.u_mouse.value.lerp(vGlobalMouse.current, 0.05);

    // Dynamic color cycling (every 2 seconds)
    if (!isDark) {
      const idx1 = Math.floor(elapsed / 2.5) % brandColors.length;
      const idx2 = (idx1 + 1) % brandColors.length;
      const t = (elapsed % 2.5) / 2.5;
      
      uniforms.current.u_col1.value.lerpColors(brandColors[idx1], brandColors[idx2], t);
      uniforms.current.u_col2.value.lerpColors(brandColors[idx2], brandColors[(idx2 + 1) % brandColors.length], t);
    }
  });

  const vertexShader = `
    varying vec3 vPosition;
    varying float vWave;
    uniform float u_time;

    void main() {
      float wave = sin(position.x * 0.12 + u_time * 0.5)
                 * cos(position.y * 0.12 + u_time * 0.5) * 0.25;
      vWave = wave;
      vec3 newPos = position;
      newPos.z += wave;
      vPosition = newPos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vPosition;
    varying float vWave;
    uniform vec2  u_mouse;
    uniform float u_isDark;
    uniform vec3  u_baseColor;
    uniform vec3  u_col1;
    uniform vec3  u_col2;

    void main() {
      vec2 worldMouse = u_mouse * 50.0;
      float dist = length(vPosition.xy - worldMouse);
      float illumination = exp(-pow(dist / 22.0, 2.0));

      vec3 finalColor = u_baseColor;
      float opacity = 0.3;

      if (u_isDark > 0.5) {
        finalColor = mix(u_baseColor, vec3(0.5, 0.52, 0.6), illumination);
        opacity = mix(0.15, 0.9, illumination);
      } else {
        // Light: always visible, peaks tinted with cycling brand colors
        float peak = smoothstep(0.2, 2.5, vPosition.z);
        vec3 peakColor = mix(u_col1, u_col2, clamp(vPosition.z / 2.0, 0.0, 1.0));
        
        // Add subtle hover focus to Light mode too
        finalColor = mix(u_baseColor, peakColor, peak);
        finalColor = mix(finalColor, u_col1, illumination * 0.4);
        opacity = mix(0.35, 0.8, illumination);
      }

      gl_FragColor = vec4(finalColor, opacity);
    }
  `;

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.5, 0, 0]}
      position={[0, -5, -5]}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="index"
          args={[indices, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        wireframe={true}
        transparent={true}
        side={THREE.DoubleSide}
        depthWrite={true}
      />
    </mesh>
  );
};

export const DataTerrain = () => {
  const { theme } = useTheme();
  
  if (theme === 'light') return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <TerrainPlane />
      </Canvas>
    </div>
  );
};