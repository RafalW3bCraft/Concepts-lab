export type Suit = "♠" | "♥" | "♦" | "♣";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export function createDeck(): Card[] {
  const suits: Suit[] = ["♠", "♥", "♦", "♣"];
  const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck: Card[] = [];
  
  suits.forEach(suit => {
    ranks.forEach(rank => {
      let value = 0;
      if (rank === "A") value = 11;
      else if (["J", "Q", "K"].includes(rank)) value = 10;
      else value = parseInt(rank);
      
      deck.push({ suit, rank, value });
    });
  });
  
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateHandValue(hand: Card[]): number {
  let value = 0;
  let aces = 0;
  
  hand.forEach(card => {
    if (card.rank === "A") {
      aces++;
      value += 11;
    } else {
      value += card.value;
    }
  });
  
  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return value;
}

export function isBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && calculateHandValue(hand) === 21;
}

export function isSoftHand(hand: Card[]): boolean {
  let aces = 0;
  let value = 0;
  
  hand.forEach(card => {
    if (card.rank === "A") aces++;
    value += card.value;
  });
  
  return aces > 0 && value <= 21;
}

export function canSplit(hand: Card[]): boolean {
  return hand.length === 2 && hand[0].rank === hand[1].rank;
}
