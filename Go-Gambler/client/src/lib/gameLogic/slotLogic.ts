const SYMBOLS = ["🍒", "🍋", "🍊", "⭐", "💎", "🔔", "7️⃣"];
const PAYOUTS = {
  "🍒": 5,
  "🍋": 10,
  "🍊": 15,
  "⭐": 25,
  "💎": 50,
  "🔔": 75,
  "7️⃣": 100
};

export interface SlotResult {
  reels: string[][];
  winningLines: number[];
  symbols: string[];
}

export function generateSlotResult(): SlotResult {
  const reels = [
    generateReel(),
    generateReel(),
    generateReel()
  ];
  
  const symbols = [
    reels[0][10],
    reels[1][10],
    reels[2][10]
  ];
  
  const winningLines = checkWinningLines(symbols);
  
  return {
    reels,
    winningLines,
    symbols
  };
}

function generateReel(): string[] {
  const reel = [];
  const weights = {
    "🍒": 25,
    "🍋": 20,
    "🍊": 15,
    "⭐": 15,
    "💎": 10,
    "🔔": 8,
    "7️⃣": 7
  };
  
  const weightedSymbols: string[] = [];
  Object.entries(weights).forEach(([symbol, weight]) => {
    for (let i = 0; i < weight; i++) {
      weightedSymbols.push(symbol);
    }
  });
  
  for (let i = 0; i < 20; i++) {
    const randomSymbol = weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
    reel.push(randomSymbol);
  }
  
  return reel;
}

function checkWinningLines(symbols: string[]): number[] {
  const winningLines = [];
  
  if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
    winningLines.push(1);
  }
  
  return winningLines;
}

export function calculatePayout(result: SlotResult, bet: number): number {
  if (result.winningLines.length === 0) {
    return 0;
  }
  
  const symbol = result.symbols[0];
  const multiplier = PAYOUTS[symbol as keyof typeof PAYOUTS] || 1;
  
  return bet * multiplier;
}
