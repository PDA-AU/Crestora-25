import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import eventData from '@/data/eventData.json';
import { Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// import { RollingEventModal } from '@/components/RollingEventModal';

// Import club logos
import pdaLogo from '@/assets/logos/pda.png';
import mitQuillLogo from '@/assets/logos/mit-quill.png';
import mitMeteorologyLogo from '@/assets/logos/mit-meteorology.png';
import vibesLogo from '@/assets/logos/vibes.png';
import varietyTeamLogo from '@/assets/logos/variety-team.png';
import tamilMandramLogo from '@/assets/logos/tamil-mandram.png';
import quizClubLogo from '@/assets/logos/quiz-club-of-mit.png';
import tedClubLogo from '@/assets/logos/ted-club-of-mit.png';
import boxOfficeLogo from '@/assets/logos/the-box-office-of-mit.png';
import ausecLogo from '@/assets/logos/ausec-mit.png';
import csmitLogo from '@/assets/logos/csmit.png';
import bookReadersLogo from '@/assets/logos/book-readers-club-of-mit.png';
import defaultClubLogo from '@/assets/logos/default-club.png';

const clubLogos: Record<string, string> = {
  'PDA': pdaLogo,
  'MIT Quill': mitQuillLogo,
  'MIT Meteorology Club': mitMeteorologyLogo,
  'Vibes': vibesLogo,
  'Variety Team': varietyTeamLogo,
  'Tamil Mandram': tamilMandramLogo,
  'Quiz Club of MIT': quizClubLogo,
  'TED Club of MIT': tedClubLogo,
  'The Box Office of MIT': boxOfficeLogo,
  'AUSEC MIT': ausecLogo,
  'CSMIT': csmitLogo,
  'Book Readers Club of MIT': bookReadersLogo,
  'default': defaultClubLogo,
};

interface RollingEvent {
  id: string;
  name: string;
  club: string;
  type: string;
  date: string;
  description: string;
  // Extended data for modal
  extended_description?: string;
  form_link?: string;
  contact?: string;
  venue?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  event_id?: string;
  event_code?: string;
}

export const RollingEvents = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedEvent, setSelectedEvent] = useState<RollingEvent | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const openModal = (event: RollingEvent) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
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
              <div 
                onClick={() => openModal(event)}
                className="relative bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 h-full transition-transform group-hover:scale-[1.02] flex flex-col cursor-pointer"
              >
                {/* Logo */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[hsl(var(--space-gold))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-gold))]/30 p-2 flex items-center justify-center">
                    <img 
                      src={clubLogos[event.club] || clubLogos['default']} 
                      alt={`${event.club} logo`}
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
                
                <div className="mt-2 text-xs text-muted-foreground italic text-center">
                  Click to view full details
                </div>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>

      {/* Rolling Event Modal - TODO: Implement modal component */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-bold mb-2">{selectedEvent.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{selectedEvent.description}</p>
            <button onClick={closeModal} className="px-4 py-2 bg-primary text-primary-foreground rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
