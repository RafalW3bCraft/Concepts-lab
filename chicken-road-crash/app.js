const { useState, useEffect, useCallback } = React;

const DIFFICULTIES = {
  Easy: {
    name: "Easy",
    description: "Lower risk, steady rewards. Good for beginners.",
    crashChance: 0.05,
    multiplierGrowth: 1.1,
    maxSteps: 50,
    color: "#4CAF50"
  },
  Medium: {
    name: "Medium", 
    description: "Balanced risk and reward. Standard gameplay.",
    crashChance: 0.07,
    multiplierGrowth: 1.15,
    maxSteps: 35,
    color: "#FF9800"
  },
  Hard: {
    name: "Hard",
    description: "Higher risk, bigger potential rewards.",
    crashChance: 0.3,
    multiplierGrowth: 1.2,
    maxSteps: 25,
    color: "#F44336"
  },
  Hardcore: {
    name: "Hardcore", 
    description: "Extreme risk, massive potential rewards!",
    crashChance: 0.7,
    multiplierGrowth: 1.3,
    maxSteps: 15,
    color: "#9C27B0"
  }
};

const GAME_CONFIG = {
  startingBalance: 1000,
  minBet: 10,
  stepInterval: 1500,
  maxMultiplier: 1000
};

// API calls
class GameAPI {
  static currentRound = null;
  
  static startRound(difficulty, betAmount) {
    const difficultyConfig = DIFFICULTIES[difficulty];
    const crashPoint = this.calculateCrashPoint(difficultyConfig);
    
    this.currentRound = {
      difficulty,
      betAmount,
      crashPoint,
      currentStep: 0,
      multiplier: 1.0,
      crashed: false,
      cashedOut: false
    };
    
    return Promise.resolve({
      success: true,
      roundId: Date.now(),
      initialMultiplier: 1.0
    });
  }
  
  static calculateCrashPoint(difficultyConfig) {
    const random = Math.random();
    const baseSteps = Math.floor(Math.log(1 - random) / Math.log(1 - difficultyConfig.crashChance));
    return Math.max(1, Math.min(baseSteps, difficultyConfig.maxSteps));
  }
  
  static step() {
    if (!this.currentRound || this.currentRound.crashed || this.currentRound.cashedOut) {
      return Promise.resolve({ success: false, error: "No active round" });
    }
    
    this.currentRound.currentStep++;
    const difficultyConfig = DIFFICULTIES[this.currentRound.difficulty];
    
    // Calc new multiplier
    this.currentRound.multiplier = Math.pow(difficultyConfig.multiplierGrowth, this.currentRound.currentStep);
    
    // Check if crashed
    if (this.currentRound.currentStep >= this.currentRound.crashPoint) {
      this.currentRound.crashed = true;
      return Promise.resolve({
        success: true,
        crashed: true,
        step: this.currentRound.currentStep,
        multiplier: this.currentRound.multiplier,
        crashPoint: this.currentRound.crashPoint
      });
    }
    
    return Promise.resolve({
      success: true,
      crashed: false,
      step: this.currentRound.currentStep,
      multiplier: this.currentRound.multiplier
    });
  }
  
  static cashOut() {
    if (!this.currentRound || this.currentRound.crashed || this.currentRound.cashedOut) {
      return Promise.resolve({ success: false, error: "Cannot cash out" });
    }
    
    this.currentRound.cashedOut = true;
    const winnings = Math.floor(this.currentRound.betAmount * this.currentRound.multiplier);
    
    return Promise.resolve({
      success: true,
      winnings,
      multiplier: this.currentRound.multiplier,
      step: this.currentRound.currentStep
    });
  }
  
  static getHighScores() {
    const scores = JSON.parse(localStorage.getItem('chickenRoadHighScores') || '[]');
    return Promise.resolve(scores.sort((a, b) => b.multiplier - a.multiplier).slice(0, 5));
  }
  
