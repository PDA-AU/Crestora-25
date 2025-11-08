import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Starfield } from '@/components/Starfield';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WinnersHero } from '@/components/WinnersHero';
import { Top3Podium } from '@/components/Top3Podium';
import { RollingEventsGrid } from '@/components/RollingEventsGrid';

gsap.registerPlugin(ScrollTrigger);

const Winners = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Page entry animation
    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Starfield />
      <Header />
      
      <main className="relative z-10 pt-20">
        <WinnersHero />
        <Top3Podium />
        <RollingEventsGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Winners;
