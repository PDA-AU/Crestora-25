import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

export const WinnersHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: 'power4.out',
      })
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.6');

      // Glow animation
      gsap.to(titleRef.current, {
        textShadow: '0 0 30px hsl(var(--space-gold)), 0 0 60px hsl(var(--space-gold) / 0.5)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1
            ref={titleRef}
            className="font-orbitron font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 bg-gradient-to-r from-[hsl(var(--space-gold))] via-[hsl(var(--space-cyan))] to-[hsl(var(--space-gold))] bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% auto',
              animation: 'gradient-shift 3s ease infinite',
            }}
          >
            Crestora '25
            <br />
            <span className="text-4xl sm:text-5xl md:text-6xl">The Champions</span>
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
          >
            Celebrating the teams that reached for the stars and conquered the cosmos
          </p>
        </motion.div>
      </div>
    </section>
  );
};
