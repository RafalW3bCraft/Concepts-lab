import { useEffect, useState } from "react";
import Casino2D from "./components/Casino2D";
import GameUI from "./components/ui/GameUI";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";
import { useCasino } from "./lib/stores/useCasino";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import "./styles/casino.css";

function App() {
  const { initializeCasino } = useCasino();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize casino and audio on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing casino...');
        initializeCasino();
        
        // Load audio files with proper error handling
        try {
          const bgMusic = new Audio("/sounds/background.mp3");
          bgMusic.loop = true;
          bgMusic.volume = 0.3;
          setBackgroundMusic(bgMusic);
          console.log('Background music loaded');
        } catch (error) {
          console.warn('Background music failed to load:', error);
        }

        try {
          const hitAudio = new Audio("/sounds/hit.mp3");
          hitAudio.volume = 0.5;
          setHitSound(hitAudio);
          console.log('Hit sound loaded');
        } catch (error) {
          console.warn('Hit sound failed to load:', error);
        }

        try {
          const successAudio = new Audio("/sounds/success.mp3");
          successAudio.volume = 0.7;
          setSuccessSound(successAudio);
          console.log('Success sound loaded');
        } catch (error) {
          console.warn('Success sound failed to load:', error);
        }

        // Simulate loading time for better UX
        setTimeout(() => {
          setIsLoading(false);
          console.log('Casino initialized successfully');
        }, 2000);
      } catch (error) {
        console.error('Failed to initialize casino:', error);
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    initializeApp();
  }, [initializeCasino, setBackgroundMusic, setHitSound, setSuccessSound]);

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="casino-app">
        <ErrorBoundary>
          <Casino2D />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <GameUI />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

export default App;
