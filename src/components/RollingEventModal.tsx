import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, ExternalLink, Copy } from 'lucide-react';

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
  contact?: string | string[];
  venue?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  event_id?: string;
  event_code?: string;
}

interface RollingEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: RollingEvent;
  logo: string;
}

export const RollingEventModal = ({ 
  isOpen, 
  onClose, 
  event, 
  logo 
}: RollingEventModalProps) => {
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
        aria-labelledby={`modal-title-event-${event.id}`}
        className="relative z-50 w-[min(920px,95%)] max-h-[90vh] overflow-auto rounded-2xl bg-card/95 border border-border p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[hsl(var(--space-gold))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-gold))]/30 p-2 flex items-center justify-center">
              <img src={logo} alt={`${event.name} logo`} className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="flex-1">
            <h2 id={`modal-title-event-${event.id}`} className="font-orbitron text-xl font-bold text-[hsl(var(--space-gold))]">
              {event.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Organized by {event.club} • {event.type} Event
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
              <Calendar className="w-4 h-4 text-[hsl(var(--space-gold))]" />
              <span className="font-medium">Date:</span>
              <span>{formatDate(event.date)}</span>
            </div>
            
            {event.venue && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-[hsl(var(--space-gold))]" />
                <span className="font-medium">Venue:</span>
                <span>{event.venue}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-[hsl(var(--space-gold))]" />
              <span className="font-medium">Club:</span>
              <span>{event.club}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[hsl(var(--space-gold))]" />
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                event.status === 'completed' ? 'bg-green-100 text-green-800' :
                event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {event.status?.replace('_', ' ').toUpperCase() || 'UPCOMING'}
              </span>
            </div>
          </div>

          {/* Event Period */}
          {(event.start_date || event.end_date) && (
            <div>
              <h3 className="font-semibold text-[hsl(var(--space-gold))] mb-2">Event Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {event.start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[hsl(var(--space-gold))]" />
                    <span className="font-medium">Start Date:</span>
                    <span>{formatDate(event.start_date)}</span>
                  </div>
                )}
                {event.end_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[hsl(var(--space-gold))]" />
                    <span className="font-medium">End Date:</span>
                    <span>{formatDate(event.end_date)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-[hsl(var(--space-gold))] mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Extended Description */}
          {event.extended_description && (
            <div>
              <h3 className="font-semibold text-[hsl(var(--space-gold))] mb-2">Detailed Information</h3>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {event.extended_description}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {event.contact && (
            <div>
              <h3 className="font-semibold text-[hsl(var(--space-gold))] mb-2">Contact Information</h3>
              <div className="text-sm text-muted-foreground">
                {Array.isArray(event.contact) ? (
                  <div className="space-y-1">
                    {event.contact.map((contact, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{contact}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{event.contact}</p>
                )}
              </div>
            </div>
          )}

          {/* Event Code */}
          {event.event_code && (
            <div>
              <h3 className="font-semibold text-[hsl(var(--space-gold))] mb-2">Event Code</h3>
              <div className="text-sm text-muted-foreground">
                <code className="bg-muted px-2 py-1 rounded">{event.event_code}</code>
              </div>
            </div>
          )}
        </div>

        {/* Form link / actions */}
        {event.form_link && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <button
                onClick={() => window.open(event.form_link, '_blank')}
                className="rounded-lg px-4 py-2 bg-[hsl(var(--space-gold))] text-background font-semibold shadow-sm hover:brightness-95 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Registration Form
              </button>

              <button
                onClick={() => copyToClipboard(event.form_link!)}
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
