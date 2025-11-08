import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award } from 'lucide-react';
import leaderboardData from '@/data/leaderboard.json';
import defaultClubLogo from '@/assets/logos/default-club.png';
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

  const top3 = leaderboardData.leaderboard.slice(0, 3);

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
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 text-[hsl(var(--space-gold))]">
            🏆 Top 3 Winners
          </h2>
          <Button
            onClick={replayCeremony}
            variant="outline"
            className="border-[hsl(var(--space-cyan))] text-[hsl(var(--space-cyan))] hover:bg-[hsl(var(--space-cyan))]/10"
          >
            🎬 Replay Ceremony
          </Button>
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
                className={`relative ${podiumHeights[team.rank as keyof typeof podiumHeights]} transition-all duration-300`}
                style={{ perspective: '1000px' }}
              >
                {/* Card */}
                <div 
                  className="podium-card absolute inset-0 bg-gradient-to-br from-background/40 to-background/10 backdrop-blur-lg border-2 border-border rounded-2xl p-4 md:p-6 flex flex-col items-center justify-between transition-all duration-300"
                  style={{
                    boxShadow: team.rank === 1 
                      ? '0 0 60px rgba(253, 205, 0, 0.4)' 
                      : '0 10px 40px rgba(0,0,0,0.3)',
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseMove={(e) => {
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
                    const card = e.currentTarget;
                    card.style.setProperty('--rotate-x', '0deg');
                    card.style.setProperty('--rotate-y', '0deg');
                  }}
                >
                  {/* Team Logo */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-background/60 border-2 border-[hsl(var(--space-cyan))]/30 flex items-center justify-center overflow-hidden mb-3 transition-transform duration-300 hover:rotate-12">
                    <img 
                      src={defaultClubLogo} 
                      alt={team.team_name}
                      className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    />
                  </div>

                  {/* Rank Badge */}
                  <div className="flex flex-col items-center gap-2">
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
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <h3 className="font-orbitron font-bold text-lg md:text-2xl mb-1 md:mb-2 text-foreground">
                      {team.team_name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                      Led by {team.leader_name}
                    </p>
                    <div className="mt-2 md:mt-4 px-3 py-2 md:px-4 md:py-2 bg-[hsl(var(--space-cyan))]/10 rounded-lg border border-[hsl(var(--space-cyan))]/30 transition-all duration-300 hover:bg-[hsl(var(--space-cyan))]/20">
                      <p className="text-xl md:text-2xl font-bold text-[hsl(var(--space-cyan))]">
                        {team.final_score}
                      </p>
                      <p className="text-xs text-muted-foreground">Final Score</p>
                    </div>
                  </div>

                  {/* Podium Base Number */}
                  <div className="text-4xl md:text-6xl font-bold opacity-10 font-orbitron absolute bottom-2 right-2 md:bottom-4 md:right-4">
                    {team.rank}
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
