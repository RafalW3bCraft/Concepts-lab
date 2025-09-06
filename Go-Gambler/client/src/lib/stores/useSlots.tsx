import { create } from "zustand";
import { generateSlotResult, calculatePayout } from "../gameLogic/slotLogic";
import { useCasino } from "./useCasino";

interface SlotsState {
  reels: number[];
  isSpinning: boolean;
  spinSpeed: number[];
  lastWin: number;
  bet: number;
  
  // Actions
  spin: () => void;
  canSpin: () => boolean;
}

const SYMBOLS = ["🍒", "🍋", "🍊", "⭐", "💎", "🔔", "7️⃣"];

const generateReelIndex = () => {
  return Math.floor(Math.random() * SYMBOLS.length);
};

export const useSlots = create<SlotsState>((set, get) => ({
  reels: [generateReelIndex(), generateReelIndex(), generateReelIndex()],
  isSpinning: false,
  spinSpeed: [0, 0, 0],
  lastWin: 0,
  bet: 10,
  
  spin: () => {
    const casino = useCasino.getState();
    const state = get();
    
    if (!state.canSpin()) return;
    
    // Deduct bet amount
    if (!casino.removeCredits(state.bet)) return;
    
    set({ 
      isSpinning: true,
      spinSpeed: [15, 12, 10],
      lastWin: 0
    });
    
    casino.recordSpin();
    
    // Generate result
    const result = generateSlotResult();
    const payout = calculatePayout(result, state.bet);
    
    // Stop spinning after delay
    setTimeout(() => {
      set({
        reels: result.symbols.map(symbol => SYMBOLS.indexOf(symbol)),
        isSpinning: false,
        spinSpeed: [0, 0, 0],
        lastWin: payout
      });
      
      if (payout > 0) {
        casino.addCredits(payout);
        casino.recordWin(payout);
      } else {
        casino.recordLoss(state.bet);
      }
    }, 3000);
  },
  
  canSpin: () => {
    const casino = useCasino.getState();
    const state = get();
    return !state.isSpinning && casino.totalCredits >= state.bet;
  }
}));
