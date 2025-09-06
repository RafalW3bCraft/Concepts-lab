import { useCasino } from "../lib/stores/useCasino";
import SlotMachine2D from "./games/SlotMachine2D";
import Blackjack2D from "./games/Blackjack2D";
import Roulette2D from "./games/Roulette2D";

export default function Casino2D() {
  const { currentGame } = useCasino();

  return (
    <div className="casino-2d">
      <div className="casino-background">
        <div className="casino-main-area">
          {/* Render current game */}
          {currentGame === "slots" && <SlotMachine2D />}
          {currentGame === "blackjack" && <Blackjack2D />}
          {currentGame === "roulette" && <Roulette2D />}
        </div>
      </div>
    </div>
  );
}