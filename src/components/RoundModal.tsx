import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, ExternalLink, Copy } from 'lucide-react';

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

interface RoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: Round;
  logo: string;
}

export const RoundModal = ({ 
  isOpen, 
  onClose, 
  round, 
  logo 
}: RoundModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    // You could add a toast notification here
  };

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
        aria-labelledby={`modal-title-round-${round.round_number}`}
        className="relative z-50 w-[min(920px,95%)] max-h-[90vh] overflow-auto rounded-2xl bg-card/95 border border-border p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[hsl(var(--space-cyan))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-cyan))]/30 p-2 flex items-center justify-center">
              <img src={logo} alt={`${round.name} logo`} className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="flex-1">
            <h2 id={`modal-title-round-${round.round_number}`} className="font-orbitron text-xl font-bold text-[hsl(var(--space-cyan))]">
              Round {round.round_number}: {round.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Organized by {round.club} • {round.type} Event
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

        {/* Event Details */}
        <div className="mt-6 space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-[hsl(var(--space-cyan))]" />
              <span className="font-medium">Date:</span>
              <span>{formatDate(round.date)}</span>
        </div>

            {round.venue && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[hsl(var(--space-cyan))]" />
                <span className="font-medium">Venue:</span>
                <span>{round.venue}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-[hsl(var(--space-cyan))]" />
              <span className="font-medium">Club:</span>
              <span>{round.club}</span>
                </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[hsl(var(--space-cyan))]" />
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                round.status === 'completed' ? 'bg-green-100 text-green-800' :
                round.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {round.status?.replace('_', ' ').toUpperCase() || 'UPCOMING'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-[hsl(var(--space-cyan))] mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {round.description}
            </p>
          </div>

          {/* Extended Description */}
          {round.extended_description && (
            <div>
              <h3 className="font-semibold text-[hsl(var(--space-cyan))] mb-2">Detailed Information</h3>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {round.extended_description}
              </div>
            </div>
          )}

          {/* Evaluation Criteria */}
          {round.criteria && (
            (() => {
              // Check if criteria has meaningful data
              const hasValidCriteria = () => {
                if (!round.criteria) return false;
                
                if (typeof round.criteria === 'string') {
                  return round.criteria.trim().length > 0;
                }
                
                if (Array.isArray(round.criteria)) {
                  return round.criteria.length > 0 && round.criteria.some(item => 
                    item && (item.name || item.title || item.criteria)
                  );
                }
                
                if (typeof round.criteria === 'object') {
                  return Object.keys(round.criteria).length > 0 && 
                         Object.values(round.criteria).some(value => 
                           value !== null && value !== undefined && value !== ''
                         );
                }
                
                return false;
              };

              return hasValidCriteria() ? (
                <div>
                  <h3 className="font-semibold text-[hsl(var(--space-cyan))] mb-2">Evaluation Criteria</h3>
                  <div className="text-sm text-muted-foreground">
                    {typeof round.criteria === 'string' ? (
                      <p className="whitespace-pre-line">{round.criteria}</p>
                    ) : Array.isArray(round.criteria) ? (
                      <div className="space-y-2">
                        {round.criteria.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium">{item.name || item.title || item.criteria}</span>
                            {item.max_points && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {item.max_points} points
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="list-disc ml-4 space-y-1">
                        {Object.entries(round.criteria).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {String(value)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : null;
            })()
          )}


          {/* Contact Information */}
          {(() => {
            // Check if there's meaningful contact data
            const hasValidContact = () => {
              if (!round.contact) return false;
              
              if (typeof round.contact === 'string') {
                return round.contact.trim().length > 0;
              }
              
              if (Array.isArray(round.contact)) {
                return round.contact.length > 0 && round.contact.some(contact => 
                  contact && String(contact).trim().length > 0
                );
              }
              
              return String(round.contact).trim().length > 0;
            };

            return hasValidContact() ? (
              <div>
                <h3 className="font-semibold text-[hsl(var(--space-cyan))] mb-2">Contact Information</h3>
                <div className="text-sm text-muted-foreground">
                  {typeof round.contact === 'string' ? (
                    <p>{round.contact}</p>
                  ) : Array.isArray(round.contact) ? (
                    <div className="space-y-1">
                      {round.contact
                        .filter(contact => contact && String(contact).trim().length > 0)
                        .map((contact: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{contact}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{String(round.contact)}</p>
                  )}
                </div>
              </div>
            ) : null;
          })()}
        </div>

        {/* Form link / actions */}
        {round.form_link && round.form_link.trim().length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <button
                onClick={() => window.open(round.form_link, '_blank')}
                className="rounded-lg px-4 py-2 bg-[hsl(var(--space-cyan))] text-background font-semibold shadow-sm hover:brightness-95 flex items-center gap-2"
            >
                <ExternalLink className="w-4 h-4" />
                Open Submission Form
            </button>

            <button
                onClick={() => copyToClipboard(round.form_link!)}
                className="rounded-lg px-3 py-2 border border-border text-sm hover:bg-muted flex items-center gap-2"
              title="Copy form link"
            >
                <Copy className="w-4 h-4" />
              Copy Form Link
            </button>

            <div className="ml-auto text-xs text-muted-foreground">
              <div>Click outside or press <strong>Esc</strong> to close.</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
