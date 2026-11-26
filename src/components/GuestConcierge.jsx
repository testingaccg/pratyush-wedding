import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown } from 'lucide-react';
import { WEDDING_DATA } from '../data/weddingData';
import { soundEngine } from '../utils/soundEngine';
import { toast, copyText } from '../utils/toast';
import { useLang } from '../context/LangContext';

const LUXURY_EASE = [0.22, 1, 0.36, 1];

const RITUAL_NOTES = {
  'Bor Jatri & Boron':
    'The groom’s procession arrives to conch shells (Shankha) and Uludhwani; the bride’s mother welcomes him at the threshold with a woven Kulo and brass lamp.',
  'Shubho Drishti & Saat Paak':
    'Seated on a wooden pidi, the bride is carried in seven circles around the groom before lowering two betel leaves (Paan Pata) for their auspicious first glance.',
  'Mala Bodol & Sindoor Daan':
    'The couple exchanges fragrant Rajanigandha garlands three times, walks the seven sacred steps (Saptapadi), and seals the vows with Sindoor.',
  'Pritibhoj Feast':
    'Guests gather for a warm multi-course celebratory dinner featuring classic Bengali sweets and pure-vegetarian delicacies.',
};

function EveningTimeline() {
  const { lang } = useLang();
  const [openStep, setOpenStep] = useState(null);

  return (
    <div className="mt-10">
      <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-kansa-muted">
        {lang === 'bn'
          ? `সন্ধ্যার অনুষ্ঠানসূচি · ${WEDDING_DATA.couple.weddingDateLabel}`
          : `Evening Flow · ${WEDDING_DATA.couple.weddingDateLabel}`}
      </p>
      <p className="mt-1 text-center font-serif text-sm italic text-ink/65">
        Tap any ritual below for a quick cultural note
      </p>
      <ol className="relative mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-transparent via-kansa/60 to-transparent lg:block"
        />
        {WEDDING_DATA.ceremonyTimeline.map((step, i) => {
          const isOpen = openStep === step.title;
          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: LUXURY_EASE }}
              className="relative"
            >
              <div className="relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-kansa bg-sindoor font-serif text-sm font-semibold text-ivory shadow-md">
                0{i + 1}
              </div>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  soundEngine.playSoftTick();
                  setOpenStep(isOpen ? null : step.title);
                }}
                className="mt-3 w-full rounded-sm border border-kansa/35 bg-ivory/85 p-4 text-center shadow-sm transition-colors hover:border-sindoor/50"
              >
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-kansa-muted">
                  {step.time}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold leading-tight text-sindoor">
                  {step.title}
                </h3>
                <p lang="bn" className="mt-0.5 font-bengali text-xs text-kansa-muted">
                  {step.bengali}
                </p>
                <p className="mt-2 font-serif text-sm italic leading-relaxed text-ink/75">
                  {step.detail}
                </p>

                <span className="mt-2 inline-flex items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-kansa-muted">
                  {isOpen ? 'Hide Note' : 'Ritual Note'}
                  <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </span>

                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-kansa/20 pt-2.5 text-left font-sans text-xs leading-relaxed text-ink/80"
                    >
                      {RITUAL_NOTES[step.title]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export default function GuestConcierge() {
  const { lang } = useLang();
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
        <p className={lang === 'bn' ? 'font-bengali text-sm font-semibold text-sindoor' : 'font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-kansa-muted'}>
          {lang === 'bn' ? 'অতিথিদের জন্য জরুরি তথ্য' : 'Guest Concierge'}
        </p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-sindoor sm:text-5xl">
          {lang === 'bn' ? <span lang="bn" className="font-bengali">অনুষ্ঠান ও আপ্যায়ন</span> : 'Things To Know'}
        </h2>
      </motion.div>

      <EveningTimeline />

      <div className="mt-12 border-y border-kansa/40 bg-ivory/70 px-6 py-8 sm:px-10">
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {WEDDING_DATA.concierge.map((item, idx) => {
            const isHashtag = item.value === WEDDING_DATA.couple.hashtag;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{ duration: 0.55, delay: idx * 0.07, ease: LUXURY_EASE }}
                className="flex flex-col justify-between border-b border-kansa/20 pb-6 last:border-b-0 md:nth-last-2:border-b-0"
              >
                <div>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-kansa-muted">
                    0{idx + 1} · {item.label}
                  </p>
                  <h3 className="mt-1.5 break-words font-serif text-2xl font-semibold text-sindoor">
                    {item.value}
                  </h3>
                  <p className="mt-2 font-serif text-base leading-relaxed text-ink/80">
                    {item.detail}
                  </p>
                </div>
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
      </div>
    </section>
  );
}
