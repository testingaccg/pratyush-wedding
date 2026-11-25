import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';

/**
 * Twin Lotus-Arch Courtyard Doors Intro:
 * Tapping parts the ornate ivory-and-gold courtyard doors to reveal the celebration.
 */
export default function ShubhoDrishtiIntro({ onEnter }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    soundEngine.playShubhoDrishti();
    setTimeout(onEnter, 1000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: opening ? 0 : 1, scale: opening ? 1.04 : 1 }}
        transition={{ duration: 0.75, delay: opening ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-sindoor-deep"
      >
        {/* Rotating Antique Gold Mandala Backdrop */}
        <svg
          viewBox="0 0 240 240"
          className="pointer-events-none absolute h-[620px] w-[620px] animate-slow-spin text-kansa-light opacity-20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
        >
          <circle cx="120" cy="120" r="108" strokeDasharray="4 4" />
          <circle cx="120" cy="120" r="84" />
          <circle cx="120" cy="120" r="58" strokeDasharray="2 5" />
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d="M120 22 Q132 52 120 82 Q108 52 120 22 Z"
              transform={`rotate(${i * 22.5} 120 120)`}
            />
          ))}
        </svg>

        {/* Center Heritage Folio */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-4 flex max-w-md flex-col items-center rounded-sm border border-kansa/60 bg-ivory px-8 py-12 text-center shadow-2xl sm:px-14 sm:py-14"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted">
            The Wedding Celebration Of
          </p>

          {/* Interactive Twin Lotus Doors */}
          <button
            onClick={handleOpen}
            aria-label="Open the wedding invitation doors"
            className="group relative my-8 block h-44 w-60 overflow-hidden rounded-t-full border-2 border-kansa/70 bg-cream focus:outline-none"
          >
            {/* Revealed Names Behind Doors */}
            <motion.div
              animate={{
                scale: opening ? 1.06 : 0.94,
                opacity: opening ? 1 : 0.35,
              }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center px-3"
            >
              <span className="font-script text-3xl text-sindoor">
                {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
              </span>
              <span className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
                {WEDDING_DATA.couple.dateRange}
              </span>
            </motion.div>

            {/* Left Door */}
            <motion.div
              animate={{ x: opening ? '-100%' : '0%' }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 flex w-1/2 items-center justify-end border-r border-kansa/70 bg-sindoor pr-2 shadow-md"
            >
              <span className="h-6 w-1 rounded-full bg-kansa-light transition-transform group-hover:scale-110" />
            </motion.div>

            {/* Right Door */}
            <motion.div
              animate={{ x: opening ? '100%' : '0%' }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-start border-l border-kansa/70 bg-sindoor pl-2 shadow-md"
            >
              <span className="h-6 w-1 rounded-full bg-kansa-light transition-transform group-hover:scale-110" />
            </motion.div>

            {/* Dead-Centered Medallion */}
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <motion.div
                animate={{ opacity: opening ? 0 : 1, scale: opening ? 1.2 : 1 }}
                transition={{ duration: 0.35 }}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-kansa-light bg-ivory text-sindoor shadow-xl transition-transform duration-300 group-hover:scale-110"
              >
                <span className="font-serif text-sm font-bold tracking-widest">
                  {WEDDING_DATA.couple.monogram}
                </span>
              </motion.div>
            </div>
          </button>

          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-sindoor">
            Tap the doors to enter
          </p>
          <p className="mt-1.5 font-serif text-sm italic text-ink/70">
            {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
