import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';
import { useLang } from '../context/LangContext';

export default function Navbar() {
  const { lang, toggleLang } = useLang();
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

  const links =
    lang === 'bn'
      ? [
          { label: 'অনুষ্ঠান', href: '#celebrations' },
          { label: 'সাজ', href: '#attire' },
          { label: 'গল্প', href: '#story' },
          { label: 'তথ্য', href: '#concierge' },
        ]
      : [
          { label: 'Ceremony', href: '#celebrations' },
          { label: 'Attire', href: '#attire' },
          { label: 'Story', href: '#story' },
          { label: 'Guide', href: '#concierge' },
        ];

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-sindoor via-kansa to-sindoor-bright"
      />

      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Sections"
            className="fixed left-0 right-0 top-2.5 z-30 mx-auto max-w-3xl px-2.5 sm:px-4"
          >
            <div className="flex items-center justify-between rounded-full border border-kansa/45 bg-ivory/90 px-3 py-0.5 shadow-lg backdrop-blur-md sm:px-5">
              <a
                href="#"
                onClick={() => soundEngine.playSoftTick()}
                className="flex min-h-[44px] shrink-0 items-center px-1"
                aria-label="Back to top"
              >
                <span className="font-serif text-sm font-bold tracking-widest text-sindoor sm:hidden">
                  {WEDDING_DATA.couple.monogram}
                </span>
                <span className="hidden font-script text-2xl text-sindoor sm:inline">
                  {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
                </span>
              </a>

              <div className="flex items-center gap-0.5 sm:gap-2.5">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => soundEngine.playSoftTick()}
                    className={`flex min-h-[44px] items-center px-1.5 transition-colors hover:text-sindoor sm:px-2 ${
                      lang === 'bn'
                        ? 'font-bengali text-xs font-semibold text-ink/85'
                        : 'font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/80 sm:text-[11px] sm:tracking-[0.18em]'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playSoftTick();
                    toggleLang();
                  }}
                  aria-label={lang === 'en' ? 'Switch headings to Bengali' : 'Switch headings to English'}
                  className="ml-1 inline-flex min-h-[34px] items-center rounded-full border border-kansa/60 bg-cream px-2.5 font-sans text-[10px] font-semibold tracking-wider text-sindoor transition-colors hover:bg-sindoor hover:text-ivory"
                >
                  {lang === 'en' ? 'বাংলা' : 'EN'}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
