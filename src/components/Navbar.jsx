import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';

export default function Navbar() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setVisible(latest > 260);
    });
  }, [scrollY]);

  return (
    <>
      {/* Continuous Top Reading/Scroll Progress Thread */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-sindoor via-kansa to-sindoor-bright"
      />

      {/* Sticky Minimal Glass Nav */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 right-0 top-2.5 z-30 mx-auto max-w-3xl px-3 sm:px-4"
          >
            <div className="flex items-center justify-between rounded-full border border-kansa/45 bg-ivory/90 px-4 py-2 shadow-lg backdrop-blur-md sm:px-5 sm:py-2.5">
              <a
                href="#"
                onClick={() => soundEngine.playSoftTick()}
                className="shrink-0"
                aria-label="Back to top"
              >
                <span className="font-serif text-sm font-bold tracking-widest text-sindoor sm:hidden">
                  {WEDDING_DATA.couple.monogram}
                </span>
                <span className="hidden font-script text-2xl text-sindoor sm:inline">
                  {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
                </span>
              </a>

              <div className="flex items-center gap-3.5 sm:gap-6">
                {[
                  { label: 'Rituals', href: '#celebrations' },
                  { label: 'Story', href: '#story' },
                  { label: 'Guide', href: '#concierge' },
                  { label: 'RSVP', href: '#rsvp' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => soundEngine.playSoftTick()}
                    className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/80 transition-colors hover:text-sindoor sm:text-[11px] sm:tracking-[0.18em]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
