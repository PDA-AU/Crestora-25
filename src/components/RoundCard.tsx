import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Calendar, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RoundModal } from '@/components/RoundModal';

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

interface Round {
  id: string;
  round_number: number;
  name: string;
  club: string;
  type: string;
  date: string;
  description: string;
  // Extended data for modal
  extended_description?: string;
  form_link?: string;
  contact?: string | string[];
  venue?: string;
  status?: string;
  is_frozen?: boolean;
  is_evaluated?: boolean;
  is_wildcard?: boolean;
  criteria?: any;
  max_score?: number;
  min_score?: number;
  avg_score?: number;
}

interface RoundCardProps {
  round: Round;
  index: number;
  blur?: boolean;
}


export const RoundCard = ({ round, index, blur = false }: RoundCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;

  // Modal state — now enabled for all rounds
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const openModal = () => {
    // Don't open modal for blurred events
    if (blur) return;
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div ref={ref} className="relative">
      {/* Central Planet/Node */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block"
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--space-cyan))] to-[hsl(var(--space-violet))] flex items-center justify-center shadow-[var(--shadow-neon)] animate-pulse-glow">
            <span className="font-orbitron font-bold text-2xl text-background">
              {round.round_number}
            </span>
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[hsl(var(--space-gold))]/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ scale: 1.4 }}
          />
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div
        className={`md:w-[calc(50%-4rem)] ${isEven ? 'md:ml-0' : 'md:ml-auto'}`}
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative group">
          {/* Glow Effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r from-[hsl(var(--space-cyan))] to-[hsl(var(--space-violet))] rounded-2xl opacity-20 transition-opacity ${blur ? 'opacity-10' : 'group-hover:opacity-40'}`} />

          <div
            onClick={openModal}
            role="button"
            tabIndex={0}
            className={blur ? "cursor-not-allowed" : "cursor-pointer"}
          >
            <div className={`relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 transition-transform ${blur ? '' : 'group-hover:scale-[1.02]'}`}>
              {/* Logo Section */}
              <div className="flex items-start gap-6 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gradient-to-br from-[hsl(var(--space-cyan))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-cyan))]/30 p-3 flex items-center justify-center">
                    <img
                      src={clubLogos[round.club] || clubLogos['default']}
                      alt={`${round.club} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="md:hidden mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--space-cyan))] to-[hsl(var(--space-violet))] flex items-center justify-center shadow-[var(--shadow-neon)]">
                      <span className="font-orbitron font-bold text-lg text-background">
                        {round.round_number}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-orbitron text-lg md:text-xl lg:text-2xl font-bold mb-2 text-[hsl(var(--space-cyan))] break-words">
                    {round.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-[hsl(var(--space-gold))] text-[hsl(var(--space-gold))]">
                      {round.type}
                    </Badge>
                    <Badge variant="outline" className="border-[hsl(var(--space-violet))] text-[hsl(var(--space-violet))]">
                      {round.club}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className={`${blur ? 'blur-sm opacity-80' : ''} text-muted-foreground mb-4 leading-relaxed`}>
                {round.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[hsl(var(--space-cyan))]" />
                  <span>{formatDate(round.date)}</span>
                </div>
                {blur ? (
                  <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground italic">
                    <Lock className="w-3 h-3" />
                    <span>Details locked</span>
                  </div>
                ) : (
                  <div className="ml-auto text-xs text-muted-foreground italic">Click to view full details & form link</div>
                )}
              </div>
            </div>
          </div>

          {/* Reusable Modal */}
          <RoundModal
            isOpen={isModalOpen}
            onClose={closeModal}
            round={round}
            logo={clubLogos[round.club] || clubLogos['default']}
          />
        </div>
      </motion.div>
    </div>
  );
};
