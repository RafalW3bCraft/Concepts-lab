import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import * as THREE from "three";
import { useBlackjack } from "../../lib/stores/useBlackjack";
import { useAudio } from "../../lib/stores/useAudio";
import { useCasino } from "../../lib/stores/useCasino";

export default function Blackjack() {
  const groupRef = useRef<THREE.Group>(null);
  const {
    playerHand,
    dealerHand,
    playerScore,
    dealerScore,
    gameState,
    currentBet,
    canHit,
    canStand,
    canDouble,
    canDeal,
    hit,
    stand,
    double,
    deal,
    showDealerCard
  } = useBlackjack();
  
  const { totalCredits } = useCasino();
  const { playHit, playSuccess } = useAudio();
  const [animationOffset, setAnimationOffset] = useState(0);

  useFrame((state) => {
    setAnimationOffset(Math.sin(state.clock.elapsedTime) * 0.1);
  });

  const renderCard = (card: any, position: [number, number, number], hidden = false) => {
    if (!card) return null;
    
    return (
      <group position={position}>
        
        <Box args={[1.2, 1.8, 0.1]}>
          <meshStandardMaterial
            color={hidden ? "#4a4a4a" : "#ffffff"}
          />
        </Box>
        
        
        {!hidden && (
          <>
            <Text
              position={[0, 0.3, 0.1]}
              fontSize={0.6}
              color={card.suit === "♥" || card.suit === "♦" ? "#ff0000" : "#000000"}
              anchorX="center"
              anchorY="middle"
            >
              {card.rank}
            </Text>
            <Text
              position={[0, -0.3, 0.1]}
              fontSize={0.8}
              color={card.suit === "♥" || card.suit === "♦" ? "#ff0000" : "#000000"}
              anchorX="center"
              anchorY="middle"
            >
              {card.suit}
            </Text>
          </>
        )}
      </group>
    );
  };

  const handleHit = () => {
    if (canHit()) {
      hit();
      playHit();
    }
  };

  const handleStand = () => {
    if (canStand()) {
      stand();
    }
  };

  const handleDouble = () => {
    if (canDouble()) {
      double();
      playHit();
    }
  };

  const handleDeal = () => {
    if (canDeal()) {
      deal();
      playHit();
    }
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      
      <Box args={[16, 10, 0.2]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#0f5132" />
      </Box>

      
      <Box args={[14, 8, 0.1]} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#198754" />
      </Box>

      
      <Text
        position={[0, 1, 4]}
        fontSize={1}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        BLACKJACK
      </Text>

      
      <Text
        position={[0, 1, 2]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        DEALER: {showDealerCard ? dealerScore : "?"}
      </Text>

      
      {dealerHand.map((card, index) => 
        renderCard(
          card,
          [-2 + index * 1.5, 1.2, 1.5],
          index === 1 && !showDealerCard
        )
      )}

      
      <Text
        position={[0, 1, -2]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        PLAYER: {playerScore}
      </Text>

      
      {playerHand.map((card, index) => 
        renderCard(
          card,
          [-2 + index * 1.5, 1.2, -1.5]
        )
      )}

      
      <group position={[0, 1, -3.5]}>
        
        <Box
          args={[2, 0.8, 0.3]}
          position={[-4, 0, 0]}
          onClick={handleDeal}
        >
          <meshStandardMaterial
            color={canDeal() ? "#28a745" : "#666666"}
            emissive={canDeal() ? "#001100" : "#000000"}
          />
        </Box>
        <Text
          position={[-4, 0, 0.2]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          DEAL
        </Text>

        
        <Box
          args={[2, 0.8, 0.3]}
          position={[-1.5, 0, 0]}
          onClick={handleHit}
        >
          <meshStandardMaterial
            color={canHit() ? "#dc3545" : "#666666"}
            emissive={canHit() ? "#330000" : "#000000"}
          />
        </Box>
        <Text
          position={[-1.5, 0, 0.2]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          HIT
        </Text>

        
        <Box
          args={[2, 0.8, 0.3]}
          position={[1, 0, 0]}
          onClick={handleStand}
        >
          <meshStandardMaterial
            color={canStand() ? "#ffc107" : "#666666"}
            emissive={canStand() ? "#332200" : "#000000"}
          />
        </Box>
        <Text
          position={[1, 0, 0.2]}
          fontSize={0.3}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          STAND
        </Text>

        
        <Box
          args={[2, 0.8, 0.3]}
          position={[3.5, 0, 0]}
          onClick={handleDouble}
        >
          <meshStandardMaterial
            color={canDouble() ? "#17a2b8" : "#666666"}
            emissive={canDouble() ? "#001122" : "#000000"}
          />
        </Box>
        <Text
          position={[3.5, 0, 0.2]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          DOUBLE
        </Text>
      </group>

      
      <Box args={[6, 1, 0.2]} position={[-5, 1, -4.5]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      <Text
        position={[-5, 1, -4.3]}
        fontSize={0.4}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        CREDITS: {totalCredits}
      </Text>

      <Box args={[6, 1, 0.2]} position={[5, 1, -4.5]}>
        <meshStandardMaterial color="#000000" />
      </Box>
      <Text
        position={[5, 1, -4.3]}
        fontSize={0.4}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        BET: {currentBet}
      </Text>

      
      {gameState !== "playing" && gameState !== "waiting" && (
        <Text
          position={[0, 2 + animationOffset, 0]}
          fontSize={0.8}
          color={gameState === "playerWin" ? "#00ff00" : gameState === "dealerWin" ? "#ff0000" : "#ffd700"}
          anchorX="center"
          anchorY="middle"
        >
          {gameState === "playerWin" && "YOU WIN!"}
          {gameState === "dealerWin" && "DEALER WINS!"}
          {gameState === "push" && "PUSH!"}
          {gameState === "playerBust" && "BUST!"}
          {gameState === "dealerBust" && "DEALER BUST!"}
          {gameState === "blackjack" && "BLACKJACK!"}
        </Text>
      )}
    </group>
  );
}
