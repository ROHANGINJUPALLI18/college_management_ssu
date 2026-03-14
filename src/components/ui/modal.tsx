import React from "react";
import { X } from "lucide-react";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      {/* Container for the modal content */}
      <div className="relative z-[110] w-full max-w-[480px] px-4 animate-in zoom-in-95 duration-200">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <button
            type="button"
            className="absolute top-5 right-5 z-[120] flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white transition-all hover:bg-black/40 hover:scale-110 active:scale-95"
            onClick={onClose}
          >
            <X size={18} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
