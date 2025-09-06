import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import * as THREE from "three";
import { useSlots } from "../../lib/stores/useSlots";
import { useAudio } from "../../lib/stores/useAudio";
import { useCasino } from "../../lib/stores/useCasino";

const SYMBOLS = ["🍒", "🍋", "🍊", "⭐", "💎", "🔔", "7️⃣"];
const SYMBOL_COLORS = ["#ff4757", "#feca57", "#ff9ff3", "#3742fa", "#2f3542", "#ffd700", "#ff3838"];

export default function SlotMachine() {
  const groupRef = useRef<THREE.Group>(null);
  const reel1Ref = useRef<THREE.Group>(null);
  const reel2Ref = useRef<THREE.Group>(null);
  const reel3Ref = useRef<THREE.Group>(null);
  
  const {
    reels,
    isSpinning,
    spinSpeed,
    lastWin,
    spin,
    canSpin
  } = useSlots();
  
  const { totalCredits } = useCasino();
  const { playHit, playSuccess } = useAudio();

  // Handle reel spinning animation
  useFrame((state, delta) => {
    if (isSpinning) {
      if (reel1Ref.current) {
        reel1Ref.current.rotation.x += spinSpeed[0] * delta;
      }
      if (reel2Ref.current) {
        reel2Ref.current.rotation.x += spinSpeed[1] * delta;
      }
      if (reel3Ref.current) {
        reel3Ref.current.rotation.x += spinSpeed[2] * delta;
      }
    } else {
      // When not spinning, ensure reels show the correct symbols
      if (reel1Ref.current) {
        reel1Ref.current.rotation.x = (reels[0] / SYMBOLS.length) * Math.PI * 2;
      }
      if (reel2Ref.current) {
        reel2Ref.current.rotation.x = (reels[1] / SYMBOLS.length) * Math.PI * 2;
      }
      if (reel3Ref.current) {
        reel3Ref.current.rotation.x = (reels[2] / SYMBOLS.length) * Math.PI * 2;
      }
    }
  });

  // Play sound effects
  useEffect(() => {
    if (isSpinning) {
      playHit();
    }
  }, [isSpinning, playHit]);

  useEffect(() => {
    if (lastWin > 0) {
      playSuccess();
    }
  }, [lastWin, playSuccess]);

  const handleSpin = () => {
    if (canSpin()) {
      spin();
    }
  };

  const renderReel = (reelIndex: number, reelRef: React.RefObject<THREE.Group>, position: [number, number, number]) => (
    <group position={position}>
      {/* Reel frame */}
      <Box args={[2, 6, 0.5]} position={[0, 0, 0.5]}>
        <meshStandardMaterial color="#2c2c54" />
      </Box>
      
      {/* Reel symbols */}
      <group ref={reelRef}>
        {SYMBOLS.map((symbol, index) => {
          const angle = (index / SYMBOLS.length) * Math.PI * 2;
          const radius = 1.5;
          // Adjust rotation to show the correct symbol when not spinning
          const adjustedAngle = isSpinning ? angle : angle - (reelIndex / SYMBOLS.length) * Math.PI * 2;
          return (
            <Text
              key={index}
              position={[
                Math.sin(adjustedAngle) * radius,
                Math.cos(adjustedAngle) * radius,
                1
              ]}
              rotation={[-adjustedAngle, 0, 0]}
              fontSize={1.2}
              color={SYMBOL_COLORS[index] || "#ffffff"}
              anchorX="center"
              anchorY="middle"
            >
              {symbol}
            </Text>
          );
        })}
      </group>
      
      {/* Reel window */}
      <Box args={[1.8, 2, 0.1]} position={[0, 0, 1]}>
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.8}
        />
      </Box>
    </group>
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Slot machine cabinet */}
      <Box args={[12, 8, 4]} position={[0, 0, -1]}>
        <meshStandardMaterial color="#8B0000" />
      </Box>

      {/* Machine top */}
      <Box args={[12, 1, 4]} position={[0, 4.5, -1]}>
        <meshStandardMaterial color="#ffd700" />
      </Box>

      {/* Title */}
      <Text
        position={[0, 3.5, 2]}
        fontSize={0.8}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        LUCKY SLOTS
      </Text>

      {/* Reels */}
      {renderReel(reels[0], reel1Ref, [-3, 0, 2])}
      {renderReel(reels[1], reel2Ref, [0, 0, 2])}
      {renderReel(reels[2], reel3Ref, [3, 0, 2])}

      {/* Credits display */}
      <Box args={[4, 1, 0.2]} position={[-3, -2.5, 2]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      <Text
        position={[-3, -2.5, 2.2]}
        fontSize={0.4}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        CREDITS: {totalCredits}
      </Text>

      {/* Last win display */}
      <Box args={[4, 1, 0.2]} position={[3, -2.5, 2]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      <Text
        position={[3, -2.5, 2.2]}
        fontSize={0.4}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        WIN: {lastWin}
      </Text>

      {/* Spin button */}
      <Box
        args={[3, 1, 0.5]}
        position={[0, -3.5, 2]}
        onClick={handleSpin}
      >
        <meshStandardMaterial
          color={canSpin() ? "#ff6b6b" : "#666666"}
          emissive={canSpin() ? "#330000" : "#000000"}
        />
      </Box>
      <Text
        position={[0, -3.5, 2.5]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {isSpinning ? "SPINNING..." : "SPIN"}
      </Text>

      {/* Paylines */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          args={[8, 0.1, 0.1]}
          position={[0, i - 1, 2.1]}
        >
          <meshStandardMaterial color="#ffd700" />
        </Box>
      ))}
    </group>
  );
}
