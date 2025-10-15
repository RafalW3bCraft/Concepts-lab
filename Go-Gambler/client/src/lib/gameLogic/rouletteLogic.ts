const NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
  24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export interface RouletteResult {
  number: number;
  color: "red" | "black" | "green";
}

export function spinWheel(): RouletteResult {
  const number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  let color: "red" | "black" | "green";
  
  if (number === 0) {
    color = "green";
  } else if (RED_NUMBERS.includes(number)) {
    color = "red";
  } else {
    color = "black";
  }
  
  return { number, color };
}

export function calculatePayout(bets: Record<string, number>, winningNumber: number): number {
  let totalPayout = 0;
  const result = {
    number: winningNumber,
    color: winningNumber === 0 ? "green" : RED_NUMBERS.includes(winningNumber) ? "red" : "black"
  };
  
  Object.entries(bets).forEach(([betKey, amount]) => {
    const [type, value] = betKey.split("-");
    
    switch (type) {
      case "number":
        if (parseInt(value) === winningNumber) {
          totalPayout += amount * 36;
        }
        break;
        
      case "red":
        if (result.color === "red") {
          totalPayout += amount * 2;
        }
        break;
        
      case "black":
        if (result.color === "black") {
          totalPayout += amount * 2;
        }
        break;
        
      case "even":
        if (winningNumber > 0 && winningNumber % 2 === 0) {
          totalPayout += amount * 2;
        }
        break;
        
      case "odd":
        if (winningNumber > 0 && winningNumber % 2 === 1) {
          totalPayout += amount * 2;
        }
        break;
        
      case "low":
        if (winningNumber >= 1 && winningNumber <= 18) {
          totalPayout += amount * 2;
        }
        break;
        
      case "high":
        if (winningNumber >= 19 && winningNumber <= 36) {
          totalPayout += amount * 2;
        }
        break;
    }
  });
  
  return totalPayout;
}

export function getNumberColor(number: number): "red" | "black" | "green" {
  if (number === 0) return "green";
  return RED_NUMBERS.includes(number) ? "red" : "black";
}
