import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WEDDING_DATA } from '../data/weddingData';

export default function WaxSealIntro({ onEnter }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 950);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{ duration: 0.75, delay: isOpening ? 0.35 : 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-burgundy-deep"
      >
        {/* Left & Right Split Panels */}
        <motion.div
          animate={{ x: isOpening ? '-100%' : '0%' }}
          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-y-0 left-0 w-1/2 border-r border-gold/30 bg-burgundy"
        />
        <motion.div
          animate={{ x: isOpening ? '100%' : '0%' }}
          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-y-0 right-0 w-1/2 border-l border-gold/30 bg-burgundy"
        />

        {/* Rotating Subtle Mandala Watermark */}
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute h-[520px] w-[520px] text-gold/10 animate-slow-spin"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
        >
          <circle cx="100" cy="100" r="92" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="72" />
          <circle cx="100" cy="100" r="50" strokeDasharray="2 4" />
          {Array.from({ length: 16 }).map((_, i) => (
            <ellipse
              key={i}
              cx="100"
              cy="45"
              rx="10"
              ry="32"
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
        </svg>

        {/* Center Invitation Card */}
        <motion.div
          animate={{
            scale: isOpening ? 1.06 : 1,
            opacity: isOpening ? 0 : 1,
          }}
          transition={{ duration: 0.55 }}
          className="relative z-10 mx-4 flex max-w-md flex-col items-center rounded-sm border border-gold/45 bg-burgundy/90 px-8 py-12 text-center shadow-2xl backdrop-blur-sm sm:px-14 sm:py-16"
        >
          {/* Corner Brackets */}
          <span className="absolute left-3 top-3 h-5 w-5 border-l border-t border-gold/60" />
          <span className="absolute right-3 top-3 h-5 w-5 border-r border-t border-gold/60" />
          <span className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-gold/60" />
          <span className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-gold/60" />

          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-light">
            The Wedding Of
          </p>

          <h1 className="mt-4 font-script text-5xl text-ivory sm:text-6xl">
            {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
          </h1>

          <p className="mt-3 font-sans text-xs uppercase tracking-[0.25em] text-ivory/75">
            {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city}
          </p>

          {/* Interactive Wax Seal Button */}
          <button
            onClick={handleOpen}
            className="group relative mt-9 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-muted text-burgundy-deep shadow-[0_0_35px_rgba(197,160,89,0.45)] transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label="Open the wedding invitation"
          >
            <span className="absolute inset-1.5 rounded-full border border-burgundy/35" />
            <span className="absolute -inset-2 rounded-full border border-gold/35 animate-ping opacity-40" />
            <span className="font-serif text-xl font-bold tracking-widest">
              {WEDDING_DATA.couple.monogram}
            </span>
          </button>

          <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.22em] text-gold-light/85">
            Tap the seal to open
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
