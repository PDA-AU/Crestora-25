// src/components/ui/Modal.tsx
import React from 'react';

export type ModalProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-background rounded-lg p-4 z-10 max-w-3xl w-full shadow-lg"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
