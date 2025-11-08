import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Medal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Rolling events winners data
const rollingWinners = [
  {
    event_name: "Vibretto",
    winner_team: "Melody Masters",
    winner_name: "Arun Kumar",
    winner_regno: "2023PD001",
    runnerup_team: "Sound Waves",
    runner_name: "Priya Singh",
    runner_regno: "2023PD002",
  },
  {
    event_name: "Meme & Reel Contest",
    winner_team: "Viral Vibes",
    winner_name: "Rahul Sharma",
    winner_regno: "2023PD003",
    runnerup_team: "Content Creators",
    runner_name: "Sneha Patel",
    runner_regno: "2023PD004",
  },
  {
    event_name: "கருத்தரங்கம் (Karutharangam)",
    winner_team: "Tamil Scholars",
    winner_name: "Karthik Raja",
    winner_regno: "2023PD005",
    runnerup_team: "Debate Dragons",
    runner_name: "Lakshmi Devi",
    runner_regno: "2023PD006",
  },
  {
    event_name: "Plot Twist Paradox",
    winner_team: "Story Spinners",
    winner_name: "Aarav Mehta",
    winner_regno: "2023PD007",
    runnerup_team: "Literary Legends",
    runner_name: "Ishita Gupta",
    runner_regno: "2023PD008",
  },
];

export const RollingEventsGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
            y: 100,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
          });

          // Hover effect
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.05,
              rotateY: 5,
              boxShadow: '0 20px 60px hsl(var(--space-cyan) / 0.3)',
              duration: 0.3,
              ease: 'power2.out',
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              rotateY: 0,
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              duration: 0.3,
              ease: 'power2.out',
            });
          });
        }
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={gridRef} className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 text-[hsl(var(--space-gold))]">
            🌟 Rolling Event Winners
          </h2>
          <p className="text-muted-foreground text-lg">
            Individual achievements across special events
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rollingWinners.map((event, index) => (
            <div
              key={event.event_name}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="bg-gradient-to-br from-background/60 to-background/20 backdrop-blur-xl border-2 border-border rounded-2xl p-6 hover:border-[hsl(var(--space-cyan))]/50 transition-colors duration-300"
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Event Name */}
              <h3 className="font-orbitron font-bold text-2xl mb-6 text-center text-[hsl(var(--space-cyan))]">
                {event.event_name}
              </h3>

              {/* Winner */}
              <div className="mb-4 p-4 bg-[hsl(var(--space-gold))]/10 border-2 border-[hsl(var(--space-gold))]/30 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-[hsl(var(--space-gold))]" />
                  <span className="font-orbitron font-bold text-[hsl(var(--space-gold))]">
                    Winner
                  </span>
                </div>
                <p className="font-semibold text-lg text-foreground">{event.winner_team}</p>
                <p className="text-sm text-muted-foreground">
                  {event.winner_name} • {event.winner_regno}
                </p>
                <p className="text-xs text-[hsl(var(--space-gold))] mt-2 font-semibold">
                  Prize: ₹400
                </p>
              </div>

              {/* Runner-up */}
              <div className="p-4 bg-muted/20 border-2 border-muted rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Medal className="w-6 h-6 text-gray-400" />
                  <span className="font-orbitron font-bold text-gray-400">
                    Runner-up
                  </span>
                </div>
                <p className="font-semibold text-lg text-foreground">{event.runnerup_team}</p>
                <p className="text-sm text-muted-foreground">
                  {event.runner_name} • {event.runner_regno}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-semibold">
                  Prize: ₹250
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