  static saveHighScore(difficulty, multiplier, winnings) {
    const scores = JSON.parse(localStorage.getItem('chickenRoadHighScores') || '[]');
    scores.push({
      difficulty,
      multiplier: parseFloat(multiplier.toFixed(2)),
      winnings,
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem('chickenRoadHighScores', JSON.stringify(scores));
  }
}

function StartScreen({ onStartGame, balance, highScores }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  
  const handleStartGame = (e) => {
    e.preventDefault();
    console.log('Start button clicked, difficulty:', selectedDifficulty);
    onStartGame(selectedDifficulty);
  };
  
  return React.createElement('div', { className: 'start-screen' }, 
    React.createElement('div', { className: 'game-instructions' },
      React.createElement('h3', null, 'How to Play'),
      React.createElement('ul', null,
        React.createElement('li', null, 'Choose your difficulty level and bet amount'),
        React.createElement('li', null, 'Watch the chicken cross the road step by step'),
        React.createElement('li', null, 'Your multiplier increases with each safe step'),
        React.createElement('li', null, 'Cash out before hitting a trap to secure your winnings'),
        React.createElement('li', null, 'If you hit a trap, you lose your bet!')
      )
    ),
    
    React.createElement('div', { className: 'stats-container' },
      React.createElement('div', { className: 'stat-item' },
        React.createElement('span', { className: 'stat-value' }, `🪙 ${balance}`),
        React.createElement('span', { className: 'stat-label' }, 'Balance')
      ),
      React.createElement('div', { className: 'stat-item' },
        React.createElement('span', { className: 'stat-value' }, 
          highScores.length > 0 ? `${highScores[0].multiplier}x` : '0x'
        ),
        React.createElement('span', { className: 'stat-label' }, 'Best Multiplier')
      )
    ),
    
    React.createElement('div', { className: 'difficulty-selection' },
      React.createElement('h3', { className: 'difficulty-title' }, 'Select Difficulty'),
      React.createElement('div', { className: 'difficulty-grid' },
        Object.entries(DIFFICULTIES).map(([key, difficulty]) =>
          React.createElement('div', {
            key: key,
            className: `difficulty-option ${selectedDifficulty === key ? 'selected' : ''}`,
            onClick: () => {
              console.log('Difficulty selected:', key);
              setSelectedDifficulty(key);
            },
            style: { borderColor: selectedDifficulty === key ? difficulty.color : undefined }
          },
            React.createElement('div', { 
              className: 'difficulty-name',
              style: { color: difficulty.color }
            }, difficulty.name),
            React.createElement('div', { className: 'difficulty-description' }, difficulty.description)
          )
        )
      ),
      
      React.createElement('button', {
        className: 'btn btn--primary btn-large',
        onClick: handleStartGame,
        type: 'button'
      }, 'Start Playing')
    )
  );
}

// Road Visualization Component
function RoadPath({ currentStep, maxSteps, crashed, crashPoint }) {
  const segments = [];
  const totalSegments = 20;
  
  for (let i = 0; i < totalSegments; i++) {
    const stepNumber = i + 1;
    let segmentClass = 'road-segment';
    let content = '';
    
    if (stepNumber === currentStep && !crashed) {
      segmentClass += ' current';
      content = '🐔';
    } else if (stepNumber === crashPoint && crashed) {
      segmentClass += ' crashed';
      content = '💥';
    } else if (stepNumber <= currentStep) {
      segmentClass += ' safe';
      content = '✓';
    } else if (stepNumber > maxSteps * 0.7) {
      segmentClass += ' danger';
    } else {
      segmentClass += ' safe';
    }
    
    segments.push(
      React.createElement('div', { key: i, className: segmentClass }, content)
    );
  }
  
  return React.createElement('div', { className: 'road-container' },
    React.createElement('div', { className: 'road-path' }, ...segments)
  );
}

function GameInterface({ difficulty, balance, onGameEnd, onBalanceChange }) {
  const [gameState, setGameState] = useState('betting'); // betting, playing, finished
  const [currentStep, setCurrentStep] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [betAmount, setBetAmount] = useState(50);
  const [gameResult, setGameResult] = useState(null);
  const [crashed, setCrashed] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  
  const difficultyConfig = DIFFICULTIES[difficulty];
  
  const resetGame = () => {
    setGameState('betting');
    setCurrentStep(0);
    setMultiplier(1.0);
    setGameResult(null);
    setCrashed(false);
    setCrashPoint(0);
  };
  
  const startRound = async () => {
    if (betAmount > balance || betAmount < GAME_CONFIG.minBet) {
      alert('Invalid bet amount!');
      return;
    }
    
    try {
      const response = await GameAPI.startRound(difficulty, betAmount);
      if (response.success) {
        setGameState('playing');
        setCurrentStep(0);
        setMultiplier(1.0);
        setGameResult(null);
        setCrashed(false);
        
        // Start the automatic steps
        stepInterval();
      }
    } catch (error) {
      console.error('Error starting round:', error);
    }
  };
  
  const stepInterval = () => {
    const interval = setInterval(async () => {
      try {
        const response = await GameAPI.step();
        if (response.success) {
          setCurrentStep(response.step);
          setMultiplier(response.multiplier);
          
          if (response.crashed) {
            clearInterval(interval);
            setCrashed(true);
            setCrashPoint(response.crashPoint);
            setGameState('finished');
            
            // logic loss
            const newBalance = balance - betAmount;
            onBalanceChange(newBalance);
            setGameResult({
              type: 'loss',
              message: `Crashed at step ${response.step}!`,
              amount: -betAmount
            });
          }
        }
      } catch (error) {
        clearInterval(interval);
        console.error('Error in step:', error);
      }
    }, GAME_CONFIG.stepInterval);
    
    window.currentGameInterval = interval;
  };
  
  const cashOut = async () => {
    if (gameState !== 'playing') return;
    
    if (window.currentGameInterval) {
      clearInterval(window.currentGameInterval);
    }
    
    try {
      const response = await GameAPI.cashOut();
      if (response.success) {
        setGameState('finished');
        
        // logic win
        const newBalance = balance - betAmount + response.winnings;
        onBalanceChange(newBalance);
        
        // Save high score
        GameAPI.saveHighScore(difficulty, response.multiplier, response.winnings);
        
        setGameResult({
          type: 'win',
          message: `Cashed out at ${response.multiplier.toFixed(2)}x!`,
          amount: response.winnings - betAmount
        });
      }
    } catch (error) {
      console.error('Error cashing out:', error);
    }
  };
  
  const getRiskLevel = () => {
    const progress = currentStep / difficultyConfig.maxSteps;
    if (progress < 0.3) return { level: 'Low', className: 'risk-low' };
    if (progress < 0.7) return { level: 'Medium', className: 'risk-medium' };
    return { level: 'High', className: 'risk-high' };
  };
  
  const riskLevel = getRiskLevel();
  const progressPercentage = (currentStep / difficultyConfig.maxSteps) * 100;
  
  useEffect(() => {
    return () => {
      if (window.currentGameInterval) {
        clearInterval(window.currentGameInterval);
      }
    };
  }, []);
  
  const gameHeaderContent = [
    React.createElement('div', { key: 'balance', className: 'stat-item' },
      React.createElement('span', { className: 'stat-value' }, `🪙 ${balance}`),
      React.createElement('span', { className: 'stat-label' }, 'Balance')
    ),
    React.createElement('div', { key: 'multiplier', className: 'multiplier-display' },
      React.createElement('div', { className: 'multiplier-value' }, `${multiplier.toFixed(2)}x`),
      React.createElement('div', { className: 'multiplier-label' }, 'Current Multiplier')
    ),
    React.createElement('div', { key: 'difficulty', className: 'stat-item' },
      React.createElement('span', { 
        className: 'stat-value',
        style: { color: difficultyConfig.color }
      }, difficulty),
      React.createElement('span', { className: 'stat-label' }, 'Difficulty')
    )
  ];
  
  const gameInterfaceElements = [
    React.createElement('div', { key: 'header', className: 'game-header' }, ...gameHeaderContent)
  ];
  
  if (gameState === 'playing') {
    gameInterfaceElements.push(
      React.createElement('div', { key: 'status', className: 'game-status playing' },
        React.createElement('div', { className: 'status-text' }, `Step ${currentStep} - Keep going or cash out?`),
        React.createElement('div', { className: 'progress-container' },
          React.createElement('div', { className: 'progress-bar' },
            React.createElement('div', {
              className: 'progress-fill',
              style: { width: `${Math.min(progressPercentage, 100)}%` }
            })
          ),
          React.createElement('div', { className: 'risk-indicator' },
            React.createElement('span', null, 'Risk Level:'),
            React.createElement('span', { className: `risk-level ${riskLevel.className}` }, riskLevel.level)
          )
        )
      )
    );
  }
  
  // Game result if finished
  if (gameResult) {
    gameInterfaceElements.push(
      React.createElement('div', { 
        key: 'result', 
        className: `game-status ${gameResult.type === 'win' ? 'won' : 'lost'}`
      },
        React.createElement('div', { className: 'status-text' }, gameResult.message),
        React.createElement('div', { className: 'status-details' },
          `${gameResult.type === 'win' ? '+' : ''}${gameResult.amount} coins`
        )
      )
    );
  }
  
  // Add road path
  gameInterfaceElements.push(
    React.createElement(RoadPath, {
      key: 'road',
      currentStep: currentStep,
      maxSteps: difficultyConfig.maxSteps,
      crashed: crashed,
      crashPoint: crashPoint
    })
  );
  
  // Add game controls
  const controlElements = [];
  
  if (gameState === 'betting') {
    controlElements.push(
      React.createElement('div', { key: 'bet-section', className: 'bet-section' },
        React.createElement('label', { className: 'form-label' }, 'Bet Amount'),
        React.createElement('div', { className: 'bet-input-container' },
          React.createElement('input', {
            type: 'number',
            className: 'form-control bet-input',
            value: betAmount,
            onChange: (e) => setBetAmount(Math.max(GAME_CONFIG.minBet, parseInt(e.target.value) || GAME_CONFIG.minBet)),
            min: GAME_CONFIG.minBet,
            max: balance
          }),
          React.createElement('div', { className: 'bet-buttons' },
            React.createElement('button', {
              className: 'bet-quick-btn',
              onClick: () => setBetAmount(Math.min(50, balance))
            }, '50'),
            React.createElement('button', {
              className: 'bet-quick-btn',
              onClick: () => setBetAmount(Math.min(100, balance))
            }, '100'),
            React.createElement('button', {
              className: 'bet-quick-btn',
              onClick: () => setBetAmount(Math.min(Math.floor(balance / 2), balance))
            }, 'Half'),
            React.createElement('button', {
              className: 'bet-quick-btn',
              onClick: () => setBetAmount(balance)
            }, 'Max')
          )
        )
      )
    );
    
    controlElements.push(
      React.createElement('div', { key: 'action-betting', className: 'action-buttons' },
        React.createElement('button', {
          className: 'btn btn--primary btn-large',
          onClick: startRound,
          disabled: betAmount > balance || betAmount < GAME_CONFIG.minBet
        }, 'Start Round')
      )
    );
  }
  
  if (gameState === 'playing') {
    controlElements.push(
      React.createElement('div', { key: 'action-playing', className: 'action-buttons' },
        React.createElement('button', {
          className: 'btn btn-cash-out btn-large',
          onClick: cashOut
        }, `Cash Out (${(betAmount * multiplier).toFixed(0)} coins)`)
      )
    );
  }
  
  if (gameState === 'finished') {
    controlElements.push(
      React.createElement('div', { key: 'action-finished', className: 'action-buttons' },
        React.createElement('button', {
          className: 'btn btn--secondary btn-large',
          onClick: resetGame
        }, 'Play Again'),
        React.createElement('button', {
          className: 'btn btn--outline btn-large',
          onClick: onGameEnd
        }, 'Change Difficulty')
      )
    );
  }
  
  gameInterfaceElements.push(
    React.createElement('div', { key: 'controls', className: 'game-controls' }, ...controlElements)
  );
  
  return React.createElement('div', { className: 'game-interface' }, ...gameInterfaceElements);
}

function HighScores({ scores }) {
  if (scores.length === 0) {
    return React.createElement('div', { className: 'high-scores' },
      React.createElement('h3', null, 'High Scores'),
      React.createElement('p', {
        style: { textAlign: 'center', color: 'var(--color-text-secondary)' }
      }, 'No scores yet. Play your first game!')
    );
  }
  
  const scoreElements = scores.map((score, index) =>
    React.createElement('div', { key: index, className: 'score-item' },
      React.createElement('div', null,
        React.createElement('div', { 
          style: { fontWeight: 'var(--font-weight-semibold)' }
        }, `${score.multiplier}x`),
        React.createElement('div', { className: 'score-difficulty' }, score.difficulty)
      ),
      React.createElement('div', { className: 'score-value' }, `+${score.winnings}`)
    )
  );
  
  return React.createElement('div', { className: 'high-scores' },
    React.createElement('h3', null, 'High Scores'),
    ...scoreElements
  );
}

function App() {
  const [currentScreen, setCurrentScreen] = useState('start'); 
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('chickenRoadBalance');
    return saved ? parseInt(saved) : GAME_CONFIG.startingBalance;
  });
  const [highScores, setHighScores] = useState([]);
  
