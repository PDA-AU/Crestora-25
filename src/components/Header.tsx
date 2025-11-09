import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import pdaLogo from '@/assets/pda-logo.png';
import rocketship from '@/assets/rocketship.png';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/25 backdrop-blur-md border-b border-border">
      {/* Animated Rocketships */}
      

      {/* Header Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Increased logo size: default slightly larger, bigger on md */}
          <Link to="/">
            <img
              src={pdaLogo}
              alt="PDA Logo"
              className="w-12 h-12 md:w-14 md:h-14"
            />
          </Link>
          <div>
            <h1 className="font-orbitron font-bold text-lg text-[hsl(var(--space-cyan))]">
              <Link to="/">CRESTORA'25</Link>
            </h1>
            <p className="text-xs text-muted-foreground">PDA, MIT Campus</p>
          </div>
        </div>

        <Link to="https://crestora-summit-voyage.lovable.app/winners">
          <Button 
            className="bg-[hsl(var(--space-gold))] hover:bg-[hsl(var(--space-gold))]/90 text-background font-orbitron font-bold gap-2"
            style={{
              boxShadow: '0 0 20px hsl(var(--space-gold) / 0.5)',
            }}
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden sm:inline">Reveal Winners</span>
            <span className="sm:hidden">Winners</span>
            🎉
          </Button>
        </Link>
      </div>
    </header>
  );
};
