import { create } from "zustand";
import { createDeck, calculateHandValue, Card } from "../gameLogic/cardDeck";
import { useCasino } from "./useCasino";

type GameState = "waiting" | "playing" | "playerWin" | "dealerWin" | "push" | "playerBust" | "dealerBust" | "blackjack";

interface BlackjackState {
  deck: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  playerScore: number;
  dealerScore: number;
  gameState: GameState;
  currentBet: number;
  showDealerCard: boolean;
  
  deal: () => void;
  hit: () => void;
  stand: () => void;
  double: () => void;
  canHit: () => boolean;
  canStand: () => boolean;
  canDouble: () => boolean;
  canDeal: () => boolean;
}

export const useBlackjack = create<BlackjackState>((set, get) => ({
  deck: createDeck(),
  playerHand: [],
  dealerHand: [],
  playerScore: 0,
  dealerScore: 0,
  gameState: "waiting",
  currentBet: 25,
  showDealerCard: false,
  
  deal: () => {
    const casino = useCasino.getState();
    const state = get();
    
    if (!casino.removeCredits(state.currentBet)) return;
    
    const deck = createDeck();
    const playerHand = [deck.pop()!, deck.pop()!];
    const dealerHand = [deck.pop()!, deck.pop()!];
    
    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);
    
    let gameState: GameState = "playing";
    
    if (playerScore === 21) {
      gameState = "blackjack";
      const payout = Math.floor(state.currentBet * 2.5);
      casino.addCredits(payout);
      casino.recordWin(payout);
    }
    
    set({
      deck,
      playerHand,
      dealerHand,
      playerScore,
      dealerScore,
      gameState,
      showDealerCard: gameState !== "playing"
    });
  },
  
  hit: () => {
    const state = get();
    if (!state.canHit()) return;
    
    const newPlayerHand = [...state.playerHand, state.deck.pop()!];
    const newPlayerScore = calculateHandValue(newPlayerHand);
    
    let gameState: GameState = "playing";
    
    if (newPlayerScore > 21) {
      gameState = "playerBust";
      useCasino.getState().recordLoss(state.currentBet);
    }
    
    set({
      playerHand: newPlayerHand,
      playerScore: newPlayerScore,
      gameState
    });
  },
  
  stand: () => {
    const state = get();
    if (!state.canStand()) return;
    
    let dealerHand = [...state.dealerHand];
    let dealerScore = calculateHandValue(dealerHand);
    
    while (dealerScore < 17) {
      dealerHand.push(state.deck.pop()!);
      dealerScore = calculateHandValue(dealerHand);
    }
    
    let gameState: GameState;
    const casino = useCasino.getState();
    
    if (dealerScore > 21) {
      gameState = "dealerBust";
      const payout = state.currentBet * 2;
      casino.addCredits(payout);
      casino.recordWin(payout);
    } else if (state.playerScore > dealerScore) {
      gameState = "playerWin";
      const payout = state.currentBet * 2;
      casino.addCredits(payout);
      casino.recordWin(payout);
    } else if (state.playerScore < dealerScore) {
      gameState = "dealerWin";
      casino.recordLoss(state.currentBet);
    } else {
      gameState = "push";
      casino.addCredits(state.currentBet);
    }
    
    set({
      dealerHand,
      dealerScore,
      gameState,
      showDealerCard: true
    });
  },
  
  double: () => {
    const casino = useCasino.getState();
    const state = get();
    
    if (!state.canDouble() || !casino.removeCredits(state.currentBet)) return;
    
    const newPlayerHand = [...state.playerHand, state.deck.pop()!];
    const newPlayerScore = calculateHandValue(newPlayerHand);
    
    set({
      playerHand: newPlayerHand,
      playerScore: newPlayerScore,
      currentBet: state.currentBet * 2
    });
    
    setTimeout(() => {
      get().stand();
    }, 1000);
  },
  
  canHit: () => {
    const state = get();
    return state.gameState === "playing" && state.playerScore < 21;
  },
  
  canStand: () => {
    const state = get();
    return state.gameState === "playing";
  },
  
  canDouble: () => {
    const casino = useCasino.getState();
    const state = get();
    return state.gameState === "playing" && 
           state.playerHand.length === 2 && 
           casino.totalCredits >= state.currentBet;
  },
  
  canDeal: () => {
    const casino = useCasino.getState();
    const state = get();
    return state.gameState !== "playing" && casino.totalCredits >= state.currentBet;
  }
}));