  useEffect(() => {
    GameAPI.getHighScores().then(setHighScores);
  }, [currentScreen]);
  
  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chickenRoadBalance', balance.toString());
  }, [balance]);
  
  const handleStartGame = (difficulty) => {
    console.log('App handleStartGame called with difficulty:', difficulty);
    setSelectedDifficulty(difficulty);
    setCurrentScreen('game');
  };
  
  const handleGameEnd = () => {
    setCurrentScreen('start');
    GameAPI.getHighScores().then(setHighScores);
  };
  
  const handleBalanceChange = (newBalance) => {
    setBalance(newBalance);
  };
  
  const resetBalance = () => {
    setBalance(GAME_CONFIG.startingBalance);
    localStorage.removeItem('chickenRoadBalance');
    localStorage.removeItem('chickenRoadHighScores');
    setHighScores([]);
  };
  
  console.log('App render - currentScreen:', currentScreen);
  
  const titleElements = [
    React.createElement('span', { key: 'chicken1', className: 'chicken-emoji' }, '🐔'),
    'Chicken Road Crash',
    React.createElement('span', { key: 'road', className: 'chicken-emoji' }, '🛣️')
  ];
  
  const appElements = [
    React.createElement('div', { key: 'title', className: 'game-title' }, ...titleElements)
  ];
  
  if (currentScreen === 'start') {
    const startElements = [
      React.createElement(StartScreen, {
        key: 'start-screen',
        onStartGame: handleStartGame,
        balance: balance,
        highScores: highScores
      })
    ];
    
    const bottomElements = [
      React.createElement(HighScores, { key: 'high-scores', scores: highScores })
    ];
    
    if (balance < GAME_CONFIG.minBet) {
      bottomElements.push(
        React.createElement('div', { key: 'reset', style: { textAlign: 'center' } },
          React.createElement('button', {
            className: 'btn btn--outline',
            onClick: resetBalance
          }, 'Reset Balance')
        )
      );
    }
    
    startElements.push(
      React.createElement('div', {
        key: 'bottom',
        style: { display: 'flex', gap: 'var(--space-16)', alignItems: 'flex-start' }
      }, ...bottomElements)
    );
    
    appElements.push(...startElements);
  }
  
  if (currentScreen === 'game') {
    appElements.push(
      React.createElement(GameInterface, {
        key: 'game-interface',
        difficulty: selectedDifficulty,
        balance: balance,
        onGameEnd: handleGameEnd,
        onBalanceChange: handleBalanceChange
      })
    );
  }
  
  return React.createElement('div', { className: 'game-container' }, ...appElements);
}

// Render the app
ReactDOM.render(React.createElement(App), document.getElementById('root'));