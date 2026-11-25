import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';

/** Hand-drawn rose petal cluster, matching the canvas petals. */
function PetalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden="true">
      <ellipse cx="9" cy="13" rx="4.2" ry="6.8" transform="rotate(-28 9 13)" fill="#E89BA7" />
      <ellipse cx="15" cy="11.5" rx="3.8" ry="6.2" transform="rotate(24 15 11.5)" fill="#F2C6C2" />
      <ellipse cx="12" cy="9" rx="2.6" ry="4.6" fill="#E6CA7E" />
      <path d="M12 5.5 V12" stroke="#C59B38" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Floating "shower petals" blessing button (bottom-left, mirroring the music
 * toggle). Petals burst from the button itself. A label introduces it for a
 * few seconds, then it settles into a quiet icon with a blessing counter.
 */
export default function PetalButton() {
  const [blessings, setBlessings] = useState(108);
  const [showLabel, setShowLabel] = useState(true);
  const btnRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setShowLabel(false), 4500);
    return () => clearTimeout(t);
  }, []);

  const shower = () => {
    setBlessings((b) => b + 1);
    setShowLabel(false);
    soundEngine.playHoludSplash();
    try {
      navigator.vibrate?.(10);
    } catch {
      /* no haptics on this device */
    }
    const r = btnRef.current?.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('wedding-petal-burst', {
        detail: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined,
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 z-40 flex items-center gap-2.5"
    >
      <motion.button
        ref={btnRef}
        type="button"
        onClick={shower}
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', duration: 0.35, bounce: 0.3 }}
        aria-label={`Shower petals for the couple — ${blessings} blessings sent`}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-kansa/70 bg-ivory shadow-xl transition-colors hover:bg-cream"
      >
        <PetalIcon />
        {/* Blessing counter — pops on each tap */}
        <span className="absolute -right-1.5 -top-1.5 overflow-hidden rounded-full bg-sindoor px-1.5 py-0.5 font-sans text-[10px] font-semibold leading-none tabular-nums text-ivory shadow-md ring-2 ring-ivory">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={blessings}
              initial={{ y: reduced ? 0 : -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduced ? 0 : 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="block"
            >
              {blessings}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>

      <AnimatePresence>
        {showLabel && (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, x: reduced ? 0 : -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -6 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-none rounded-full border border-kansa/55 bg-ivory/95 px-3.5 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-sindoor shadow-lg backdrop-blur-md"
          >
            Tap to shower petals
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
