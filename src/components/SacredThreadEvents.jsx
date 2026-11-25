import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { MapPin, CalendarPlus, CalendarHeart, Sparkles, Check, Flame } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';
import { googleCalendarUrl, downloadWeddingIcs } from '../utils/calendar';
import { toast } from '../utils/toast';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

/* 1. Henna Lotus Bloom (Mehendi) */
function HennaReveal({ onReveal }) {
  const [blooming, setBlooming] = useState(false);

  const trigger = () => {
    if (blooming) return;
    setBlooming(true);
    soundEngine.playKansaThali();
    setTimeout(onReveal, 650);
  };

  return (
    <div className="flex flex-col items-center justify-center py-7 text-center">
      <motion.button
        onClick={trigger}
        aria-label="Tap the lotus to bloom the henna pattern"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-kansa bg-gradient-to-br from-kansa-light/35 via-ivory to-cream shadow-lg"
      >
        <svg viewBox="0 0 100 100" className="h-20 w-20 text-sindoor">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.ellipse
              key={i}
              cx="50"
              cy="28"
              rx="8"
              ry="18"
              fill={blooming ? '#C59B38' : 'none'}
              fillOpacity={blooming ? 0.35 : 0}
              stroke="currentColor"
              strokeWidth="1.4"
              transform={`rotate(${i * 45} 50 50)`}
              animate={{ scale: blooming ? 1.18 : 1 }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            />
          ))}
          <circle cx="50" cy="50" r="8" fill="#A61C24" />
        </svg>
      </motion.button>
      <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
        Tap the lotus to bloom the henna pattern
      </p>
    </div>
  );
}

