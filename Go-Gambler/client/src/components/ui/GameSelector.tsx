import { useCasino } from "../../lib/stores/useCasino";

export default function GameSelector() {
  const { currentGame, setCurrentGame } = useCasino();

  const games = [
    { id: "slots", name: "Slot Machine", icon: "🎰", description: "Spin to win big!" },
    { id: "blackjack", name: "Blackjack", icon: "🃏", description: "Beat the dealer!" },
    { id: "roulette", name: "Roulette", icon: "🎯", description: "Place your bets!" }
  ];

  return (
    <div className="game-selector">
      <h2>Choose Your Game</h2>
      <div className="game-buttons">
        {games.map((game) => (
          <button
            key={game.id}
            className={`game-btn ${currentGame === game.id ? 'active' : ''}`}
            onClick={() => setCurrentGame(game.id as any)}
          >
            <div className="game-icon">{game.icon}</div>
            <div className="game-info">
              <div className="game-name">{game.name}</div>
              <div className="game-desc">{game.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
