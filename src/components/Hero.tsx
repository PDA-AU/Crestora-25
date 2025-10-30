import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-space.jpg';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const Hero = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const firstActionRef = useRef<HTMLButtonElement | null>(null);

  const scrollToTimeline = () => {
    document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Open modal and focus first action
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // Redirect handlers
  const goParticipant = () => {
    // SPA-friendly redirect
    window.location.href = '/login';
  };

  const goOrganiser = () => {
    // Redirect to organiser dashboard (external)
    window.location.href = 'http://13.127.109.143:8080/login';
  };

  // Accessibility: focus first action when modal opens, close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLoginModalOpen(false);
      }
    };
    if (isLoginModalOpen) {
      window.addEventListener('keydown', onKey);
      // small timeout to ensure element is mounted
      setTimeout(() => firstActionRef.current?.focus(), 20);
    } else {
      window.removeEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [isLoginModalOpen]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          filter: 'brightness(0.4)',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--space-cyan))] via-[hsl(var(--space-violet))] to-[hsl(var(--space-gold))] px-4">
            CRESTORA'25
          </h1>
        </motion.div>

        <motion.p
          className="text-xl sm:text-2xl md:text-3xl font-light mb-4 text-foreground/90 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Beyond Limits – A Talent Odyssey
        </motion.p>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          of Personality Development Association
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-col gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Login Button -> opens modal */}
          <Button
            size="lg"
            onClick={openLoginModal}
            aria-label="Open login options"
            className="bg-[hsl(var(--space-cyan))] hover:bg-[hsl(var(--space-cyan))]/80 text-background font-orbitron text-lg px-8 py-6 shadow-[var(--shadow-neon)] hover:shadow-[0_0_30px_hsl(var(--space-cyan))] transition-all"
          >
            Login
          </Button>

          {/* WhatsApp Group Button */}
          <a
            href="https://chat.whatsapp.com/LCmsRUtkXIbJFsleaX8VIT?mode=ems_copy_t"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join WhatsApp Group"
          >
            <Button
              size="lg"
              className="mt-2 bg-green-500 text-background font-orbitron text-lg px-8 py-6 
                         shadow-[0_0_20px_#00ff88] hover:shadow-[0_0_35px_#00ff88] 
                         hover:bg-green-400 transition-all duration-300"
            >
              Join WhatsApp Group
            </Button>
          </a>

          {/* Explore Button */}
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToTimeline}
            className="border-[hsl(var(--space-gold))] text-[hsl(var(--space-gold))] hover:bg-[hsl(var(--space-gold))]/10 font-orbitron text-lg px-8 py-6"
          >
            Explore Journey
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-xs text-muted-foreground">
            Organized by PDA, MIT Campus, Anna University
          </p>
          <p className="text-xs text-muted-foreground">
            In collaboration with 12+ clubs
          </p>
        </motion.div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={closeLoginModal}
            aria-hidden
          />

          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            className="relative z-50 w-[min(640px,92%)] rounded-2xl bg-card/95 border border-border p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="login-modal-title" className="font-orbitron text-2xl font-bold text-[hsl(var(--space-cyan))]">
                  Choose Login Type
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select whether you're a participant or an organiser.
                </p>
              </div>

              <div>
                <button
                  onClick={closeLoginModal}
                  aria-label="Close login modal"
                  className="rounded-md px-3 py-1 text-sm border border-border bg-transparent hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Participant Card */}
              <div className="rounded-xl p-5 border border-[hsl(var(--space-cyan))]/20 bg-gradient-to-b from-transparent to-[hsl(var(--space-cyan))]/5">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-orbitron text-lg font-bold text-[hsl(var(--space-cyan))]">Participant</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Login to manage your team profile, submissions and view rounds.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Button
                        size="default"
                        onClick={goParticipant}
                        ref={firstActionRef}
                        className="bg-[hsl(var(--space-cyan))] text-background font-orbitron px-4 py-3 shadow-[0_0_20px_hsl(var(--space-cyan))] hover:brightness-95"
                      >
                        Login as Participant
                      </Button>

                  
                    </div>
                  </div>
                </div>
              </div>

              {/* Organiser Card */}
              <div className="rounded-xl p-5 border border-[hsl(var(--space-violet))]/20 bg-gradient-to-b from-transparent to-[hsl(var(--space-violet))]/5">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-orbitron text-lg font-bold text-[hsl(var(--space-violet))]">Organiser</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Organiser / Admin login for event management.
                    </p>
                    <div className="mt-4 flex gap-3">
                      <Button
                        size="default"
                        onClick={goOrganiser}
                        className="bg-[hsl(var(--space-violet))] text-background font-orbitron px-4 py-3 shadow-[0_0_20px_hsl(var(--space-violet))] hover:brightness-95"
                      >
                        Login as Organiser
                      </Button>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-muted-foreground">
              <div>Tip: Press <strong>Esc</strong> to close this dialog.</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};
