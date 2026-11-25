import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Sparkles, Heart } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import RoyalArtwork from './RoyalArtwork';
import CoutureCrest from './CoutureCrest';
import { soundEngine } from '../utils/soundEngine';

function useCountdown(targetIso) {
  const calc = () => {
    const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
    return {
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
  }, [targetIso]);
  return time;
}

const LUXURY_EASE = [0.22, 1, 0.36, 1];

export default function HeroSection() {
  const countdown = useCountdown(WEDDING_DATA.couple.ceremonyISO);
  const [blessings, setBlessings] = useState(108);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const archY = useTransform(scrollYProgress, [0, 1], [0, 44]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  const sendPetalBlessing = () => {
    setBlessings((b) => b + 1);
    soundEngine.playHoludSplash();
    window.dispatchEvent(new CustomEvent('wedding-petal-burst'));
  };

  return (
    <header ref={heroRef} className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:py-12 lg:grid-cols-12 lg:gap-10 lg:py-14">
        {/* Left Editorial Column */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: LUXURY_EASE }}
          className="text-center lg:col-span-7 lg:text-left"
        >
          <CoutureCrest className="mx-auto mb-3 h-16 w-40 lg:mx-0" />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: LUXURY_EASE }}
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted"
          >
            {WEDDING_DATA.poem.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: LUXURY_EASE }}
            className="mt-3 font-script text-6xl text-sindoor sm:text-7xl xl:text-8xl"
          >
            {WEDDING_DATA.couple.groom} &amp; {WEDDING_DATA.couple.bride}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: LUXURY_EASE }}
            className="mt-2 font-serif text-2xl italic text-ink/80 sm:text-3xl"
          >
            {WEDDING_DATA.poem.title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.38, ease: LUXURY_EASE }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-kansa/45 bg-cream px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sindoor shadow-sm"
          >
            <Calendar className="h-3.5 w-3.5 text-terracotta" />
            {WEDDING_DATA.couple.dateRange} · {WEDDING_DATA.couple.city}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.48 }}
            className="mx-auto mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-ink/85 lg:mx-0"
          >
            {WEDDING_DATA.poem.quote}
          </motion.p>

          {/* Live Countdown */}
          <div className="mx-auto mt-8 grid max-w-md grid-cols-4 gap-2.5 lg:mx-0">
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
                whileHover={{ y: -3 }}
                className="alpona-frame bg-ivory px-2 py-3 text-center transition-shadow hover:shadow-md"
              >
                <div className="font-serif text-2xl font-bold text-sindoor sm:text-3xl">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-kansa-muted">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Action Links + Petal Shower Trigger */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: LUXURY_EASE }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#celebrations"
              onClick={() => soundEngine.playSoftTick()}
              className="inline-flex items-center gap-2 rounded-full bg-sindoor px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ivory shadow-md transition-all hover:-translate-y-0.5 hover:bg-sindoor-deep hover:shadow-lg"
            >
              <Sparkles className="h-4 w-4 text-kansa-light" />
              Explore All 5 Events
            </a>
            <a
              href="#rsvp"
              onClick={() => soundEngine.playSoftTick()}
              className="inline-flex items-center gap-2 rounded-full border border-sindoor bg-ivory px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sindoor transition-all hover:-translate-y-0.5 hover:bg-cream"
            >
              RSVP Now
            </a>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={sendPetalBlessing}
              className="inline-flex items-center gap-2 rounded-full border border-kansa/70 bg-cream/90 px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-sindoor transition-colors hover:bg-kansa/20"
            >
              <Heart className="h-3.5 w-3.5 fill-sindoor text-sindoor" />
              Shower Petals ({blessings})
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Heritage Arch Showcase with Scroll Parallax */}
        <motion.div
          style={{ y: archY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.2, ease: LUXURY_EASE }}
          className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-[390px]"
        >
          <div className="rajbari-frame overflow-hidden bg-ivory p-3 shadow-2xl">
            <div className="aspect-[4/5] overflow-hidden">
              <RoyalArtwork variant="palace-courtyard" />
            </div>
          </div>

          <motion.div
            style={{ y: badgeY }}
            whileHover={{ scale: 1.04 }}
            className="alpona-frame -mt-10 ml-auto mr-2 w-36 overflow-hidden bg-sindoor p-1.5 shadow-xl sm:mr-4 sm:w-40"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <RoyalArtwork variant="floral-kalash" />
            </div>
            <p className="py-1 text-center font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory">
              Five Celebrations
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Ornamental Divider Strip */}
      <div className="w-full overflow-hidden border-y border-kansa/45 bg-sindoor py-2.5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 text-ivory/90 sm:gap-6">
          {[WEDDING_DATA.couple.hashtag, '16 February 2027', WEDDING_DATA.couple.city, 'Five Celebrations'].map(
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
