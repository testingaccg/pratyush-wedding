import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';
import { toast, copyText } from '../utils/toast';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

/** Group events by calendar day for the "Weekend at a Glance" strip. */
const DAYS = WEDDING_DATA.events.reduce((acc, ev) => {
  const key = ev.startISO.slice(0, 10);
  const day = acc.find((d) => d.key === key);
  if (day) day.events.push(ev);
  else acc.push({ key, label: ev.date.split(',')[0], date: ev.date.split(', ')[1].replace(' 2027', ''), events: [ev] });
  return acc;
}, []);

function WeekendGlance() {
  return (
    <div className="mt-10">
      <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-kansa-muted">
        The Weekend at a Glance
      </p>
      <ol className="relative mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-transparent via-kansa/60 to-transparent lg:block"
        />
        {DAYS.map((day, i) => (
          <motion.li
            key={day.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.55, delay: i * 0.09, ease: LUXURY_EASE }}
            className="relative"
          >
            <div className="relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-kansa bg-sindoor font-serif text-sm font-semibold text-ivory shadow-md">
              {day.date.split(' ')[0]}
            </div>
            <div className="mt-3 rounded-sm border border-kansa/35 bg-ivory/80 p-4 text-center shadow-sm">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">
                {day.label} · {day.date}
              </p>
              <ul className="mt-2 space-y-2">
                {day.events.map((ev) => (
                  <li key={ev.id}>
                    <a
                      href="#celebrations"
                      onClick={() => soundEngine.playSoftTick()}
                      className="group flex min-h-[44px] items-center justify-center gap-2 rounded-sm px-1 transition-colors hover:bg-cream"
                    >
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 shrink-0 rounded-full ring-1 ring-kansa/60"
                        style={{ backgroundColor: ev.dressColor }}
                      />
                      <span className="text-left">
                        <span className="block font-serif text-lg font-semibold leading-tight text-sindoor group-hover:underline">
                          {ev.title}
                        </span>
                        <span className="block font-sans text-[11px] text-ink/75">{ev.time}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function GuestConcierge() {
  const [copied, setCopied] = useState(false);

  const copyHashtag = async () => {
    const ok = await copyText(WEDDING_DATA.couple.hashtag);
    soundEngine.playSoftTick();
    if (ok) {
      setCopied(true);
      toast(`${WEDDING_DATA.couple.hashtag} copied — tag us in every candid ✦`);
      setTimeout(() => setCopied(false), 2200);
    } else {
      toast('Copy unavailable — long-press the hashtag to copy');
    }
  };

  return (
    <section id="concierge" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.7, ease: LUXURY_EASE }}
        className="text-center"
      >
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted">Guest Concierge</p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">Things To Know</h2>
      </motion.div>

      <WeekendGlance />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WEDDING_DATA.concierge.map((item, idx) => {
          const isHashtag = item.value === WEDDING_DATA.couple.hashtag;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: LUXURY_EASE }}
              className="alpona-frame flex flex-col bg-ivory p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-kansa-muted">{item.label}</p>
              <h3 className="mt-2 break-words font-serif text-xl font-semibold text-sindoor">{item.value}</h3>
              <p className="mt-2 font-sans text-xs leading-relaxed text-ink/75">{item.detail}</p>
              {isHashtag && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={copyHashtag}
                  aria-label={`Copy ${WEDDING_DATA.couple.hashtag} to clipboard`}
                  className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full border border-kansa bg-cream px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sindoor transition-colors hover:bg-kansa/20"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'done' : 'copy'}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex"
                    >
                      {copied ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
                    </motion.span>
                  </AnimatePresence>
                  {copied ? 'Copied' : 'Copy Hashtag'}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