/* 2. Turmeric & Marigold Splash (Haldi) */
function HoludReveal({ onReveal }) {
  const [splashed, setSplashed] = useState(false);

  const trigger = () => {
    if (splashed) return;
    setSplashed(true);
    soundEngine.playHoludSplash();
    setTimeout(onReveal, 650);
  };

  return (
    <div className="flex flex-col items-center justify-center py-7 text-center">
      <motion.button
        onClick={trigger}
        aria-label="Tap to shower turmeric and marigold"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#E8B923] bg-[#FFF8DC] shadow-md"
      >
        {splashed && (
          <>
            <motion.span
              initial={{ scale: 0.4, opacity: 0.95 }}
              animate={{ scale: 2.3, opacity: 0 }}
              transition={{ duration: 0.65, ease: LUXURY_EASE }}
              className="absolute inset-0 rounded-full bg-[#E8B923]"
            />
            <motion.span
              initial={{ scale: 0.3, opacity: 0.85 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="absolute inset-0 rounded-full bg-terracotta/40"
            />
          </>
        )}
        <span className="font-serif text-lg font-bold tracking-wide text-[#9A6B00]">
          Haldi Glow
        </span>
      </motion.button>
      <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
        Tap to shower turmeric &amp; marigold
      </p>
    </div>
  );
}

/* 3. Strike the Royal Dhol (Sangeet) */
function DholReveal({ onReveal }) {
  const [beats, setBeats] = useState(0);

  const strike = () => {
    if (beats >= 2) return;
    const next = beats + 1;
    setBeats(next);
    soundEngine.playDhakBeat(next >= 2);
    if (next >= 2) {
      setTimeout(onReveal, 420);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-7 text-center">
      <motion.button
        onClick={strike}
        aria-label="Tap the dhol twice to begin Sangeet"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.88 }}
        animate={beats === 1 ? { rotate: [-5, 5, -4, 0], scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.35 }}
        className="relative flex h-28 w-28 items-center justify-center rounded-full border border-kansa bg-indigoNight text-kansa-light shadow-lg"
      >
        {beats >= 1 && (
          <motion.span
            key={beats}
            initial={{ scale: 0.9, opacity: 0.9 }}
            animate={{ scale: 2.0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full border-2 border-kansa"
          />
        )}
        <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="14" y="20" width="36" height="24" rx="8" fill="#C59B38" fillOpacity="0.22" />
          <ellipse cx="14" cy="32" rx="4" ry="12" />
          <ellipse cx="50" cy="32" rx="4" ry="12" />
          <path d="M22 20 L28 44 M36 20 L42 44 M28 20 L22 44 M42 20 L36 44" strokeWidth="1.5" />
        </svg>
      </motion.button>
      <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
        {beats === 0 ? 'Tap the dhol twice to strike the beat' : 'One more tap! Feel the rhythm'}
      </p>
    </div>
  );
}

/* 4. Seven Sacred Steps / Saptapadi (The Wedding) */
function SaptapadiReveal({ onReveal }) {
  const [step, setStep] = useState(0);

  const advance = () => {
    if (step >= 7) return;
    const next = step + 1;
    soundEngine.playSaatPaakStep(step);
    setStep(next);
    if (next >= 7) {
      setTimeout(onReveal, 420);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="flex items-center gap-2.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.span
            key={i}
            animate={i < step ? { scale: [1, 1.35, 1.1] } : {}}
            transition={{ duration: 0.3 }}
            className={`h-3 w-3 rounded-full border transition-colors ${
              i < step
                ? 'border-sindoor bg-sindoor'
                : 'border-kansa/60 bg-cream'
            }`}
          />
        ))}
      </div>

      <motion.button
        onClick={advance}
        aria-label={`Tap through seven sacred vows — ${step} of 7 taken`}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        animate={{ rotate: step * 51.4 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="mt-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-sindoor bg-ivory text-sindoor shadow-md"
      >
        <div style={{ transform: `rotate(${-step * 51.4}deg)` }} className="text-center transition-transform">
          <span className="block font-serif text-base font-bold">7 Vows</span>
          <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">
            {step} / 7
          </span>
        </div>
      </motion.button>

      <button
        onClick={() => {
          soundEngine.playSaatPaakStep(6);
          onReveal();
        }}
        className="mt-2 min-h-[44px] px-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-sindoor underline underline-offset-4 hover:text-kansa-muted"
      >
        Or unveil the wedding details now
      </button>
    </div>
  );
}

/* 5. Light the Sacred Diya (The Reception) */
function DiyaReveal({ onReveal }) {
  const [lit, setLit] = useState(false);

  const lightUp = () => {
    if (lit) return;
    setLit(true);
    soundEngine.playPradipLit();
    setTimeout(onReveal, 650);
  };

  return (
    <div className="flex flex-col items-center justify-center py-7 text-center">
      <motion.button
        onClick={lightUp}
        aria-label="Tap to light the diya for The Reception"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        className={`relative flex h-28 w-28 items-center justify-center rounded-full border-2 transition-all duration-500 ${
          lit
            ? 'border-kansa bg-sindoor text-kansa-light shadow-[0_0_40px_rgba(197,155,56,0.7)]'
            : 'border-terracotta/60 bg-cream text-terracotta'
        }`}
      >
        {lit && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 rounded-full bg-kansa/45"
          />
        )}
        <Flame className={`h-10 w-10 ${lit ? 'animate-pulse text-[#FFE699]' : ''}`} />
      </motion.button>
      <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
        Tap to light the evening diya
      </p>
    </div>
  );
}

export default function SacredThreadEvents() {
  const [revealedIds, setRevealedIds] = useState([]);
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 65%'],
  });
  const threadProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
  });

  const markRevealed = (id) => {
    setRevealedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const revealAll = () => {
    soundEngine.playShubhoDrishti();
    setRevealedIds(WEDDING_DATA.events.map((e) => e.id));
  };

  return (
    <section id="celebrations" className="relative mx-auto max-w-4xl scroll-mt-20 px-4 py-20 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.7, ease: LUXURY_EASE }}
        className="text-center"
      >
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted">
          The Celebrations
        </p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">
          Five Rituals of Forever
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic text-ink/75">
          Four days of colour, music, sacred vows, and unforgettable celebrations.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {revealedIds.length < WEDDING_DATA.events.length && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={revealAll}
              className="min-h-[44px] rounded-full border border-sindoor bg-ivory px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-sindoor transition-colors hover:bg-sindoor hover:text-ivory"
            >
              Unveil All 5 Events
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundEngine.playPradipLit();
              downloadWeddingIcs();
              toast('All 5 celebrations added — open the file to save to your calendar');
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sindoor px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory shadow-md transition-colors hover:bg-sindoor-deep"
          >
            <CalendarHeart aria-hidden="true" className="h-4 w-4 text-kansa-light" />
            Add All 5 to Calendar (.ics)
          </motion.button>
        </div>
        <p aria-live="polite" className="mt-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
          {revealedIds.length} of {WEDDING_DATA.events.length} rituals unveiled
        </p>
      </motion.div>

      <div ref={timelineRef} className="relative mt-14 space-y-10">
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-6 top-8 hidden w-px bg-kansa/20 sm:block"
        />
        <motion.div
          aria-hidden="true"
          style={{ scaleY: threadProgress }}
          className="absolute bottom-8 left-6 top-8 hidden w-0.5 origin-top bg-gradient-to-b from-sindoor via-kansa to-sindoor sm:block"
        />

        {WEDDING_DATA.events.map((ev, index) => {
          const isRevealed = revealedIds.includes(ev.id);

          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.5, delay: index * 0.04, ease: LUXURY_EASE }}
              className="relative sm:pl-16"
            >
              <motion.div
                animate={isRevealed ? { scale: [1, 1.25, 1] } : {}}
                transition={{ duration: 0.4 }}
                className={`absolute left-3.5 top-8 hidden h-5 w-5 items-center justify-center rounded-full border transition-colors sm:flex ${
                  isRevealed
                    ? 'border-sindoor bg-sindoor text-ivory shadow-[0_0_12px_rgba(166,28,36,0.45)]'
                    : 'border-kansa bg-ivory text-sindoor'
                }`}
              >
                {isRevealed ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-sindoor" />}
              </motion.div>

              <div className="rajbari-frame group bg-ivory p-6 shadow-sm transition-shadow duration-500 hover:shadow-xl sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-kansa/25 pb-4">
                  <div>
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-kansa-muted">
                      {ev.number} · {ev.eyebrow}
                    </span>
                    <h3 className="mt-1 font-serif text-3xl font-semibold text-sindoor">
                      {ev.title}
                    </h3>
                  </div>

                  {isRevealed && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-kansa/55 bg-cream px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-sindoor"
                    >
                      <Sparkles className="h-3 w-3 text-kansa" />
                      Unveiled
                    </motion.span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {!isRevealed ? (
                    <motion.div
                      key="locked"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.35 }}
                      className="pt-4"
                    >
                      {ev.revealType === 'henna' && <HennaReveal onReveal={() => markRevealed(ev.id)} />}
                      {ev.revealType === 'holud' && <HoludReveal onReveal={() => markRevealed(ev.id)} />}
                      {ev.revealType === 'dhol' && <DholReveal onReveal={() => markRevealed(ev.id)} />}
                      {ev.revealType === 'saptapadi' && <SaptapadiReveal onReveal={() => markRevealed(ev.id)} />}
                      {ev.revealType === 'diya' && <DiyaReveal onReveal={() => markRevealed(ev.id)} />}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: LUXURY_EASE }}
                      className="pt-5"
                    >
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sindoor">
                            {ev.date}
                          </p>
                          <p className="mt-1 font-sans text-sm text-ink/80">{ev.time}</p>
                          <p className="mt-2 font-serif text-lg font-semibold text-ink">
                            {ev.venue} · {ev.city}
                          </p>
                        </div>

                        <div className="flex flex-col justify-between">
                          <p className="font-serif text-base italic leading-relaxed text-ink/80">
                            {ev.description}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-kansa/60"
                              style={{ backgroundColor: ev.dressColor }}
                            />
                            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-kansa-muted">
                              Attire · {ev.dressCode}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3 border-t border-kansa/20 pt-4">
                        <a
                          href={ev.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => soundEngine.playSoftTick()}
                          aria-label={`Get directions to ${ev.venue} for ${ev.title}`}
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sindoor px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory transition-all hover:-translate-y-0.5 hover:bg-sindoor-deep"
                        >
                          <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-kansa-light" />
                          Get Directions
                        </a>

                        {(
                          <a
                            href={googleCalendarUrl(ev)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => soundEngine.playSoftTick()}
                            aria-label={`Add ${ev.title} to Google Calendar`}
                            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-kansa bg-cream px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sindoor transition-all hover:-translate-y-0.5 hover:bg-kansa/20"
                          >
                            <CalendarPlus aria-hidden="true" className="h-3.5 w-3.5" />
                            Add to Calendar
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
