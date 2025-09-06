import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import SlotMachine from "./games/SlotMachine";
import Blackjack from "./games/Blackjack";
import Roulette from "./games/Roulette";
import { useCasino } from "../lib/stores/useCasino";

export default function Casino() {
  const groupRef = useRef<THREE.Group>(null);
  const { currentGame } = useCasino();

  // Gentle rotation animation for ambiance
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Casino floor */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Casino walls */}
      <mesh position={[0, 4, -25]} rotation={[0, 0, 0]}>
        <planeGeometry args={[50, 8]} />
        <meshStandardMaterial color="#16213e" />
      </mesh>

      {/* Simple casino sign */}
      <mesh position={[0, 6, -24]}>
        <boxGeometry args={[8, 2, 0.1]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
      </mesh>

      {/* Test cube to verify 3D rendering */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>

      {/* Render current game */}
      {currentGame === "slots" && <SlotMachine />}
      {currentGame === "blackjack" && <Blackjack />}
      {currentGame === "roulette" && <Roulette />}
    </group>
  );
}
