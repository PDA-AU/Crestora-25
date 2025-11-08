import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Starfield } from '@/components/Starfield';
import { ParticleField3D } from '@/components/ParticleField3D';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WinnersHero } from '@/components/WinnersHero';
import { Top3Podium } from '@/components/Top3Podium';
import { RollingEventsGrid } from '@/components/RollingEventsGrid';

gsap.registerPlugin(ScrollTrigger);

const Winners = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page entry animation
      gsap.from(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Parallax effect for background
      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
          y: -200,
          ease: 'none',
        });
      }

      // Animate sections on scroll
      const sections = containerRef.current?.querySelectorAll('section');
      sections?.forEach((section, index) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 100,
          duration: 1,
          ease: 'power3.out',
          delay: index * 0.1,
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Parallax Background Layer */}
      <div 
        ref={parallaxRef}
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--space-cyan) / 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--space-violet) / 0.1) 0%, transparent 50%)',
        }}
      />
      
      <Starfield />
      <ParticleField3D />
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
