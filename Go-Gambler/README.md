# GO-GAMBLER 🎰

A 3D casino simulation application built with React Three Fiber and TypeScript. Experience an immersive 3D casino environment where you can play classic casino games including slot machines, blackjack, and roulette.

## ✨ Features

### 🎮 Games Available
- **Slot Machine**: Classic 3-reel slot machine with symbol matching and payout calculations
- **Roulette**: European-style roulette wheel with comprehensive betting options
- **Blackjack**: Complete card game with proper hand value calculations and ace handling

### 🎨 3D Graphics
- Immersive 3D casino environment using React Three Fiber
- Realistic animations and physics
- Professional lighting and materials
- Smooth 60fps gameplay

### 🔊 Audio Experience
- Background casino music
- Sound effects for spins, wins, and interactions
- Mute/unmute functionality

### 💰 Credit System
- Start with 1000 credits
- Track wins, losses, and total spins
- Persistent progress saving via local storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone or access the project**
   ```bash
   # The project is already set up in your Replit environment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The application will automatically open in your Replit workspace
   - Navigate to the provided URL to start playing

## 🎯 How to Play

### Slot Machine
1. Click the red "SPIN" button to play
2. Each spin costs 10 credits
3. Match symbols across the paylines to win
4. Payouts vary based on symbol combinations

### Roulette
1. Place bets by clicking on numbers or betting areas
2. Each bet costs 5 credits
3. Click "SPIN" to start the wheel
4. Ball will settle on winning number
5. Payouts based on bet type and odds

### Blackjack
1. Place your bet to start the hand
2. Try to get as close to 21 without going over
3. Hit to take another card, Stand to keep your total
4. Dealer plays after your turn
5. Beat the dealer to win

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **React Three Fiber** for 3D rendering and WebGL graphics
- **Three.js** as the underlying 3D graphics library
- **Zustand** for state management across games
- **Tailwind CSS** with Radix UI components for styling
- **Vite** for fast development and optimized builds

### Backend Stack
- **Express.js** server with TypeScript
- **PostgreSQL** database with Drizzle ORM
- **Session management** for user persistence
- **RESTful API** architecture

### Game Logic
- **Weighted probability systems** for realistic gameplay
- **Comprehensive payout calculations** for all games
- **Advanced card deck simulation** for blackjack
- **Authentic roulette wheel mechanics** with proper number positioning

## 🔧 Recent Improvements

### Bug Fixes Completed
✅ **Slot Machine Fixes**
- Fixed symbol rendering issues - symbols now display correctly
- Improved reel alignment for accurate final results
- Enhanced spinning animations for smooth gameplay

✅ **Roulette Improvements**
- Eliminated erratic ball bouncing behavior
- Fixed wheel number spacing and positioning
- Improved ball positioning accuracy
- Enhanced wheel layout and visibility

### Performance Optimizations
- Optimized 3D rendering for better frame rates
- Improved memory management for long gaming sessions
- Enhanced audio loading and playback

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── games/      # Game-specific components
│   │   │   └── ui/         # Reusable UI components
│   │   ├── lib/
│   │   │   ├── stores/     # Zustand state management
│   │   │   └── gameLogic/  # Game mechanics and calculations
│   │   └── styles/         # CSS and styling files
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   └── storage.ts         # Database configuration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── public/               # Static assets and textures
```

## 🎮 Controls

- **Mouse**: Click to interact with game elements
- **UI Navigation**: Use on-screen buttons and menus
- **Audio Toggle**: Click the speaker icon to mute/unmute

## 🐛 Troubleshooting

### Common Issues

**Game not loading?**
- Ensure you have a stable internet connection
- Try refreshing the page
- Check browser console for any error messages

**Audio not working?**
- Check if your browser allows autoplay
- Verify volume settings
- Try clicking the audio toggle button

**3D graphics appear broken?**
- Ensure your browser supports WebGL
- Try using a different browser (Chrome/Firefox recommended)
- Check if hardware acceleration is enabled

## 🔄 Database

The application uses PostgreSQL for data persistence:
- User progress and credits are automatically saved
- Game statistics are tracked across sessions
- Database migrations are handled automatically

To reset your progress:
```bash
npm run db:push --force
```

## 🚀 Deployment

The application is ready for deployment on Replit:
1. All dependencies are properly configured
2. Database is set up and connected
3. Environment variables are configured
4. Production build optimizations are enabled

## 📝 License

This project is built for educational and entertainment purposes.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Enjoy your casino experience! 🎰 Good luck at the tables! 🍀**