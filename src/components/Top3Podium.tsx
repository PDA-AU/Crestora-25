import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award } from 'lucide-react';
import leaderboardData from '@/data/leaderboard.json';

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

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

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

  const playAnimation = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: podiumRef.current,
          start: 'top 80%',
          once: true,
        },
        onComplete: () => {
          if (!hasAnimated) {
            triggerConfetti();
            setHasAnimated(true);
          }
        },
      });

      cardsRef.current.forEach((card, index) => {
        if (card) {
          tl.from(card, {
            y: -200,
            opacity: 0,
            scale: 0.5,
            rotation: index % 2 === 0 ? -15 : 15,
            duration: 1,
            ease: 'power4.out',
          }, index * 0.2)
          .to(card, {
            boxShadow: '0 0 40px hsl(var(--space-gold) / 0.6)',
            duration: 0.5,
            ease: 'power2.inOut',
          }, '-=0.5');
        }
      });
    }, podiumRef);

    return () => ctx.revert();
  };

  useEffect(() => {
    playAnimation();
  }, []);

  const replayCeremony = () => {
    cardsRef.current.forEach((card) => {
      if (card) {
        gsap.set(card, { y: 0, opacity: 1, scale: 1, rotation: 0 });
      }
    });
    setHasAnimated(false);
    playAnimation();
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
          {podiumOrder.map((position, index) => {
            const team = top3.find(t => t.rank === position);
            if (!team) return null;

            return (
              <div
                key={team.team_id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className={`relative ${podiumHeights[team.rank as keyof typeof podiumHeights]}`}
              >
                {/* Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-background/40 to-background/10 backdrop-blur-lg border-2 border-border rounded-2xl p-6 flex flex-col items-center justify-between"
                  style={{
                    boxShadow: team.rank === 1 
                      ? '0 0 60px hsl(var(--space-gold) / 0.4)' 
                      : '0 10px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Rank Badge */}
                  <div className="flex flex-col items-center gap-2">
                    {getRankIcon(team.rank)}
                    <div className={`
                      px-4 py-2 rounded-full font-orbitron font-bold text-lg
                      ${team.rank === 1 ? 'bg-[hsl(var(--space-gold))] text-background' : ''}
                      ${team.rank === 2 ? 'bg-gray-300 text-background' : ''}
                      ${team.rank === 3 ? 'bg-amber-600 text-background' : ''}
                    `}>
                      Rank {team.rank}
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="text-center">
                    <h3 className="font-orbitron font-bold text-xl md:text-2xl mb-2 text-foreground">
                      {team.team_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      Led by {team.leader_name}
                    </p>
                    <div className="mt-4 px-4 py-2 bg-[hsl(var(--space-cyan))]/10 rounded-lg border border-[hsl(var(--space-cyan))]/30">
                      <p className="text-2xl font-bold text-[hsl(var(--space-cyan))]">
                        {team.final_score}
                      </p>
                      <p className="text-xs text-muted-foreground">Final Score</p>
                    </div>
                  </div>

                  {/* Podium Base Number */}
                  <div className="text-6xl font-bold opacity-10 font-orbitron">
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
