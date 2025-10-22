import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { RoundContent } from '@/data/roundContent';

interface RoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  roundNumber: number;
  roundName: string;
  content: RoundContent;
  logo: string;
}

export const RoundModal = ({ 
  isOpen, 
  onClose, 
  roundNumber, 
  roundName, 
  content, 
  logo 
}: RoundModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />

      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-round-${roundNumber}`}
        className="relative z-50 w-[min(920px,95%)] max-h-[90vh] overflow-auto rounded-2xl bg-card/95 border border-border p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[hsl(var(--space-cyan))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-cyan))]/30 p-2 flex items-center justify-center">
              <img src={logo} alt={`${roundName} logo`} className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="flex-1">
            <h2 id={`modal-title-round-${roundNumber}`} className="font-orbitron text-xl font-bold text-[hsl(var(--space-cyan))]">
              {content.title} — {content.subtitle || 'Full Details'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              All details & official submission link for this round.
            </p>
          </div>

          <div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-md px-3 py-1 text-sm border border-border bg-transparent hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="mt-4">
          {content.content}
        </div>

        {/* Contact Information */}
        {content.contact && content.contact.length > 0 && (
          <div className="mt-4">
            <strong>Contact:</strong>
            <div className="mt-1">
              {content.contact.map((contact, index) => (
                <div key={index}>
                  {contact.name} - {contact.phone}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {content.additionalInfo && (
          <div className="mt-4">
            {content.additionalInfo}
          </div>
        )}

        {/* Form link / actions */}
        {content.formUrl && (
          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-3">
            <button
              onClick={() => window.open(content.formUrl, '_blank')}
              className="rounded-lg px-4 py-2 bg-[hsl(var(--space-cyan))] text-background font-semibold shadow-sm hover:brightness-95"
            >
              Open Submission Google Form
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(content.formUrl!);
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
        )}
      </motion.div>
    </motion.div>
  );
};
