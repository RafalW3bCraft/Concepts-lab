import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { getLocalStorage, setLocalStorage } from "../utils";

export type GameType = "slots" | "blackjack" | "roulette";

interface CasinoState {
  currentGame: GameType;
  totalCredits: number;
  
  // Statistics
  totalWins: number;
  totalLosses: number;
  totalSpins: number;
  biggestWin: number;
  
  // Actions
  setCurrentGame: (game: GameType) => void;
  addCredits: (amount: number) => void;
  removeCredits: (amount: number) => boolean;
  recordWin: (amount: number) => void;
  recordLoss: (amount: number) => void;
  recordSpin: () => void;
  initializeCasino: () => void;
  saveProgress: () => void;
}

export const useCasino = create<CasinoState>()(
  subscribeWithSelector((set, get) => ({
    currentGame: "slots",
    totalCredits: 1000,
    totalWins: 0,
    totalLosses: 0,
    totalSpins: 0,
    biggestWin: 0,
    
    setCurrentGame: (game) => {
      set({ currentGame: game });
      get().saveProgress();
    },
    
    addCredits: (amount) => {
      set((state) => ({ totalCredits: state.totalCredits + amount }));
      get().saveProgress();
    },
    
    removeCredits: (amount) => {
      const state = get();
      if (state.totalCredits >= amount) {
        set({ totalCredits: state.totalCredits - amount });
        get().saveProgress();
        return true;
      }
      return false;
    },
    
    recordWin: (amount) => {
      set((state) => ({
        totalWins: state.totalWins + 1,
        biggestWin: Math.max(state.biggestWin, amount)
      }));
      get().saveProgress();
    },
    
    recordLoss: (amount) => {
      set((state) => ({ totalLosses: state.totalLosses + 1 }));
      get().saveProgress();
    },
    
    recordSpin: () => {
      set((state) => ({ totalSpins: state.totalSpins + 1 }));
      get().saveProgress();
    },
    
    initializeCasino: () => {
      const saved = getLocalStorage("casino-progress");
      if (saved) {
        set({
          totalCredits: saved.totalCredits || 1000,
          totalWins: saved.totalWins || 0,
          totalLosses: saved.totalLosses || 0,
          totalSpins: saved.totalSpins || 0,
          biggestWin: saved.biggestWin || 0,
          currentGame: saved.currentGame || "slots"
        });
      }
    },
    
    saveProgress: () => {
      const state = get();
      setLocalStorage("casino-progress", {
        totalCredits: state.totalCredits,
        totalWins: state.totalWins,
        totalLosses: state.totalLosses,
        totalSpins: state.totalSpins,
        biggestWin: state.biggestWin,
        currentGame: state.currentGame
      });
    }
  }))
);
