import { useCasino } from "../../lib/stores/useCasino";
import { useAudio } from "../../lib/stores/useAudio";
import CreditDisplay from "./CreditDisplay";
import GameSelector from "./GameSelector";

export default function GameUI() {
  const { currentGame, totalCredits, setCurrentGame } = useCasino();
  const { isMuted, toggleMute } = useAudio();

  console.log('GameUI rendering:', { currentGame, totalCredits });

  const handleMobileGameSelect = (gameType: string) => {
    console.log('Game selected:', gameType);
    setCurrentGame(gameType as any);
  };

  return (
    <div className="game-ui" style={{ display: 'block', visibility: 'visible' }}>
      {/* Top UI Bar */}
      <div className="ui-top">
        <div className="casino-branding">
          <h1>GO-GAMBLER</h1>
          <p>by RafalW3bCraft</p>
        </div>
        
        <CreditDisplay credits={totalCredits} />
        
        <button 
          className={`sound-toggle ${isMuted ? 'muted' : ''}`}
          onClick={toggleMute}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Game Selection */}
      <GameSelector />

      {/* Instructions */}
      <div className="instructions">
        <div className="instruction-panel">
          <h3>Game Controls</h3>
          {currentGame === "slots" && (
            <div>
              <p>• Click SPIN or press SPACE to spin the reels</p>
              <p>• Match 3 symbols to win credits</p>
              <p>• Each spin costs 10 credits</p>
            </div>
          )}
          {currentGame === "blackjack" && (
            <div>
              <p>• Click DEAL to start a new hand</p>
              <p>• Click HIT to take another card</p>
              <p>• Click STAND to end your turn</p>
              <p>• Click DOUBLE to double your bet</p>
              <p>• Get as close to 21 as possible without going over</p>
            </div>
          )}
          {currentGame === "roulette" && (
            <div>
              <p>• Click on numbers or betting areas to place bets</p>
              <p>• Click SPIN to spin the wheel</p>
              <p>• Red/Black pays 2:1, Numbers pay 36:1</p>
              <p>• Even/Odd and High/Low pay 2:1</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-friendly navigation */}
      <div className="mobile-nav">
        <button 
          className={`nav-btn ${currentGame === 'slots' ? 'active' : ''}`} 
          onClick={() => handleMobileGameSelect('slots')}
        >
          🎰
        </button>
        <button 
          className={`nav-btn ${currentGame === 'blackjack' ? 'active' : ''}`} 
          onClick={() => handleMobileGameSelect('blackjack')}
        >
          🃏
        </button>
        <button 
          className={`nav-btn ${currentGame === 'roulette' ? 'active' : ''}`} 
          onClick={() => handleMobileGameSelect('roulette')}
        >
          🎯
        </button>
      </div>
    </div>
  );
}
