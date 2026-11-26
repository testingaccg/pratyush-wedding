import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import RoyalArtwork from './RoyalArtwork';
import { AlponaMandala, ToporMukutEmblem, ShankhaIcon } from './BengaliMotifs';
import { soundEngine } from '../utils/soundEngine';
import { GUEST } from '../utils/guest';
import { getSchedule, now } from '../utils/schedule';
import { useLang } from '../context/LangContext';

/** Ticks every second; re-targets automatically through the wedding week. */
function useLiveCountdown() {
  const calc = () => {
    const schedule = getSchedule();
    const diff = schedule.target ? Math.max(0, schedule.target - now()) : 0;
    return {
      schedule,
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function LiveBanner({ event }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      className="mx-auto mb-4 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-sindoor/40 bg-sindoor px-4 py-2 text-ivory shadow-lg lg:mx-0"
    >
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kansa-light opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-kansa-light" />
      </span>
      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">
        Happening now · {event.title}
      </span>
      <a
        href={event.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-[32px] items-center gap-1 font-serif text-sm italic text-kansa-light underline-offset-4 hover:underline"
      >
        <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
        {event.venue}
      </a>
    </motion.div>
  );
}

const LUXURY_EASE = [0.22, 1, 0.36, 1];

export default function HeroSection() {
  const { lang } = useLang();
  const countdown = useLiveCountdown();
  const { schedule } = countdown;
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const archY = useTransform(scrollYProgress, [0, 1], [0, 42]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  return (
    <header ref={heroRef} className="relative overflow-hidden">
      {/* Rotating Bengali Alpona Mandalas in the background */}
      <AlponaMandala
        className="absolute -left-24 -top-20 hidden h-72 w-72 lg:block"
        opacity={0.14}
        duration={95}
      />
      <AlponaMandala
        className="absolute -right-24 bottom-4 hidden h-64 w-64 sm:block sm:h-80 sm:w-80"
        opacity={0.16}
        duration={110}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-7 sm:py-10 lg:grid-cols-12 lg:gap-10 lg:py-11">
        {/* Left Editorial Column */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: LUXURY_EASE }}
          className="text-center lg:col-span-7 lg:text-left"
        >
          {schedule.live && <LiveBanner event={schedule.live} />}

          <div className="mb-2 flex flex-col items-center gap-1 lg:items-start">
            <span lang="bn" className="font-bengali text-sm font-semibold tracking-wider text-sindoor/85">
              ॥ শুভ বিবাহ ॥
            </span>
            <ToporMukutEmblem className="h-14 w-40" />
          </div>

          {GUEST.name && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: LUXURY_EASE }}
              className={`mb-2 break-words text-sindoor/90 ${
                lang === 'bn' ? 'font-bengali text-2xl sm:text-3xl' : 'font-script text-3xl sm:text-4xl'
              }`}
            >
              {lang === 'bn' ? `প্রিয় ${GUEST.name},` : `Dearest ${GUEST.name},`}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: LUXURY_EASE }}
            className={
              lang === 'bn'
                ? 'font-bengali text-sm font-semibold text-kansa-muted'
                : 'font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted'
            }
          >
            {lang === 'bn' ? 'সপরিবারে সাদর আমন্ত্রণ' : WEDDING_DATA.poem.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.2, ease: LUXURY_EASE }}
            className="mt-2.5 pb-2 font-script text-6xl leading-[1.18] text-sindoor sm:text-7xl xl:text-8xl"
          >
            <span className="foil-text inline-block px-2 py-1">
              {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
            </span>
          </motion.h1>

          {WEDDING_DATA.couple.bengaliNames && (
            <motion.p
              lang="bn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-bengali text-lg font-medium tracking-wide text-kansa-muted sm:text-xl"
            >
              {WEDDING_DATA.couple.bengaliNames}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.38, ease: LUXURY_EASE }}
            className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-kansa/45 bg-cream px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sindoor shadow-sm"
          >
            <Calendar aria-hidden="true" className="h-3.5 w-3.5 text-terracotta" />
            {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.0, delay: 0.48, ease: LUXURY_EASE }}
            className="mx-auto mt-5 max-w-xl font-serif text-lg italic leading-relaxed text-ink/85 sm:text-xl lg:mx-0"
          >
            {WEDDING_DATA.poem.quote}
          </motion.p>

          {/* Live Countdown with Smooth Tick Pop */}
          {schedule.phase === 'after' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alpona-frame mx-auto mt-6 max-w-md bg-ivory px-5 py-4 text-center lg:mx-0"
            >
              <p className="font-script text-3xl text-sindoor">Thank you for celebrating with us</p>
              <p className="mt-1 font-serif text-base italic text-ink/75">
                Our forever began in {WEDDING_DATA.couple.city} — share your memories with {WEDDING_DATA.couple.hashtag}
              </p>
            </motion.div>
          ) : schedule.target ? (
          <>
          <p className="sr-only">
            {countdown.days} days and {countdown.hours} hours {schedule.targetLabel}.
          </p>
          <div aria-hidden="true" className="mx-auto mt-6 grid max-w-md grid-cols-4 gap-2.5 lg:mx-0">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Mins', value: countdown.minutes },
              { label: 'Secs', value: countdown.seconds },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + idx * 0.07, ease: LUXURY_EASE }}
                className="alpona-frame overflow-hidden bg-ivory px-2 py-2.5 text-center transition-shadow hover:shadow-md"
              >
                <div className="relative h-8 overflow-hidden sm:h-9">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={item.value}
                      initial={{ y: -12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 12, opacity: 0 }}
                      transition={{ duration: 0.28, ease: LUXURY_EASE }}
                      className="block font-serif text-2xl font-bold tabular-nums text-sindoor sm:text-3xl"
                    >
                      {String(item.value).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-kansa-muted">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
          <p aria-hidden="true" className="mt-2.5 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted lg:text-left">
            {schedule.targetLabel}
          </p>
          </>
          ) : null}

          {/* Quick Action Links + Petal Shower Trigger */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: LUXURY_EASE }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#celebrations"
              onClick={() => soundEngine.playSoftTick()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-sindoor px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ivory shadow-md transition-[transform,background-color,box-shadow] active:scale-[0.97] hover:-translate-y-0.5 hover:bg-sindoor-deep hover:shadow-lg"
            >
              The Ceremony
            </a>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                soundEngine.playShankha();
                const r = e.currentTarget.getBoundingClientRect();
                window.dispatchEvent(
                  new CustomEvent('wedding-petal-burst', {
                    detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 },
                  })
                );
              }}
              aria-label="Sound the auspicious Shankha conch shell"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-kansa/70 bg-cream/85 px-4 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-sindoor shadow-sm transition-colors hover:bg-kansa/20"
            >
              <ShankhaIcon className="h-4 w-4 text-sindoor" />
              <span>Shankha</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Heritage Arch Showcase with Scroll Parallax & Floating Sparkles */}
        <motion.div
          style={{ y: archY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.2, ease: LUXURY_EASE }}
          className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-[375px]"
        >
          {/* Delicate Orbiting Gold Sparkles */}
          <motion.span
            animate={{ y: [-4, 4, -4], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
            className="pointer-events-none absolute -left-3 top-10 z-10 text-sm text-kansa"
          >
            ✦
          </motion.span>
          <motion.span
            animate={{ y: [4, -4, 4], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 4.1, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 top-24 z-10 text-xs text-sindoor"
          >
            ✦
          </motion.span>

          <div className="rajbari-frame overflow-hidden bg-ivory p-3 shadow-2xl">
            <div className="aspect-[4/5] overflow-hidden">
              <RoyalArtwork variant="palace-courtyard" interactive />
            </div>
          </div>

          <motion.div
            style={{ y: badgeY }}
            className="alpona-frame -mt-10 ml-auto mr-2 w-36 overflow-hidden bg-sindoor p-1.5 shadow-xl sm:mr-4 sm:w-40"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <RoyalArtwork variant="floral-kalash" />
            </div>
            <p className="py-1 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory">
              Shubho Biye
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Ornamental Divider Strip */}
      <div className="w-full overflow-hidden border-y border-kansa/45 bg-sindoor py-2.5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 text-ivory/90 sm:gap-6">
          {[WEDDING_DATA.couple.hashtag, WEDDING_DATA.couple.weddingDateLabel, WEDDING_DATA.couple.city, 'Shubho Biye'].map(
            (text, i) => (
              <div key={text} className="flex items-center gap-4">
                <span className="font-sans text-[11px] uppercase tracking-[0.24em]">
                  {text}
                </span>
                {i < 3 && <span className="hidden text-kansa-light sm:inline">✦</span>}
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
