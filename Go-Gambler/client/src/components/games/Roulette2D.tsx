import { useRoulette } from "../../lib/stores/useRoulette";
import { useAudio } from "../../lib/stores/useAudio";
import { useCasino } from "../../lib/stores/useCasino";

const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export default function Roulette2D() {
  const {
    bets: currentBets,
    totalBet: totalBetAmount,
    isSpinning,
    lastWinningNumber: winningNumber,
    canSpin,
    canBet,
    placeBet,
    spin,
    clearBets
  } = useRoulette();
  
  const { totalCredits } = useCasino();
  const { playHit, playSuccess } = useAudio();

  const isRed = (num: number) => {
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num);
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'green';
    return isRed(num) ? 'red' : 'black';
  };

  return (
    <div className="roulette-2d">
      <div className="roulette-frame">
        <h2 className="game-title">🎯 Roulette</h2>
        
        <div className="roulette-wheel-container">
          <div className={`roulette-wheel ${isSpinning ? 'spinning' : ''}`}>
            <div className="wheel-center">
              {winningNumber !== null ? (
                <div className={`winning-number ${getNumberColor(winningNumber)}`}>
                  {winningNumber}
                </div>
              ) : (
                <div className="wheel-logo">🎰</div>
              )}
            </div>
            <div className="wheel-numbers">
              {ROULETTE_NUMBERS.map((num, index) => (
                <div 
                  key={index} 
                  className={`wheel-number ${getNumberColor(num)}`}
                  style={{ 
                    transform: `rotate(${(index * 360) / ROULETTE_NUMBERS.length}deg) translateY(-80px)` 
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="betting-area">
          <div className="number-grid">
            {[...Array(37)].map((_, i) => (
              <button
                key={i}
                className={`number-bet ${getNumberColor(i)} ${currentBets[`number-${i}`] ? 'has-bet' : ''}`}
                onClick={() => canBet() && placeBet(`number-${i}`, 5)}
                disabled={!canBet() || totalCredits < 5}
              >
                {i}
                {currentBets[`number-${i}`] && (
                  <span className="bet-chip">{currentBets[`number-${i}`]}</span>
                )}
              </button>
            ))}
          </div>

          <div className="outside-bets">
            <button
              className={`outside-bet red ${currentBets.red ? 'has-bet' : ''}`}
              onClick={() => canBet() && placeBet('red', 10)}
              disabled={!canBet() || totalCredits < 10}
            >
              RED
              {currentBets.red && <span className="bet-chip">{currentBets.red}</span>}
            </button>
            
            <button
              className={`outside-bet black ${currentBets.black ? 'has-bet' : ''}`}
              onClick={() => canBet() && placeBet('black', 10)}
              disabled={!canBet() || totalCredits < 10}
            >
              BLACK
              {currentBets.black && <span className="bet-chip">{currentBets.black}</span>}
            </button>
            
            <button
              className={`outside-bet even ${currentBets.even ? 'has-bet' : ''}`}
              onClick={() => canBet() && placeBet('even', 10)}
              disabled={!canBet() || totalCredits < 10}
            >
              EVEN
              {currentBets.even && <span className="bet-chip">{currentBets.even}</span>}
            </button>
            
            <button
              className={`outside-bet odd ${currentBets.odd ? 'has-bet' : ''}`}
              onClick={() => canBet() && placeBet('odd', 10)}
              disabled={!canBet() || totalCredits < 10}
            >
              ODD
              {currentBets.odd && <span className="bet-chip">{currentBets.odd}</span>}
            </button>
          </div>
        </div>

        <div className="roulette-controls">
          <div className="bet-info">
            Total Bet: {totalBetAmount} credits
          </div>
          
          <div className="control-buttons">
            <button 
              className="clear-button"
              onClick={clearBets}
              disabled={!canBet() || totalBetAmount === 0}
            >
              CLEAR BETS
            </button>
            
            <button 
              className={`spin-button ${!canSpin() || totalBetAmount === 0 ? 'disabled' : ''}`}
              onClick={spin}
              disabled={!canSpin() || totalBetAmount === 0}
            >
              {isSpinning ? 'SPINNING...' : 'SPIN WHEEL'}
            </button>
          </div>
        </div>

        {winningNumber !== null && (
          <div className="result-display">
            <span className="result-text">
              Number: {winningNumber} ({getNumberColor(winningNumber)})
            </span>
          </div>
        )}

        <div className="game-info">
          <p>Place bets and spin the wheel!</p>
          <p>Numbers pay 36:1, Colors pay 2:1</p>
        </div>
      </div>
    </div>
  );
}