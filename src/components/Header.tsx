import { motion } from 'framer-motion';
import pdaLogo from '@/assets/pda-logo.png';
import rocketship from '@/assets/rocketship.png';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/25 backdrop-blur-md border-b border-border">
      {/* Animated Rocketships */}
      

      {/* Header Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Increased logo size: default slightly larger, bigger on md */}
          <img
            src={pdaLogo}
            alt="PDA Logo"
            className="w-12 h-12 md:w-14 md:h-14"
          />
          <div>
            <h1 className="font-orbitron font-bold text-lg text-[hsl(var(--space-cyan))]">
              CRESTORA'25
            </h1>
            <p className="text-xs text-muted-foreground">PDA, MIT Campus</p>
          </div>
        </div>
        
      </div>
    </header>
  );
};
