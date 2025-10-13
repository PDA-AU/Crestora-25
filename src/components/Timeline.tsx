import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import eventData from '@/data/eventData.json';
import { RoundCard } from './RoundCard';
import { RollingEvents } from './RollingEvents';

export const Timeline = () => {
  return (
    <section id="timeline" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4 text-[hsl(var(--space-cyan))]">
            The Odyssey Timeline
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Embark on a journey through {eventData.event.total_rounds} rounds of challenges
          </p>
        </motion.div>

        {/* Timeline Path */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[hsl(var(--space-cyan))] via-[hsl(var(--space-violet))] to-[hsl(var(--space-gold))] opacity-30 hidden md:block" />

          {/* Rounds */}
          <div className="space-y-32">
            {eventData.rounds.map((round, index) => (
              <RoundCard key={round.id} round={round} index={index} />
            ))}
          </div>
        </div>

        {/* Rolling Events */}
        <RollingEvents />
      </div>
    </section>
  );
};
