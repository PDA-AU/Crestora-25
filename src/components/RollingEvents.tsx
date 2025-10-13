import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import eventData from '@/data/eventData.json';
import { Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Import logos
import rolling1Logo from '@/assets/logos/rolling1.png';
import rolling2Logo from '@/assets/logos/rolling2.png';
import rolling3Logo from '@/assets/logos/rolling3.png';
import rolling4Logo from '@/assets/logos/rolling4.png';

const rollingLogos: Record<number, string> = {
  1: rolling1Logo,
  2: rolling2Logo,
  3: rolling3Logo,
  4: rolling4Logo,
};

export const RollingEvents = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div ref={ref} className="mt-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-[hsl(var(--space-gold))]" />
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-[hsl(var(--space-gold))]">
            Rolling Events
          </h2>
          <Sparkles className="w-8 h-8 text-[hsl(var(--space-gold))]" />
        </div>
        <p className="text-muted-foreground">
          Special events running alongside the main odyssey
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {eventData.rolling_events.map((event, index) => {
          const eventNumber = parseInt(event.id.replace('rolling', ''));
          return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="relative group h-full">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--space-gold))] to-[hsl(var(--space-violet))] rounded-xl opacity-20 group-hover:opacity-40 blur transition-opacity" />
              
              {/* Card */}
              <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 h-full transition-transform group-hover:scale-[1.02] flex flex-col">
                {/* Logo */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[hsl(var(--space-gold))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-gold))]/30 p-2 flex items-center justify-center">
                    <img 
                      src={rollingLogos[eventNumber]} 
                      alt={`${event.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-orbitron text-lg font-bold mb-2 text-foreground text-center break-words">
                    {event.name}
                  </h3>
                  <div className="flex justify-center">
                    <Badge variant="outline" className="border-[hsl(var(--space-gold))] text-[hsl(var(--space-gold))] mb-3">
                      {event.club}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  {event.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border">
                  <Calendar className="w-3 h-3 text-[hsl(var(--space-gold))]" />
                  <span>{formatDate(event.date)}</span>
                  <span className="ml-auto">{event.type}</span>
                </div>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
};
