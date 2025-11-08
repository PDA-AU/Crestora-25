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
          // Entrance animation
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

          // Parallax effect on scroll
          gsap.to(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
            y: index % 2 === 0 ? -30 : 30, // Alternate direction
            ease: 'none',
          });

          // Hover effect (desktop only)
          const mediaQuery = window.matchMedia('(min-width: 1024px)');
          
          const handleMouseEnter = () => {
            if (mediaQuery.matches) {
              gsap.to(card, {
                scale: 1.03,
                rotateY: 3,
                boxShadow: '0 20px 60px hsl(var(--space-cyan) / 0.3)',
                duration: 0.3,
                ease: 'power2.out',
              });
            }
          };

          const handleMouseLeave = () => {
            if (mediaQuery.matches) {
              gsap.to(card, {
                scale: 1,
                rotateY: 0,
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                duration: 0.3,
                ease: 'power2.out',
              });
            }
          };

          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);
        }
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={gridRef} className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-[hsl(var(--space-gold))]">
            🌟 Rolling Event Winners
          </h2>
          <p className="text-muted-foreground text-base md:text-lg px-4">
            Individual achievements across special events
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {rollingWinners.map((event, index) => (
            <div
              key={event.event_name}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="bg-gradient-to-br from-background/60 to-background/20 backdrop-blur-xl border-2 border-border rounded-2xl p-5 sm:p-6 hover:border-[hsl(var(--space-cyan))]/50 transition-all duration-300 w-full"
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Event Name */}
              <h3 className="font-orbitron font-bold text-xl sm:text-2xl mb-4 md:mb-6 text-center text-[hsl(var(--space-cyan))]">
                {event.event_name}
              </h3>

              {/* Winner */}
              <div className="mb-3 md:mb-4 p-3 sm:p-4 bg-[hsl(var(--space-gold))]/10 border-2 border-[hsl(var(--space-gold))]/30 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--space-gold))] flex-shrink-0" />
                  <span className="font-orbitron font-bold text-sm sm:text-base text-[hsl(var(--space-gold))]">
                    Winner
                  </span>
                </div>
                <p className="font-semibold text-base sm:text-lg text-foreground break-words">{event.winner_team}</p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  {event.winner_name} • {event.winner_regno}
                </p>
              </div>

              {/* Runner-up */}
              <div className="p-3 sm:p-4 bg-muted/20 border-2 border-muted rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                  <span className="font-orbitron font-bold text-sm sm:text-base text-gray-400">
                    Runner-up
                  </span>
                </div>
                <p className="font-semibold text-base sm:text-lg text-foreground break-words">{event.runnerup_team}</p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  {event.runner_name} • {event.runner_regno}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
