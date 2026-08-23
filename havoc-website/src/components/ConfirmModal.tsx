"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

type Props = {
  isOpen: boolean;
  options: ConfirmOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ isOpen, options, onConfirm, onCancel }: Props) {
  return (
    <AnimatePresence>
      {isOpen && options && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl overflow-hidden border border-black/5"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${options.destructive ? 'bg-red-50 text-red-500' : 'bg-zinc-100 text-black'}`}>
                {options.destructive ? <AlertTriangle size={24} /> : <Info size={24} />}
              </div>
              
              <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2">
                {options.title}
              </h3>
              
              <p className="text-sm font-medium text-black/60 mb-8 leading-relaxed">
                {options.message}
              </p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={onCancel}
                  className="flex-1 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-[11px] bg-zinc-100 text-black/60 hover:bg-zinc-200 hover:text-black transition-colors"
                >
                  {options.cancelText || "Cancel"}
                </button>
                <button 
                  onClick={onConfirm}
                  className={`flex-1 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-[11px] transition-colors ${
                    options.destructive 
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_14px_rgba(239,68,68,0.3)]' 
                      : 'bg-black text-white hover:bg-zinc-800 shadow-[0_4px_14px_rgba(0,0,0,0.15)]'
                  }`}
                >
                  {options.confirmText || "Confirm"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
