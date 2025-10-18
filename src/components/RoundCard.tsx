import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Import logos
import round1Logo from '@/assets/logos/round1.png';
import round2Logo from '@/assets/logos/round2.png';
import round3Logo from '@/assets/logos/round3.png';
import round4Logo from '@/assets/logos/round4.png';
import round5Logo from '@/assets/logos/round5.png';
import round6Logo from '@/assets/logos/round6.png';
import round7Logo from '@/assets/logos/round7.png';
import round8Logo from '@/assets/logos/round8.png';

const roundLogos: Record<number, string> = {
  1: round1Logo,
  2: round2Logo,
  3: round3Logo,
  4: round4Logo,
  5: round5Logo,
  6: round6Logo,
  7: round7Logo,
  8: round8Logo,
};

interface Round {
  id: string;
  round_number: number;
  name: string;
  club: string;
  type: string;
  date: string;
  description: string;
}

interface RoundCardProps {
  round: Round;
  index: number;
  blur?: boolean;
}

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdF2RndaINy13_wv_b0ulYwg2iCCJ-k7nj3zwjtU55v7DgfrA/viewform?usp=header';

export const RoundCard = ({ round, index, blur = false }: RoundCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;

  // Modal state — only enabled for Round 1 by default
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalOpenable = round.round_number === 1; // change to true to allow all rounds

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    if (isModalOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  const openModal = () => {
    if (!modalOpenable) return;
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
          <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--space-cyan))] to-[hsl(var(--space-violet))] rounded-2xl opacity-20 group-hover:opacity-40 blur transition-opacity" />

          <div
            onClick={openModal}
            role={modalOpenable ? 'button' : undefined}
            tabIndex={modalOpenable ? 0 : -1}
            className={`${modalOpenable ? 'cursor-pointer' : ''}`}
          >
            <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 transition-transform group-hover:scale-[1.02]">
              {/* Logo Section */}
              <div className="flex items-start gap-6 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-gradient-to-br from-[hsl(var(--space-cyan))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-cyan))]/30 p-3 flex items-center justify-center">
                    <img
                      src={roundLogos[round.round_number]}
                      alt={`${round.name} logo`}
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
                {modalOpenable && (
                  <div className="ml-auto text-xs text-muted-foreground italic">Click to view full details & form link</div>
                )}
              </div>
            </div>
          </div>

          {/* Modal: only show full details (no form inputs) */}
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-black/60" onClick={closeModal} aria-hidden />

              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-title-round-${round.round_number}`}
                className="relative z-50 w-[min(920px,95%)] max-h-[90vh] overflow-auto rounded-2xl bg-card/95 border border-border p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[hsl(var(--space-cyan))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-cyan))]/30 p-2 flex items-center justify-center">
                      <img src={roundLogos[round.round_number]} alt="" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 id={`modal-title-round-${round.round_number}`} className="font-orbitron text-xl font-bold text-[hsl(var(--space-cyan))]">
                      {round.name} — Full Details
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">All details & official submission link for this round.</p>
                  </div>

                  <div>
                    <button
                      onClick={closeModal}
                      aria-label="Close modal"
                      className="rounded-md px-3 py-1 text-sm border border-border bg-transparent hover:bg-muted"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Content: exact text you provided */}
                <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <div className="text-lg font-semibold">🌟✨ PDA MIT Presents — CRESTORA’25 (ODD SEM SIGNATURE EVENT) ✨🌟</div>

                  <div>
                    <strong>🎯 Round 1:</strong> “Team Identity — The Creative Prelude”
                  </div>

                  <div className="space-y-1">
                    <strong>📅 Event Duration:</strong>
                    <div>🕚 Starts: 18th Oct, 11:00 AM</div>
                    <div>🕚 Ends: 19th Oct, 11:00 AM</div>
                    <div>⏰ Total Duration: 24 hours</div>
                  </div>

                  <div><strong>💻 Mode:</strong> ONLINE ROUND 🌐</div>

                  <div>
                    <strong>🎬 ROUND DETAILS:</strong>
                    <div>
                      This round is all about introducing your team — let the world know who you are in the most creative, spontaneous, and original way possible!
                    </div>
                    <div className="mt-2">
                      Your team introduction can be in any form —
                      <ul className="list-disc ml-6 mt-1">
                        <li>A website</li>
                        <li>A video</li>
                        <li>An article</li>
                        <li>A meme</li>
                        <li>Anything unique that speaks for your team’s name, spirit, and originality!</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <strong>📩 Submission:</strong>
                    <div>You will be given a Google Form to submit your works. Submit your work as a link in the form.</div>
                  </div>

                  <div>
                    <strong>⚠️ GUIDELINES (STRICTLY TO BE FOLLOWED):</strong>
                    <ul className="list-disc ml-6 mt-1">
                      <li>🚫 No Plagiarism — originality is key.</li>
                      <li>🤖 Excessive dependency on AI tools = score reduction.</li>
                      <li>❌ Vulgarity or personal offense = direct disqualification.</li>
                      <li>🧠 No lame excuses! This round tests your critical thinking, spontaneity & creativity.</li>
                    </ul>
                  </div>

                  <div>
                    <strong>🏆 EVALUATION CRITERIA:</strong>
                    <div className="ml-6">
                      <div>✨ Professionalism</div>
                      <div>✨ Clarity</div>
                      <div>✨ Team Spirit</div>
                      <div>✨ Individuality</div>
                      <div>✨ Content Creation</div>
                    </div>
                  </div>

                  <div>
                    <strong>💥 BONUS:</strong> Add a creative record of your team’s strengths to earn extra points!
                  </div>

                  <div>
                    <strong>Contact:</strong>
                    <div>Ms. Akshaya Gothandabani - +91 88387 42309</div>
                    <div>Ms. Dhivya - 9080682474</div>
                  </div>

                  <div className="pt-2">
                    <strong>🔥 Showcase your identity. Unleash your creativity. Leave your mark.</strong>
                    <div>💫 Let CRESTORA’25 witness your team’s spark!</div>
                    <div className="mt-2 font-semibold">📣 All the best, warriors of PDA! 💪</div>
                  </div>
                </div>

                {/* Form link / actions */}
                <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-3">
                  <button
                    onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
                    className="rounded-lg px-4 py-2 bg-[hsl(var(--space-cyan))] text-background font-semibold shadow-sm hover:brightness-95"
                  >
                    Open Submission Google Form
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(GOOGLE_FORM_URL);
                    }}
                    className="rounded-lg px-3 py-2 border border-border text-sm"
                    title="Copy form link"
                  >
                    Copy Form Link
                  </button>

                  <div className="ml-auto text-xs text-muted-foreground">
                    <div>Click outside or press <strong>Esc</strong> to close.</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          {/* end modal */}
        </div>
      </motion.div>
    </div>
  );
};
