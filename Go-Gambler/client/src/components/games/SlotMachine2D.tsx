import { useEffect, useRef } from "react";
import { useSlots } from "../../lib/stores/useSlots";
import { useAudio } from "../../lib/stores/useAudio";
import { useCasino } from "../../lib/stores/useCasino";

const SYMBOLS = ["🍒", "🍋", "🍊", "⭐", "💎", "🔔", "7️⃣"];
const SYMBOL_INDICES = [0, 1, 2, 3, 4, 5, 6];

export default function SlotMachine2D() {
  const reel1Ref = useRef<HTMLDivElement>(null);
  const reel2Ref = useRef<HTMLDivElement>(null);
  const reel3Ref = useRef<HTMLDivElement>(null);
  
  const {
    reels,
    isSpinning,
    lastWin,
    spin,
    canSpin
  } = useSlots();
  
  const { totalCredits } = useCasino();
  const { playHit, playSuccess } = useAudio();

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

  // Handle reel animations
  useEffect(() => {
    if (isSpinning) {
      [reel1Ref, reel2Ref, reel3Ref].forEach((ref, index) => {
        if (ref.current) {
          ref.current.style.animation = `spin-reel-${index + 1} ${1 + index * 0.5}s linear infinite`;
        }
      });
    } else {
      [reel1Ref, reel2Ref, reel3Ref].forEach(ref => {
        if (ref.current) {
          ref.current.style.animation = 'none';
        }
      });
    }
  }, [isSpinning]);

  const handleSpin = () => {
    if (canSpin() && totalCredits >= 10) {
      spin();
    }
  };

  return (
    <div className="slot-machine-2d">
      <div className="slot-machine-frame">
        <h2 className="game-title">🎰 Slot Machine</h2>
        
        <div className="slot-reels">
          <div className="reel" ref={reel1Ref}>
            <div className="symbol-display">
              {SYMBOLS[reels[0] || 0]}
            </div>
          </div>
          
          <div className="reel" ref={reel2Ref}>
            <div className="symbol-display">
              {SYMBOLS[reels[1] || 0]}
            </div>
          </div>
          
          <div className="reel" ref={reel3Ref}>
            <div className="symbol-display">
              {SYMBOLS[reels[2] || 0]}
            </div>
          </div>
        </div>

        <div className="slot-controls">
          <button 
            className={`spin-button ${!canSpin() || totalCredits < 10 ? 'disabled' : ''}`}
            onClick={handleSpin}
            disabled={!canSpin() || totalCredits < 10}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN (10 Credits)'}
          </button>
        </div>

        {lastWin > 0 && (
          <div className="win-display">
            <span className="win-text">🎉 YOU WIN!</span>
            <span className="win-amount">+{lastWin} Credits</span>
          </div>
        )}

        <div className="game-info">
          <p>Match 3 symbols to win!</p>
          <p>Cost: 10 credits per spin</p>
        </div>
      </div>
    </div>
  );
}