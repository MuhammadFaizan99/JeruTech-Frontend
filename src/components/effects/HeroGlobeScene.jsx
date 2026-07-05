import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { DoubleSide } from "three";

const Globe = () => {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.28) * 0.06;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.14) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.9, 64, 56]} />
        <meshStandardMaterial
          color="#2f4eb5"
          roughness={0.18}
          metalness={0.85}
          emissive="#1e3a8a"
          emissiveIntensity={0.22}
          transparent
          opacity={0.94}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.18, 2.48, 128]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.16}
          side={DoubleSide}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.95, 0.03, 16, 120]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={0.38}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

const HeroGlobeScene = () => (
  <div className="hero-globe-scene" aria-hidden="true">
    <Canvas
      shadows={false}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 8], fov: 38 }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 4, 5]} intensity={1.1} />
      <directionalLight position={[-4, -2, 3]} intensity={0.35} />
      <Globe />
    </Canvas>
  </div>
);

export default HeroGlobeScene;
