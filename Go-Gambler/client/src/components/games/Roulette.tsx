import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { useRoulette } from "../../lib/stores/useRoulette";
import { useAudio } from "../../lib/stores/useAudio";
import { useCasino } from "../../lib/stores/useCasino";

const NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function Roulette() {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  
  const {
    isSpinning,
    wheelRotation,
    ballPosition,
    lastWinningNumber,
    totalBet,
    bets,
    spin,
    placeBet,
    canSpin,
    canBet
  } = useRoulette();
  
  const { totalCredits } = useCasino();
  const { playHit, playSuccess } = useAudio();

  useFrame((state, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.y = wheelRotation;
    }
    
    if (ballRef.current) {
      const wheelCenter = [6, 0.6, -3];
      if (isSpinning) {
        const radius = 4.6;
        ballRef.current.position.x = wheelCenter[0] + Math.cos(ballPosition) * radius;
        ballRef.current.position.z = wheelCenter[2] + Math.sin(ballPosition) * radius;
        ballRef.current.position.y = wheelCenter[1] + 0.1;
      } else {
        if (lastWinningNumber !== null) {
          const numberIndex = NUMBERS.indexOf(lastWinningNumber);
          const angle = (numberIndex / NUMBERS.length) * Math.PI * 2;
          const radius = 4.2;
          ballRef.current.position.x = wheelCenter[0] + Math.cos(angle) * radius;
          ballRef.current.position.z = wheelCenter[2] + Math.sin(angle) * radius;
          ballRef.current.position.y = wheelCenter[1] + 0.1;
        }
      }
    }
  });

  useEffect(() => {
    if (isSpinning) {
      playHit();
    }
  }, [isSpinning, playHit]);

  useEffect(() => {
    if (lastWinningNumber !== null) {
      playSuccess();
    }
  }, [lastWinningNumber, playSuccess]);

  const handleSpin = () => {
    if (canSpin()) {
      spin();
    }
  };

  const handleBet = (type: string, value: number | string) => {
    if (canBet()) {
      placeBet(type, value);
    }
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return "#00ff00";
    return RED_NUMBERS.includes(num) ? "#ff0000" : "#000000";
  };

  const renderWheelNumber = (number: number, index: number) => {
    const angle = (index / NUMBERS.length) * Math.PI * 2;
    const radius = 4.2;
    const color = getNumberColor(number);
    
    return (
      <group key={number} rotation={[0, angle, 0]}>
        <Box
          args={[0.4, 0.3, 0.2]}
          position={[0, 0.1, radius]}
        >
          <meshStandardMaterial color={color} />
        </Box>
        <Text
          position={[0, 0.1, radius + 0.11]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {number}
        </Text>
      </group>
    );
  };

  const renderBettingArea = () => {
    const bettingSpots = [
      ...NUMBERS.slice(1).map((num, i) => ({
        type: "number",
        value: num,
        position: [
          -6 + (i % 12) * 1,
          1.2,
          -2 + Math.floor(i / 12) * 1
        ] as [number, number, number],
        label: num.toString(),
        color: getNumberColor(num)
      })),
      { type: "red", value: "red", position: [-7, 1.2, 2] as [number, number, number], label: "RED", color: "#ff0000" },
      { type: "black", value: "black", position: [-5, 1.2, 2] as [number, number, number], label: "BLACK", color: "#000000" },
      { type: "even", value: "even", position: [-3, 1.2, 2] as [number, number, number], label: "EVEN", color: "#444444" },
      { type: "odd", value: "odd", position: [-1, 1.2, 2] as [number, number, number], label: "ODD", color: "#444444" },
      { type: "low", value: "low", position: [1, 1.2, 2] as [number, number, number], label: "1-18", color: "#444444" },
      { type: "high", value: "high", position: [3, 1.2, 2] as [number, number, number], label: "19-36", color: "#444444" },
    ];

    return bettingSpots.map((spot, index) => (
      <group key={`${spot.type}-${spot.value}`}>
        <Box
          args={[0.8, 0.1, 0.8]}
          position={spot.position}
          onClick={() => handleBet(spot.type, spot.value)}
        >
          <meshStandardMaterial
            color={spot.color}
            emissive={canBet() ? "#111111" : "#000000"}
          />
        </Box>
        <Text
          position={[spot.position[0], spot.position[1] + 0.1, spot.position[2]]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {spot.label}
        </Text>
        {bets[`${spot.type}-${spot.value}`] && (
          <Text
            position={[spot.position[0], spot.position[1] + 0.2, spot.position[2]]}
            fontSize={0.15}
            color="#ffd700"
            anchorX="center"
            anchorY="middle"
          >
            ${bets[`${spot.type}-${spot.value}`]}
          </Text>
        )}
      </group>
    ));
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      
      <Box args={[20, 0.2, 12]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f5132" />
      </Box>

      
      <Cylinder args={[5.5, 5.5, 0.5]} position={[6, 0.3, -3]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>

      
      <group ref={wheelRef} position={[6, 0.6, -3]}>
        <Cylinder args={[4.8, 4.8, 0.2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2c2c2c" />
        </Cylinder>
        {NUMBERS.map((number, index) => renderWheelNumber(number, index))}
      </group>

      
      <mesh ref={ballRef} position={[10.8, 0.7, -3]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#ffffff" emissive="#222222" />
      </mesh>

      
      <Text
        position={[0, 2, -6]}
        fontSize={1}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        ROULETTE
      </Text>

      
      {renderBettingArea()}

      
      <Box
        args={[3, 0.8, 1]}
        position={[6, 1.5, -3]}
        onClick={handleSpin}
      >
        <meshStandardMaterial
          color={canSpin() ? "#ff6b6b" : "#666666"}
          emissive={canSpin() ? "#330000" : "#000000"}
        />
      </Box>
      <Text
        position={[6, 1.5, -2.5]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {isSpinning ? "SPINNING..." : "SPIN"}
      </Text>

      
      <Box args={[6, 1, 0.2]} position={[-8, 1.5, 4]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      <Text
        position={[-8, 1.5, 4.2]}
        fontSize={0.4}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        CREDITS: {totalCredits}
      </Text>

      
      <Box args={[6, 1, 0.2]} position={[-2, 1.5, 4]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      <Text
        position={[-2, 1.5, 4.2]}
        fontSize={0.4}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        TOTAL BET: {totalBet}
      </Text>

      
      {lastWinningNumber !== null && (
        <>
          <Box args={[4, 1, 0.2]} position={[4, 1.5, 4]}>
            <meshStandardMaterial color={getNumberColor(lastWinningNumber)} />
          </Box>
          <Text
            position={[4, 1.5, 4.2]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            LAST: {lastWinningNumber}
          </Text>
        </>
      )}
    </group>
  );
}
