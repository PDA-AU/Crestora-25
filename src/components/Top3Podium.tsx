import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award } from 'lucide-react';
import leaderboardData from '@/data/leaderboard.json';
import { getTeamLogo } from '@/utils/teamLogoMapper';
import './Top3Podium.css';

gsap.registerPlugin(ScrollTrigger);

const podiumHeights = {
  1: 'h-64 md:h-80',
  2: 'h-48 md:h-64',
  3: 'h-40 md:h-56',
};

const podiumOrder = [2, 1, 3]; // Left to right: 2nd, 1st, 3rd

export const Top3Podium = () => {
  const podiumRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const top3 = leaderboardData.leaderboard.slice(0, 3);

  const toggleCardFlip = (index: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const triggerParticleBurst = () => {
    const count = 200;
    const defaults = {
      origin: { x: 0.5, y: 0.5 },
      zIndex: 0,
    };

    confetti({
      ...defaults,
      particleCount: count,
      spread: 360,
      startVelocity: 25,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#FDCD00', '#00FFFF', '#FF1493', '#8B5CF6'],
    });

    confetti({
      ...defaults,
      particleCount: count / 2,
      spread: 120,
      startVelocity: 45,
      decay: 0.9,
      scalar: 1.2,
      colors: ['#FDCD00', '#00FFFF'],
    });
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    // Trigger particle burst for winner
    triggerParticleBurst();

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#00FFFF', '#FF1493'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#00FFFF', '#FF1493'],
      });
    }, 250);
  };

  const playAnimation = (isReplay = false) => {
    // Kill any existing animations and ScrollTriggers
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.killTweensOf(cardsRef.current);

    const tl = gsap.timeline({
      onComplete: () => {
        if (!hasAnimated || isReplay) {
          triggerConfetti();
          if (!isReplay) setHasAnimated(true);
        }
      },
    });

    cardsRef.current.forEach((card, index) => {
      if (card) {
        // Reset to initial state
        gsap.set(card, {
          y: -200,
          opacity: 0,
          scale: 0.5,
          rotation: index % 2 === 0 ? -15 : 15,
        });

        // Animate in
        tl.to(card, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: 'power4.out',
        }, index * 0.2)
        .to(card, {
          boxShadow: '0 0 40px rgba(253, 205, 0, 0.6)',
          duration: 0.5,
          ease: 'power2.inOut',
        }, '-=0.5');
      }
    });

    return tl;
  };

  useEffect(() => {
    // Initial animation with scroll trigger
    const st = ScrollTrigger.create({
      trigger: podiumRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => playAnimation(false),
    });

    return () => {
      st.kill();
    };
  }, []);

  const replayCeremony = () => {
    playAnimation(true);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-12 h-12 text-[hsl(var(--space-gold))]" />;
      case 2:
        return <Medal className="w-10 h-10 text-gray-300" />;
      case 3:
        return <Award className="w-10 h-10 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <section ref={podiumRef} className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-[hsl(var(--space-gold))]">
            🏆 Top 3 Winners
          </h2>
        </div>

        {/* Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-end max-w-5xl mx-auto">
          {podiumOrder.map((position, index) => {
            const team = top3.find(t => t.rank === position);
            if (!team) return null;

            return (
              <div
                key={team.team_id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className={`relative ${podiumHeights[team.rank as keyof typeof podiumHeights]} transition-all duration-300 cursor-pointer`}
                style={{ perspective: '1000px' }}
                onClick={() => toggleCardFlip(index)}
              >
                {/* Card Container with Flip */}
                <div 
                  className={`podium-card-container absolute inset-0 transition-transform duration-700`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front of Card */}
                  <div 
                    className="podium-card absolute inset-0 bg-gradient-to-br from-background/40 to-background/10 backdrop-blur-lg border-2 border-border rounded-2xl p-4 md:p-6 flex flex-col items-center justify-between"
                    style={{
                      boxShadow: team.rank === 1 
                        ? '0 0 60px rgba(253, 205, 0, 0.4)' 
                        : '0 10px 40px rgba(0,0,0,0.3)',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                    onMouseMove={(e) => {
                      if (flippedCards[index]) return;
                      const card = e.currentTarget;
                      const rect = card.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const rotateX = (y - centerY) / 10;
                      const rotateY = (centerX - x) / 10;
                      
                      card.style.setProperty('--rotate-x', `${rotateX}deg`);
                      card.style.setProperty('--rotate-y', `${rotateY}deg`);
                    }}
                    onMouseLeave={(e) => {
                      if (flippedCards[index]) return;
                      const card = e.currentTarget;
                      card.style.setProperty('--rotate-x', '0deg');
                      card.style.setProperty('--rotate-y', '0deg');
                    }}
                  >
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center gap-2" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(15px)' }}>
                      {getRankIcon(team.rank)}
                      <div className={`
                        px-3 py-1.5 md:px-4 md:py-2 rounded-full font-orbitron font-bold text-sm md:text-lg transition-all duration-300
                        ${team.rank === 1 ? 'bg-[hsl(var(--space-gold))] text-background shadow-[0_0_20px_rgba(253,205,0,0.5)]' : ''}
                        ${team.rank === 2 ? 'bg-gray-300 text-background shadow-[0_0_15px_rgba(211,211,211,0.5)]' : ''}
                        ${team.rank === 3 ? 'bg-amber-600 text-background shadow-[0_0_15px_rgba(217,119,6,0.5)]' : ''}
                      `}>
                        Rank {team.rank}
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="text-center flex-1 flex flex-col justify-center mt-2" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}>
                      <h3 className="font-orbitron font-bold text-base md:text-xl lg:text-2xl mb-1 md:mb-2 text-foreground leading-tight">
                        {team.team_name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Led by {team.leader_name}
                      </p>
                      <p className="text-xs text-[hsl(var(--space-cyan))] mt-2 opacity-70">
                        Click to reveal logo
                      </p>
                    </div>

                    {/* Podium Base Number */}
                    <div 
                      className="text-4xl md:text-6xl font-bold opacity-10 font-orbitron absolute bottom-2 right-2 md:bottom-4 md:right-4"
                      style={{ transformStyle: 'preserve-3d', transform: 'translateZ(5px)' }}
                    >
                      {team.rank}
                    </div>
                  </div>

                  {/* Back of Card - Team Logo */}
                  <div 
                    className="podium-card absolute inset-0 bg-gradient-to-br from-background/60 to-background/20 backdrop-blur-lg border-2 border-[hsl(var(--space-cyan))]/50 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center"
                    style={{
                      boxShadow: '0 0 60px rgba(0, 255, 255, 0.4)',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-background/80 border-4 border-[hsl(var(--space-cyan))] flex items-center justify-center overflow-hidden mb-4 shadow-[0_0_40px_rgba(0,255,255,0.5)]">
                      <img 
                        src={getTeamLogo(team.team_id)} 
                        alt={team.team_name}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    <h3 className="font-orbitron font-bold text-xl md:text-2xl text-[hsl(var(--space-cyan))] mb-2">
                      {team.team_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Click to flip back
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
