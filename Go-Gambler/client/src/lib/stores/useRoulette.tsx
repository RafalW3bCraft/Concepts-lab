import { create } from "zustand";
import { spinWheel, calculatePayout } from "../gameLogic/rouletteLogic";
import { useCasino } from "./useCasino";

interface RouletteState {
  isSpinning: boolean;
  wheelRotation: number;
  ballPosition: number;
  lastWinningNumber: number | null;
  bets: Record<string, number>;
  totalBet: number;
  
  // Actions
  spin: () => void;
  placeBet: (type: string, value: number | string) => void;
  clearBets: () => void;
  canSpin: () => boolean;
  canBet: () => boolean;
}

export const useRoulette = create<RouletteState>((set, get) => ({
  isSpinning: false,
  wheelRotation: 0,
  ballPosition: 0,
  lastWinningNumber: null,
  bets: {},
  totalBet: 0,
  
  spin: () => {
    const casino = useCasino.getState();
    const state = get();
    
    if (!state.canSpin()) return;
    
    // Deduct total bet
    if (!casino.removeCredits(state.totalBet)) return;
    
    set({ isSpinning: true });
    
    casino.recordSpin();
    
    // Simulate wheel spin
    const result = spinWheel();
    const spinDuration = 4000;
    
    // Animate wheel
    const startRotation = state.wheelRotation;
    const endRotation = startRotation + Math.PI * 10 + (result.number / 37) * Math.PI * 2;
    
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + (endRotation - startRotation) * easeOut;
      const ballPos = Math.PI * 20 * progress;
      
      set({
        wheelRotation: currentRotation,
        ballPosition: ballPos
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Calculate payouts
        const payout = calculatePayout(state.bets, result.number);
        
        set({
          isSpinning: false,
          lastWinningNumber: result.number,
          bets: {},
          totalBet: 0
        });
        
        if (payout > 0) {
          casino.addCredits(payout);
          casino.recordWin(payout);
        } else {
          casino.recordLoss(state.totalBet);
        }
      }
    };
    
    requestAnimationFrame(animate);
  },
  
  placeBet: (type, value) => {
    const state = get();
    const betKey = `${type}-${value}`;
    const betAmount = 5;
    
    if (!state.canBet()) return;
    
    const casino = useCasino.getState();
    if (!casino.removeCredits(betAmount)) return;
    
    set((state) => ({
      bets: {
        ...state.bets,
        [betKey]: (state.bets[betKey] || 0) + betAmount
      },
      totalBet: state.totalBet + betAmount
    }));
  },
  
  clearBets: () => {
    const state = get();
    const casino = useCasino.getState();
    
    casino.addCredits(state.totalBet);
    
    set({
      bets: {},
      totalBet: 0
    });
  },
  
  canSpin: () => {
    const state = get();
    return !state.isSpinning && state.totalBet > 0;
  },
  
  canBet: () => {
    const casino = useCasino.getState();
    const state = get();
    return !state.isSpinning && casino.totalCredits >= 5;
  }
}));
