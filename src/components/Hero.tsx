import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-space.jpg';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export const Hero = () => {
  const scrollToTimeline = () => {
    document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          filter: 'brightness(0.4)',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--space-cyan))] via-[hsl(var(--space-violet))] to-[hsl(var(--space-gold))] px-4">
            CRESTORA'25
          </h1>
        </motion.div>

        <motion.p
          className="text-xl sm:text-2xl md:text-3xl font-light mb-4 text-foreground/90 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Beyond Limits – A Talent Odyssey
        </motion.p>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          of Personality Development Association
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-col gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Register Button */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScFxZSWGixzAKsZbVfpTxcn2A2zv3IZy0aIcrLPWGA-S92I0A/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Register for Crestora'25 - Google Form"
          >
            <Button
              size="lg"
              className="bg-[hsl(var(--space-cyan))] hover:bg-[hsl(var(--space-cyan))]/80 text-background font-orbitron text-lg px-8 py-6 shadow-[var(--shadow-neon)] hover:shadow-[0_0_30px_hsl(var(--space-cyan))] transition-all"
            >
              Click here to Register!⚡️
            </Button>
          </a>

          {/* WhatsApp Group Button */}
          <a
            href="https://chat.whatsapp.com/LCmsRUtkXIbJFsleaX8VIT?mode=ems_copy_t"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join WhatsApp Group"
          >
            <Button
              size="lg"
              className="mt-2 bg-green-500 text-background font-orbitron text-lg px-8 py-6 
                         shadow-[0_0_20px_#00ff88] hover:shadow-[0_0_35px_#00ff88] 
                         hover:bg-green-400 transition-all duration-300"
            >
              Join WhatsApp Group
            </Button>
          </a>

          {/* Explore Button */}
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToTimeline}
            className="border-[hsl(var(--space-gold))] text-[hsl(var(--space-gold))] hover:bg-[hsl(var(--space-gold))]/10 font-orbitron text-lg px-8 py-6"
          >
            Explore Journey
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-xs text-muted-foreground">
            Organized by PDA, MIT Campus, Anna University
          </p>
          <p className="text-xs text-muted-foreground">
            In collaboration with 12+ clubs
          </p>
        </motion.div>
      </div>
    </section>
  );
};
