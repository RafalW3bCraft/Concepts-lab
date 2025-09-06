import { useEffect, useState } from "react";

interface CreditDisplayProps {
  credits: number;
}

export default function CreditDisplay({ credits }: CreditDisplayProps) {
  const [animatedCredits, setAnimatedCredits] = useState(credits);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (credits !== animatedCredits) {
      setIsAnimating(true);
      const duration = 1000;
      const startTime = Date.now();
      const startValue = animatedCredits;
      const endValue = credits;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOut);
        
        setAnimatedCredits(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [credits, animatedCredits]);

  return (
    <div className={`credit-display ${isAnimating ? 'animating' : ''}`}>
      <div className="credit-icon">💰</div>
      <div className="credit-amount">
        <span className="credit-label">Credits</span>
        <span className="credit-value">{animatedCredits.toLocaleString()}</span>
      </div>
    </div>
  );
}
