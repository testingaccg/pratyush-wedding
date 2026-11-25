import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import RoyalArtwork from './RoyalArtwork';
import { soundEngine } from '../utils/soundEngine';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

export default function StoryGallery() {
  const [activeIdx, setActiveIdx] = useState(null);

  const openAt = (idx) => {
    soundEngine.playSoftTick();
    setActiveIdx(idx);
  };
  const close = () => {
    soundEngine.playSoftTick();
    setActiveIdx(null);
  };

  const prev = () => {
    soundEngine.playSoftTick();
    setActiveIdx((i) => (i === 0 ? WEDDING_DATA.gallery.length - 1 : i - 1));
  };
  const next = () => {
    soundEngine.playSoftTick();
    setActiveIdx((i) => (i === WEDDING_DATA.gallery.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    if (activeIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx]);

  return (
    <section id="story" className="scroll-mt-20 bg-cream/65 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: LUXURY_EASE }}
          className="text-center"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted">
            Our Journey
          </p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">
            Moments We Cherish
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic text-ink/75">
            Glimpses into our story—from unscripted laughs to the promises that carry us forward.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WEDDING_DATA.gallery.map((item, idx) => (
            <motion.button
              key={item.id}
              onClick={() => openAt(idx)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.06, ease: LUXURY_EASE }}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-sm border border-kansa/45 bg-ivory p-3 text-left shadow-sm transition-shadow hover:shadow-xl"
            >
              {/* Gold Foil Sheen Sweep */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-kansa-light/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
              />
              <div className="relative aspect-[4/3] overflow-hidden bg-indigoNight">
                <RoyalArtwork
                  variant={item.variant}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-sindoor/90 px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory">
                  {item.id} · {item.location}
                </span>
              </div>
              <div className="pt-3">
                <h3 className="font-serif text-xl font-semibold text-sindoor">
                  {item.title}
                </h3>
                <p className="mt-0.5 font-serif text-sm italic text-ink/75">
                  {item.subtitle}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => openAt(0)}
            className="inline-flex items-center gap-2 rounded-full bg-sindoor px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory shadow-md transition-colors hover:bg-sindoor-deep"
          >
            <Images className="h-4 w-4 text-kansa-light" />
            Open Full Story Carousel
          </motion.button>
        </div>
      </div>

      {/* Split-Pane Lightbox Modal with Thumbnail Strip */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-indigoNight/90 p-4 backdrop-blur-md"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.35, ease: LUXURY_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid w-full max-w-4xl overflow-hidden rounded-sm border border-kansa/55 bg-ivory shadow-2xl md:grid-cols-2"
            >
              <button
                onClick={close}
                aria-label="Close carousel"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-sindoor text-ivory transition-transform hover:scale-105 hover:bg-sindoor-deep"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative aspect-[4/3] overflow-hidden bg-indigoNight md:aspect-auto md:min-h-[380px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: LUXURY_EASE }}
                    className="h-full w-full"
                  >
                    <RoyalArtwork variant={WEDDING_DATA.gallery[activeIdx].variant} />
                  </motion.div>
                </AnimatePresence>
                <span className="absolute bottom-3 left-3 rounded-full bg-sindoor/90 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory">
                  {activeIdx + 1} / {WEDDING_DATA.gallery.length}
                </span>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, ease: LUXURY_EASE }}
                  >
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-kansa-muted">
                      {WEDDING_DATA.gallery[activeIdx].location}
                    </p>
                    <h3 className="mt-2 font-serif text-3xl font-semibold text-sindoor">
                      {WEDDING_DATA.gallery[activeIdx].title}
                    </h3>
                    <p className="mt-1 font-serif text-base italic text-kansa-muted">
                      {WEDDING_DATA.gallery[activeIdx].subtitle}
                    </p>
                    <p className="mt-5 font-serif text-lg leading-relaxed text-ink/85">
                      {WEDDING_DATA.gallery[activeIdx].story}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between border-t border-kansa/25 pt-4">
                  <button
                    onClick={prev}
                    className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sindoor hover:text-kansa-muted"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={next}
                    className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sindoor hover:text-kansa-muted"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 6-Thumbnail Strip */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-4 flex max-w-4xl items-center gap-2.5 overflow-x-auto px-2 py-1"
            >
              {WEDDING_DATA.gallery.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => openAt(i)}
                  aria-label={`View story ${i + 1}: ${g.title}`}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-sm border-2 transition-all ${
                    i === activeIdx
                      ? 'scale-105 border-kansa-light shadow-lg'
                      : 'border-ivory/25 opacity-60 hover:opacity-100'
                  }`}
                >
                  <RoyalArtwork variant={g.variant} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
