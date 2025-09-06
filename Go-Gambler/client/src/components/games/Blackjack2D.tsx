import { useBlackjack } from "../../lib/stores/useBlackjack";
import { useAudio } from "../../lib/stores/useAudio";
import { useCasino } from "../../lib/stores/useCasino";

export default function Blackjack2D() {
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
    deal,
    hit,
    stand,
    double
  } = useBlackjack();
  
  const { totalCredits } = useCasino();
  const { playHit, playSuccess } = useAudio();

  const renderCard = (card: any, isHidden = false) => {
    if (isHidden) {
      return <div className="card card-back">🂠</div>;
    }
    
    const suitSymbols: { [key: string]: string } = {
      'hearts': '♥️',
      'diamonds': '♦️',
      'clubs': '♣️',
      'spades': '♠️'
    };

    return (
      <div className={`card ${card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black'}`}>
        <div className="card-value">{card.value}</div>
        <div className="card-suit">{suitSymbols[card.suit]}</div>
      </div>
    );
  };

  return (
    <div className="blackjack-2d">
      <div className="blackjack-frame">
        <h2 className="game-title">🃏 Blackjack</h2>
        
        <div className="blackjack-table">
          {/* Dealer Area */}
          <div className="dealer-area">
            <h3>Dealer: {gameState === 'playing' ? '?' : dealerScore}</h3>
            <div className="hand">
              {dealerHand.map((card, index) => 
                renderCard(card, index === 1 && gameState === 'playing')
              )}
            </div>
          </div>

          {/* Player Area */}
          <div className="player-area">
            <h3>You: {playerScore}</h3>
            <div className="hand">
              {playerHand.map((card, index) => 
                renderCard(card)
              )}
            </div>
          </div>
        </div>

        <div className="blackjack-controls">
          {gameState === 'waiting' && (
            <button 
              className={`deal-button ${!canDeal || totalCredits < 20 ? 'disabled' : ''}`}
              onClick={deal}
              disabled={!canDeal || totalCredits < 20}
            >
              DEAL (20 Credits)
            </button>
          )}

          {gameState === 'playing' && (
            <div className="play-buttons">
              <button 
                className={`action-button ${!canHit ? 'disabled' : ''}`}
                onClick={hit}
                disabled={!canHit}
              >
                HIT
              </button>
              <button 
                className={`action-button ${!canStand ? 'disabled' : ''}`}
                onClick={stand}
                disabled={!canStand}
              >
                STAND
              </button>
              <button 
                className={`action-button ${!canDouble ? 'disabled' : ''}`}
                onClick={double}
                disabled={!canDouble}
              >
                DOUBLE
              </button>
            </div>
          )}
        </div>

        {gameState !== 'waiting' && gameState !== 'playing' && (
          <div className={`result-display ${gameState}`}>
            <span className="result-text">{gameState}</span>
          </div>
        )}

        <div className="game-info">
          <p>Get as close to 21 as possible without going over</p>
          <p>Bet: {currentBet} credits</p>
        </div>
      </div>
    </div>
  );
}