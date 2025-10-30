import { motion } from 'framer-motion';
import { Trophy, Users, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative py-16 px-4 mt-32 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Title */}
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--space-cyan))] to-[hsl(var(--space-gold))]">
            Crestora'25
          </h2>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Event Details */}
            <div className="space-y-2">
              <h3 className="font-orbitron text-lg font-semibold text-[hsl(var(--space-cyan))]">Event Details</h3>
              <p className="text-sm text-muted-foreground">8 Main Rounds</p>
              <p className="text-sm text-muted-foreground">4 Rolling Events</p>
              <p className="text-sm text-muted-foreground">Compete with 50+ teams</p>
            </div>

            {/* Team Structure */}
            <div className="space-y-2">
              <h3 className="font-orbitron text-lg font-semibold text-[hsl(var(--space-gold))]">Team Structure</h3>
              <p className="text-sm text-muted-foreground">3–4 Members per Team</p>
              <p className="text-sm text-muted-foreground">UG 2nd & 3rd Years</p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <Users className="w-4 h-4 text-[hsl(var(--space-gold))]" />
                <span className="text-sm text-muted-foreground">Team Event</span>
              </div>
            </div>

            {/* Prizes */}
            <div className="space-y-2">
              <h3 className="font-orbitron text-lg font-semibold text-[hsl(var(--space-violet))]">Prizes</h3>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-[hsl(var(--space-gold))]" />
                <span className="text-sm text-muted-foreground">Winner Team</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-[hsl(var(--space-cyan))]" />
                <span className="text-sm text-muted-foreground">Runner-up Team</span>
              </div>
            </div>
          </div>

          {/* ✨ Contact Details Section */}
          <div className="mb-10">
            <h3 className="font-orbitron text-lg font-semibold mb-3 text-[hsl(var(--space-cyan))]">
              Contact Details
            </h3>
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[hsl(var(--space-gold))]" />
                <span>
                  <strong className="text-[hsl(var(--space-gold))]">Akshaya</strong> – +91&nbsp;88387&nbsp;42309
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[hsl(var(--space-gold))]" />
                <span>
                  <strong className="text-[hsl(var(--space-gold))]">Manjuvarsheni</strong> – +91&nbsp;63827&nbsp;06381
                </span>
              </div>
            </div>
          </div>

          {/* Organizer Credits */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Organized by Personality Development Association
            </p>
            <p className="text-xs text-muted-foreground">
              MIT Campus, Anna University
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2025 PDA WEB TEAM. All Rights Reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
